import { Injectable } from '@angular/core';
import { Router, NavigationStart, ActivationEnd, NavigationEnd } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { MenuItem } from '../model/menu-item.model'
import { Setting } from '../model/settings'
import { DataModel } from './../../common/utility/dataModel'

@Injectable()
export class SideNavService {
    private _menuItemSubject = new BehaviorSubject<MenuItem[]>([]);
    private _menuItem: MenuItem[] = [];
    menuItem$: Observable<MenuItem[]> = this._menuItemSubject.asObservable();


    constructor(private router: Router) {

        console.log('constructor called');

        this.router.events.subscribe((res) => {
            if (res instanceof NavigationStart) {
                this.setSidenavMenuItem(res.url.split('/')[1])
                console.log('navigation start')
            }
            else if (res instanceof NavigationEnd) {
                this.setSidenavMenuItem(res.url.split('/')[1])
                console.log('Navigation end')
            }
        })
    }

    ngOnInit() {


    }

    setSidenavMenuItem(url) {

        if (url != Setting.routeUrl) {
            Setting.routeUrl = url;
            switch (url) {
                case "admin":
                    this.setAdminMenu();
                    break;
                default:
                    this.setMenu();
            }
        }

        //  this.setAdminMenu();
    }

    setMenu() {
        let userObject = localStorage.getItem('authorization') ? JSON.parse(localStorage.getItem('authorization')) : {};
        DataModel.ProjectId = userObject['selectedProjectId'];
        DataModel.UserRole = userObject['role'];
        console.log('set menu function called');
        let menu = this;
        menu._menuItem = [];
        menu.addItem("Dashboard", "/dashboard", "ion-android-apps icon-2x", 1);
        menu.addItem("My Profile", "/userprofile", "ion-android-contact icon-2x", 2);
        // menu.addItem("Create Work Item", "/project/" + userObject['selectedProjectId'] +  "/workitem/add", "ion-document icon-2x" , 2);
        menu.addItem("Work Item List", "/workitemlist", "ion-ios-list icon-2x", 3);
        this.setMenuItem();
    }

    setAdminMenu() {
        let userObject = localStorage.getItem('authorization') ? JSON.parse(localStorage.getItem('authorization')) : {};
        DataModel.UserRole = userObject['role'];
        console.log('set admin menu function called');
        let adminmenu = this;
        adminmenu._menuItem = [];
        let dashboard = adminmenu.addItem("Dashboard", "/admin/dashboard", "ion-android-apps icon-2x", 1);

        // adminmenu.addSubItem(dashboard , "sub menu 1" , "admin/aaa" , 1);
        // adminmenu.addSubItem(dashboard , "sub menu 2" , "admin/aaa" , 1);
        // adminmenu.addSubItem(dashboard , "sub menu 3" , "admin/aaa" , 1);
        // adminmenu.addSubItem(dashboard , "sub menu 4" , "admin/aaa" , 1);

        adminmenu.addItem("Admin Project Settings", "/admin/projectsettings", "ion-gear-a icon-2x", 2);
        adminmenu.addItem("Invite User", "/admin/inviteuser", "ion-person-add icon-2x", 3);
        adminmenu.addItem("Users", "/admin/userlist", "ion-person-stalker icon-2x", 4);
        adminmenu.addItem("Company Settings", "/admin/companysettings", "ion-gear-b icon-2x", 5);


        this.setMenuItem();
    }

    setMenuItem() {
        this._menuItemSubject.next(this._menuItem);
    }

    addItem(name: string, route: string, icon: string, position: number): MenuItem {
        let item = new MenuItem({
            name: name,
            route: route,
            subItems: [],
            position: position || 99,
            icon: icon
        });
        this._menuItem.push(item);
        //   this._itemsSubject.next(this._items);
        return item;
    }

    addSubItem(parent: MenuItem, name: string, route: string, position: number) {
        let item = new MenuItem({
            name: name,
            route: route,
            parent: parent,
            subItems: [],
            position: position || 99
        });

        parent.subItems.push(item);
        return item;
    }

}
