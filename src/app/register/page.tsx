"use client"

import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormValues({ name: "", email: "", password: "" });

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify(formValues),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setLoading(false);
            if (!res.ok) {
                setError((await res.json()).message);
                return;
            }

            signIn(undefined, { callbackUrl: "/" });
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
        <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-white sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Register</h1>
                    <p className="text-gray-500">Create a new account to get started.</p>
                </div>
                {error && (
                    <div className="p-4 text-red-600 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name
                        </Label>
                        <Input id="name" type="text" name="name" placeholder="John Doe" value={formValues.name}
                            onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email
                        </Label>
                        <Input id="email" type="email" name="email" placeholder="iam@example.com" value={formValues.email}
                            onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Input id="password" type="password" name="password" value={formValues.password}
                            onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full">
                        {loading ? "Loading..." : "Register"}
                    </Button>
                </form>
                <div className="text-center">
                    <p className="text-gray-500">
                        Already have an account?
                    </p>
                    <Link href="/login" legacyBehavior>
                        <a className="text-blue-600 hover:underline">
                            Login here
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};