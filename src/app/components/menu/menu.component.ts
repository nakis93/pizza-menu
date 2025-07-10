import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { PizzaItemView } from '../../models/item';
import { Price } from '../../models/price';
import { Size } from '../../models/size';
import { DataService } from '../../services/data.service';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [MenuItemComponent, AsyncPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  viewModel$: Observable<{ sizes: Size[]; pizzaItems: PizzaItemView[]; }>;
  private storageKey = 'pizzaPrices';

  constructor(
    private dataService: DataService
  ) {
    this.viewModel$ = combineLatest([
      this.dataService.getItems(),
      this.dataService.getPrices(),
      this.dataService.getSizes()
    ]).pipe(
      map(([items, apiPrices, sizes]) => {
        const storedPrices = this.getStoredPrices();
        const mergedPrices = this.mergePrices(apiPrices, storedPrices);

        const pizzaItems: PizzaItemView[] = items.map(item => ({
          item,
          prices: mergedPrices.filter(p => p.itemId === item.itemId)
        }));

        return { sizes, pizzaItems };
      })
    );
  }

  onItemUpdated(itemId: number, updatedPrices: Price[]) {
    const stored = this.getStoredPrices();
    const filtered = stored.filter(p => p.itemId !== itemId);
    const newStorage = [...filtered, ...updatedPrices];
    localStorage.setItem(this.storageKey, JSON.stringify(newStorage));
  }

  private getStoredPrices(): Price[] {
    const json = localStorage.getItem(this.storageKey);
    return json ? JSON.parse(json) : [];
  }

  private mergePrices(api: Price[], stored: Price[]): Price[] {
    const map = new Map<string, Price>();
    api.forEach(p => {
      map.set(`${p.itemId}-${p.sizeId}`, p);
    });
    stored.forEach(p => {
      map.set(`${p.itemId}-${p.sizeId}`, p);
    });
    return Array.from(map.values());
  }
}
