import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { MessageService } from 'primeng/api';
export interface Plan {
  Id?;
  TradingPartnerCommunitySize?;
  Complexity?;
  Fee?;
}

@Component({
  selector: 'app-diametrics-fees2',
  templateUrl: './diametrics-fees2.component.html',
  styleUrls: ['./diametrics-fees2.component.css'],
  providers: [AdminService, MessageService]
})
export class DiametricsFees2Component implements OnInit {

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
      { field: 'TradingPartnerCommunitySize', header: 'Trading Partner Community Size' },
      { field: 'Complexity', header: 'Complexity' },
      { field: 'Fee', header: 'Fee' },
    ];
  }

  ngOnInit() {
    this.getAllDiametricsFee2();
  }

  getAllDiametricsFee2() {
    this.service.getAllDiametricsFee2()
      .subscribe(data => {
        this.planData = data;
        this.finalPlanData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteDiametricsFee2Id(this.selectedPlan.Id)
        .subscribe(data1 => {
          let index = this.planData.indexOf(this.selectedPlan);
          this.planData = this.planData.filter((val, i) => i != index);
          this.finalPlanData = this.finalPlanData.filter((val, i) => i != index);
          this.plan = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
          this.service.addLogs('DimetricsFeesSecondPart', this.selectedPlan.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete',this.selectedPlan,null)
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
      this.service.addDiametricsFee2(this.plan)
        .subscribe(data1 => {
          this.planData.push(data1);
          this.finalPlanData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
          this.service.addLogs('DimetricsFeesSecondPart', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add',null, data1)
          .subscribe(l => {
          });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      let old = this.finalPlanData.filter(a => a.Id == this.plan.Id)
      this.service.updateDiametricsFee2(this.plan)
        .subscribe(data1 => {
          erps[this.planData.indexOf(this.selectedPlan)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
          this.service.addLogs('DimetricsFeesSecondPart', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update', old[0], data1)
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
