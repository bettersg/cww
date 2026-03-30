import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthPage } from '../pages/AuthPage';
import { supabase } from '../utils/supabase/client';
import { decodeJwt } from '../utils/jwtHelpers';

jest.mock('../utils/supabase/info', () => ({
  projectId: 'test-project',
  tenantId: 'bukit_merah',
  publicAnonKey: 'test-key',
}));
// 1) Mock the Supabase client
jest.mock('../utils/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
  // We want to test verifyUserTenant's actual logic, so we DO NOT mock it here.
  verifyUserTenant: jest.requireActual('../utils/supabase/client').verifyUserTenant,
}));

// Mock decodeJwt
jest.mock('../utils/jwtHelpers', () => ({
  decodeJwt: jest.fn(),
}));

const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock;
const mockGetSession = supabase.auth.getSession as jest.Mock;
const mockDecodeJwt = decodeJwt as jest.Mock;

// Mock the PantryKeeperLogo since it contains SVG requiring special loading inside jest
jest.mock('../components/PantryKeeperLogo', () => ({
  PantryKeeperLogo: () => <div data-testid="logo-mock">Logo</div>
}));

describe('Frontend Login Flow with Tenant_id', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  const renderAuth = () => {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={<div data-testid="dashboard">Dashboard</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  test('successfully logs in when user has the correct tenant_id', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValueOnce({
      data: {
        session: { access_token: 'valid.token.here', user: { email: 'tenant_user1@better.sg' } }
      },
      error: null
    });
    // User has bukit_merah tenant_id
    mockDecodeJwt.mockReturnValueOnce({
      app_metadata: {
        tenant_id: ["bukit_merah"]
      }
    });

    renderAuth();

    await user.type(screen.getByLabelText(/email/i), 'tenant_user1@better.sg');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'tenant_user1@better.sg',
        password: 'Password123!',
      });
      // Should redirect to dashboard
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  test('shows unauthorized error when user does not have the tenant_id', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValueOnce({
      data: {
        session: { access_token: 'invalid.token.here', user: { email: 'no_tenant_user2@better.sg' } }
      },
      error: null
    });
    // User fails the tenant check (empty tenant_id array)
    mockDecodeJwt.mockReturnValueOnce({
      app_metadata: {
        tenant_id: []
      }
    });

    renderAuth();

    await user.type(screen.getByLabelText(/email/i), 'no_tenant_user2@better.sg');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'no_tenant_user2@better.sg',
        password: 'Password123!',
      });
      // Should display error message
      expect(screen.getByText(/Unauthorized: Your account does not have access to this tenant application/i)).toBeInTheDocument();
      // Should call signOut to clear the invalid session
      expect(supabase.auth.signOut).toHaveBeenCalled();

      // Should NOT redirect to dashboard, should remain on /login
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
    });
  });

});
