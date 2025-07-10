import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewPizzaItem } from '../../models/item';
import { DataService } from '../../services/data.service';
import { MenuItemComponent } from './menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  imports: [MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  openedItemId: number | null = null;
  private destroyRef = inject(DestroyRef);
  pizzaItems: ViewPizzaItem[] = [];
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.pizzaMenu$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(menu => {
      this.pizzaItems = menu;
    });
    if (this.pizzaItems.length === 0) {
      this.dataService.getMenu().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(menu => {
        this.pizzaItems = menu;
      });
    }
  }

  toggleItem(itemId: number) {
    this.openedItemId = this.openedItemId === itemId ? null : itemId;
  }

}
