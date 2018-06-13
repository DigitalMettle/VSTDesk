import { Component , Input} from '@angular/core'
import { MenuItem } from '../model/menu-item.model'

@Component({
    selector : 'app-sidenav-menu-item',
    templateUrl : 'sidenav-item.component.html'
})

export class SidenavMenuItemComponent{
    @Input() item : MenuItem

    constructor(){

    }

    ngOnInit(){
        console.log(`item = ${this.item}`);
    }

    getSubItemsHeight(): string {
    return (this.getOpenSubItemsCount(this.item) * 48) + "px";
  }

  getOpenSubItemsCount(item: MenuItem): number {
    let count = 0;

    // if (item.hasSubItems() && this.sidenavService.isOpen(item)) {
    //   count += item.subItems.length;

    //   item.subItems.forEach((subItem: any) => {
    //     count += this.getOpenSubItemsCount(subItem);
    //   })
    // }

    return count;
  }
}
