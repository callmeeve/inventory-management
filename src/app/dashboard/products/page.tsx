'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { Rings } from 'react-loader-spinner'
import ProductFormDialog from '@/components/ProductFormDialog';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
    const { data: session } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const user = session?.user;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/products', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setProducts(data);
        } catch (error: any) {
            console.error(error.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchProducts();
        }
    }, [session]);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                fetchProducts();
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }

    return (
        <>
            <div className="mt-5">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <Rings color="#000" height={100} width={100} />
                    </div>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="flex items-center space-x-2">
                                    <p className="text-gray-500">No products found.</p>
                                    <ProductFormDialog fetchProducts={fetchProducts} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <h1 className="text-3xl font-semibold">Products</h1>
                                            <p className="text-gray-500">Welcome back, {user?.name}! Here are your products.</p>
                                        </div>
                                        <ProductFormDialog fetchProducts={fetchProducts} />
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{formatCurrency(item.price)}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.categories?.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {/* <Button variant="outline" size="icon" onClick={() => handleView(item.id)}>
                                                            <EyeIcon className="h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Button>
                                                        <Button variant="outline" size="icon" onClick={() => handleEdit(item.id)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button> */}
                                                        <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}