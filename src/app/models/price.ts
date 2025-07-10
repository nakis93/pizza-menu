export interface Price {
    itemId: number;
    sizeId: number;
    price: number;
}

export interface ViewSizePrice {
    sizeId: number;
    name: string;
    price: number;
    enabled: boolean;
}
