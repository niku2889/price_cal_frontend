import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { MessageService } from 'primeng/api';
export interface Plan {
  Id?;
  NumberRules?;
  NumberDocuments?;
  Complexity?;
}

@Component({
  selector: 'app-diametrics-fees',
  templateUrl: './diametrics-fees.component.html',
  styleUrls: ['./diametrics-fees.component.css'],
  providers: [AdminService, MessageService]
})
export class DiametricsFeesComponent implements OnInit {
  cols: any[];
  planData: any[] = [];
  displayDialog: boolean;
  plan: Plan = {};
  selectedPlan: Plan;
  newPlan: boolean;

  constructor(private service: AdminService,
    private messageService: MessageService) {

    this.cols = [
      { field: 'NumberRules', header: 'Number Rules' },
      { field: 'NumberDocuments', header: 'Number Documents' },
      { field: 'Complexity', header: 'Complexity' },
    ];
  }

  ngOnInit() {
    this.getAllDiametricsFee();
  }

  getAllDiametricsFee() {
    this.service.getAllDiametricsFee()
      .subscribe(data => {
        this.planData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteDiametricsFeeId(this.selectedPlan.Id)
        .subscribe(data1 => {
          let index = this.planData.indexOf(this.selectedPlan);
          this.planData = this.planData.filter((val, i) => i != index);
          this.plan = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
          this.service.addLogs('DimetricsFees', this.selectedPlan.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete')
          .subscribe(l => {
          });
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
      this.service.addDiametricsFee(this.plan)
        .subscribe(data1 => {
          this.planData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
          this.service.addLogs('DimetricsFees', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add')
          .subscribe(l => {
          });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      this.service.updateDiametricsFee(this.plan)
        .subscribe(data1 => {
          erps[this.planData.indexOf(this.selectedPlan)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
          this.service.addLogs('DimetricsFees', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update')
          .subscribe(l => {
          });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    this.planData = erps;
    this.plan = null;
    this.displayDialog = false;
  }

}
