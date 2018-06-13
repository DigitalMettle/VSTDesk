﻿import { Component, OnInit } from '@angular/core';
import { CoreService } from '../services/core.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Validations } from '../../common'

@Component({
    selector: 'create-password',
    templateUrl: 'create-password.component.html'
})

export class CreatePasswordComponent implements OnInit {
    body: any;
    id: string;
    addPasswordForm: FormGroup;


    constructor(private coreService: CoreService, public fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private customValidation: Validations) {



        this.addPasswordForm = this.fb.group({
            Password: ['', Validators.compose([Validators.required, Validators.minLength(6), customValidation.validatePassword])],
            ConfirmPassword: ['', Validators.required],
            UserId: [this.id],

        }, { validator: customValidation.matchPassword })
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.id = params['userId']
            this.addPasswordForm.patchValue({UserId : this.id});
        })
        this.body = document.getElementsByTagName('body')[0];
        this.body.classList.add("account-theme");
        //this.activatedRoute.queryParams.subscribe(params => {
        //    this.id = params['code']
        //})
    }

    createPassword() {
        this.coreService.createPassword(this.addPasswordForm.value).subscribe(res => {
            if (res.Data) {
                this.router.navigateByUrl('/login');
            }
        })

    }
  

    // Remove class from body tag
    ngOnDestroy() {
        this.body = document.getElementsByTagName('body')[0];
        this.body.classList.remove("account-theme");
    }
}