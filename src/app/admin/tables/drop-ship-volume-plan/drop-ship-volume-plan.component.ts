import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { MessageService } from 'primeng/api';
export interface Plan {
  Id?;
  Plans?;
  PlanNo?;
  VolumeOrdersPerMonth?;
  VolumeOrdersPerYear?;
  YearlyCost?;
  MonthlyPrice?;
  AveragePricePerOrder?;
  AverageFee?;
  CostForTheYear2?;
  MonthlyPrice3?;
  AveragePricePerOrder4?;
  AverageFee5?;
}

@Component({
  selector: 'app-drop-ship-volume-plan',
  templateUrl: './drop-ship-volume-plan.component.html',
  styleUrls: ['./drop-ship-volume-plan.component.css'],
  providers: [AdminService, MessageService]
})
export class DropShipVolumePlanComponent implements OnInit {

  cols: any[];
  planData: any[] = [];
  displayDialog: boolean;
  plan: Plan = {};
  selectedPlan: Plan;
  newPlan: boolean;

  constructor(private service: AdminService,
    private messageService: MessageService) {

    this.cols = [
      { field: 'Plans', header: 'Plans' },
      { field: 'PlanNo', header: 'PlanNo.' },
      { field: 'VolumeOrdersPerMonth', header: 'Orders/Month' },
      { field: 'VolumeOrdersPerYear', header: 'Orders/Year' },
      { field: 'YearlyCost', header: 'Yearly Cost' },
      { field: 'MonthlyPrice', header: 'Monthly Price' },
      { field: 'AveragePricePerOrder', header: 'Avg. Price/Order' },
      { field: 'AverageFee', header: 'Avg. Fee' },
      { field: 'CostForTheYear2', header: 'Cost For Year2' },
      { field: 'MonthlyPrice3', header: 'Monthly Price3' },
      { field: 'AveragePricePerOrder4', header: 'Avg. Price/Order4' },
      { field: 'AverageFee5', header: 'Avg. Fee5' }
    ];
  }

  ngOnInit() {
    this.getAllDSVPlan();
  }

  getAllDSVPlan() {
    this.service.getAllDSVPlan()
      .subscribe(data => {
        this.planData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteDSVPlanId(this.selectedPlan.Id)
        .subscribe(data1 => {
          let index = this.planData.indexOf(this.selectedPlan);
          this.planData = this.planData.filter((val, i) => i != index);
          this.plan = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
          this.service.addLogs('DropShipVolumePlan', this.selectedPlan.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete')
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
      this.service.addDSVPlan(this.plan)
        .subscribe(data1 => {
          this.planData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
          this.service.addLogs('DropShipVolumePlan', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add')
          .subscribe(l => {
          });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      this.service.updateDSVPlan(this.plan)
        .subscribe(data1 => {
          erps[this.planData.indexOf(this.selectedPlan)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
          this.service.addLogs('DropShipVolumePlan', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update')
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
