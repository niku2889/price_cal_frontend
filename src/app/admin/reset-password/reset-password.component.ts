import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [AdminService, MessageService]
})
export class ResetPasswordComponent implements OnInit {

  currentPassword: any;
  newPassword: any;
  confirmPassword: any;

  constructor(private service: AdminService,
    private messageService: MessageService) { }

  ngOnInit() {
  }

  submit() {
    this.service.resetPassword(this.currentPassword, this.newPassword, this.confirmPassword)
      .subscribe(data => {
        if (data != null) {
          if (data.error) {
            if (data.error.ModelState[''])
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState[''][0] });
            else if (data.error.ModelState['model.OldPassword'])
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState['model.OldPassword'][0] });
            else if (data.error.ModelState['model.NewPassword'])
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState['model.NewPassword'][0] });
            else if (data.error.ModelState['model.ConfirmPassword'])
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState['model.ConfirmPassword'][0] });
          }
        }
        else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Reset Successfully' });
        }
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
      });
  }
}
