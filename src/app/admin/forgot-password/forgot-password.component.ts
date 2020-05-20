import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [AdminService, MessageService]
})
export class ForgotPasswordComponent implements OnInit {

  signinForm: FormGroup;
  constructor(private service: AdminService,
    private messageService: MessageService, private router: Router, ) {
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  forgotPassword() {
    const signinData = this.signinForm.value;
    this.service
      .forgotPassword(signinData.email)
      .subscribe(
        data => {
          if (data != null) {
            if (data.error)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.Message });
          }
          else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Please check your email and click on the provided link to reset your password." });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.Message });
        }
      );
  }

}
