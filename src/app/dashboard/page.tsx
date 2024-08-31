'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Business, Product } from '@/types';
import BusinessForm from '@/components/BusinessForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CreditCard, Archive } from 'lucide-react';
import { Rings } from 'react-loader-spinner'
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns'

export default function DashboardPage() {
    const { data: session } = useSession();
    const [business, setBusiness] = useState<Business[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentWeekCount, setCurrentWeekCount] = useState(0)
    const [previousWeekCount, setPreviousWeekCount] = useState(0)
    const [productDifference, setProductDifference] = useState(0)
    const [loading, setLoading] = useState<boolean>(true);

    const user = session?.user;

    const fetchBusiness = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/business', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setBusiness(data);
        } catch (error: any) {
            console.error(error.message);
            setBusiness([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data);

            const now = new Date()
            const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }) // Assuming week starts on Monday
            const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 })
            const startOfPreviousWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
            const endOfPreviousWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })

            const currentWeekProducts = data.filter((product: { createdAt: string | number | Date; }) => {
                const createdAt = new Date(product.createdAt)
                return createdAt >= startOfCurrentWeek && createdAt <= endOfCurrentWeek
            })

            const previousWeekProducts = data.filter((product: { createdAt: string | number | Date; }) => {
                const createdAt = new Date(product.createdAt)
                return createdAt >= startOfPreviousWeek && createdAt <= endOfPreviousWeek
            })

            setCurrentWeekCount(currentWeekProducts.length)
            setPreviousWeekCount(previousWeekProducts.length)
            setProductDifference(currentWeekProducts.length - previousWeekProducts.length)
        } catch (err) {
            console.error('Failed to fetch products:', err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session) {
            fetchBusiness();
            fetchProducts();
        }
    }, [session]);

    return (
        <>
            <div className="mt-5">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <Rings color="#000" height={100} width={100} />
                    </div>
                ) : (
                    <>
                        {business.length === 0 ? (
                            <BusinessForm onSuccess={fetchBusiness} />
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold">Dashboard</h1>
                                    <p className="text-gray-500">Welcome back, {user?.name}! Here are your businesses.</p>
                                </div>
                                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Products
                                            </CardTitle>
                                            <Archive className="h-4 w-4 text-gray-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{products.length}</div>
                                            <p className="text-xs text-gray-500">
                                                {productDifference >= 0 ? `+${productDifference}` : productDifference} from last week
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}