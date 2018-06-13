import { NgModule } from '@angular/core'
import {Routes , RouterModule } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { InviteUserComponent, UserListComponent, UserDetailsComponent,CompanySettingsComponent,ProjectSettingsComponent } from './index'
import {UserProfileComponent} from './../common'

const routes : Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'projectsettings', component: ProjectSettingsComponent },
    { path: 'inviteuser', component: InviteUserComponent },
    { path: 'userlist', component: UserListComponent },
    { path: 'userdetails', component: UserDetailsComponent},
    { path: 'userprofile', component: UserProfileComponent },
    { path: 'companysettings', component:CompanySettingsComponent}

]

@NgModule({
 imports : [RouterModule.forChild(routes)],
 exports :[ RouterModule ]
})

export class AdminRouteModule{
    
}