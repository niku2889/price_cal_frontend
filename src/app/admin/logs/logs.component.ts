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
      { field: 'TableName', header: 'Table Name', width: 'auto' },
      { field: 'RowId', header: 'Row Id', width: '5%' },
      { field: 'Date', header: 'Date', width: 'auto' },
      { field: 'UserName', header: 'User Name', width: 'auto' },
      { field: 'UserId', header: 'User Id', width: '5%' },
      { field: 'OperationType', header: 'Action', width: '8%' },
      { field: 'OldValues', header: 'OldValues', width: '25%' },
      { field: 'NewValues', header: 'NewValues', width: '25%' },
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
