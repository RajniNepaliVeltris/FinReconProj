export interface CustomerInfo {
    type: 'existing' | 'new';
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    country?: string;
    state?: string;
    postalCode?: string;
}

export interface OrderItem {
    productName: string;
    quantity: number;
    price?: number;
    sku?: string;
    variant?: string;
}

export interface ShippingDetails {
    method: string;
    price?: number;
    carrier?: string;
    trackingNumber?: string;
}

export interface PaymentDetails {
    method: string;
    amount: number;
    status: string;
}

export interface OrderData {
    customer: CustomerInfo;
    items: OrderItem[];
    shipping: ShippingDetails;
    payment: PaymentDetails;
    notes?: string;
    status?: string;
}