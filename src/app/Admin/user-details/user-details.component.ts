import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Validations } from './../../common'




@Component({
    selector: 'user-details',
    templateUrl: 'user-details.component.html'
})

export class UserDetailsComponent implements OnInit {

    id: any = 0;
    userDetails: any;
    public isDisplayProjectList: any = false;
    userProjects: any

    

    constructor(private adminService: AdminService, public router: Router, private activatedRoute: ActivatedRoute, private route: Router, private customValidation: Validations, private fb: FormBuilder,) {

        this.userDetails = this.fb.group({
            Id:[],
            PhoneNumber:[''],
            FirstName: ['', Validators.compose([Validators.required])],
            LastName: [''],
            Email: [''],
            Projects: this.fb.array([this.initProject()
            ],
                customValidation.multipleCheckboxRequireOne
            )
        })
    }

    


    ngOnInit(): void {
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.id = params['Id'];
            this.getUserDetails(this.id);

           
        });

       
    }

    getUserDetails(userid: any) {
        let that = this;
 
        this.adminService.getUserDetails(this.id).subscribe(res => {
            if (res) {
                //this.userDetails = res.Data;

                if (res.Data.Projects) {
                    let dataLength = res.Data.Projects.length;
                    let formControl = <FormArray>that.userDetails.controls["Projects"];

                    while (--dataLength) {
                        formControl.push(this.initProject());
                    }

                }
                this.userDetails.patchValue(res.Data);
                
            }
        });
    }

    OnChange(e) {
        var isChecked = e.target.checked;
        if (isChecked) {

            this.getProjectsList();
            this.isDisplayProjectList = true;

           }
        else {
           this.isDisplayProjectList = false;
        }

    }

    getProjectsList() {
        
    }

    initProject() {
        return this.fb.group({
            Id: [0],
            Name: [''],
            IsSelected: [false]
        })
    }

    saveUserDeatails() {
        this.userDetails.patchValue({Id :this.id });
        this.adminService.updateUserDetails(this.userDetails.value).subscribe(res => {
            if (res.Data) {
                //this.router.navigate(['admin/userlist']);
            }
        });
    }
}


