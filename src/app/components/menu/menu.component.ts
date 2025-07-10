import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewPizzaItem } from '../../models/item';
import { Price } from '../../models/price';
import { DataService } from '../../services/data.service';
import { MenuItemComponent } from './menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  imports: [MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  private storageKey = 'pizzaPrices';
  private destroyRef = inject(DestroyRef);
  pizzaItems: ViewPizzaItem[] = [];
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getMenu().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(menu => {
      this.pizzaItems = menu;
      console.log(this.pizzaItems);
    });
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
