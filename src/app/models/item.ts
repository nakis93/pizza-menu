import { Price } from "./price";

export interface PizzaItem {
    itemId: number;
    name: string;
}

export interface PizzaItemView {
    item: PizzaItem;
    prices: Price[];
}
