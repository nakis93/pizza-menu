import { Injectable } from '@angular/core';
import { itemSizes } from '../constants/fakeData/sizes';
import { itemPrices } from '../constants/fakeData/prices';
import { items } from '../constants/fakeData/items';
import { Observable, of } from 'rxjs';
import { Price } from '../models/price';
import { Size } from '../models/size';
import { PizzaItem } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  itemSizes = itemSizes;
  prices = itemPrices;
  items = items;
  constructor() { }

  getItems(): Observable<PizzaItem[]> {
    return of(items);
  }

  getPrices(): Observable<Price[]> {
    return of(itemPrices);
  }

  getSizes(): Observable<Size[]> {
    return of(itemSizes);
  }

}
