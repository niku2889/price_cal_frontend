import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';
export interface Plan {
  Id?;
  Name?;
  Email?;
  Password?;
  IsSuperAdmin?;
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
  displayDialog: boolean;
  plan: Plan = {};
  selectedPlan: Plan;
  newPlan: boolean;

  constructor(private service: AdminService,
    private messageService: MessageService) {

    this.cols = [
      { field: 'Name', header: 'Name' },
      { field: 'Email', header: 'Email' },
      { field: 'Password', header: 'Password' },
      { field: 'IsSuperAdmin', header: 'IsSuperAdmin' },
    ];
  }

  ngOnInit() {
    this.getAllAdminUsers();
  }

  getAllAdminUsers() {
    this.service.getAllAdminUsers()
      .subscribe(data => {
        this.planData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteAdminUsersId(this.selectedPlan.Id)
        .subscribe(data1 => {
          let index = this.planData.indexOf(this.selectedPlan);
          this.planData = this.planData.filter((val, i) => i != index);
          this.plan = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
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

  onRowSelect(event) {
    this.newPlan = false;
    this.plan = this.cloneCar(event.data);
    this.displayDialog = true;
  }

  cloneCar(c: Plan): Plan {
    let plan = {};
    for (let prop in c) {
      plan[prop] = c[prop];
    }
    return plan;
  }

  save() {
    let erps = [...this.planData];
    if (this.newPlan) {
      this.service.addAdminUsers(this.plan)
        .subscribe(data1 => {
          this.planData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      this.service.updateAdminUsers(this.plan)
        .subscribe(data1 => {
          erps[this.planData.indexOf(this.selectedPlan)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    this.planData = erps;
    this.plan = null;
    this.displayDialog = false;
  }

}
