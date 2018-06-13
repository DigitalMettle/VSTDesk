import { Component,OnInit } from '@angular/core';
import { CommonServices } from '../services/common.services';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo, SuccessEvent } from '@progress/kendo-angular-upload';


@Component({
    selector: 'user-profile',
    templateUrl: 'user-profile.component.html'
})

export class UserProfileComponent implements OnInit{
    ProPic: any ="UserImages/noimage.gif";
    uploadSaveUrl = "api/user/uploadimage";
    formData: any;
    file: any;
    data: any;
    allowedExtensions: [".jpg", ".png"]
    public uploadRemoveUrl: string = "removeUrl";
    public uploadRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".png"]
    };
  

    ngOnInit(): void {

        this.commonService.getUserProfileData().subscribe(res => {
            if (res) {
                this.formData.patchValue(res.Data);
                if ((res.Data.ProfilePhoto).indexOf('.')>0) {
                    this.ProPic = res.Data.ProfilePhoto;
                }
               
            }

        });

       
    }

    constructor(private fb: FormBuilder , public commonService : CommonServices) {
        this.formData = this.fb.group({
            UserId:[''],
            FirstName: ['', Validators.required],
            LastName: [''],
            Email: [''],
            ProfileImage: [''],
            ProfilePhoto: [''],
            PhoneNumber:['']
        });
    }

    successEventHandler(e: SuccessEvent) {
        
        if (e.operation == "upload") {
            this.formData.patchValue({ ProfilePhoto: e.response.body.Data })
            this.ProPic = e.response.body.Data;
            this.commonService.setProfileImage(e.response.body.Data);
            this.commonService.setUserImage(e.response.body.Data);
        }
    }
  
    saveUserProfileData() {
        this.commonService.setUserProfileData(this.formData.value).subscribe(res => {
            if (res) {
                this.commonService.setUserProfileHeader(this.formData.value);
                //this.formData = res.Data;
            }

        });
    } 




}