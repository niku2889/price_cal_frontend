import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { MessageService } from 'primeng/api';
export interface EdiDocs {
  Id?;
  EdiDocs?;
}

@Component({
  selector: 'app-edi-docs',
  templateUrl: './edi-docs.component.html',
  styleUrls: ['./edi-docs.component.css'],
  providers: [AdminService, MessageService]
})
export class EdiDocsComponent implements OnInit {
  cols: any[];
  ediDocsData: any[] = [];
  finalediDocsData: any[] = [];
  displayDialog: boolean;
  ediDocs: EdiDocs = {};
  selectedEdiDocs: EdiDocs;
  newEdiDocs: boolean;

  constructor(private service: AdminService,
    private messageService: MessageService) {

    this.cols = [
      { field: 'EdiDocs', header: 'EdiDocs' },
    ];
  }

  ngOnInit() {
    this.getAllEdi();
  }

  getAllEdi() {
    this.service.getAllEdi()
      .subscribe(data => {
        this.ediDocsData = data;
        this.finalediDocsData = data;
      });
  }

  delete() {
    if (confirm("Are you sure you want to delete this record?")) {
      this.service.deleteEdiId(this.selectedEdiDocs.Id)
        .subscribe(data1 => {
          let index = this.ediDocsData.indexOf(this.selectedEdiDocs);
          this.ediDocsData = this.ediDocsData.filter((val, i) => i != index);
          this.finalediDocsData = this.finalediDocsData.filter((val, i) => i != index);
          this.ediDocs = null;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted Successfully' });
          this.service.addLogs('EdiDocs', this.selectedEdiDocs.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Delete', this.selectedEdiDocs, null)
            .subscribe(l => {
            });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
  }

  showDialogToAdd() {
    this.newEdiDocs = true;
    this.ediDocs = {};
    this.displayDialog = true;
  }

  onRowSelect(event) {
    this.newEdiDocs = false;
    this.ediDocs = this.cloneCar(event.data);
    this.displayDialog = true;
  }

  cloneCar(c: EdiDocs): EdiDocs {
    let ediDocs = {};
    for (let prop in c) {
      ediDocs[prop] = c[prop];
    }
    return ediDocs;
  }

  save() {
    let erps = [...this.ediDocsData];
    if (this.newEdiDocs) {
      this.service.addEdi(this.ediDocs)
        .subscribe(data1 => {
          this.ediDocsData.push(data1);
          this.finalediDocsData.push(data1);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully' });
          this.service.addLogs('EdiDocs', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Add', null, data1)
            .subscribe(l => {
            });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    else {
      let old = this.finalediDocsData.filter(a => a.Id == this.ediDocs.Id)
      this.service.updateEdi(this.ediDocs)
        .subscribe(data1 => {
          erps[this.ediDocsData.indexOf(this.selectedEdiDocs)] = data1;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated Successfully' });
          this.service.addLogs('EdiDocs', data1.Id, localStorage.getItem('name'), localStorage.getItem('userId'), 'Update', old[0], data1)
            .subscribe(l => {
            });
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.Message });
        });
    }
    this.ediDocsData = erps;
    this.ediDocs = null;
    this.displayDialog = false;
  }

}
