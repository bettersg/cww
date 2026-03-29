import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, verifyUserTenant } from '../utils/supabase/client';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("rerender");

        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    if (!verifyUserTenant(session.access_token)) {
                        await supabase.auth.signOut();
                        setUser(null);
                    } else {
                        const name = session.user.user_metadata?.full_name ||
                            session.user.email?.split('@')[0] || "User";
                        setUser({ name, email: session.user.email || "" });
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log(`authStateChange:${location.pathname}`, _event, session);

            if (session?.user) {
                if (!verifyUserTenant(session.access_token)) {
                    supabase.auth.signOut();
                    setUser(null);
                } else {
                    const name = session.user.user_metadata?.full_name ||
                        session.user.email?.split('@')[0] || "User";
                    setUser({ name, email: session.user.email || "" });
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
