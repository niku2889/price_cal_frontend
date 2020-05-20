import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [AdminService, MessageService]
})
export class AdminLoginComponent implements OnInit {
  signinForm: FormGroup;
  constructor(private service: AdminService,
    private messageService: MessageService, private router: Router, ) {
    localStorage.clear();
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    })
  }

  signin() {
    const signinData = this.signinForm.value;
    this.service
      .getValidateUsers(signinData.username, signinData.password)
      .subscribe(
        data => {
          if (data.error)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.error_description });
          else {
            localStorage.setItem('login', 'true');
            sessionStorage.setItem('token', data.access_token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('name', data.userName);
            localStorage.setItem('superAdmin', data.role == "SuperAdmin" ? 'true' : 'false');
            this.router.navigate(['/admin']);
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.Message });
        }
      );
  }

  forgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

}
