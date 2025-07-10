import { Injectable } from '@angular/core';
import { itemSizes } from '../constants/fakeData/sizes';
import { itemPrices } from '../constants/fakeData/prices';
import { items } from '../constants/fakeData/items';
import { map, Observable, of } from 'rxjs';
import { Price, ViewSizePrice } from '../models/price';
import { Size } from '../models/size';
import { PizzaItem, ViewPizzaItem } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  itemSizes = itemSizes;
  prices = itemPrices;
  items = items;
  constructor() { }

  // getItems(): Observable<PizzaItem[]> {
  //   return of(items);
  // }

  // getPrices(): Observable<Price[]> {
  //   return of(itemPrices);
  // }

  // getSizes(): Observable<Size[]> {
  //   return of(itemSizes);
  // }

  getMenu(): Observable<ViewPizzaItem[]> {
    return of({
      items: this.items,
      prices: this.prices,
      sizes: this.itemSizes
    }).pipe(
      map(data => {
        const sizeMap = new Map<number, string>();
        data.sizes.forEach(size => sizeMap.set(size.sizeId, size.name));
        const transformedMenu = data.items.map(item => {
          const pricesForItem = data.prices.filter(p => p.itemId === item.itemId);
          const sizesWithPrices: ViewSizePrice[] = pricesForItem.map(price => {
            return {
              sizeId: price.sizeId,
              price: price.price,
              name: sizeMap.get(price.sizeId) || 'Unknown Size'
            };
          });
          return {
            itemId: item.itemId,
            name: item.name,
            sizes: sizesWithPrices
          };
        });
        return transformedMenu;
      })
    );
  }

}
