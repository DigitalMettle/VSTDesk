import { Component } from '@angular/core'
import {Router} from '@angular/router'
import { UserProfile , CommonServices , UserRoles } from './../../common'

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})

export class HeaderComponent {
    openSidebar: boolean = true;
    body: any;
    isShow : boolean = true;
    userProfile = UserProfile;
    constructor(private router : Router , public commonServices : CommonServices){

    }

    // Open close sidebar menu
    ngOnInit() {
        let that = this;
        this.body = document.getElementsByTagName('body')[0];
        this.body.classList.remove("close-sidebar");
        this.body.classList.add("open-sidebar");

        this.commonServices.userImage$.subscribe(res => {
            if (res != '') {
                that.isShow = false;
                UserProfile.ProfileImageUrl = res;
                this.userProfile = UserProfile;
                setTimeout(function () {
                    that.isShow = true;
                }, 1);
            }
            
        })

         this.commonServices.userProfile$.subscribe(res => {
            if(res['FirstName'] != undefined){
                UserProfile.FirstName = res['FirstName'];
                UserProfile.LastName = res['LastName'];
                this.userProfile = UserProfile;
            }
        })
    }

    sidbarToggle() {
        this.openSidebar = !this.openSidebar;
        if (this.openSidebar) {
            this.body = document.getElementsByTagName('body')[0];
            this.body.classList.remove("close-sidebar");
            this.body.classList.add("open-sidebar");
        } else {
            this.body = document.getElementsByTagName('body')[0];
            this.body.classList.remove("open-sidebar");
            this.body.classList.add("close-sidebar");
        }
    }

    logout() {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('authorization');
            this.router.navigate(['/login'])
        }
       
    }

    navigateToProfile(){
          if(UserProfile.Role == UserRoles.Admin.toString()){
               this.router.navigate(['admin/userprofile'])
          }else{
              this.router.navigate(['userprofile'])
          }
    }

    
}