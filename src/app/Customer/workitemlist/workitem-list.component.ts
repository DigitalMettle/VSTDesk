import { Component } from '@angular/core'
import { GridDataResult, PageChangeEvent, SelectionEvent } from '@progress/kendo-angular-grid'
import { SortDescriptor } from '@progress/kendo-data-query'
import { FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/debounceTime';
import { CustomerService } from '../services/customer-services';
import { Router } from '@angular/router';
import { DataModel, Projects } from './../../common';




@Component({
    selector: 'app-work-item-list',
    templateUrl: 'workitem-list.component.html'
})
export class WorkItemListComponent {
    items: any[]
    gridItem: any[]
    childItem: any[] = [];
    public gridView: GridDataResult;
    private data: Object[];
    searchItemForm: any;
    projects = Projects;
    public pageSize = 10;
    public skip = 0;
    public showWorkItemId: any = true;
    public showWorkItemType: any = true;
    public showTitle: any = true;
    public showState: any = true;

    constructor(private customerService: CustomerService, private router: Router, private fb: FormBuilder) {
        if (this.projects.projectStatus.length == 0) {
            this.getProjectStatus(this.projects.selectedProjectId);
        }
    }

    ngOnInit() {
        console.log(this.projects, this.projects.selectedProjectId);
        this.customerService.getAssignedProjectList().subscribe(res => {
            if (res) {
                this.projects.Project = res.Data.map(o => { return { Id: o.Id, Name: o.Name }; });
                Projects.resetProjectList(this.projects.Project);
            }
        });
        let that = this;
        this.loadData();
        this.getGridColumnFields();
        this.searchItemForm = this.fb.group({
            Title: [''],
            ProjectId: [''],
            ProjectStatus: ['Select']
        })

        this.searchItemForm.patchValue({ ProjectId: this.projects.selectedProjectId });

        this.searchItemForm.controls['Title'].valueChanges.debounceTime(500).subscribe(res => {
            //that.SearchItembyTitle(res);
            this.SearchItembyTitleAndState(res , this.searchItemForm.controls['ProjectStatus'].value )
        })

        this.searchItemForm.controls['ProjectId'].valueChanges.debounceTime(500).subscribe(res => {
            this.projects.setSelectedProject(res);
            this.getProjectStatus(res);
            DataModel.ProjectId = res;
            this.loadData();
            this.getGridColumnFields();

        })

        this.searchItemForm.controls['ProjectStatus'].valueChanges.debounceTime(300).subscribe(res => {

           // this.getProjectWorkItemByStatus(res);
           this.SearchItembyTitleAndState(this.searchItemForm.controls['Title'].value , res)

        })


    }

    getProjectStatus(id: number) {
        let that = this;
        this.customerService.getProjectStatusByProjectId(id).subscribe(res => {
            that.projects.projectStatus = [];
            that.projects.projectStatus.push.apply(that.projects.projectStatus, res.Data);
        })
    }


    loadData() {
        this.customerService.getProjectWorkItem(DataModel.ProjectId).subscribe(res => {
            if (res && res.Data.Items) {
                this.items = res.Data.Items;
                this.gridItem = res.Data.Items;
                this.setGrid();
            }
        })

    }
    getGridColumnFields() {
        this.customerService.getGridColumnFields(DataModel.ProjectId).subscribe(res => {
            if (res && res.Data) {

                this.showWorkItemId = res.Data.WorkItemId;
                this.showWorkItemType = res.Data.WorkItemType;
                this.showTitle = res.Data.Title;
                this.showState = res.Data.State;
                this.setGrid();
                
            }
        })
    }

    setGrid() {
        this.gridView = {
            data: this.gridItem.slice(this.skip, this.skip + this.pageSize),
            total: this.gridItem.length
        };
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.setGrid();
    }


    public selectedRowChange(selectionEvent: SelectionEvent) {

        let selectedItem = this.gridView.data[selectionEvent.index];
        // console.log(selectedItem);
        // console.log(selectedItem["Field"]["Id"]);
        // console.log('/project/1/workitem/' + selectedItem["Field"]["Id"] + '/edit');
        //this.router.navigateByUrl('/project/1/workitem/' + selectedItem["Field"]["Id"] + '/edit');
        this.router.navigate(['project', DataModel.ProjectId, 'workitem', selectedItem["Field"]["Id"], 'edit']);
    }

    addNewWorkItem() {
        this.router.navigate(['project', DataModel.ProjectId, 'workitem', 'add']);
    }

   

    SearchItembyTitleAndState(title: string, state: any) {
        let that = this;
        this.skip = 0;
        that.childItem = [];
        let parentItem: any[];
        if (title && state && state != "Select") {
            parentItem = this.items.filter(x => x.Field.Title.toLowerCase().indexOf(title.toLowerCase()) > -1);
            // = this.items.filter(x => x.ChildList.filter(x => x.Title.toLowerCase().indexOf(res['Title'].toLowerCase()) >-1))        
            if (parentItem.length > 0) {
                parentItem.forEach(element => {
                    element.ChildList = element.ChildList.length > 0 ? element.ChildList.filter(x => x.Title.toLowerCase().indexOf(title.toLowerCase()) > -1) : []
                });
            }

            this.items.forEach(ele => {
                let item = ele.ChildList.length > 0 ? ele.ChildList.filter(x => x.Title.toLowerCase().indexOf(title.toLowerCase()) > -1) : [];
                that.childItem.push.apply(that.childItem, item);
            })

            for (let item of parentItem) {
                let subItems = item['ChildList'];
                for (let subItem of subItems) {
                    let index = that.childItem.indexOf(subItem);
                    that.childItem.splice(index, 1);
                }
            }

            for (let item of that.childItem) {
                let obj = {
                    Field: item,
                    count: 0,
                    ChildList: []
                }

                parentItem.push(obj);
            }

            let searchPrentItem = parentItem;
            that.childItem = [];

            parentItem = searchPrentItem.filter(x => x.Field.State.toLowerCase().indexOf(state.toLowerCase()) > -1);
            // = this.items.filter(x => x.ChildList.filter(x => x.Title.toLowerCase().indexOf(res['Title'].toLowerCase()) >-1))        
            if (parentItem.length > 0) {
                parentItem.forEach(element => {
                    element.ChildList = element.ChildList.length > 0 ? element.ChildList.filter(x => x.State.toLowerCase().indexOf(state.toLowerCase()) > -1) : []
                });
            }

            searchPrentItem.forEach(ele => {
                let item = ele.ChildList.length > 0 ? ele.ChildList.filter(x => x.State.toLowerCase().indexOf(state.toLowerCase()) > -1) : [];
                that.childItem.push.apply(that.childItem, item);
            })

            for (let item of parentItem) {
                let subItems = item['ChildList'];
                for (let subItem of subItems) {
                    let index = that.childItem.indexOf(subItem);
                    that.childItem.splice(index, 1);
                }
            }

            for (let item of that.childItem) {
                let obj = {
                    Field: item,
                    count: 0,
                    ChildList: []
                }

                parentItem.push(obj);
            }



        } else if (title) {
            parentItem = this.items.filter(x => x.Field.Title.toLowerCase().indexOf(title.toLowerCase()) > -1);
            // = this.items.filter(x => x.ChildList.filter(x => x.Title.toLowerCase().indexOf(res['Title'].toLowerCase()) >-1))        
            if (parentItem.length > 0) {
                parentItem.forEach(element => {
                    element.ChildList = element.ChildList.length > 0 ? element.ChildList.filter(x => x.Title.toLowerCase().indexOf(title.toLowerCase()) > -1) : []
                });
            }

            this.items.forEach(ele => {
                let item = ele.ChildList.length > 0 ? ele.ChildList.filter(x => x.Title.toLowerCase().indexOf(title.toLowerCase()) > -1) : [];
                that.childItem.push.apply(that.childItem, item);
            })

            for (let item of parentItem) {
                let subItems = item['ChildList'];
                for (let subItem of subItems) {
                    let index = that.childItem.indexOf(subItem);
                    that.childItem.splice(index, 1);
                }
            }

            for (let item of that.childItem) {
                let obj = {
                    Field: item,
                    count: 0,
                    ChildList: []
                }

                parentItem.push(obj);
            }

        } else if (state && state != "Select") {
            parentItem = this.items.filter(x => x.Field.State.toLowerCase() == state.toLowerCase());
            // = this.items.filter(x => x.ChildList.filter(x => x.Title.toLowerCase().indexOf(res['Title'].toLowerCase()) >-1))        
            if (parentItem.length > 0) {
                parentItem.forEach(element => {
                    element.ChildList = element.ChildList.length > 0 ? element.ChildList.filter(x => x.State.toLowerCase() == state.toLowerCase()) : []
                });
            }

            this.items.forEach(ele => {
                let item = ele.ChildList.length > 0 ? ele.ChildList.filter(x => x.State.toLowerCase() == state.toLowerCase()) : [];
                that.childItem.push.apply(that.childItem, item);
            })

            for (let item of parentItem) {
                let subItems = item['ChildList'];
                for (let subItem of subItems) {
                    let index = that.childItem.indexOf(subItem);
                    that.childItem.splice(index, 1);
                }
            }

            for (let item of that.childItem) {
                let obj = {
                    Field: item,
                    count: 0,
                    ChildList: []
                }

                parentItem.push(obj);
            }
        } else {
            parentItem = this.items;
        }

        this.gridItem = parentItem;
        this.setGrid();

    }

}

