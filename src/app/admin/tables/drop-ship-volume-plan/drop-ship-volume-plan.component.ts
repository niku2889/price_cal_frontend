import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { MessageService } from 'primeng/api';
export interface Plan {
  Id?;
  Plans?;
  PlanNo?;
  VolumeOrdersPerMonth?;
  VolumeOrdersPerYear?;
  YearlyCostByMonthlyPlan?;
  MonthlyPriceByMonthlyPlan?;
  AveragePricePerOrderByMonthlyPlan?;
  OverageFeeByMonthlyPlan?;
  CostForTheYear2ByAnnualPlan?;
  MonthlyPrice3ByAnnualPlan?;
  AveragePricePerOrder4ByAnnualPlan?;
  OverageFee5ByAnnualPlan?;
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
  finalPlanData: any[] = [];
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
      { field: 'YearlyCostByMonthlyPlan', header: 'Yearly Cost By Monthly Plan' },
      { field: 'MonthlyPriceByMonthlyPlan', header: 'Monthly Price By Monthly Plan' },
      { field: 'AveragePricePerOrderByMonthlyPlan', header: 'Average Price Per Order By Monthly Plan' },
      { field: 'OverageFeeByMonthlyPlan', header: 'Overage Fee By Monthly Plan' },
      { field: 'CostForTheYear2ByAnnualPlan', header: 'Cost For The Year2 By Annual Plan' },
      { field: 'MonthlyPrice3ByAnnualPlan', header: 'Monthly Price3 By Annual Plan' },
      { field: 'AveragePricePerOrder4ByAnnualPlan', header: 'Average Price Per Order4 By Annual Plan' },
      { field: 'OverageFee5ByAnnualPlan', header: 'Overage Fee5 By Annual Plan' }
    ];
  }

  ngOnInit() {
    this.getAllDSVPlan();
  }

  getAllDSVPlan() {
    this.service.getAllDSVPlan()
      .subscribe(data => {
        this.planData = data;
        this.finalPlanData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteDSVPlanId(this.selectedPlan.Id)
        .subscribe(data1 => {
          let index = this.planData.indexOf(this.selectedPlan);
          this.planData = this.planData.filter((val, i) => i != index);
          this.finalPlanData = this.finalPlanData.filter((val, i) => i != index);
          this.plan = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
          this.service.addLogs('DropShipVolumePlan', this.selectedPlan.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete',this.selectedPlan,null)
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
          this.finalPlanData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
          this.service.addLogs('DropShipVolumePlan', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add',null, data1)
          .subscribe(l => {
          });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      let old = this.finalPlanData.filter(a => a.Id == this.plan.Id)
      this.service.updateDSVPlan(this.plan)
        .subscribe(data1 => {
          erps[this.planData.indexOf(this.selectedPlan)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
          this.service.addLogs('DropShipVolumePlan', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update', old[0], data1)
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
