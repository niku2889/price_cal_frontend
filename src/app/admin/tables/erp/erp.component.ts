import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { MessageService } from 'primeng/api';
export interface Erp {
  Id?;
  Name?;
  Size?;
  Type?;
  Amount?;
  Methodology?;
  Valid?;
}
@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrls: ['./erp.component.css'],
  providers: [AdminService, MessageService]
})
export class ErpComponent implements OnInit {
  cols: any[];
  erpData: any[] = [];
  displayDialog: boolean;
  erp: Erp = {};
  selectedErp: Erp;
  newErp: boolean;

  constructor(private service: AdminService,
    private messageService: MessageService) {

    this.cols = [
      { field: 'Name', header: 'Name' },
      { field: 'Size', header: 'Size' },
      { field: 'Type', header: 'Type' },
      { field: 'Amount', header: 'Amount' },
      { field: 'Methodology', header: 'Methodology' },
      { field: 'Valid', header: 'Valid' }
    ];
  }

  ngOnInit() {
    this.getAllErp();
  }

  getAllErp() {
    this.service.getAllErp()
      .subscribe(data => {
        this.erpData = data;
      });
  }

  deleteOne(id) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteErpId(id)
        .subscribe(data1 => {
          let index = this.erpData.indexOf(id);
          this.erpData = this.erpData.filter((val, i) => i != index);
          this.erp = null;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteErpId(this.selectedErp.Id)
        .subscribe(data1 => {
          let index = this.erpData.indexOf(this.selectedErp);
          this.erpData = this.erpData.filter((val, i) => i != index);
          this.erp = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
  }

  showDialogToAdd() {
    this.newErp = true;
    this.erp = {};
    this.displayDialog = true;
  }

  onRowSelect(event) {
    console.log(event)
    this.newErp = false;
    this.erp = this.cloneCar(event.data);
    this.displayDialog = true;
    console.log(this.erp)
  }

  cloneCar(c: Erp): Erp {
    let erp = {};
    for (let prop in c) {
      erp[prop] = c[prop];
    }
    return erp;
  }

  save() {
    let erps = [...this.erpData];
    if (this.newErp) {
      this.service.addErp(this.erp)
        .subscribe(data1 => {
          this.erpData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      this.service.updateErp(this.erp)
        .subscribe(data1 => {
          erps[this.erpData.indexOf(this.selectedErp)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    this.erpData = erps;
    this.erp = null;
    this.displayDialog = false;
  }

}
