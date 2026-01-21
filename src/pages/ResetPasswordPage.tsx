import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner";
import { PantryKeeperLogo } from "../components/PantryKeeperLogo";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                throw updateError;
            }

            setSuccess(true);
            toast.success("Password updated successfully");

            // Redirect after delay
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (err: any) {
            console.error("Error updating password:", err);
            setError(err.message || "Failed to update password");
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
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Reset Password
                    </h1>
                </div>

                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {/* Logo at top center of card */}
                        <div className="flex justify-center mb-6">
                            <PantryKeeperLogo className="h-12 w-auto" />
                        </div>

                        {!success ? (
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="new-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertDescription className="text-red-800">
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2 pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#F58220] hover:bg-[#d47020] text-white"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 py-4">
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Your password has been updated successfully.
                                        Redirecting to dashboard...
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    className="w-full"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        )}
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
