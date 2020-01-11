import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormArray } from "@angular/forms";
import { HomeService } from './service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface DialogData {
  email: string;
  name: string;
  dealId: number;
  customerName: string;
  currency: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, HomeService],

})
export class HomeComponent implements OnInit {
  email: string;
  name: string;

  items: MenuItem[];
  oneTimeFeeData: any;
  recurringFeeData: any;

  activeIndex: number = 1;
  isOneTimeFee = true;
  isRecurringFee = false;
  isAdditionalService = false;
  isTab1 = true;
  isTab2 = false;
  isTab3 = false;
  isTab4 = false;
  isEDI = false;
  isNonEDI = false;
  isPlan = false;

  erpData = [];
  ediData = [];
  msKbPlansData = [];
  dropShipVolumePlanData = [];
  complieanceFeeData = [];
  pmFeeData = [];
  ecomFeeData = [];
  isMs = true;
  isCompliance = false;
  isProvideLabel = false;
  isHubPaying = false;
  ediLoop = [];
  nonEdiLoop = [];
  isMsKbPlan = false;
  isDropShipVolumePlan = false;
  isAdditionalPlanDetails = false;
  isIntegrationMethodology = false;

  isTpUsingEdiStandards = false;
  isEcommerceTable = false;

  oneTimeFeeCommunicationServices = [];
  oneTimeFeeIntegrationServices = [];
  oneTimeFeeTPDocumentActivation = [];
  oneTimeFeeAdminManagementServices = [];
  oneTimeFeeCommunityManagement = [];
  oneTimeFeeProjectManagement = [];
  oneTimeFeeOther = [];

  recurringFeeMonthlySupportService = [];
  recurringFeeVolumePlan = [];
  recurringFeeServiceBureau = [];
  recurringFeeNonEdiFormattedFee = [];
  recurringFeeOther = [];
  totalEdiDocs = 0;
  totalEcommerce = 0;
  totalNonEdiDocs = 0;

  ecommerceData = [
    { "name": "Magneto", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
    { "name": "Shopify", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
    { "name": "Woo Commerce", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
    { "name": "Amazon Seller Central", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false }
  ]

  //Managed Service Input fields start
  selectedErp = "3PL";
  msEcommerece = "MS";
  buySideCheck = false;
  sellSideCheck = true;
  buySideCreateEdiSpecForBookletTp = false;
  buySideImplementComplianceTestProgram = false;
  complianceTestWhoPays = "Trading Partner (Paid)";
  noTPComplienceTested = 0;
  provideLabel = false;
  noRetailerDivisionLabels = 0;
  hubPayingForSupplier = false;
  isPrivatePortal = false;
  noTPusingPortal = 0;
  noEdiDocs = 0;
  noNonEdiDocs = 0;
  selectedKBPlan: string;
  selectedMSKBPlan = "1";
  selectedDropShipVolumePlan = "1";
  dsvpSelectedServicePlan = "";
  dsvpSelectedProgram: string;
  dsvpSelectedPlan: string;
  moreIntegrationMethodology = false;
  selectedPrimaryIntegrationMethod = "Flat File";
  selectedSecondaryIntegrationMethod = "";
  tpUsingOnlyEdiStandards = true;
  noElectronicallyIntegratedNonEdiTp = 0;
  isClientNeedAdditionalSerices = false;
  //form fields end

  //Additional Service Input fields start
  diPulse = false;
  diMetrics = false;
  serviceBureau = false;
  communicationSoftware = false;
  onsiteProfessionalServices = false;
  noDiPulseIdNeeded = 0;
  noBusinessRules = 0;
  noDocUsedInBusinessRules = 0;
  isDiMetricsHost = false;
  noKBHostedEachMonth = 0;
  noDocServiceBureauUsers = 0;
  sponsorPayingServiceBureauUsers = "No";
  serviceBureauUsersInProject = 0;
  docsPerMonth = 0;
  docs856PerMonth = 0;
  labelsServiceBureauUsersPerMonth = 0;
  lineItemsPerMonth = 0;
  identifyTheSwNo = "The Client will provide their own Comma SW";
  identifyTheSwYes = "DiIntegrator";
  protocolConnectToDicenter = "AS2";
  howManyHoursNeeded = 0;
  //form fields end

  additionServiceTab1 = true;
  additionServiceTab2 = true;
  additionServiceTab3 = true;
  additionServiceTab4 = true;
  additionServiceTab5 = true;
  isAdditionalTab = false;
  diMetricsData = [];
  diMetricsSecondPartData = [];
  serviceBureauFeesData = [];
  todayDate = new Date();
  contractMonths = 0;
  totalContractValue = 0;
  dealId: Number;
  customerName: string = "";
  currency: string = "USD";
  reportId = '';
  usdToinr = 70;
  usdTocad = 1.30;
  usdTojpy = 109;
  usdToaud = 1.45;
  usdToeur = 0.90;
  usdTogbp = 0.76;
  usdTovnd = 23173;
  convertedCurrency = 1;

  constructor(private messageService: MessageService,
    public dialog: MatDialog,
    private service: HomeService
  ) {
    this.service.getAllComplieanceFee()
      .subscribe(data => {
        this.complieanceFeeData = data;
      });
  }

  ngOnInit() {
    this.getAllErp();
    this.getAllEdi();
    this.getAllMsKbPlans();
    this.getAllDropShipVolumePlans();
    this.getAllDiMetricsFee();
    this.getAllDimetricsFeesSecondPart();
    this.getAllServiceBureauFees();
    this.getEcomFees();
    this.getPMFees();
    this.openDialog();
    this.service.getOneTimeFeeData().then(data => this.oneTimeFeeData = data);
    this.service.getRecurringFeeData().then(data => this.recurringFeeData = data);
  }

  getAllErp() {
    this.service.getAllErp()
      .subscribe(data => {
        this.erpData = data;
        this.addPrimaryIntegrationService(this.totalEdiDocs);
      });
  }

  getAllEdi() {
    this.service.getAllEdi()
      .subscribe(data => {
        this.ediData = data;
      });
  }

  getAllMsKbPlans() {
    this.service.getAllMsKbPlans()
      .subscribe(data => {
        this.msKbPlansData = data;
      });
  }

  getAllDropShipVolumePlans() {
    this.service.getAllDropShipVolumePlans()
      .subscribe(data => {
        this.dropShipVolumePlanData = data;
      });
  }

  getAllDiMetricsFee() {
    this.service.getAllDiMetricsFee()
      .subscribe(data => {
        this.diMetricsData = data;
      });
  }

  getAllDimetricsFeesSecondPart() {
    this.service.getAllDimetricsFeesSecondPart()
      .subscribe(data => {
        this.diMetricsSecondPartData = data;
      });
  }

  getAllServiceBureauFees() {
    this.service.getAllServiceBureauFees()
      .subscribe(data => {
        this.serviceBureauFeesData = data;
      });
  }

  getPMFees() {
    this.service.getPMFees()
      .subscribe(data => {
        this.pmFeeData = data;
      });
  }

  getEcomFees() {
    this.service.getEcomFees()
      .subscribe(data => {
        this.ecomFeeData = data;
      });
  }

  currencyChange() {
    if (this.currency == 'USD')
      this.convertedCurrency = 1;
    else if (this.currency == 'JPY')
      this.convertedCurrency = this.usdTojpy;
    else if (this.currency == 'CAD')
      this.convertedCurrency = this.usdTocad;
    else if (this.currency == 'AUD')
      this.convertedCurrency = this.usdToaud;
    else if (this.currency == 'EUR')
      this.convertedCurrency = this.usdToeur;
    else if (this.currency == 'GBP')
      this.convertedCurrency = this.usdTogbp;
    else if (this.currency == 'INR')
      this.convertedCurrency = this.usdToinr;
    else if (this.currency == 'VND')
      this.convertedCurrency = this.usdTovnd;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: { name: this.name, email: this.email, dealId: this.dealId, customerName: this.customerName, currency: this.currency },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.name = result.name;
      this.email = result.email;
      this.dealId = result.dealId;
      this.customerName = result.customerName;
      this.currency = result.currency;
      this.reportId = 'PC-' + this.dealId;
      this.currencyChange();
    });
  }

  getFee(index) {
    if (index == 1) {
      this.isOneTimeFee = true;
      this.isRecurringFee = false;
    } else {
      this.isOneTimeFee = false;
      this.isRecurringFee = true;
    }
  }

  // exportExcel() {
  //   import("xlsx").then(xlsx => {
  //     const worksheet = xlsx.utils.sheet_to_html(this.getCars());
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, "primengTable");
  //   });
  // }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   import("file-saver").then(FileSaver => {
  //     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //     let EXCEL_EXTENSION = '.xlsx';
  //     const data: Blob = new Blob([buffer], {
  //       type: EXCEL_TYPE
  //     });
  //     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  //   });
  // }

  additionalService(e) {
    if (this.validateManagedServiceTab()) {
      if (e.checked) {
        this.isAdditionalService = true;
        this.hideShowTab(2);
      } else {
        this.isAdditionalService = false;
        this.hideShowTab(1);
        this.emptyAdditionalServiceInout();
      }
    }
  }

  hideShowTab(id) {
    if (id == 1) {
      this.isTab1 = true;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
    } else if (id == 2) {
      if (this.validateManagedServiceTab()) {
        this.isTab1 = false;
        this.isTab2 = true;
        this.isTab3 = false;
        this.isTab4 = false;
        this.isAdditionalService = true;
      }
    } else if (id == 3) {
      if (this.validateManagedServiceTab()) {
        this.isTab1 = false;
        this.isTab2 = false;
        this.isTab3 = true;
        this.isTab4 = false;
        this.addNonEdiFormattedFees2();
        this.addNonEdiFormattedFees3();
        this.addNonEdiFormattedFees4();
        this.addNonEdiFormattedFees5();
      }
    } else if (id == 4) {
      if (confirm("You cannot make modification after finalizing. Do you want to proceed?")) {
        this.isTab1 = false;
        this.isTab2 = false;
        this.isTab3 = false;
        this.isTab4 = true;
        this.postUserData();
      }
    } else {
      this.isTab1 = true;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
    }
  }

  validateManagedServiceTab() {
    if (this.dealId == 0 || !this.dealId) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Deal ID is require' });
      return false;
    } else if (this.customerName == '') {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Customer Name is require' });
      return false;
    } else if (this.noEdiDocs == 0 && this.noNonEdiDocs == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Number of Documents on Scope is require' });
      return false;
    } else if (this.selectedKBPlan == "" || !this.selectedKBPlan) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose min no. of KB' });
      return false;
    } else if (this.dsvpSelectedServicePlan == "" || !this.dsvpSelectedServicePlan) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose Service Plan Offered' });
      return false;
    } else if (this.dsvpSelectedProgram == "" || !this.dsvpSelectedProgram) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose Standard Replenishment or Drop Ship Program' });
      return false;
    } else if (this.dsvpSelectedPlan == "" || !this.dsvpSelectedPlan) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose Annual Plan or Monthly Plan' });
      return false;
    } else {
      return true;
    }
  }

  postUserData() {
    this.totalContractValue = (this.contractMonths * this.getTotalRecurringFee(this.recurringFeeData)) + this.getTotalOneTimeFee(this.oneTimeFeeData);
    this.service.postUserData(this.name, this.email, this.dealId, this.customerName, this.currency, this.reportId, this.contractMonths, this.totalContractValue)
      .subscribe(data => {
        this.postUserReportData(data.Id, "OneTime", "communicationServices", this.oneTimeFeeData.communicationServices);
        this.postUserReportData(data.Id, "OneTime", "integrationServices", this.oneTimeFeeData.integrationServices);
        this.postUserReportData(data.Id, "OneTime", "tpAndDocumentActivation", this.oneTimeFeeData.tpAndDocumentActivation);
        this.postUserReportData(data.Id, "OneTime", "administrativeAndManagementServices", this.oneTimeFeeData.administrativeAndManagementServices);
        this.postUserReportData(data.Id, "OneTime", "communityManagement", this.oneTimeFeeData.communityManagement);
        this.postUserReportData(data.Id, "OneTime", "projectManagement", this.oneTimeFeeData.projectManagement);
        this.postUserReportData(data.Id, "OneTime", "other", this.oneTimeFeeData.other);

        this.postUserReportData(data.Id, "Recurring", "monthlySupportService", this.recurringFeeData.monthlySupportService);
        this.postUserReportData(data.Id, "Recurring", "volumePlan", this.recurringFeeData.volumePlan);
        this.postUserReportData(data.Id, "Recurring", "serviceBureau", this.recurringFeeData.serviceBureau);
        this.postUserReportData(data.Id, "Recurring", "nonEdiFormattedFees", this.recurringFeeData.nonEdiFormattedFees);
        this.postUserReportData(data.Id, "Recurring", "other", this.recurringFeeData.other);
      });
  }

  postUserReportData(id, type, section, data) {
    if (data.length > 0 && type == "OneTime") {
      data.forEach(e => {
        this.service.postUserReportData(id, type, section, e.item, e.oneTimeDeliverable, e.erp, e.unitPrice, e.quantity, e.price, e.discount, e.afterDiscountPrice)
          .subscribe(data => {
          });
      });
    } else if (data.length > 0 && type == "Recurring") {
      data.forEach(e => {
        this.service.postUserReportData(id, type, section, e.item, e.monthlyRecurringDeliverable, e.instructions, e.unitPrice, e.quantity, e.price, e.discount, e.afterDiscountPrice)
          .subscribe(data => {
          });
      });
    }
  }

  downloadReport() {
    let doc = new jsPDF();
    let totalPagesExp = "{total_pages_count_string}";
    let s = this.name + ' - ' + this.email + ' - ' + new Date().toLocaleString();
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

    doc.save('Final-Report-' + this.todayDate.toUTCString() + '.pdf');
  }

  finalReportData(index) {
    if (index == 1) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.communicationServices.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 2) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.integrationServices.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 3) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.tpAndDocumentActivation.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 4) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.administrativeAndManagementServices.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 5) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.communityManagement.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 6) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.projectManagement.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 7) {
      return this.oneTimeFeeData != null ? this.oneTimeFeeData.other.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 8) {
      return this.recurringFeeData != null ? this.recurringFeeData.monthlySupportService.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 9) {
      return this.recurringFeeData != null ? this.recurringFeeData.volumePlan.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 10) {
      return this.recurringFeeData != null ? this.recurringFeeData.serviceBureau.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 11) {
      return this.recurringFeeData != null ? this.recurringFeeData.nonEdiFormattedFees.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    } else if (index == 12) {
      return this.recurringFeeData != null ? this.recurringFeeData.other.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
    }
  }

  showHideRow(index) {
    if (index == 1) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.communicationServices.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 2) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.integrationServices.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 3) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.tpAndDocumentActivation.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 4) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.administrativeAndManagementServices.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 5) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.communityManagement.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 6) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.projectManagement.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 7) {
      let d = this.oneTimeFeeData != null ? this.oneTimeFeeData.other.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 8) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.monthlySupportService.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 9) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.volumePlan.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 10) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.serviceBureau.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 11) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.nonEdiFormattedFees.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    } else if (index == 12) {
      let d = this.recurringFeeData != null ? this.recurringFeeData.other.filter(a => a.afterDiscountPrice != 0 && a.afterDiscountPrice != '') : [];
      return d.length > 0 ? true : false;
    }
  }

  handleChange(e) {
    if (this.isAdditionalService) {
      this.hideShowTab(e.index + 1)
    }
    else {
      this.isTab2 = false;

      if (e.index == 0) {
        this.isTab1 = true;
        this.isTab3 = false;
        this.isTab4 = false;
      } else if (e.index == 1) {
        this.isTab1 = false;
        this.isTab3 = true;
        this.isTab4 = false;
      } else if (e.index == 2) {
        this.isTab1 = false;
        this.isTab3 = false;
        this.isTab4 = true;
      }
    }
  }

  changeErp(e) {
    this.addPrimaryIntegrationService(this.totalEdiDocs);
    this.addSecondaryIntegrationServices(this.totalEdiDocs);
  }

  ediChange(e) {
    this.ediLoop = [];
    for (let index = 0; index < e.target.value; index++) {
      let ediModel = {
        ediDocs: 128,
        noOfTP: 0,
        integratedERPDiPulse: ''
      }
      this.ediLoop.push(ediModel)
    }
    if (this.noEdiDocs > 0) {
      this.isEDI = true;
      this.addTPEDIImplementationGuideCreation(5000, this.noEdiDocs);
      let qty = this.complianceTestWhoPays == "Trading Partner (Paid)" ? 0 : (this.noEdiDocs + this.noTPComplienceTested);
      let fd = this.complieanceFeeData.filter(a => a.Name == "Compliance Testing per TP per document" && a.Scope == this.complianceTestWhoPays);
      this.addComplienceTestingPerTPperDocument(this.complianceTestWhoPays, fd[0].Fee, qty)

      this.addMSPTradingCommunity(15, 0);
      this.addTradingPartnerEnable(0);
    } else {
      this.isEDI = false;
      this.addComplienceTestingPerTPperDocument('', 0, 0);
      this.addMSPTradingCommunity(0, 0);
    }
    //this.isNonEDI = false;
  }

  changeEdiTP(e) {
    let total = 0;
    this.ediLoop.forEach(element => {
      total += element.noOfTP;
    });
    this.totalEdiDocs = total;
    this.addMSPTradingCommunity(15, total);
    this.addTradingPartnerEnable(total);
    this.addPrimaryIntegrationService(total);
    this.addSecondaryIntegrationServices(this.totalEdiDocs);
    this.addTpAndDocument();
    this.addProjectManagement();
  }

  ediDocsSelectChange(e) {
    this.addProjectManagement();
  }

  //Recurring Fee - Monthly Support Service - Trading Community - 6 - array 5
  addMSPTradingCommunity(unitPrice, qty) {
    this.recurringFeeData.monthlySupportService[5].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[5].quantity = qty;
    this.recurringFeeData.monthlySupportService[5].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[5].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  //One Time Fees - Community Management - Trading Partners to be enabled - 1 - array 0
  addTradingPartnerEnable(qty) {
    this.oneTimeFeeData.communityManagement[0].unitPrice = 150 * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[0].quantity = qty;
    this.oneTimeFeeData.communityManagement[0].price = 150 * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[0].afterDiscountPrice = 150 * qty * this.convertedCurrency;
  }

  nonEdiChange(e) {
    this.nonEdiLoop = [];
    for (let index = 0; index < e.target.value; index++) {
      let ediModel = {
        nonEdiDocs: 128,
        noOfNonEdiTP: 0,
      }
      this.nonEdiLoop.push(ediModel)
    }
    this.isNonEDI = true;
  }

  changeNonEdiTP(e) {
    let total = 0;
    this.nonEdiLoop.forEach(element => {
      total += element.noOfNonEdiTP;
    });
    this.totalNonEdiDocs = total;
  }

  buySide(e) {
    if (e.checked) {
      this.sellSideCheck = false;
    } else {
      this.sellSideCheck = true;
      this.oneTimeFeeCommunityManagement = [];
    }
    this.addPrimaryIntegrationService(this.totalEdiDocs);
    this.addSecondaryIntegrationServices(this.totalEdiDocs);

  }

  sellSide(e) {
    if (e.checked) {
      this.buySideCheck = false;
    } else {
      this.buySideCheck = true;
    }
    this.oneTimeFeeCommunityManagement = [];
    this.addPrimaryIntegrationService(this.totalEdiDocs);
    this.addSecondaryIntegrationServices(this.totalEdiDocs);
  }

  changeComplianceTestWhoPays(pays) {
    this.addComplianceTestAndSetup();
  }

  addComplianceTestAndSetup() {
    let fd = this.complieanceFeeData.filter(a => a.Name == "Compliance Testing per TP per document" && a.Scope == this.complianceTestWhoPays);
    let qty = this.complianceTestWhoPays == "Trading Partner (Paid)" ? 0 : (this.noEdiDocs + this.noTPComplienceTested);
    this.addComplienceTestingPerTPperDocument(this.complianceTestWhoPays, fd[0].Fee, qty)

    let fee = this.complieanceFeeData.filter(a => a.Name == "Set Up Compliance Test Site" && a.Scope == this.complianceTestWhoPays);
    let qty1 = this.complianceTestWhoPays == "Project Sponsor (Paid)" ? 1 : null;
    this.addSetupComplianceTestSite(this.complianceTestWhoPays, fee[0].Fee, qty1)
  }

  changeNoTPComplienceTested(e) {
    if (this.noTPComplienceTested > 0) {
      let qty = this.complianceTestWhoPays == "Trading Partner (Paid)" ? 0 : (this.noEdiDocs + this.noTPComplienceTested);
      this.addComplienceTestingPerTPperDocument(this.complianceTestWhoPays, this.oneTimeFeeData.communityManagement[3].unitPrice, qty);
    } else {
      this.addComplienceTestingPerTPperDocument('', 0, 0)
    }
  }

  createEdiSpecBooklet(e) {
    if (e.checked) {
      this.addTPEDIImplementationGuideCreation(5000, this.noEdiDocs);
    } else {
      this.addTPEDIImplementationGuideCreation(0, 0);
    }
  }

  //One Time Fees - Community Management - Set up Compliance Test Site - 3 - array 2
  addSetupComplianceTestSite(item, unitPrice, qty) {
    this.oneTimeFeeData.communityManagement[2].item = item;
    this.oneTimeFeeData.communityManagement[2].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[2].quantity = qty;
    this.oneTimeFeeData.communityManagement[2].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[2].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  //One Time Fees - Community Management - Trading Partner EDI Implementation Guide Creation - 2 - array 1
  addTPEDIImplementationGuideCreation(unitPrice, qty) {
    this.oneTimeFeeData.communityManagement[1].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[1].quantity = qty;
    this.oneTimeFeeData.communityManagement[1].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[1].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  //One Time Fees - Community Management - Compliance Testing per Document - 4 - array 3
  addComplienceTestingPerTPperDocument(item, unitPrice, qty) {
    this.oneTimeFeeData.communityManagement[3].item = item;
    this.oneTimeFeeData.communityManagement[3].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[3].quantity = qty;
    this.oneTimeFeeData.communityManagement[3].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[3].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  plans(e) {
    if (e.value == "MS KB Plan") {
      this.isMsKbPlan = true;
      this.isDropShipVolumePlan = false;
    }
    else if (e.value == "Drop Ship Volume Plan") {
      this.isMsKbPlan = false;
      this.isDropShipVolumePlan = true;
      this.dsvpChange('');
    } else {
      this.isMsKbPlan = false;
      this.isDropShipVolumePlan = false;
    }
    this.isAdditionalPlanDetails = true;
  }

  complianceTest(e) {
    if (e.checked) {
      this.isCompliance = true;
      this.addComplianceTestAndSetup();
    }
    else {
      this.isCompliance = false;
      this.addSetupComplianceTestSite('', 0, 0);
    }
  }

  provideLabels(e) {
    if (e.checked) {
      this.isProvideLabel = true;
    }
    else {
      this.isProvideLabel = false;
      this.addCreateLabels(0, 0);
    }
  }

  lablesChange(e) {
    if (this.noRetailerDivisionLabels > 0)
      this.addCreateLabels(295, this.noRetailerDivisionLabels);
    else
      this.addCreateLabels(0, 0);
  }

  //One Time Fees - Community Management - Create Labels - 5 - array 4
  addCreateLabels(unitPrice, qty) {
    this.oneTimeFeeData.communityManagement[4].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[4].quantity = qty;
    this.oneTimeFeeData.communityManagement[4].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[4].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  hubPaying(e) {
    if (e.checked) {
      this.isHubPaying = true;
      this.addVolumeForDiWeb('Number of User IDs', 20, this.noTPusingPortal);
    }
    else {
      this.addSetupSponsorPaidPortal(0, 0);
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
      this.addVolumeForDiWeb('', 0, 0);
      this.isHubPaying = false;
    }
  }

  //Recurring Fees - Volume Plan - Volume for DiWeb - 5 - array 4
  addVolumeForDiWeb(instruction, unitPrice, qty) {
    this.recurringFeeData.volumePlan[4].instruction = instruction;
    this.recurringFeeData.volumePlan[4].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.volumePlan[4].quantity = qty;
    this.recurringFeeData.volumePlan[4].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.volumePlan[4].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  privatePortal(e) {
    if (e.checked) {
      this.addSetupSponsorPaidPortal(3000, 1);
      this.addTradingPartnerFeesSponsorPaidPortal(150, this.noTPusingPortal);
    }
    else {
      this.addSetupSponsorPaidPortal(0, 0);
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
    }
  }

  tpPortalChange(e) {
    if (this.noTPusingPortal > 0) {
      this.addTradingPartnerFeesSponsorPaidPortal(150, this.noTPusingPortal);
      this.addVolumeForDiWeb('Number of User IDs', 20, this.noTPusingPortal);
    } else {
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
      this.addVolumeForDiWeb('', 0, 0);
    }
  }

  //One Time Fees - Community Management - Setup - Sponsor Paid Portal - 6 - array 5
  addSetupSponsorPaidPortal(unitPrice, qty) {
    this.oneTimeFeeData.communityManagement[5].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[5].quantity = qty;
    this.oneTimeFeeData.communityManagement[5].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[5].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  //One Time Fees - Community Management - Trading Partner Fees - Sponsor Paid Portal - 7 - array 6
  addTradingPartnerFeesSponsorPaidPortal(unitPrice, qty) {
    this.oneTimeFeeData.communityManagement[6].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[6].quantity = qty;
    this.oneTimeFeeData.communityManagement[6].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[6].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  integrationMethodology(e) {
    if (e.checked) {
      this.isIntegrationMethodology = true;
      this.addSecondaryIntegrationServices(this.totalEdiDocs);
    }
    else {
      this.isIntegrationMethodology = false;

      this.oneTimeFeeData.integrationServices[1].oneTimeDeliverable = "";
      this.oneTimeFeeData.integrationServices[1].unitPrice = 0;
      this.oneTimeFeeData.integrationServices[1].quantity = 0;
      this.oneTimeFeeData.integrationServices[1].price = 0;
      this.oneTimeFeeData.integrationServices[1].afterDiscountPrice = 0;
    }
  }

  //One Time Fees -  Integration Services - Secondary Adapter - 2 - array 1
  addSecondaryIntegrationServices(total) {
    if (this.selectedSecondaryIntegrationMethod != "") {
      let type = this.selectedSecondaryIntegrationMethod + ' ' + (this.buySideCheck ? "Buy Side" : "Sell Side");
      let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
      let qty = erp[0].Methodology.toString().indexOf('Per Document Fee') == -1 ? 1 : total;
      this.oneTimeFeeData.integrationServices[1].oneTimeDeliverable = type;
      this.oneTimeFeeData.integrationServices[1].unitPrice = erp[0].Amount * this.convertedCurrency;
      this.oneTimeFeeData.integrationServices[1].quantity = qty;
      this.oneTimeFeeData.integrationServices[1].price = erp[0].Amount * qty * this.convertedCurrency;
      this.oneTimeFeeData.integrationServices[1].afterDiscountPrice = erp[0].Amount * qty * this.convertedCurrency;
    }
  }

  changePrimaryMethod(primary) {
    this.selectedPrimaryIntegrationMethod = primary;
    this.checkIntegrationMethod();
    this.addPrimaryIntegrationService(this.totalEdiDocs);
  }

  changeSecondaryMethod(secondary) {
    this.selectedSecondaryIntegrationMethod = secondary;
    this.checkIntegrationMethod();
    this.addSecondaryIntegrationServices(this.totalEdiDocs);
  }

  checkIntegrationMethod() {
    //if (this.selectedSecondaryIntegrationMethod == this.selectedPrimaryIntegrationMethod)
    //  this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Secondary integration method can not be same as primary integration method' });
    //else 
    if (this.selectedSecondaryIntegrationMethod == "Embedded Adapter") {
      let type = this.selectedSecondaryIntegrationMethod + ' ' + (this.buySideCheck ? "Buy Side" : "Sell Side");
      let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
      let valid = erp.length > 0 ? (erp[0].Valid == 1 ? true : false) : false;
      if (!valid)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'EMBEDDED ADAPTER DOES NOT EXIST FOR THIS ERP' });
    }
  }

  tpUsingEdiStandards(e) {
    if (e.checked) {
      this.isTpUsingEdiStandards = false;
      this.isEcommerceTable = false;
      this.totalEcommerce = 0;
      this.addOneTimeFeeOthers('', '', '', 0, 0);
      this.addTPAndDocumentService("TP and Documents", '', '', 0, 0);
      this.projectManagement(0, 0);
      this.ecommerceData.forEach(e => {
        e.fullfilment = false;
        e.inventory = false;
        e.orders = false;
        e.payment = false;
        e.product = false;
      });
      this.noElectronicallyIntegratedNonEdiTp = 0;
    }
    else {
      this.isTpUsingEdiStandards = true;
      this.addOneTimeFeeOthersService();
    }
  }

  dsvpChange(e) {
    if (this.dsvpSelectedPlan && this.dsvpSelectedProgram) {
      let deliverable = "";
      if (this.dsvpSelectedProgram == "Standard Replenishment")
        deliverable = "Measured in Kilo Bytes";
      else
        deliverable = "Measured in 850/Orders";

      let maxKB;
      if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        maxKB = k[0].MonthlyMax;
      } else if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        maxKB = k[0].AnnualMax;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        maxKB = k[0].VolumeOrdersPerMonth;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        maxKB = k[0].VolumeOrdersPerYear;
      } else {
        maxKB = 0;
      }

      let fixedFee;
      if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        fixedFee = k[0].MinimumMonthlyFee;
      } else if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        fixedFee = k[0].MinimumMonthlyFee;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedFee = k[0].MonthlyPrice;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedFee = k[0].MonthlyPrice;
      } else {
        fixedFee = 0;
      }

      let instruction;
      if (this.dsvpSelectedProgram == "Standard Replenishment" && this.dsvpSelectedPlan == "Annual Plan")
        instruction = "Overage when annual KB exceeded";
      else if (this.dsvpSelectedProgram != "Standard Replenishment" && this.dsvpSelectedPlan == "Annual Plan")
        instruction = "Overage when annual Orders exceeded";
      else if (this.dsvpSelectedProgram == "Standard Replenishment" && this.dsvpSelectedPlan == "Monthly Plan")
        instruction = "Overage when monthly KB exceeded";
      else if (this.dsvpSelectedProgram != "Standard Replenishment" && this.dsvpSelectedPlan == "Monthly Plan")
        instruction = "Overage when monthly Orders exceeded";

      let fixedRate;
      if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        fixedRate = k[0].OverKBRateMonthlyPlan;
      } else if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        fixedRate = k[0].OverKBRateAnnualPlan;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedRate = k[0].AverageFee;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedRate = k[0].AverageFee;
      } else {
        fixedRate = 0;
      }

      this.addDropShipPlanRecurringFee1(deliverable, maxKB, fixedFee);
      this.addDropShipPlanRecurringFee2(deliverable, instruction, fixedRate);
      if (this.dsvpSelectedProgram != "Standard Replenishment") {
        this.addDropShipPlanRecurringFee3("No Fee");
        this.addTransactionFees2(this.recurringFeeData.volumePlan[0].quantity == 0 ? 0 : 0.01);
        this.addTransactionFees4(this.recurringFeeData.volumePlan[0].quantity == 0 ? 0 : 25);
        this.addTransactionFees5(this.recurringFeeData.volumePlan[0].quantity == 0 ? 0 : 1, 1);
      }
      else {
        this.addDropShipPlanRecurringFee3("");
        this.addTransactionFees2(0);
        this.addTransactionFees4(0);
        this.addTransactionFees5(0, 0);
      }
      if (this.oneTimeFeeData.other[3].oneTimeDeliverable != "") {
        this.addNonEdiFormattedFees(this.recurringFeeData.monthlySupportService[0].instruction,
          this.recurringFeeData.monthlySupportService[0].unitPrice,
          this.oneTimeFeeData.other[3].price)
      }
    }
  }

  //Recurring Fees - Volume Plan -  1 - array 0
  addDropShipPlanRecurringFee1(deliverable, maxKB, fixedFee) {
    this.recurringFeeData.volumePlan[0].item = this.dsvpSelectedPlan;
    this.recurringFeeData.volumePlan[0].monthlyRecurringDeliverable = deliverable;
    this.recurringFeeData.volumePlan[0].unitPrice = maxKB;
    this.recurringFeeData.volumePlan[0].price = fixedFee * this.convertedCurrency;
    this.recurringFeeData.volumePlan[0].afterDiscountPrice = fixedFee * this.convertedCurrency;
  }

  //Recurring Fees - Volume Plan - 2 - array 1
  addDropShipPlanRecurringFee2(deliverable, instruction, fixedRate) {
    this.recurringFeeData.volumePlan[1].item = this.dsvpSelectedPlan;
    this.recurringFeeData.volumePlan[1].monthlyRecurringDeliverable = deliverable;
    this.recurringFeeData.volumePlan[1].instruction = instruction;
    this.recurringFeeData.volumePlan[1].quantity = fixedRate;
  }

  //Recurring Fees - Volume Plan - 	Inventory Transactions (846/INVRPT) - 3 - array 2
  addTransactionFees2(fixedRate) {
    this.recurringFeeData.volumePlan[2].quantity = fixedRate;
  }

  //Recurring Fees - Volume Plan - 	832/PRICAT, 852/SLSRPT and 811 - 5 - array 4
  addTransactionFees4(fixedRate) {
    this.recurringFeeData.volumePlan[4].quantity = fixedRate;
  }

  //Recurring Fees - Volume Plan - 		All other transactions - 6 - array 5
  addTransactionFees5(fixedRate, price) {
    this.recurringFeeData.volumePlan[5].quantity = fixedRate;
    this.recurringFeeData.volumePlan[5].price = price * this.convertedCurrency;
  }

  //Recurring Fees - Volume Plan - 	855/ORDRSP, 810/INVOIC and 856/DESADV - 4 - array 3
  addDropShipPlanRecurringFee3(instruction) {
    this.recurringFeeData.volumePlan[3].instruction = instruction;
  }

  //Recurring Fees - NON EDI Formatted Fees - Integration Service NON-EDI - 1 - array 0
  addNonEdiFormattedFees(instruction, unitPrice, price) {
    this.recurringFeeData.nonEdiFormattedFees[0].instructions = instruction;
    this.recurringFeeData.nonEdiFormattedFees[0].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.nonEdiFormattedFees[0].price = price * this.convertedCurrency;
    this.recurringFeeData.nonEdiFormattedFees[0].afterDiscountPrice = price * this.convertedCurrency;
  }

  addPrimaryIntegrationService(total) {
    let type = this.selectedPrimaryIntegrationMethod + ' ' + (this.buySideCheck == true ? "Buy Side" : "Sell Side");
    let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
    let qty = erp[0].Methodology.toString().indexOf('Per Document Fee') == -1 ? 1 : total;
    this.addIntegrationService(this.selectedPrimaryIntegrationMethod, type, this.selectedErp, erp[0].Amount, qty, erp[0].Amount * qty)
  }

  //One Time Fees -  Integration Services - 1 - array 0
  addIntegrationService(item, deliverable, erp, unitprice, qty, price) {
    this.oneTimeFeeData.integrationServices[0].item = item;
    this.oneTimeFeeData.integrationServices[0].oneTimeDeliverable = deliverable;
    this.oneTimeFeeData.integrationServices[0].erp = erp;
    this.oneTimeFeeData.integrationServices[0].unitPrice = unitprice * this.convertedCurrency;
    this.oneTimeFeeData.integrationServices[0].quantity = qty;
    this.oneTimeFeeData.integrationServices[0].price = price * this.convertedCurrency;
    this.oneTimeFeeData.integrationServices[0].afterDiscountPrice = unitprice * qty * this.convertedCurrency;
  }

  changeServicePlan(e) {
    if (this.dsvpSelectedServicePlan != '') {
      let instruction = this.dsvpSelectedServicePlan + ' Support';
      let up;
      if (this.dsvpSelectedServicePlan == "Standard")
        up = 1.7;
      else if (this.dsvpSelectedServicePlan == "Advanced")
        up = 2.5;
      else if (this.dsvpSelectedServicePlan == "Premium")
        up = 3.3;

      let price = ((this.oneTimeFeeData.integrationServices[0].price + this.oneTimeFeeData.integrationServices[1].price) * up) / 100;
      this.addMSPIntegrationService(instruction, up, price);

      let price1 = ((this.oneTimeFeeData.communityManagement[0].price + this.oneTimeFeeData.communityManagement[5].price) * up) / 100;
      this.addMSPCommunityManagement(instruction, up, price1);
    }
  }

  //Recurring Fees - Monthly Support Service - Integration Service - 2 - array 1
  addMSPIntegrationService(instruction, unitPrice, price) {
    this.recurringFeeData.monthlySupportService[1].instruction = instruction;
    this.recurringFeeData.monthlySupportService[1].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[1].price = price * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[1].afterDiscountPrice = price * this.convertedCurrency;
  }

  //Recurring Fees - Monthly Support Service - Community management - 3 - array 2
  addMSPCommunityManagement(instruction, unitPrice, price) {
    this.recurringFeeData.monthlySupportService[2].instruction = instruction;
    this.recurringFeeData.monthlySupportService[2].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[2].price = price * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[2].afterDiscountPrice = price * this.convertedCurrency;
  }

  noElectronicallyIntegratedNonEdiTpChange(e) {
    if (this.noElectronicallyIntegratedNonEdiTp == null || this.noElectronicallyIntegratedNonEdiTp == 0) {
      this.isEcommerceTable = false;
      this.totalEcommerce = 0;
      this.addTPAndDocumentService("TP and Documents", '', '', 0, 0);
      this.projectManagement(0, 0);
      this.ecommerceData.forEach(e => {
        e.fullfilment = false;
        e.inventory = false;
        e.orders = false;
        e.payment = false;
        e.product = false;
      });
      this.addOneTimeFeeOthers('', '', '', 0, 0);
    }
    else {
      this.isEcommerceTable = true;
      this.addTpAndDocument();
      this.addProjectManagement();
    }
  }

  addTpAndDocument() {
    let type = this.buySideCheck == true ? "Buy Side - per document (all TP's)" : "Sell Side - per document per TP";
    let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
    let qty;
    if (type == "Buy Side - per document (all TPs)")
      qty = this.noEdiDocs;
    else
      qty = this.totalEdiDocs + this.totalEcommerce;

    this.addTPAndDocumentService("TP and Documents", type, this.selectedErp, erp[0].Amount, qty);
  }

  //One Time Fees -  Trading Partner and Document Activation - TP and Documents - 1 - array 0
  addTPAndDocumentService(item, deliverable, erp, unitprice, qty) {
    this.oneTimeFeeData.tpAndDocumentActivation[0].item = item;
    this.oneTimeFeeData.tpAndDocumentActivation[0].oneTimeDeliverable = deliverable;
    this.oneTimeFeeData.tpAndDocumentActivation[0].erp = erp;
    this.oneTimeFeeData.tpAndDocumentActivation[0].unitPrice = unitprice * this.convertedCurrency;
    this.oneTimeFeeData.tpAndDocumentActivation[0].quantity = qty;
    this.oneTimeFeeData.tpAndDocumentActivation[0].price = unitprice * qty * this.convertedCurrency;
    this.oneTimeFeeData.tpAndDocumentActivation[0].afterDiscountPrice = unitprice * qty * this.convertedCurrency;
  }

  addOneTimeFeeOthersService() {
    let type = this.selectedPrimaryIntegrationMethod + ' ' + (this.buySideCheck == true ? "Buy Side" : "Sell Side");
    let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
    let qty = this.totalNonEdiDocs + this.totalEcommerce;
    this.addOneTimeFeeOthers("Non-EDI TP Integration", type, '', erp[0].Amount, qty)
  }

  //One Time Fees -  Other - Non-EDI TP Integration - 4 - array 3
  addOneTimeFeeOthers(item, deliverable, erp, unitprice, qty) {
    this.oneTimeFeeData.other[3].item = item;
    this.oneTimeFeeData.other[3].oneTimeDeliverable = deliverable;
    this.oneTimeFeeData.other[3].erp = erp;
    this.oneTimeFeeData.other[3].unitPrice = unitprice * this.convertedCurrency;
    this.oneTimeFeeData.other[3].quantity = qty;
    this.oneTimeFeeData.other[3].price = unitprice * qty * this.convertedCurrency;
    this.oneTimeFeeData.other[3].afterDiscountPrice = unitprice * qty * this.convertedCurrency;
  }

  changeEcomCheck(e) {
    if (e.checked)
      this.totalEcommerce += 1;
    else
      this.totalEcommerce = this.totalEcommerce - 1;

    this.addTpAndDocument();
    this.addProjectManagement();
    this.addOneTimeFeeOthersService();
    this.addNonEdiFormattedFees2();
    this.addNonEdiFormattedFees3();
    this.addNonEdiFormattedFees4();
    this.addNonEdiFormattedFees5();
  }

  addProjectManagement() {
    if (this.totalEcommerce > 0) {
      let transactionType = 0;
      let tp = 0;
      this.ediLoop.forEach(e => {
        if (e.integratedERPDiPulse == "Outbound from Trading Partner" || e.integratedERPDiPulse == "Inbound from Trading Partner") {
          transactionType += 1;
          tp += e.noOfTP;
        }
      });
      let projectWeeks = (4 * transactionType) + 1;
      let PMperWeek;
      if (tp > 500)
        PMperWeek = 8;
      else {
        let filter = this.pmFeeData.filter(a => tp >= a.Min && tp <= a.Max);
        PMperWeek = filter.length > 0 ? filter[0].PMHoursPerWeek : 0;
      }
      let totalPmHours = (projectWeeks * PMperWeek) > 416 ? 416 : (projectWeeks * PMperWeek);
      let adjustedPmHours = this.buySideCheck ? (totalPmHours / 2) : totalPmHours;
      let ecom;
      if (this.totalEcommerce >= 9)
        ecom = this.ecomFeeData.filter(a => a.EcommerceWebsites == 4 && a.NumberProcessesAutomated == '9+');
      else
        ecom = this.ecomFeeData.filter(a => a.EcommerceWebsites == 4 && a.NumberProcessesAutomated == this.totalEcommerce);

      console.log(ecom)
      let valuePMHours = ecom.length > 0 ? ecom[0].PMHours : 0;
      let finalTotalPMHours = adjustedPmHours * valuePMHours;
      this.projectManagement(150, finalTotalPMHours);
    }
    else
      this.projectManagement(0, 0);
  }

  //One Time Fees -  Project Management - 1 - array 0
  projectManagement(unitPrice, qty) {
    this.oneTimeFeeData.projectManagement[0].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.projectManagement[0].quantity = qty;
    this.oneTimeFeeData.projectManagement[0].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.projectManagement[0].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 2 - array 1
  addNonEdiFormattedFees2() {
    let mogneto = this.ecommerceData.filter(a => a.name == "Magneto");
    let count = mogneto[0].orders ? 1 : 0;
    count += mogneto[0].payment ? 1 : 0;
    count += mogneto[0].product ? 1 : 0;
    count += mogneto[0].fullfilment ? 1 : 0;
    count += mogneto[0].inventory ? 1 : 0;

    let price;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = 250;
    else if (count > 1)
      price = 250 + ((count - 1) * 50);

    if (mogneto[0].orders || mogneto[0].payment || mogneto[0].product || mogneto[0].fullfilment || mogneto[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[1].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[1].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[1].afterDiscountPrice = price * this.convertedCurrency;
    }
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 3 - array 2
  addNonEdiFormattedFees3() {
    let shopify = this.ecommerceData.filter(a => a.name == "Shopify");
    let count = shopify[0].orders ? 1 : 0;
    count += shopify[0].payment ? 1 : 0;
    count += shopify[0].product ? 1 : 0;
    count += shopify[0].fullfilment ? 1 : 0;
    count += shopify[0].inventory ? 1 : 0;

    let price;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = 250;
    else if (count > 1)
      price = 250 + ((count - 1) * 50);

    if (shopify[0].orders || shopify[0].payment || shopify[0].product || shopify[0].fullfilment || shopify[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[2].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[2].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[2].afterDiscountPrice = price * this.convertedCurrency;
    }
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 4 - array 3
  addNonEdiFormattedFees4() {
    let wc = this.ecommerceData.filter(a => a.name == "Woo Commerce");
    let count = wc[0].orders ? 1 : 0;
    count += wc[0].payment ? 1 : 0;
    count += wc[0].product ? 1 : 0;
    count += wc[0].fullfilment ? 1 : 0;
    count += wc[0].inventory ? 1 : 0;

    let price;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = 250;
    else if (count > 1)
      price = 250 + ((count - 1) * 50);

    if (wc[0].orders || wc[0].payment || wc[0].product || wc[0].fullfilment || wc[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[3].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[3].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[3].afterDiscountPrice = price * this.convertedCurrency;
    }
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 5 - array 4
  addNonEdiFormattedFees5() {
    let asc = this.ecommerceData.filter(a => a.name == "Amazon Seller Central");
    let count = asc[0].orders ? 1 : 0;
    count += asc[0].payment ? 1 : 0;
    count += asc[0].product ? 1 : 0;
    count += asc[0].fullfilment ? 1 : 0;
    count += asc[0].inventory ? 1 : 0;

    let price;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = 250;
    else if (count > 1)
      price = 250 + ((count - 1) * 50);

    if (asc[0].orders || asc[0].payment || asc[0].product || asc[0].fullfilment || asc[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[4].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[4].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[4].afterDiscountPrice = price * this.convertedCurrency;
    }
  }

  getSum(ary) {
    let total = 0;
    if (ary != null) {
      ary.forEach(element => {
        total += element.afterDiscountPrice;
      });
    }
    return total;
  }

  getTotalOneTimeFee(ary) {
    let total = 0;
    if (ary != null) {
      ary.communicationServices.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.integrationServices.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.tpAndDocumentActivation.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.administrativeAndManagementServices.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.communityManagement.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.projectManagement.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.other.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
    }
    return total;
  }

  getTotalRecurringFee(ary) {
    let total = 0;
    if (ary != null) {
      ary.monthlySupportService.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.volumePlan.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.serviceBureau.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.nonEdiFormattedFees.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
      ary.other.forEach(element => {
        total += element.afterDiscountPrice * this.convertedCurrency;
      });
    }
    return total;
  }

  clearManagedServiceInputes() {
    this.selectedErp = "3PL";
    this.msEcommerece = "MS";
    this.buySideCheck = false;
    this.sellSideCheck = true;
    this.buySideCreateEdiSpecForBookletTp = false;
    this.buySideImplementComplianceTestProgram = false;
    this.complianceTestWhoPays = "Trading Partner (Paid)";
    this.noTPComplienceTested = 0;
    this.provideLabel = false;
    this.noRetailerDivisionLabels = 0;
    this.hubPayingForSupplier = false;
    this.isPrivatePortal = false;
    this.noTPusingPortal = 0;
    this.noEdiDocs = 0;
    this.noNonEdiDocs = 0;
    this.selectedKBPlan = "";
    this.selectedMSKBPlan = "1";
    this.selectedDropShipVolumePlan = "1";
    this.dsvpSelectedServicePlan = "";
    this.dsvpSelectedProgram = "";
    this.dsvpSelectedPlan = "";
    this.moreIntegrationMethodology = false;
    this.selectedPrimaryIntegrationMethod = "Flat File";
    this.selectedSecondaryIntegrationMethod = "";
    this.tpUsingOnlyEdiStandards = true;
    this.noElectronicallyIntegratedNonEdiTp = 0;
    this.isClientNeedAdditionalSerices = false;
    this.ediLoop = [];
    this.nonEdiLoop = [];
    this.isEDI = false;
    this.isNonEDI = false;
    this.isMsKbPlan = false;
    this.isDropShipVolumePlan = false;
    this.isIntegrationMethodology = false;
    this.isTpUsingEdiStandards = false;
    this.isEcommerceTable = false;
    this.isAdditionalPlanDetails = false;
    this.isCompliance = false;
    this.isProvideLabel = false;
    this.isHubPaying = false;
    this.ecommerceData = [
      { "name": "Magneto", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
      { "name": "Shopify", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
      { "name": "Woo Commerce", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
      { "name": "Amazon Seller Central", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false }
    ];
    this.service.getOneTimeFeeData().then(data => this.oneTimeFeeData = data);
    this.service.getRecurringFeeData().then(data => this.recurringFeeData = data);
    this.addPrimaryIntegrationService(this.totalEdiDocs);
    this.dealId = 0;
    this.customerName = '';
  }

  addServices(e, index) {
    this.isAdditionalTab = true;
    if (e.checked && index == 1) {
      this.additionServiceTab1 = false;
      this.addAdminAndManagementService(250, 250, 1);
    } else if (!e.checked && index == 1) {
      this.additionServiceTab1 = true;
      this.noDiPulseIdNeeded = 0;
      this.addAdminAndManagementService(0, 0, 0);
    } else if (e.checked && index == 2) {
      this.additionServiceTab2 = false;
      this.addDimetricsSetup(5000, 1, 5000);
      this.addMSPDimetrics();
    } else if (!e.checked && index == 2) {
      this.additionServiceTab2 = true;
      this.addDimetricsSetup(0, 0, 0);
      this.noBusinessRules = 0;
      this.noDocUsedInBusinessRules = 0;
      this.isDiMetricsHost = false;
      this.noKBHostedEachMonth = 0;
      this.addMSPDimetrics();
    } else if (e.checked && index == 3) {
      this.additionServiceTab3 = false;
      this.addServiceBureauSetup(500, 1, 500);
      if (this.noDocServiceBureauUsers > 1) {
        let price = 200 * (this.noDocServiceBureauUsers - 1);
        this.addServiceBureauSetupAdditionalDoc(200, (this.noDocServiceBureauUsers - 1), price);
      }
    } else if (!e.checked && index == 3) {
      this.additionServiceTab3 = true;
      this.addServiceBureauSetup(0, 0, 0);
      this.addServiceBureauSetupAdditionalDoc(0, 0, 0);
    } else if (e.checked && index == 4) {
      this.additionServiceTab4 = false;
      this.identifyTheSwYesChange('');
      this.protocolConnectToDicenterChange('');
    } else if (!e.checked && index == 4) {
      this.additionServiceTab4 = true;
      this.addProtocol('', 0, 0);
      this.addSoftware('', 0, 0);
    } else if (e.checked && index == 5) {
      this.additionServiceTab5 = false;
    } else if (!e.checked && index == 5) {
      this.additionServiceTab5 = true;
      this.howManyHoursNeeded = 0;
      this.addDiCentralHours(0, 0);
    }
  }

  emptyAdditionalServiceInout() {
    this.diPulse = false;
    this.diMetrics = false;
    this.serviceBureau = false;
    this.communicationSoftware = false;
    this.onsiteProfessionalServices = false;
    this.isAdditionalTab = false;
    this.additionServiceTab1 = true;
    this.noDiPulseIdNeeded = 0;
    this.addAdminAndManagementService(0, 0, 0);
    this.additionServiceTab2 = true;
    this.addDimetricsSetup(0, 0, 0);
    this.noBusinessRules = 0;
    this.noDocUsedInBusinessRules = 0;
    this.isDiMetricsHost = false;
    this.noKBHostedEachMonth = 0;
    this.addMSPDimetrics();
    this.additionServiceTab3 = true;
    this.addServiceBureauSetup(0, 0, 0);
    this.addServiceBureauSetupAdditionalDoc(0, 0, 0);
    this.additionServiceTab4 = true;
    this.addProtocol('', 0, 0);
    this.addSoftware('', 0, 0);
    this.additionServiceTab5 = true;
    this.howManyHoursNeeded = 0;
    this.addDiCentralHours(0, 0);
  }

  //One Time Fees - Administrative and Management Services - DiPulse Master - 1 - array 0
  addAdminAndManagementService(unitPrice, price, qty) {
    this.oneTimeFeeData.administrativeAndManagementServices[0].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.administrativeAndManagementServices[0].price = qty * price * this.convertedCurrency;
    this.oneTimeFeeData.administrativeAndManagementServices[0].quantity = qty;
    this.oneTimeFeeData.administrativeAndManagementServices[0].afterDiscountPrice = qty * price * this.convertedCurrency;
  }

  //Recurring Fees - Monthly Support Service - Additional User Accounts - 5 -array 4
  addMSPAdditionalUserAccount(unitPrice, qty) {
    this.recurringFeeData.monthlySupportService[4].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[4].quantity = qty;
    this.recurringFeeData.monthlySupportService[4].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[4].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  noDiPulseIdNeededChange(e) {
    if (this.noDiPulseIdNeeded > 0) {
      this.addMSPAdditionalUserAccount(20, this.noDiPulseIdNeeded)
    } else {
      this.addMSPAdditionalUserAccount(0, 0);
    }
  }

  noBusinessRulesChange(e) {
    if (this.noBusinessRules == 0)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'A Business Rule is needed' });
    else if (this.noBusinessRules > 26)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'A Business Rule should not be greater than 26' });

    if (this.noBusinessRules > 0)
      this.addMSPDimetrics();
  }

  noDocUsedInBusinessRulesChange(e) {
    if (this.noDocUsedInBusinessRules > this.totalEdiDocs)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'ERROR TOO many Documents' });
    else if (this.noDocUsedInBusinessRules > 10)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents used in Business Rule should not be greater than 10' });

    if (this.noDocUsedInBusinessRules > 0)
      this.addMSPDimetrics();
  }

  isDiMetricsHostChange(e) {
    if (e.checked) {

    } else {
      this.noKBHostedEachMonth = 0;
      this.emptyDimetricsOtherTable();
    }
  }

  noKBHostedEachMonthChange(e) {
    if (this.noKBHostedEachMonth > 0 && this.noKBHostedEachMonth <= 10000)
      this.addDimetricsOtherTable();
    else {
      if (this.noKBHostedEachMonth > 10000)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of KB hosted each month should not be greater than 10000' });

      this.emptyDimetricsOtherTable();
    }
  }

  //One Time Fees - Administrative and Management Services - Dimetrics Setup - 2 - array 1
  addDimetricsSetup(unitPrice, qty, price) {
    this.oneTimeFeeData.administrativeAndManagementServices[1].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.administrativeAndManagementServices[1].quantity = qty;
    this.oneTimeFeeData.administrativeAndManagementServices[1].price = price * this.convertedCurrency;
    this.oneTimeFeeData.administrativeAndManagementServices[1].afterDiscountPrice = price * this.convertedCurrency;
  }

  //Recurring Fees - Monthly Support Service -Dimetrics - 4 -array 3
  addMSPDimetrics() {
    let complexity = this.diMetricsData.filter(a => a.NumberRules == this.noBusinessRules && a.NumberDocuments == this.noDocUsedInBusinessRules);
    if (complexity.length > 0) {
      let fee = this.diMetricsSecondPartData.filter(a => a.Complexity == complexity[0].Complexity);
      let up;
      for (let i = 0; i < fee.length; i++) {
        if (this.totalEdiDocs <= fee[i].TradingPartnerCommunitySize) {
          up = fee[i].Fee;
          break;
        }
      }

      this.recurringFeeData.monthlySupportService[4].unitPrice = up * this.convertedCurrency;
      this.recurringFeeData.monthlySupportService[4].price = up * this.convertedCurrency;
      this.recurringFeeData.monthlySupportService[4].afterDiscountPrice = up * this.convertedCurrency;
    }
  }

  //Recurring Fees - Other -Custom Tables - 1 -array 0
  addDimetricsOtherTable() {
    let fee;
    if (this.noKBHostedEachMonth > 0 && this.noKBHostedEachMonth <= 100)
      fee = 20;
    else if (this.noKBHostedEachMonth >= 101 && this.noKBHostedEachMonth <= 500)
      fee = 30;
    else if (this.noKBHostedEachMonth >= 501 && this.noKBHostedEachMonth <= 1000)
      fee = 40;
    else if (this.noKBHostedEachMonth >= 1001 && this.noKBHostedEachMonth <= 2000)
      fee = 50;
    else if (this.noKBHostedEachMonth >= 2001 && this.noKBHostedEachMonth <= 3000)
      fee = 52;
    else if (this.noKBHostedEachMonth >= 3001 && this.noKBHostedEachMonth <= 4000)
      fee = 54;
    else if (this.noKBHostedEachMonth >= 4001 && this.noKBHostedEachMonth <= 5000)
      fee = 56;
    else if (this.noKBHostedEachMonth >= 5001 && this.noKBHostedEachMonth <= 6000)
      fee = 58;
    else if (this.noKBHostedEachMonth >= 6001 && this.noKBHostedEachMonth <= 7000)
      fee = 60;
    else if (this.noKBHostedEachMonth >= 7001 && this.noKBHostedEachMonth <= 8000)
      fee = 61;
    else if (this.noKBHostedEachMonth >= 8001 && this.noKBHostedEachMonth <= 9000)
      fee = 62;
    else if (this.noKBHostedEachMonth >= 9001 && this.noKBHostedEachMonth <= 10000)
      fee = 63;

    this.recurringFeeData.other[0].unitPrice = fee * this.convertedCurrency;
    this.recurringFeeData.other[0].price = fee * this.convertedCurrency;
    this.recurringFeeData.other[0].quantity = 1;
    this.recurringFeeData.other[0].afterDiscountPrice = fee * this.convertedCurrency;
  }

  emptyDimetricsOtherTable() {
    this.recurringFeeData.other[0].unitPrice = 0;
    this.recurringFeeData.other[0].price = 0;
    this.recurringFeeData.other[0].quantity = 0;
    this.recurringFeeData.other[0].afterDiscountPrice = 0;
  }

  noDocServiceBureauUsersChange(e) {
    if (this.noDocServiceBureauUsers == 0)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'ERROR- Need Document Count for Service Bureau' });
  }

  //One Time Fees - Other - Service Bureau 1st Document Build - 2 - array 1
  addServiceBureauSetup(unitPrice, qty, price) {
    this.oneTimeFeeData.other[1].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.other[1].quantity = qty;
    this.oneTimeFeeData.other[1].price = price * this.convertedCurrency;
    this.oneTimeFeeData.other[1].afterDiscountPrice = price * this.convertedCurrency;
  }

  //One Time Fees - Other - Setup Additional Doc - 3 - array 2
  addServiceBureauSetupAdditionalDoc(unitPrice, qty, price) {
    this.oneTimeFeeData.other[2].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.other[2].quantity = qty;
    this.oneTimeFeeData.other[2].price = price * this.convertedCurrency;
    this.oneTimeFeeData.other[2].afterDiscountPrice = price * this.convertedCurrency;
  }

  serviceBureauUsersInProjectChange(e) {
    if (this.docsPerMonth > 0)
      this.addServiceBureauDocs1();
    else
      this.editServiceBureauDocs1(0, 0);
    if (this.docs856PerMonth > 0)
      this.addServiceBureauDocs2();
    else
      this.editServiceBureauDocs2(0, 0);
    if (this.lineItemsPerMonth > 0)
      this.addServiceBureauDocs3();
    else
      this.editServiceBureauDocs3(0, 0);
    if (this.labelsServiceBureauUsersPerMonth > 0)
      this.addServiceBureauDocs4();
    else
      this.editServiceBureauDocs4(0, 0);
    if (this.noDocServiceBureauUsers > 1) {
      let price = 200 * (this.noDocServiceBureauUsers - 1);
      this.addServiceBureauSetupAdditionalDoc(200, (this.noDocServiceBureauUsers - 1), price);
    } else {
      this.addServiceBureauSetupAdditionalDoc(0, 0, 0);
    }
  }

  sponsorPayingServiceBureauUsersChange(e) {

  }

  docsPerMonthChange(e) {
    if (this.docsPerMonth >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents per month should not be greater than 3999' });
    else {
      if (this.docsPerMonth > 0)
        this.addServiceBureauDocs1();
      else
        this.editServiceBureauDocs1(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 1 -array 0
  addServiceBureauDocs1() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Documents (850, 810, 855, 865)");
    let up;
    for (let i = 0; i < doc.length; i++) {
      if (this.docsPerMonth >= doc[i].Min && this.docsPerMonth <= doc[i].Max) {
        up = doc[i].Fee;
        break;
      }
    }
    let qty = this.docsPerMonth + this.serviceBureauUsersInProject;
    this.editServiceBureauDocs1(up, qty)
  }

  editServiceBureauDocs1(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[0].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[0].quantity = qty;
    this.recurringFeeData.serviceBureau[0].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[0].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  docs856PerMonthChange(e) {
    if (this.docs856PerMonth >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents per month should not be greater than 3999' });
    else {
      if (this.docs856PerMonth > 0)
        this.addServiceBureauDocs2();
      else
        this.editServiceBureauDocs2(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 2 -array 1
  addServiceBureauDocs2() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Documents (856)");
    let up;
    for (let i = 0; i < doc.length; i++) {
      if (this.docs856PerMonth >= doc[i].Min && this.docs856PerMonth <= doc[i].Max) {
        up = doc[i].Fee;
        break;
      }
    }
    let qty = this.docs856PerMonth + this.serviceBureauUsersInProject;
    this.editServiceBureauDocs2(up, qty)
  }

  editServiceBureauDocs2(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[1].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[1].quantity = qty;
    this.recurringFeeData.serviceBureau[1].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[1].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  lineItemsPerMonthChange(e) {
    if (this.lineItemsPerMonth >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Line items should not be greater than 3999' });
    else {
      if (this.lineItemsPerMonth > 0)
        this.addServiceBureauDocs3();
      else
        this.editServiceBureauDocs3(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 3 -array 2
  addServiceBureauDocs3() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Line Items");
    let up;
    for (let i = 0; i < doc.length; i++) {
      if (this.lineItemsPerMonth >= doc[i].Min && this.lineItemsPerMonth <= doc[i].Max) {
        up = doc[i].Fee;
        break;
      }
    }
    let qty = this.lineItemsPerMonth;
    this.editServiceBureauDocs3(up, qty)
  }

  editServiceBureauDocs3(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[2].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[2].quantity = qty;
    this.recurringFeeData.serviceBureau[2].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[2].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  labelsServiceBureauUsersPerMonthChange(e) {
    if (this.labelsServiceBureauUsersPerMonth >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Labels should not be greater than 3999' });
    else {
      if (this.labelsServiceBureauUsersPerMonth > 0)
        this.addServiceBureauDocs4();
      else
        this.editServiceBureauDocs4(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 4 -array 3
  addServiceBureauDocs4() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Labels (does not include shipping costs)");
    let up;
    for (let i = 0; i < doc.length; i++) {
      if (this.labelsServiceBureauUsersPerMonth >= doc[i].Min && this.labelsServiceBureauUsersPerMonth <= doc[i].Max) {
        up = doc[i].Fee;
        break;
      }
    }
    let qty = this.labelsServiceBureauUsersPerMonth;
    this.editServiceBureauDocs4(up, qty)
  }

  editServiceBureauDocs4(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[3].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[3].quantity = qty;
    this.recurringFeeData.serviceBureau[3].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[3].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  identifyTheSwYesChange(e) {
    let up;
    if (this.identifyTheSwYes == "DiConnect Lite")
      up = 500;
    else if (this.identifyTheSwYes == "DiConnect Enterprice")
      up = 1000;
    else
      up = 0;
    this.addSoftware(this.identifyTheSwYes, up, 1)
  }

  protocolConnectToDicenterChange(e) {
    let up;
    if (this.protocolConnectToDicenter == "AS2")
      up = 350;
    else if (this.protocolConnectToDicenter == "FTP")
      up = 250;
    else if (this.protocolConnectToDicenter == "SFTP")
      up = 1000;
    else if (this.protocolConnectToDicenter == "FTP/s")
      up = 500;
    else if (this.protocolConnectToDicenter == "Web Services")
      up = 1000;
    this.addProtocol(this.protocolConnectToDicenter, up, 1)
  }

  //One Time Fees - Communication Services - Protocol - 1 - array 0
  addProtocol(oneTimeDeliverable, unitPrice, qty) {
    this.oneTimeFeeData.communicationServices[0].oneTimeDeliverable = oneTimeDeliverable;
    this.oneTimeFeeData.communicationServices[0].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communicationServices[0].price = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communicationServices[0].quantity = qty;
    this.oneTimeFeeData.communicationServices[0].afterDiscountPrice = unitPrice * this.convertedCurrency;
  }

  //One Time Fees - Communication Services - Software - 2 - array 1
  addSoftware(oneTimeDeliverable, unitPrice, qty) {
    this.oneTimeFeeData.communicationServices[1].oneTimeDeliverable = oneTimeDeliverable;
    this.oneTimeFeeData.communicationServices[1].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.communicationServices[1].quantity = qty;
    this.oneTimeFeeData.communicationServices[1].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.communicationServices[1].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  howManyHoursNeededChange(e) {
    if (this.howManyHoursNeeded > 0)
      this.addDiCentralHours(150, this.howManyHoursNeeded);
    else
      this.addDiCentralHours(0, 0);
  }

  //One Time Fees - others - DiCentral hours - 1 - array 0
  addDiCentralHours(unitPrice, qty) {
    this.oneTimeFeeData.other[0].unitPrice = unitPrice * this.convertedCurrency;
    this.oneTimeFeeData.other[0].quantity = qty;
    this.oneTimeFeeData.other[0].price = unitPrice * qty * this.convertedCurrency;
    this.oneTimeFeeData.other[0].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  dicountChange(e, index, id) {
    let value = e.target.value;
    if (value > 30) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Discount cannot exceed 30%. You need to get approval from Steve Scala.' });
      this.setDisountValue(index, id);
    } else {
      if (value > 0 && value != '') {
        if (id == 1) {
          let amount = this.oneTimeFeeData.communicationServices[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.communicationServices[index].discount = value;
          this.oneTimeFeeData.communicationServices[index].afterDiscountPrice = amount - discount;
        } else if (id == 2) {
          let amount = this.oneTimeFeeData.integrationServices[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.integrationServices[index].discount = value;
          this.oneTimeFeeData.integrationServices[index].afterDiscountPrice = amount - discount;
        } else if (id == 3) {
          let amount = this.oneTimeFeeData.tpAndDocumentActivation[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.tpAndDocumentActivation[index].discount = value;
          this.oneTimeFeeData.tpAndDocumentActivation[index].afterDiscountPrice = amount - discount;
        } else if (id == 4) {
          let amount = this.oneTimeFeeData.administrativeAndManagementServices[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.administrativeAndManagementServices[index].discount = value;
          this.oneTimeFeeData.administrativeAndManagementServices[index].afterDiscountPrice = amount - discount;
        } else if (id == 5) {
          let amount = this.oneTimeFeeData.communityManagement[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.communityManagement[index].discount = value;
          this.oneTimeFeeData.communityManagement[index].afterDiscountPrice = amount - discount;
        } else if (id == 6) {
          let amount = this.oneTimeFeeData.projectManagement[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.projectManagement[index].discount = value;
          this.oneTimeFeeData.projectManagement[index].afterDiscountPrice = amount - discount;
        } else if (id == 7) {
          let amount = this.oneTimeFeeData.other[index].price;
          let discount = amount * (value / 100);
          this.oneTimeFeeData.other[index].discount = value;
          this.oneTimeFeeData.other[index].afterDiscountPrice = amount - discount;
        } else if (id == 8) {
          let amount = this.recurringFeeData.monthlySupportService[index].price;
          let discount = amount * (value / 100);
          this.recurringFeeData.monthlySupportService[index].discount = value;
          this.recurringFeeData.monthlySupportService[index].afterDiscountPrice = amount - discount;
        } else if (id == 9) {
          let amount = this.recurringFeeData.volumePlan[index].price;
          let discount = amount * (value / 100);
          this.recurringFeeData.volumePlan[index].discount = value;
          this.recurringFeeData.volumePlan[index].afterDiscountPrice = amount - discount;
        } else if (id == 10) {
          let amount = this.recurringFeeData.serviceBureau[index].price;
          let discount = amount * (value / 100);
          this.recurringFeeData.serviceBureau[index].discount = value;
          this.recurringFeeData.serviceBureau[index].afterDiscountPrice = amount - discount;
        } else if (id == 11) {
          let amount = this.recurringFeeData.nonEdiFormattedFees[index].price;
          let discount = amount * (value / 100);
          this.recurringFeeData.nonEdiFormattedFees[index].discount = value;
          this.recurringFeeData.nonEdiFormattedFees[index].afterDiscountPrice = amount - discount;
        } else if (id == 12) {
          let amount = this.recurringFeeData.other[index].price;
          let discount = amount * (value / 100);
          this.recurringFeeData.other[index].discount = value;
          this.recurringFeeData.other[index].afterDiscountPrice = amount - discount;
        }
      } else {
        this.setDisountValue(index, id);
      }
    }
  }

  setDisountValue(index, id) {
    if (id == 1) {
      this.oneTimeFeeData.communicationServices[index].afterDiscountPrice = this.oneTimeFeeData.communicationServices[index].price;
      this.oneTimeFeeData.communicationServices[index].discount = 0;
    }
    else if (id == 2) {
      this.oneTimeFeeData.integrationServices[index].afterDiscountPrice = this.oneTimeFeeData.integrationServices[index].price;
      this.oneTimeFeeData.integrationServices[index].discount = 0;
    } else if (id == 3) {
      this.oneTimeFeeData.tpAndDocumentActivation[index].afterDiscountPrice = this.oneTimeFeeData.tpAndDocumentActivation[index].price;
      this.oneTimeFeeData.tpAndDocumentActivation[index].discount = 0;
    } else if (id == 4) {
      this.oneTimeFeeData.administrativeAndManagementServices[index].afterDiscountPrice = this.oneTimeFeeData.administrativeAndManagementServices[index].price;
      this.oneTimeFeeData.administrativeAndManagementServices[index].discount = 0;
    } else if (id == 5) {
      this.oneTimeFeeData.communityManagement[index].afterDiscountPrice = this.oneTimeFeeData.communityManagement[index].price;
      this.oneTimeFeeData.communityManagement[index].discount = 0;
    } else if (id == 6) {
      this.oneTimeFeeData.projectManagement[index].afterDiscountPrice = this.oneTimeFeeData.projectManagement[index].price;
      this.oneTimeFeeData.projectManagement[index].discount = 0;
    } else if (id == 7) {
      this.oneTimeFeeData.other[index].afterDiscountPrice = this.oneTimeFeeData.other[index].price;
      this.oneTimeFeeData.other[index].discount = 0;
    } else if (id == 8) {
      this.recurringFeeData.monthlySupportService[index].afterDiscountPrice = this.recurringFeeData.monthlySupportService[index].price;
      this.recurringFeeData.monthlySupportService[index].discount = 0;
    } else if (id == 9) {
      this.recurringFeeData.volumePlan[index].afterDiscountPrice = this.recurringFeeData.volumePlan[index].price;
      this.recurringFeeData.volumePlan[index].discount = 0;
    } else if (id == 10) {
      this.recurringFeeData.serviceBureau[index].afterDiscountPrice = this.recurringFeeData.serviceBureau[index].price;
      this.recurringFeeData.serviceBureau[index].discount = 0;
    } else if (id == 11) {
      this.recurringFeeData.nonEdiFormattedFees[index].afterDiscountPrice = this.recurringFeeData.nonEdiFormattedFees[index].price;
      this.recurringFeeData.nonEdiFormattedFees[index].discount = 0;
    } else if (id == 12) {
      this.recurringFeeData.other[index].afterDiscountPrice = this.recurringFeeData.other[index].price;
      this.recurringFeeData.other[index].discount = 0;
    }
  }
}

@Component({
  selector: 'user-dialog',
  templateUrl: 'userDialog.html',
})
export class DialogOverviewExampleDialog {
  form: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    dealId: new FormControl('', [Validators.required]),
    customerName: new FormControl('', [Validators.required]),
    currency: new FormControl('USD', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  submit() {
    if (this.form.valid) {
      let form = this.form.value;
      this.data.name = form.userName;
      this.data.email = form.email;
      this.data.dealId = form.dealId;
      this.data.customerName = form.customerName;
      this.data.currency = form.currency;
      this.onNoClick();
    }
  }

}