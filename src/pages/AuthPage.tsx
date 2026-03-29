import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { PantryKeeperLogo } from "../components/PantryKeeperLogo";
import { Mail, Lock } from "lucide-react";
import { supabase, verifyUserTenant } from "../utils/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        setLoginError("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoginError("Invalid email or password"); // Keep generic message or use error.message
                console.error("Login error:", error.message);
                return;
            }

            if (data.session) {
                if (!verifyUserTenant(data.session.access_token)) {
                    await supabase.auth.signOut();
                    setLoginError("Unauthorized: Your account does not have access to this tenant application.");
                    return;
                }

                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Unexpected login error:", err);
            setLoginError("An unexpected error occurred. Please try again.");
        }
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
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

                            <Link
                                to="/forgot-password"
                                className="text-sm text-[#F58220] hover:text-[#d47020] transition-colors block text-right"
                            >
                                Forgot password?
                            </Link>

                            <div className="space-y-2 pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#F58220] hover:bg-[#d47020] text-white"
                                >
                                    Sign In
                                </Button>

                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>© 2026 Better.sg. All rights reserved.</p>
                    <p className="mt-1">Better.sg</p>
                </div>
            </div>
        </div>
    );
}
