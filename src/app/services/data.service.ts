import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { items } from '../constants/fakeData/items';
import { itemPrices } from '../constants/fakeData/prices';
import { itemSizes } from '../constants/fakeData/sizes';
import { ViewPizzaItem } from '../models/item';
import { ViewSizePrice } from '../models/price';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  itemSizes = itemSizes;
  prices = itemPrices;
  items = items;

  private defaultPizzaMenu: ViewPizzaItem[] = [];
  private _pizzaMenu$ = new BehaviorSubject<ViewPizzaItem[]>(this.loadFromLocalStorage());
  get pizzaMenu$() {
    return this._pizzaMenu$.asObservable();
  }
  private readonly storageKey = 'pizzaMenu';

  constructor() { }


  private loadFromLocalStorage(): ViewPizzaItem[] {
    const pizzaMenu = localStorage.getItem(this.storageKey);
    return pizzaMenu ? JSON.parse(pizzaMenu) : [];
  }

  private saveToLocalStorage(pizzaMenu: ViewPizzaItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(pizzaMenu));
  }


  getMenu(): Observable<ViewPizzaItem[]> {
    const savedMenu = this.loadFromLocalStorage();
    if (savedMenu && savedMenu.length > 0) {
      this._pizzaMenu$.next(savedMenu);
      this.buildOriginalMenu();
      return of(savedMenu);
    }
    else {
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
                name: sizeMap.get(price.sizeId) || '',
                enabled: true
              };
            });
            return {
              itemId: item.itemId,
              name: item.name,
              sizes: sizesWithPrices,
            };
          });
          this.defaultPizzaMenu = JSON.parse(JSON.stringify(transformedMenu));
          this.saveToLocalStorage(transformedMenu);
          this._pizzaMenu$.next(transformedMenu);
          return transformedMenu;
        })
      );
    }
  }


  updatePrice(itemId: number, sizeId: number, newPrice: number): void {
    const currentMenu = this._pizzaMenu$.getValue();
    const pizzaItem = currentMenu.find(item => item.itemId === itemId);
    const sizePrice = pizzaItem?.sizes.find(s => s.sizeId === sizeId);
    if (!sizePrice) {
      return;
    }
    sizePrice.price = newPrice;
    this.saveToLocalStorage(currentMenu);
    this._pizzaMenu$.next([...currentMenu]);
  }

  updateSize(itemId: number, sizeId: number, enabled: boolean): void {
    const currentMenu = this._pizzaMenu$.getValue();
    const pizzaItem = currentMenu.find(item => item.itemId === itemId);
    const sizePrice = pizzaItem?.sizes.find(s => s.sizeId === sizeId);
    if (!sizePrice) return;
    sizePrice.enabled = enabled;
    this.saveToLocalStorage(currentMenu);
    this._pizzaMenu$.next([...currentMenu]);
  }

  resetItem(itemId: number): void {
    const currentMenu = this._pizzaMenu$.getValue();
    const originalItem = this.defaultPizzaMenu.find(i => i.itemId === itemId);
    const currentIndex = currentMenu.findIndex(i => i.itemId === itemId);
    if (originalItem && currentIndex !== -1) {
      currentMenu[currentIndex] = JSON.parse(JSON.stringify(originalItem));
      this.saveToLocalStorage(currentMenu);
      this._pizzaMenu$.next([...currentMenu]);
    }
  }

  getOriginalItem(itemId: number): ViewPizzaItem | undefined {
    return this.defaultPizzaMenu.find(item => item.itemId === itemId);
  }

  private buildOriginalMenu(): void {
    const sizeMap = new Map<number, string>();
    this.itemSizes.forEach(size => sizeMap.set(size.sizeId, size.name));
    const transformedMenu: ViewPizzaItem[] = this.items.map(item => {
      const pricesForItem = this.prices.filter(p => p.itemId === item.itemId);
      const sizesWithPrices: ViewSizePrice[] = pricesForItem.map(price => {
        return {
          sizeId: price.sizeId,
          price: price.price,
          name: sizeMap.get(price.sizeId) || '',
          enabled: true
        };
      });
      return {
        itemId: item.itemId,
        name: item.name,
        sizes: sizesWithPrices,
      };
    });
    this.defaultPizzaMenu = JSON.parse(JSON.stringify(transformedMenu));
  }



}
