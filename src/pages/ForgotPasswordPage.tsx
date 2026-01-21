import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner";
import { FORGOT_PASSWORD_REDIRECT } from "../utils/supabase/info";

type ViewState = "forgot-password" | "reset-sent";

export default function ForgotPasswordPage() {
    const [view, setView] = useState<ViewState>("forgot-password");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            console.log(FORGOT_PASSWORD_REDIRECT);

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: FORGOT_PASSWORD_REDIRECT,
            });

            if (error) {
                console.error("Reset password error:", error.message);
                throw error;
            }

            setView("reset-sent");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
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
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Send Reset Code"}
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
