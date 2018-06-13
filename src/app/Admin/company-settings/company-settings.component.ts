import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormBuilder } from '@angular/forms';


import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo, SuccessEvent } from '@progress/kendo-angular-upload';
@Component({
    selector: "company-settings",
    templateUrl:"company-settings.component.html"
})

export  class CompanySettingsComponent implements OnInit {

    uploadSaveUrl = "api/account/uploadimage";
    public companyLogo: any;
    public companyMessage: any;
    formData: any;

    ngOnInit(): void {
        this.getCompanySettings();
    }


    constructor(private _adminService: AdminService, private fb: FormBuilder) {
        this.formData = this.fb.group({
            CompanyMessage: [],
        });
    }

    saveCompanySettings() {
        this._adminService.setCompanySettings({CompanyMessage:this.formData.controls['CompanyMessage'].value } )
            .subscribe();
    }

    getCompanySettings() {
        this._adminService.getCompanySettings()
            .subscribe(res => {
                if (res.Data) {
                    this.companyLogo = res.Data.CompanyLogo;
                    this.formData.patchValue({ CompanyMessage: res.Data.CompanyMessage });
                }
            });
    }

    successEventHandler(e: SuccessEvent) {
        if (e.operation == "upload") {
            this.companyLogo = e.response.body.Data;
        }
    }


}