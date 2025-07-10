import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  isOpen = false;
  hasChanges = false;

  constructor(
    private dataService: DataService
  ) { }


  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }

  onPriceChanged(sizeId: number, newPrice: number): void {
    this.dataService.updatePrice(this.item.itemId, sizeId, newPrice);
    this.hasChanges = true;
  }

  undoChanges(): void {
  }

  onSizeToggled(sizeId: number, enabled: boolean) {
    this.dataService.updateSize(this.item.itemId, sizeId, enabled);
  }

}
