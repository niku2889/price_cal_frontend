import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  providers: [AdminService]
})
export class LogsComponent implements OnInit {

  cols: any[];
  logsData: any[] = [];
  isSA;
  permission = true;
  constructor(private service: AdminService) {
    this.isSA = localStorage.getItem('superAdmin');
    if (this.isSA == false || this.isSA == 'false')
      this.permission = false;
    this.cols = [
      { field: 'TableName', header: 'Table Name' },
      { field: 'RowId', header: 'Row Id' },
      { field: 'Date', header: 'Date' },
      { field: 'UserName', header: 'User Name' },
      { field: 'UserId', header: 'User Id' },
      { field: 'OperationType', header: 'Action' },
    ];
  }

  ngOnInit() {
    this.getAllLogs();
  }

  getAllLogs() {
    this.service.getAllLogs()
      .subscribe(data => {
        this.logsData = data;
      });
  }
}
