import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services';
import { MessageService } from 'primeng/api';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [AdminService, MessageService]
})
export class ReportsComponent implements OnInit {
  cols: any[];
  cols2: any[];
  displayDialog = false;
  displayDialog1 = false;
  displayDialog2 = false;
  reportData = [];
  reportDetailsData = [];

  userD;
  todayDate = new Date();
  email: string;
  name: string;
  customerName = '';
  dealId = '';
  reportId = '';
  contractMonths = 0;
  totalContractValue = 0;
  currency;
  inputData = [];
  ediData = [];
  nonEdiData = [];
  ecomData = [];
  ediDataAll = [];
  oneTimeFeeData = {
    "communicationServices": [],
    "integrationServices": [],
    "tpAndDocumentActivation": [],
    "administrativeAndManagementServices": [],
    "communityManagement": [],
    "projectManagement": [],
    "other": []
  }

  recurringFeeData = {
    "monthlySupportService": [],
    "volumePlan": [],
    "serviceBureau": [],
    "nonEdiFormattedFees": [],
    "other": []
  }
  constructor(private service: AdminService,
    private messageService: MessageService) {
    this.cols = [
      { field: 'Name', header: 'Name' },
      { field: 'Email', header: 'Email' },
      { field: 'DateTime', header: 'DateTime' },
      { field: 'DealId', header: 'DealId' },
      { field: 'CustomerName', header: 'Customer Name' },
      { field: 'Currency', header: 'Currency' },
      { field: 'ReportId', header: 'ReportId' },
      { field: 'TCVMonths', header: 'TCV Months' },
      { field: 'TCV', header: 'Total Contract Value' },
    ];

    this.cols2 = [
      { field: 'FeeType', header: 'Fee Type' },
      { field: 'Section', header: 'Section' },
      { field: 'Item', header: 'Item' },
      { field: 'OneTimeDeliverable', header: 'OneTime Deliverable' },
      { field: 'Erp', header: 'Erp' },
      { field: 'UnitPrice', header: 'Unit Price' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Price', header: 'Price' },
      { field: 'Discount', header: 'Discount' },
      { field: 'AfterDiscountPrice', header: 'After Discount Price' },
    ];
  }

  ngOnInit() {
    this.getUsersReport();
    this.getAllEdi();
  }

  getUsersReport() {
    this.service.getUsersReport()
      .subscribe(data => {
        this.reportData = data;
      });
  }

  getAllEdi() {
    this.service.getAllEdi()
      .subscribe(data => {
        this.ediDataAll = data;
      });
  }

  generateReport(id, rd) {
    this.userD = rd;
    this.todayDate = this.userD.DateTime;
    this.name = this.userD.Name;
    this.email = this.userD.Email;
    this.totalContractValue = this.userD.TCV;
    this.contractMonths = this.userD.TCVMonths;
    this.currency = this.userD.Currency;
    this.customerName = this.userD.CustomerName;
    this.dealId = this.userD.DealId;
    this.reportId = this.userD.ReportId;
    this.service.getReportDetails(id)
      .subscribe(data => {
        this.reportDetailsData = data;
        this.oneTimeFeeData.communicationServices = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'communicationServices');
        this.oneTimeFeeData.integrationServices = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'integrationServices');
        this.oneTimeFeeData.tpAndDocumentActivation = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'tpAndDocumentActivation');
        this.oneTimeFeeData.administrativeAndManagementServices = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'administrativeAndManagementServices');
        this.oneTimeFeeData.communityManagement = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'communityManagement');
        this.oneTimeFeeData.projectManagement = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'projectManagement');
        this.oneTimeFeeData.other = this.reportDetailsData.filter(a => a.FeeType == 'OneTime' && a.Section == 'other');

        this.recurringFeeData.monthlySupportService = this.reportDetailsData.filter(a => a.FeeType == 'Recurring' && a.Section == 'monthlySupportService');
        this.recurringFeeData.volumePlan = this.reportDetailsData.filter(a => a.FeeType == 'Recurring' && a.Section == 'volumePlan');
        this.recurringFeeData.serviceBureau = this.reportDetailsData.filter(a => a.FeeType == 'Recurring' && a.Section == 'serviceBureau');
        this.recurringFeeData.nonEdiFormattedFees = this.reportDetailsData.filter(a => a.FeeType == 'Recurring' && a.Section == 'nonEdiFormattedFees');
        this.recurringFeeData.other = this.reportDetailsData.filter(a => a.FeeType == 'Recurring' && a.Section == 'other');

        this.displayDialog = true;
      });
  }

  downloadReport() {
    let doc = new jsPDF();
    let totalPagesExp = "{total_pages_count_string}";
    let str1 = 'User Name: ' + this.name + ' | ' + 'Email: ' + this.email + ' | ' + 'Date: ' + this.todayDate;
    let str2 = 'Customer Name: ' + this.customerName + ' | ' + 'Deal Id: ' + this.dealId + ' | ' + 'Report Version: ' + this.reportId;
    doc.autoTable({
      html: '#finalReportId',
      tableWidth: 'auto',
      rowPageBreak: 'auto',
      headStyles: { fillColor: [135, 206, 250], textColor: 0 },
      showHead: 'firstPage',
      showFoot: 'lastPage',
      footStyles: { fillColor: [135, 206, 250], textColor: 0 },
      styles: { overflow: "linebreak", fontSize: "8", lineColor: "100", lineWidth: ".10" },
      columnStyles: {
        0: { columnWidth: 20 },
        1: { columnWidth: 30 },
        2: { columnWidth: 20 }
      },
      margin: { top: 25 },
      didDrawPage: function (data) {
        // Header
        doc.setTextColor(40);
        doc.setFontStyle('normal');

        doc.text("Price Calculation Report", data.settings.margin.left, 10);
        doc.setFontSize(12);
        doc.text(str1, data.settings.margin.left, 15);
        doc.setFontSize(12);
        doc.text(str2, data.settings.margin.left, 20);
        // Footer
        var str = "Page " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(12);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      didParseCell: function (data) {
        if (data.row.cells[0].text[0] === 'Total:') {
          data.cell.styles.textColor = [237, 41, 57];
          data.cell.styles.halign = 'right';
          data.cell.styles.fontSize = '10';
        } else {
          data.cell.styles.halign = 'left';
        }
        if (data.row.cells[0].text[0] === 'Communication Services' ||
          data.row.cells[0].text[0] === 'Integration Services' ||
          data.row.cells[0].text[0] === 'Trading Partner and Document Activation' ||
          data.row.cells[0].text[0] === 'Administrative and Management Services' ||
          data.row.cells[0].text[0] === 'Community Management' ||
          data.row.cells[0].text[0] === 'Project Management' ||
          data.row.cells[0].text[0] === 'Other' ||
          data.row.cells[0].text[0] === 'Volume Plan' ||
          data.row.cells[0].text[0] === 'Monthly Support Service' ||
          data.row.cells[0].text[0] === 'Service Bureau' ||
          data.row.cells[0].text[0] === 'NON EDI Formatted Fees') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = '10';
        }
        if (data.row.cells[0].text[0] === 'One Time Fee' || data.row.cells[0].text[0] === 'Recurring Fee') {
          data.cell.styles.textColor = [150, 75, 0];
          data.cell.styles.halign = 'center';
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = '12';
        }
        if (data.row.cells[0].text[0] === 'Item') {
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [135, 206, 250];
        }
      }
    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save('Final-Report-' + this.todayDate + '.pdf');
  }

  finalReportData(index) {
    if (index == 1) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.communicationServices.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 2) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.integrationServices.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 3) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.tpAndDocumentActivation.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 4) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.administrativeAndManagementServices.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 5) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.communityManagement.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 6) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.projectManagement.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 7) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.other.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 8) {
      return this.recurringFeeData != null ? this.recurringFeeData.monthlySupportService.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 9) {
      let a = [];
      if (this.recurringFeeData != null) {
        for (let i = 0; i < this.recurringFeeData.volumePlan.length; i++) {
          if (this.recurringFeeData.volumePlan[i].Item == "Transaction Fees" || this.recurringFeeData.volumePlan[i].Item == "DiWeb ID’s for Partners" || this.recurringFeeData.volumePlan[i].Item == "") {
            if (this.recurringFeeData.volumePlan[i].AfterDiscountPrice != 0 && this.recurringFeeData.volumePlan[i].AfterDiscountPrice != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (this.recurringFeeData.volumePlan[i].Item == "Overage Rate Plan" || this.recurringFeeData.volumePlan[i].OneTimeDeliverable == "Inventory Transactions (846/INVRPT)") {
            if (this.recurringFeeData.volumePlan[i].Quantity != 0 && this.recurringFeeData.volumePlan[i].Quantity != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (this.recurringFeeData.volumePlan[i].OneTimeDeliverable == "855/ORDRSP, 810/INVOIC and 856/DESADV") {
            if (this.recurringFeeData.volumePlan[i].Erp != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (i == this.recurringFeeData.volumePlan.length - 1)
            return a;
        }
      } else
        return [];
    } else if (index == 10) {
      return this.recurringFeeData != null ? this.recurringFeeData.serviceBureau.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 11) {
      return this.recurringFeeData != null ? this.recurringFeeData.nonEdiFormattedFees.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    } else if (index == 12) {
      return this.recurringFeeData != null ? this.recurringFeeData.other.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
    }
  }

  showHideRow(index) {
    if (index == 1) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.communicationServices.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 2) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.integrationServices.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 3) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.tpAndDocumentActivation.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 4) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.administrativeAndManagementServices.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 5) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.communityManagement.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 6) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.projectManagement.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 7) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.other.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 8) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.monthlySupportService.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 9) {
      let a = [];
      if (this.recurringFeeData != null) {
        for (let i = 0; i < this.recurringFeeData.volumePlan.length; i++) {
          if (this.recurringFeeData.volumePlan[i].Item == "Transaction Fees" || this.recurringFeeData.volumePlan[i].Item == "DiWeb ID’s for Partners" || this.recurringFeeData.volumePlan[i].Item == "") {
            if (this.recurringFeeData.volumePlan[i].AfterDiscountPrice != 0 && this.recurringFeeData.volumePlan[i].AfterDiscountPrice != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (this.recurringFeeData.volumePlan[i].Item == "Overage Rate Plan" || this.recurringFeeData.volumePlan[i].OneTimeDeliverable == "Inventory Transactions (846/INVRPT)") {
            if (this.recurringFeeData.volumePlan[i].Quantity != 0 && this.recurringFeeData.volumePlan[i].Quantity != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (this.recurringFeeData.volumePlan[i].OneTimeDeliverable == "855/ORDRSP, 810/INVOIC and 856/DESADV") {
            if (this.recurringFeeData.volumePlan[i].Erp != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (i == this.recurringFeeData.volumePlan.length - 1)
            return a.length > 0 ? true : false;
        }
      } else
        return false;
    } else if (index == 10) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.serviceBureau.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 11) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.nonEdiFormattedFees.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 12) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.other.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    }
  }

  getTotalOneTimeFee(ary) {
    let total = 0;
    if (ary != null) {
      ary.communicationServices.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.integrationServices.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.tpAndDocumentActivation.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.administrativeAndManagementServices.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.communityManagement.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.projectManagement.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.other.forEach(element => {
        total += element.AfterDiscountPrice;
      });
    }
    return total;
  }

  getTotalRecurringFee(ary) {
    let total = 0;
    if (ary != null) {
      ary.monthlySupportService.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.volumePlan.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.serviceBureau.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.nonEdiFormattedFees.forEach(element => {
        total += element.AfterDiscountPrice;
      });
      ary.other.forEach(element => {
        total += element.AfterDiscountPrice;
      });
    }
    return total;
  }

  getSum(ary) {
    let total = 0;
    if (ary != null) {
      ary.forEach(element => {
        total += element.AfterDiscountPrice;
      });
    }
    return total;
  }

  input(id) {
    this.service.getInputDetails(id)
      .subscribe(data => {
        this.inputData = data;
        this.service.getEdiDetails(this.inputData[0].Id)
          .subscribe(data1 => {
            this.ediData = data1;
            this.service.getNonEdiDetails(this.inputData[0].Id)
              .subscribe(data2 => {
                this.nonEdiData = data2;
                this.service.getEcommerceDetails(this.inputData[0].Id)
                  .subscribe(data3 => {
                    this.ecomData = data3;
                    this.displayDialog1 = true;
                  });
              });
          });
      });
  }

  output(id) {
    this.service.getReportDetails(id)
      .subscribe(data => {
        this.reportDetailsData = data;
        this.displayDialog2 = true;
      });

  }
}
