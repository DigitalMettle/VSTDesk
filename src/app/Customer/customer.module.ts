import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CKEditorModule } from 'ng2-ckeditor'
import { CommonCustomModule} from './../common'
import { CustomerDashboardComponent, CustomerRouteModule, WorkItemComponent, CustomerService, WorkItemListComponent, WorkItemChildListComponent } from './index';



@NgModule({
    imports: [CommonModule, FormsModule, CommonCustomModule, CKEditorModule, ReactiveFormsModule, CustomerRouteModule, GridModule, NgxChartsModule],
    declarations: [CustomerDashboardComponent, WorkItemComponent, WorkItemListComponent, WorkItemChildListComponent],
    exports: [ ],
    providers: [CustomerService]
})  

export class CustomerModule {

}