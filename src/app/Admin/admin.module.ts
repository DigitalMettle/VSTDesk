import {NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule  , FormsModule} from '@angular/forms';
import { AdminRouteModule } from './admin.routes'
import { CommonCustomModule } from '../common'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DashboardComponent, ProjectSettingsComponent, AdminService, InviteUserComponent, UserListComponent,UserDetailsComponent,CompanySettingsComponent } from './index';



@NgModule({
    imports: [AdminRouteModule, CommonCustomModule, CommonModule, ReactiveFormsModule, FormsModule, NgxChartsModule, UploadModule],
    declarations: [DashboardComponent, ProjectSettingsComponent, InviteUserComponent, UserListComponent, UserDetailsComponent, CompanySettingsComponent],
    exports: [],
    providers : [AdminService]
})

export class AdminModule {

}