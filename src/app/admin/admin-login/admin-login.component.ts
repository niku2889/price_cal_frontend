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
    private messageService: MessageService,private router: Router,) {
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
      .getAllAdminUsers()
      .subscribe(
        data => {
          let loginResult: any[] = data;
          let l = loginResult.filter(a => a.Name == signinData.username && a.Password == signinData.password)
          if (l.length > 0) {
            localStorage.setItem('login', 'true');
            localStorage.setItem('userId', l[0].Id);
            localStorage.setItem('superAdmin', l[0].IsSuperAdmin);
            localStorage.setItem('name', l[0].Name);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully!' });
            this.router.navigate(['/admin']);
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Login attempt' });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.Message });
        }
      );
  }

}
