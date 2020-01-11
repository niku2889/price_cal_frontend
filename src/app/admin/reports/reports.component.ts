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
  displayDialog = false;
  reportData = [];
  reportDetailsData = [];

  userD;
  todayDate = new Date();
  email: string;
  name: string;
  contractMonths=0;
  totalContractValue =0;
  currency;
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
  }

  ngOnInit() {
    this.getUsersReport();
  }

  getUsersReport() {
    this.service.getUsersReport()
      .subscribe(data => {
        this.reportData = data;
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
    let s = this.name + ' - ' + this.email + ' - ' + this.todayDate;
    doc.autoTable({
      html: '#finalReportId',
      tableWidth: 'auto',
      rowPageBreak: 'auto',
      headStyles: { fillColor: [135, 206, 250] },
      showHead: 'firstPage',
      showFoot: 'lastPage',
      footStyles: { fillColor: [135, 206, 250] },
      styles: { overflow: "linebreak", fontSize: "8", lineColor: "100", lineWidth: ".10" },
      columnStyles: {
        0: { columnWidth: 20 },
        1: { columnWidth: 30 },
        2: { columnWidth: 20 }
      },
      margin: { top: 20 },
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle('normal');

        doc.text("Price Calculation Report", data.settings.margin.left, 10);
        doc.setFontSize(12);
        doc.text(s, data.settings.margin.left, 15);
        // Footer
        var str = "Page " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      didParseCell: function (data) {
        if (data.row.cells[0].text[0] === 'Total:') {
          data.cell.styles.textColor = [237, 41, 57];
          data.cell.styles.halign = 'right';
          //data.cell.styles.fontStyle = 'bold';
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
      return this.recurringFeeData != null ? this.recurringFeeData.volumePlan.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
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
      let d = this.recurringFeeData != null ? this.recurringFeeData.volumePlan.filter(a => a.AfterDiscountPrice != 0 && a.AfterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
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
}
