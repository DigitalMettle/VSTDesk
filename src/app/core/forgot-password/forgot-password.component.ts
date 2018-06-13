import { Component } from '@angular/core';
import { CoreService } from '../services/core.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Validations } from '../../common'


@Component({
    selector : 'forgot-password',
    templateUrl : 'forgot-password.component.html'
})

export class ForgotPassword{
    body: any;
    public isUserNameValid: any = false;
    forgotPasswordForm: FormGroup;
    constructor(private coreService: CoreService, public fb: FormBuilder, private customValidation: Validations) {
        this.forgotPasswordForm = this.fb.group({
            Username: ['', Validators.compose([Validators.required, customValidation.validateEmail])],
        })
    }

    forgotPassword() {
        this.coreService.sendForgotPasswordLink(this.forgotPasswordForm.value).subscribe(res => {
            this.isUserNameValid = res;
        })

        
    }

    ngOnInit() {
        // Add class in body tag
        this.body = document.getElementsByTagName('body')[0];
        this.body.classList.add("account-theme");
    }

    // Remove class from body tag
    ngOnDestroy() {
        this.body = document.getElementsByTagName('body')[0];
        this.body.classList.remove("account-theme");
    }
}