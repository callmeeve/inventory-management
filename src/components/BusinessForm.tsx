import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Business, User } from '@/types';

interface BusinessFormProps {
    onSuccess: () => void;
}

export default function BusinessForm({ onSuccess }: BusinessFormProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<Omit<Business, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [user, setUser] = useState<Omit<User, 'createdAt' | 'updatedAt'> | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogDescription, setDialogDescription] = useState('');

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id ?? '',
                name: session.user.name ?? '',
                email: session.user.email ?? '',
            });
        } else {
            setUser(null);
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formValues,
                    id: crypto.randomUUID(),
                    userId: user?.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            });

            if (response.ok) {
                const data = await response.json();
                setFormValues({
                    name: '',
                    email: '',
                    phone: '',
                    address: ''
                });
                setDialogTitle("Business created");
                setDialogDescription("Business created successfully");
                setDialogOpen(true);
                console.log('Business created successfully:', data);
                onSuccess();
            } else {
                const errorData = await response.json();
                setDialogTitle("Failed to create business");
                setDialogDescription(`Error: ${errorData.message}`);
                setDialogOpen(true);
                throw new Error(`Failed to create business: ${errorData.message}`);
            }
        } catch (error: unknown) {
            console.error('Error creating business:', error);
            setDialogTitle("Error");
            setDialogDescription("An error occurred while creating the business. Please try again.");
            setDialogOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>
                        Please provide the following information to create your business.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Business Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formValues.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formValues.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            {loading ? 'Loading...' : 'Create Business'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setDialogOpen(false)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}