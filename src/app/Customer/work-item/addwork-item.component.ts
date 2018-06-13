import { Component,OnInit } from '@angular/core';
import { CustomerService } from '../services/customer-services';
import { FormBuilder , FormArray,Validators } from '@angular/forms';
import { ActivatedRoute,Params,Router } from '@angular/router';

import { CkEditorConfig } from './../../common'

@Component({
    selector: 'addwork-item',
    templateUrl: 'addwork-item.component.html'
})

export class WorkItemComponent implements OnInit{

    public titleEditable: any = true;
    public customerFeedbackEditable: any = true;
    public deatilsEditable: any = true;
    public workItemForm: any;
    public projectId: any;
    public workItemId : number =0;
    public isNew : boolean = true
    editorConfig : any = CkEditorConfig;

    ngOnInit(): void {
        let that = this;
        let url = this.router.url;
        this.projectId =url.substr((url.lastIndexOf('/')+1));
       
       this.activatedRoute.data.subscribe(res =>{
           
           that.isNew = res.isNew;
           let routerData : string[] = this.router.routerState.snapshot.url.split('/');
             if(res.isNew){
                   that.projectId = routerData[2];
             }else {
                  that.projectId = routerData[2];
                  that.workItemId = Number(routerData[4]);
                  this.getWorkItemDetail();
                  this.getEditableItems(that.projectId);
             }

       })

    }

   
  
    constructor(private customerService: CustomerService, private activatedRoute: ActivatedRoute, public fb: FormBuilder, private router: Router ) {
        this.workItemForm = fb.group({
            Id: [0],
            ProjectId: [''],
            Title: ['', Validators.compose([Validators.required])],
            State: [''],
            Description: [''],
            WorkItemId : [''],
            Comment:[''],
            comments : this.fb.array([])
        });
    }

    initCommentList(){
       return this.fb.group({
            Name : [''],
            Text : [''],
            Date : ['']
        })
    }

    createWorkItem() {
        this.workItemForm.patchValue({ Id: this.projectId, WorkItemId: this.workItemId });
        this.customerService.createWorkItem(this.workItemForm.value , this.projectId ).subscribe(res => {
            if (res.Data) {
               this.router.navigateByUrl('/workitemlist');
           }
        });
    }

   getWorkItemDetail(){
       this.customerService.getWorkItem(this.projectId , this.workItemId).subscribe(res =>{
          
           if(res){
            this.workItemForm.patchValue(res.Data)
            let length = res.Data.CommentList.length;
            let control = <FormArray>this.workItemForm.controls['comments'];
            while(length--){
               control.push(this.initCommentList());
            }
            this.workItemForm.patchValue({ comments : res.Data.CommentList})
            console.log('ssssssssss');
           }
       })

   }

   updateWorkItem() {
       this.workItemForm.patchValue({ Id: this.projectId, WorkItemId: this.workItemId });
       this.customerService.createWorkItem(this.workItemForm.getRawValue() , this.projectId).subscribe(res => {
           if (res.Data) {
               this.router.navigateByUrl('/workitemlist');
           }
       });  

   }

   getEditableItems(projectId: any): any {
       let that = this;
       this.customerService.GetEditableItems(projectId).subscribe(res => {
           if (res.Data) {
               this.titleEditable = res.Data.Title;
               this.deatilsEditable = res.Data.Details;
               this.customerFeedbackEditable = res.Data.CustomerFeedback;
               if (!res.Data.Title) {
                   that.workItemForm.controls['Title'].disable();
           }
           }

       });
   }

}   