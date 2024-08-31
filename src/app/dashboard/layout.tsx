'use client'

import { useSession, signOut } from 'next-auth/react';
import { useState } from "react"
import { Bell, ChevronDown, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Sidebar from "@/components/Sidebar";
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: session } = useSession();

    const user = session?.user;


    return (

        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between border-b shadow-sm bg-white px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="mr-4 lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8 sm:w-64 lg:w-96"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2.5">
                                    <div className="h-8 w-8 rounded-full">
                                        <Image
                                            src={user?.image || "/user.jpg"}
                                            alt={user?.name ?? "User"}
                                            width={32}
                                            height={32}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    </div>
                                    <span>
                                        {user?.name}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>

    );
}
