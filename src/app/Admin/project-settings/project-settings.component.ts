import { Component, OnInit } from '@angular/core'
import { AdminService } from '../services/admin.service';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Validations } from '../../common'

@Component({
    selector: 'project-settings',
    templateUrl: 'project-settings.component.html'
})

export class ProjectSettingsComponent implements OnInit {

    workItemList: any;
    MemberList: any;
    public projectList: any;
    public isDisplaySettings: any = false;
    public data: any;
    public adminSettingForm: any;
    public createdItemsStatus: any = [] //[{ id: 1, name: 'InProduction' }, { id: 2, name: 'InternalQA' }, { id: 3, name: 'Questions' }, { id: 4, name: 'Assigned' }];

    constructor(private adminService: AdminService, public fb: FormBuilder, private customValidation: Validations) {

    this.createForm();
       
    }

    createForm(){
         this.adminSettingForm = this.fb.group({
            Id: [0],
            ProjectId: [0],
            VSTDeskActive: [true],
            CreatedItemStatus: ['', this.customValidation.selectOption],
            CreatedItemType: ['', this.customValidation.selectOption],
            DefaultAssignment: ['', this.customValidation.selectOption],
            EditableFields: this.fb.group({
                Title: [false],
                Details: [false],
                CustomerFeedback: [false]
            }),
            WorkItemsList: this.fb.array([]),
            Layout: this.fb.group({
                Flat: [true],
                Hierarchical: [false]
            }),
            GridVisibleFields: this.fb.group({
                WorkItemId : [false],
                WorkItemType: [false],
                Title: [false],
                State:[false]
            }),
            WorkItemsState: this.fb.array([]),
            CustomStatus: this.fb.array([
                this.initCustomStatusData()
            ]),
            MemberList:['']




        });
    }

    initCustomStatusData() {

        return this.fb.group({
            Id: [0],
            projectId: [0],
            StatusName: [''],
            DisplayName: ['', Validators.compose([Validators.required, this.customValidation.validateCharactersOnly])]

        });
    }
    ngOnInit(): void {
        //getting the list of project from the api
        this.adminService.getProjectList().subscribe(res => {
            if (res) {
                this.projectList = res.Data;
            }

        })

    }

    get WorkItemList(): FormArray { return this.adminSettingForm.get('WorkItemsList') as FormArray; }
    get WorkItemStateList(): FormArray { return this.adminSettingForm.get('WorkItemsState') as FormArray; }


    initWorkItems() {
        return this.fb.group({
            Id: [0],
            Name: [''],
            IsSelected: [false]
        })
    }



    //display panel on project selection
    onSelect(data: any) {
        if (data != -1) {
            this.getAdminSettings(data);

            this.isDisplaySettings = true;
        }
        else if (data == -1) {
            this.isDisplaySettings = false;
        }
    }

    getAdminSettings(projectId: any) {
          this.createForm();
        this.adminService.getAdminSettings(projectId).subscribe(res => {
            if (res) {

               // this.adminSettingForm.reset();
              //  this.adminSettingForm.controls["WorkItems"].reset();
               // this.adminSettingForm.controls["WorkItemState"].reset();
                // this.adminSettingForm.patchValue(res.Data);
                this.createdItemsStatus =  res.Data.WorkItemsState;
                let workItemsControls = <FormArray>this.adminSettingForm.controls["WorkItemsList"];
                let lengthofCustomItem = res.Data.WorkItemsList.length;
                while (lengthofCustomItem--) {
                    workItemsControls.push(this.initWorkItems())
                }
                this.adminSettingForm.patchValue({ WorkItemsList: res.Data.WorkItemsList })

                let lengthofCustomItemState = res.Data.WorkItemsState.length;
                let workItemsStateControls = <FormArray>this.adminSettingForm.controls["WorkItemsState"];
                while (lengthofCustomItemState--) {
                    workItemsStateControls.push(this.initWorkItems())
                }
                this.adminSettingForm.patchValue({ WorkItemsState: res.Data.WorkItemsState })

                let dataLength = res.Data.CustomStatus.length;
                let formControl = <FormArray>this.adminSettingForm.controls["CustomStatus"];

                while (--dataLength) {
                    formControl.push(this.initCustomStatusData());
                }
                
                this.adminSettingForm.patchValue({ CustomStatus: res.Data.CustomStatus })
                
                this.adminSettingForm.patchValue({DefaultAssignment : res.Data.DefaultAssignment });
                this.adminSettingForm.patchValue({EditableFields : res.Data.EditableFields});
                this.adminSettingForm.patchValue({VSTDeskActive : res.Data.VSTDeskActive})
                this.adminSettingForm.patchValue({ Layout: res.Data.Layout });
                this.adminSettingForm.patchValue({ Id: res.Data.Id });
                this.adminSettingForm.patchValue({ ProjectId: res.Data.ProjectId });
                this.adminSettingForm.patchValue({ CreatedItemStatus: res.Data.CreatedItemStatus });
                this.adminSettingForm.patchValue({ CreatedItemType: res.Data.CreatedItemType });
                this.adminSettingForm.patchValue({ GridVisibleFields: res.Data.GridVisibleFields });
                this.adminSettingForm.patchValue({ MemberList: res.Data.MemberList });
                this.MemberList = res.Data.MemberList;
                if (this.adminSettingForm.controls["DefaultAssignment"].value == null) {
                    this.adminSettingForm.patchValue({ DefaultAssignment: "" });
                }
            }

        })
    }

    //saving all the updated project settings to database
    saveProjectSetting() {

        this.adminService.setProjectSetting(this.adminSettingForm.value).subscribe(res => {
            
        })



    }

    setradio(data: any) {
        if (data == 0) {
            this.adminSettingForm.controls['Layout'].patchValue({ Flat: false, Hierarchical: true });
        }
        else {
            this.adminSettingForm.controls['Layout'].patchValue({ Flat: true, Hierarchical: false });
        }

    }
}