import { Component, OnInit } from '@angular/core';
import { AdminService} from './../services/admin.service';
import 'rxjs'
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
    selector : 'dashboard',
    templateUrl : 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

    ngOnInit(): void {
        this.adminService.getUsersByProject().subscribe(res => {
            if (res.Data) {
                this.single = res.Data;
            }

           
        })
    }

    single: any[]=[];
    

    view: any[] = [1000, 1000];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    yAxisLabel= 'Projects';
    showYAxisLabel = true;
    xAxisLabel = 'No Of Users';
    

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#5AA454', '#C7B42C', '#A10A28', '#AAAAAA', '#2980B9', '#78281F', '#9B59B6']
    };

    

    onSelect(event) {
        console.log(event);
    }

   constructor(public adminService : AdminService){

   }

   syncProject(){
       this.adminService.SyncProject().subscribe(res =>{

       })
   }
    
}