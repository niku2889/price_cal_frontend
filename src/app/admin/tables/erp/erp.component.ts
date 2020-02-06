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
  finalerpData: any[] = [];
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
        this.finalerpData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteErpId(this.selectedErp.Id)
        .subscribe(data1 => {
          let index = this.erpData.indexOf(this.selectedErp);
          this.erpData = this.erpData.filter((val, i) => i != index);
          this.finalerpData = this.finalerpData.filter((val, i) => i != index);
          this.erp = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
          this.service.addLogs('ERP', this.selectedErp.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete',this.selectedErp,null)
            .subscribe(l => {
            });
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
    this.newErp = false;
    this.erp = this.cloneCar(event.data);
    this.displayDialog = true;
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
          this.finalerpData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
          this.service.addLogs('ERP', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add', null, data1)
            .subscribe(l => {
            });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      let old = this.finalerpData.filter(a => a.Id == this.erp.Id)
      this.service.updateErp(this.erp)
        .subscribe(data1 => {
          erps[this.erpData.indexOf(this.selectedErp)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
          this.service.addLogs('ERP', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update', old[0], data1)
            .subscribe(l => {
            });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    this.erpData = erps;
    this.erp = null;
    this.displayDialog = false;
  }

}
