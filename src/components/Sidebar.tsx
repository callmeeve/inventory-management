import { LayoutDashboard, Archive, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

interface NavLink {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
}

const navLinks: NavLink[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        title: "Products",
        icon: Archive,
        href: "/dashboard/products",
    },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();

    const isActiveLink = (href: string) => {
        return pathname === href;
    };

    return (
        <div
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 py-6">
                    <span className="text-2xl font-bold mx-auto">Admin Panel</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <nav className="flex-1 space-y-2 px-2 py-4">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className={`flex items-center text-sm px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white ${isActiveLink(link.href) ? "bg-gray-800 text-white" : "text-gray-800"
                                }`}
                            aria-current={isActiveLink(link.href) ? "page" : undefined}
                        >
                            <link.icon className="h-6 w-6" />
                            <span className="ml-2">{link.title}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}