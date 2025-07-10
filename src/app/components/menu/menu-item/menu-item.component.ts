import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { Price } from '../../../models/price';
import { Size } from '../../../models/size';
import { PizzaItem } from '../../../models/item';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';

@Component({
  selector: 'app-menu-item',
  imports: [NumberInputComponent, CommonModule, FormsModule, CheckboxComponent],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {
  @Input() item!: PizzaItem;
  @Input() sizes: Size[] = [];
  @Input() prices: Price[] = [];
  @Output() itemUpdated = new EventEmitter<Price[]>();
  isOpen = false;
  hasChanges = false;

  private originalPrices: Price[] = [];
  private priceMap: Map<number, number> = new Map();
  private enabledSizeIds: Set<number> = new Set();


  ngOnInit(): void {
    this.originalPrices = this.prices.map(p => ({ ...p }));
    for (const price of this.prices) {
      this.priceMap.set(price.sizeId, price.price);
      if (price.price > 0) {
        this.enabledSizeIds.add(price.sizeId);
      }
    }
  }


  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }

  isSizeEnabled(sizeId: number): boolean {
    return this.enabledSizeIds.has(sizeId);
  }

  getPrice(sizeId: number): number {
    return this.priceMap.get(sizeId) ?? 0;
  }

  onSizeToggled(sizeId: number, enabled: boolean): void {
    if (enabled) {
      this.enabledSizeIds.add(sizeId);
      if (!this.priceMap.has(sizeId)) {
        this.priceMap.set(sizeId, 0.00);
      }
    } else {
      this.enabledSizeIds.delete(sizeId);
      this.priceMap.set(sizeId, 0.00);
    }

    this.emitIfChanged();
  }

  onPriceChanged(sizeId: number, newPrice: number): void {
    if (!this.enabledSizeIds.has(sizeId)) return;

    this.priceMap.set(sizeId, newPrice);
    this.emitIfChanged();
  }

  undoChanges(): void {
    this.originalPrices.forEach(p => {
      this.priceMap.set(p.sizeId, p.price);
      if (p.price > 0) {
        this.enabledSizeIds.add(p.sizeId);
      } else {
        this.enabledSizeIds.delete(p.sizeId);
      }
    });
    this.emitUpdated(false);
  }

  private emitIfChanged(): void {
    const updated = this.toPriceArray();
    const isChanged = JSON.stringify(updated) !== JSON.stringify(this.originalPrices);
    this.emitUpdated(isChanged);
  }

  private emitUpdated(isChanged: boolean): void {
    this.hasChanges = isChanged;
    this.itemUpdated.emit(this.toPriceArray());
  }

  private toPriceArray(): Price[] {
    return this.sizes.map(size => ({
      itemId: this.item.itemId,
      sizeId: size.sizeId,
      price: this.priceMap.get(size.sizeId) ?? 0
    }));
  }
}
