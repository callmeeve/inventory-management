export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Business {
    id: string;
    name: string;
    email?: string;
    phone: string;
    address: string;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    businessId: string;
    categories: Category;
    categoryId?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Category {
    id: string;
    name: string;
    products: Product[]
    createdAt: Date;
    updatedAt?: Date;
}