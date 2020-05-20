import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';
export interface Plan {
  Id?;
  UserName?;
  Email?;
  Password?;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  providers: [AdminService, MessageService]
})
export class AdminUsersComponent implements OnInit {
  cols: any[];
  planData: any[] = [];
  finalPlanData: any[] = [];
  displayDialog: boolean;
  plan: Plan = {};
  selectedPlan: Plan;
  newPlan: boolean;
  isSA;
  permission = true;
  name:any;

  constructor(private service: AdminService,
    private messageService: MessageService) {
    this.isSA = localStorage.getItem('superAdmin');
    this.name = localStorage.getItem('name');
    if (this.isSA == false || this.isSA == 'false')
      this.permission = false;
    this.cols = [
      { field: 'UserName', header: 'UserName' },
      { field: 'Email', header: 'Email' },
      // { field: 'Id', header: 'Id' },
      // { field: 'IsSuperAdmin', header: 'IsSuperAdmin' },
    ];
  }

  ngOnInit() {
    this.getAllAdminUsers();
  }

  getAllAdminUsers() {
    this.service.getAllAdminUsers()
      .subscribe(data => {
        this.planData = data;
        this.finalPlanData = data;
      });
  }

  // delete() {
  //   if (confirm("Are you sure you want to delete this record?")) {
  //     this.service.deleteAdminUsersId(this.selectedPlan.Id)
  //       .subscribe(data1 => {
  //         let index = this.planData.indexOf(this.selectedPlan);
  //         this.planData = this.planData.filter((val, i) => i != index);
  //         this.finalPlanData = this.finalPlanData.filter((val, i) => i != index);
  //         this.plan = null;
  //         this.displayDialog = false;
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
  //         this.service.addLogs('AdminUsers', this.selectedPlan.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete',this.selectedPlan,null)
  //           .subscribe(l => {
  //           });
  //       }, err => {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
  //       });
  //   }
  // }

  deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.service.deleteUser(id)
        .subscribe(data1 => {
          if (data1 != null) {
            if (data1.error) {
              if (data1.error.ModelState[''])
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data1.error.ModelState[''][0] });
              else
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data1.error.Message });
            }
          }
          else {
            this.getAllAdminUsers();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted Successfully' });
            this.service.addLogs('AdminUsers', this.plan.Email, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete', null, this.plan.Email)
              .subscribe(l => {
              });
          }
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
  }

  showDialogToAdd() {
    this.newPlan = true;
    this.plan = {};
    this.displayDialog = true;
  }

  // onRowSelect(event) {
  //   this.newPlan = false;
  //   this.plan = this.cloneCar(event.data);
  //   this.displayDialog = true;
  // }

  // cloneCar(c: Plan): Plan {
  //   let plan = {};
  //   for (let prop in c) {
  //     plan[prop] = c[prop];
  //   }
  //   return plan;
  // }

  getValid(email){
    return this.name == email ? false : true;
  }

  save() {
    let erps = [...this.planData];
    if (this.newPlan) {
      this.service.addAdminUsers(this.plan)
        .subscribe(data1 => {
          if (data1 != null) {
            if (data1.error) {
              if (data1.error.ModelState[''])
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data1.error.ModelState[''][0] });
              else
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data1.error.ModelState['model.Password'][0] });
            }
          }
          else {
            this.getAllAdminUsers();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
            this.service.addLogs('AdminUsers', this.plan.Email, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add', null, this.plan.Email)
              .subscribe(l => {
              });
          }
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      // let old = this.finalPlanData.filter(a => a.Id == this.plan.Id)
      // this.service.updateAdminUsers(this.plan)
      //   .subscribe(data1 => {
      //     erps[this.planData.indexOf(this.selectedPlan)] = data1;
      //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
      //     this.service.addLogs('AdminUsers', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update', old[0], data1)
      //     .subscribe(l => {
      //     });
      //   }, err => {
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
      //   });
    }
    this.planData = erps;
    this.plan = null;
    this.displayDialog = false;
  }

}
