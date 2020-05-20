import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage-password',
  templateUrl: './manage-password.component.html',
  styleUrls: ['./manage-password.component.css'],
  providers: [AdminService, MessageService]
})
export class ManagePasswordComponent implements OnInit {

  signinForm: FormGroup;
  constructor(private service: AdminService,
    private messageService: MessageService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    })
  }

  setPassword() {
    const signinData = this.signinForm.value;
    let t = this.route.snapshot.paramMap.get("token");
    let e = this.route.snapshot.paramMap.get("email");
    this.service
      .setPassword(signinData.password, signinData.confirmPassword, e, t)
      .subscribe(
        data => {
          if (data != null) {
            if (data.error) {
              if (data.error.ModelState[''])
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState[''][0] });
              else if (data.error.ModelState['model.NewPassword'])
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState['model.NewPassword'][0] });
              else if (data.error.ModelState['model.ConfirmPassword'])
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.error.ModelState['model.ConfirmPassword'][0] });
            }
          }
          else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "Your password is reset. Please go back to login." });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.Message });
        }
      );
  }

}
