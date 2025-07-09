import { Component, Input } from '@angular/core';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-item',
  imports: [NumberInputComponent, CommonModule, FormsModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {
  @Input() item: any = {};
  @Input() sizes: any[] = [];
  isOpen = false;
  onPriceChanged(sizeId: number, event: Event) {
    console.log('onPriceChanged');
  }
  isSizeEnabled(sizeId: number) {
    return true;
  }

  getPrice(priceId: number) {
    return 0;
  }
}
