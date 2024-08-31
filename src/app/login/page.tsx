"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setFormValues({ email: "", password: "" });

            const res = await signIn("credentials", {
                redirect: false,
                email: formValues.email,
                password: formValues.password,
                callbackUrl: "/dashboard", // Explicitly set the callbackUrl to /dashboard
            });

            setLoading(false);

            if (!res?.error) {
                router.push("/dashboard"); // Redirect to /dashboard
            } else {
                setError("Invalid email or password");
            }
        } catch (error: any) {
            setLoading(false);
            setError(error.message);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-white sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-gray-500">Enter your email and password to access your account.</p>
                    </div>
                    {error && (
                        <div className="p-4 text-red-600 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" name="email" placeholder="m@example.com" value={formValues.email}
                                onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" value={formValues.password}
                                onChange={handleChange} required />
                        </div>
                        <Button type="submit" className="w-full" variant={loading ? "ghost" : "default"}>
                            {loading ? "Loading..." : "Login"}
                        </Button>
                    </form>
                    <div className="text-center">
                        <Link href="/register" legacyBehavior>
                            <a className="text-blue-600 hover:underline">Create an account</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};