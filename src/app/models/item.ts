import { Price, ViewSizePrice } from "./price";

export interface PizzaItem {
    itemId: number;
    name: string;
}

export interface ViewPizzaItem {
    itemId: number;
    name: string;
    sizes: ViewSizePrice[];
}
