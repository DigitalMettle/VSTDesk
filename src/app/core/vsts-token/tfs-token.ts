import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CoreService } from '../services/core.service'


@Component({
    selector : 'app-tfs-token',
    template :`Redirecting to VSTDesk...`
})

export class TFSTokenComponent{
    tokenObject: any = {}
    constructor(private activatedRoute: ActivatedRoute, private coreService: CoreService, private router: Router) {

}

ngOnInit(){
this.activatedRoute.queryParams.subscribe(params =>{
    this.tokenObject = {
           Code : params['code'],
           State : params['state']
       }
  this.coreService.generateToken(this.tokenObject).subscribe(res => {
      if (res)
      {
           let userObject =  localStorage.getItem('authorization') ? JSON.parse(localStorage.getItem('authorization')) : null
           if(userObject){
               userObject['isTokenGenerate'] = true;
               userObject['redirectUrl'] = '';
               localStorage.setItem('authorization' , JSON.stringify(userObject))
           }

          this.router.navigateByUrl('admin/dashboard');
      }
    })
    

})

}

}