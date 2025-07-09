import { Component } from '@angular/core';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { Item } from '../../models/item';
import { items } from '../../constants/fakeData/items';

@Component({
  selector: 'app-menu',
  imports: [MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems: Item[] = items;
}
