import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ViewPizzaItem } from '../../../models/item';
import { ViewSizePrice } from '../../../models/price';
import { DataService } from '../../../services/data.service';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';

@Component({
  selector: 'app-menu-item',
  imports: [NumberInputComponent, CommonModule, FormsModule, CheckboxComponent],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {
  @Input() sizePrices: ViewSizePrice[] = [];
  @Input() item: ViewPizzaItem = { itemId: 0, name: '', sizes: [] };
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();

  hasChanges = false;

  constructor(
    private dataService: DataService
  ) { }

  onPriceChanged(sizeId: number, newPrice: number): void {
    this.dataService.updatePrice(this.item.itemId, sizeId, newPrice);
    this.hasChanges = true;
    this.detectChanges();
  }

  undoChanges(): void {
    this.dataService.resetItem(this.item.itemId);
    this.hasChanges = false;
  }

  onSizeToggled(sizeId: number, enabled: boolean) {
    this.dataService.updateSize(this.item.itemId, sizeId, enabled);
    if (enabled) {
      return;
    }
    this.dataService.updatePrice(this.item.itemId, sizeId, 0);
    this.detectChanges();
  }

  detectChanges(): void {
    const originalItem = this.dataService.getOriginalItem(this.item.itemId);
    if (!originalItem) {
      this.hasChanges = false;
      return;
    }
    this.hasChanges = this.item.sizes.some(currentSize => {
      const originalSize = originalItem.sizes.find(s => s.sizeId === currentSize.sizeId);
      if (!originalSize) return true;
      return (
        originalSize.price !== currentSize.price ||
        originalSize.enabled !== currentSize.enabled
      );
    });
  }

  toggleAccordion(): void {
    this.toggle.emit();
  }


}
