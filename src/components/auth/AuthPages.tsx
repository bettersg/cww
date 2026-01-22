import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { PantryKeeperLogo } from "../PantryKeeperLogo";
import { Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react";

type AuthView = "login" | "forgot-password" | "reset-sent";

interface AuthPagesProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function AuthPages({ onLogin }: AuthPagesProps) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    // Simple credential check - just UI, no backend
    if (email === "andre@cww.sg" && password === "123") {
      // Extract name from email (before @)
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
      onLogin({ name, email });
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("reset-sent");
  };

  const handleBackToLogin = () => {
    setView("login");
    // Reset all fields
    setEmail("");
    setPassword("");
    setLoginError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign In
          </h1>
        </div>

        {/* Login View */}
        {view === "login" && (
          <Card>
            <CardContent className="space-y-4 pt-6">
              {/* Logo at top center of card */}
              <div className="flex justify-center mb-6">
                <PantryKeeperLogo className="h-12 w-auto" />
              </div>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {loginError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}

                <button
                  type="button"
                  onClick={() => setView("forgot-password")}
                  className="text-sm text-[#F58220] hover:text-[#d47020] transition-colors"
                >
                  Forgot password?
                </button>

                <div className="space-y-2 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#F58220] hover:bg-[#d47020] text-white"
                  >
                    Sign In
                  </Button>

                  <Button type="button" variant="outline" className="w-full">
                    Request Admin Access
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Forgot Password View */}
        {view === "forgot-password" && (
          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Enter your email to receive a password reset code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#F58220] hover:bg-[#d47020] text-white"
                  >
                    Send Reset Code
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleBackToLogin}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reset Code Sent View */}
        {view === "reset-sent" && (
          <Card>
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent a password reset code to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  A password reset code has been sent to your email. Please check your inbox
                  and click the reset link to continue.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setView("forgot-password")}
                >
                  Resend Code
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2026 Better.sg. All rights reserved.</p>
          <p className="mt-1">Better.sg</p>
        </div>
      </div>
    </div>
  );
}