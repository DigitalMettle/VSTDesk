import { Component,OnInit } from '@angular/core'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomerService } from '../services/customer-services';

@Component({
    selector: 'customer-dashboard',
    templateUrl: 'customer-dashboard.component.html'
})

export class CustomerDashboardComponent implements OnInit{

    projectList: any;
    single: any[] = [];
    view: any[] = [650, 180];

    // options
    showXAxis = false;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Projects';

    colorScheme = {
        domain: ['#5AA454', '#C7B42C', '#A10A28', '#AAAAAA', '#2980B9', '#78281F','#9B59B6']
    };

    ngOnInit(): void {
        //this.single.push({ name: "Test", value:"10" });
        //getting the list of project from the api
        this._customerService.getAssignedProjectList().subscribe(res => {
                if (res) {
                    this.projectList = res.Data;
                    this.getWorkItemStatus(this.projectList[0].Id);
                }

        })
       

    }

    constructor(private _customerService:CustomerService) {

    }


    getWorkItemStatus(projectId:any) {
        this._customerService.getAllProjectWorkItemStatus(projectId).subscribe(res => {
            if (res && res.Data) {
                this.single = res.Data;
            }
        })
    }

    onSelect(data: any) {
        if (data != -1) {
            this.getWorkItemStatus(data);
        }
    }


 
   
  


  

   



}