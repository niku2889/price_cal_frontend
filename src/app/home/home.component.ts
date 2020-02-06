import { Component, OnInit, ViewEncapsulation, Inject, ViewChild, ElementRef } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormArray } from "@angular/forms";
import { HomeService } from './service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface DialogData {
  email: string;
  name: string;
  dealId: number;
  customerName: string;
  currency: string;
  currencyData: [];
  reportId: string;
  userId: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, HomeService],
})

export class HomeComponent implements OnInit {
  @ViewChild('finalReportId', { static: false }) table: ElementRef;
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
  discountData = [];
  communicationFeesData = [];
  communityManagementFeesData = [];
  diametricsThirdPartData = [];
  varienceFee = [];
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
    { "name": "Magento", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
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
  noTPInScope = 0;
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
  maxEDITpNo = 0;
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
  previousCurrency = '';
  reportId = '';
  usdToinr = 70;
  usdTocad = 1.30;
  usdTojpy = 109;
  usdToaud = 1.45;
  usdToeur = 0.90;
  usdTogbp = 0.76;
  usdTovnd = 23173;
  convertedCurrency = 1;
  currencyData = [];
  headerPlan = "";
  headerPlanSub = "";
  version = 0;
  userId = 0;
  inputData = [];

  constructor(private messageService: MessageService,
    public dialog: MatDialog,
    private service: HomeService,
  ) {
    this.service.getAllComplieanceFee()
      .subscribe(data => {
        this.complieanceFeeData = data;
      });
  }

  ngOnInit() {
    this.getAllCC();
    this.getAllErp();
    this.getAllEdi();
    this.getAllMsKbPlans();
    this.getAllDropShipVolumePlans();
    this.getAllDiMetricsFee();
    this.getAllDimetricsFeesSecondPart();
    this.getAllServiceBureauFees();
    this.getEcomFees();
    this.getPMFees();
    this.getDiscountLimitations();
    this.getAllAdminCommunityManagementFees();
    this.getAllCommunicationFees();
    this.getAllDimetricsFeesThirdPart();
    this.getAllVarienceFees();

    this.service.getOneTimeFeeData().then(data => this.oneTimeFeeData = data);
    this.service.getRecurringFeeData().then(data => this.recurringFeeData = data);

  }

  getDiscountLimitations() {
    this.service.getDiscountLimitations()
      .subscribe(data => {
        this.discountData = data;
      });
  }

  getAllErp() {
    this.service.getAllErp()
      .subscribe(data => {
        this.erpData = data;
        this.addPrimaryIntegrationService();
      });
  }

  getAllVarienceFees() {
    this.service.getAllVarienceFees()
      .subscribe(data => {
        this.varienceFee = data;
      });
  }

  getAllDimetricsFeesThirdPart() {
    this.service.getAllDimetricsFeesThirdPart()
      .subscribe(data => {
        this.diametricsThirdPartData = data;
      });
  }

  getAllAdminCommunityManagementFees() {
    this.service.getAllAdminCommunityManagementFees()
      .subscribe(data => {
        this.communityManagementFeesData = data;
      });
  }

  getAllCommunicationFees() {
    this.service.getAllCommunicationFees()
      .subscribe(data => {
        this.communicationFeesData = data;
      });
  }

  getAllEdi() {
    this.service.getAllEdi()
      .subscribe(data => {
        this.ediData = data;
      });
  }

  getAllCC() {
    this.service.getAllCC()
      .subscribe(data => {
        this.currencyData = data;
        this.openDialog();
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

  currencyChange(e) {
    let cc = this.currencyData.filter(a => a.Currency == this.currency);
    let pc = this.currencyData.filter(a => a.Currency == (this.previousCurrency == '' ? this.currency : this.previousCurrency));
    this.convertedCurrency = cc[0].ConvertionRate;

    this.changeCalculation(this.oneTimeFeeData.communicationServices, pc[0].ConvertionRate);
    this.changeCalculation(this.oneTimeFeeData.integrationServices, pc[0].ConvertionRate);
    this.changeCalculation(this.oneTimeFeeData.tpAndDocumentActivation, pc[0].ConvertionRate);
    this.changeCalculation(this.oneTimeFeeData.administrativeAndManagementServices, pc[0].ConvertionRate);
    this.changeCalculation(this.oneTimeFeeData.communityManagement, pc[0].ConvertionRate);
    this.changeCalculation(this.oneTimeFeeData.projectManagement, pc[0].ConvertionRate);
    this.changeCalculation(this.oneTimeFeeData.other, pc[0].ConvertionRate);

    this.changeCalculation(this.recurringFeeData.monthlySupportService, pc[0].ConvertionRate);
    this.changeCalvolumePlan(pc[0].ConvertionRate);
    this.changeCalculation(this.recurringFeeData.serviceBureau, pc[0].ConvertionRate);
    this.changeCalnonEdiFormattedFees(pc[0].ConvertionRate);
    this.changeCalculation(this.recurringFeeData.other, pc[0].ConvertionRate);
    this.previousCurrency = this.currency;
  }

  changeCalculation(data, previousrate) {
    data.forEach(e => {
      e.unitPrice = (e.unitPrice / previousrate) * this.convertedCurrency;
      e.price = (e.price / previousrate) * this.convertedCurrency;
      e.afterDiscountPrice = (e.afterDiscountPrice / previousrate) * this.convertedCurrency;
    });
  }

  changeCalvolumePlan(previousrate) {
    this.recurringFeeData.volumePlan.forEach(e => {
      if (e.id == 1 || e.id == 6 || e.id == 7) {
        e.unitPrice = (e.unitPrice / previousrate) * this.convertedCurrency;
        e.price = (e.price / previousrate) * this.convertedCurrency;
        e.afterDiscountPrice = (e.afterDiscountPrice / previousrate) * this.convertedCurrency;
      }
    });
  }

  changeCalnonEdiFormattedFees(previousrate) {
    this.recurringFeeData.nonEdiFormattedFees.forEach(e => {
      if (e.item == "Monthly Support Plan") {
        e.unitPrice = (e.unitPrice / previousrate) * this.convertedCurrency;
        e.price = (e.price / previousrate) * this.convertedCurrency;
        e.afterDiscountPrice = (e.afterDiscountPrice / previousrate) * this.convertedCurrency;
      } else {
        e.price = (e.price / previousrate) * this.convertedCurrency;
        e.afterDiscountPrice = (e.afterDiscountPrice / previousrate) * this.convertedCurrency;
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: { name: this.name, email: this.email, dealId: this.dealId, customerName: this.customerName, currency: this.currency, currencyData: this.currencyData, reportId: this.reportId, userId: this.userId },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.name = result.name;
      this.email = result.email;
      this.dealId = result.dealId;
      this.customerName = result.customerName;
      this.currency = result.currency;
      this.reportId = result.reportId;
      this.userId = result.userId;

      this.service.getDealIdData(this.dealId.toString())
        .subscribe(data => {
          let d: any[] = data;
          this.version = d.length + 1;
          this.reportId = 'PC-' + this.dealId + '-V' + this.version;
        });
      this.currencyChange('');

      if (this.reportId != '' && this.userId != 0) {
        this.service.getInputDetails(this.userId)
          .subscribe(data => {
            this.inputData = data;
            if (this.inputData.length > 0) {
              this.selectedErp = this.inputData[0].MERP;
              this.msEcommerece = this.inputData[0].MMsEcommerce;
              this.buySideCheck = this.inputData[0].MBuySide;
              this.sellSideCheck = this.inputData[0].MSellSide;
              this.buySideCreateEdiSpecForBookletTp = this.inputData[0].MBuySideEdiSpecBookletTP;
              this.buySideImplementComplianceTestProgram = this.inputData[0].MBuySideComTestProgram;
              if (this.buySideImplementComplianceTestProgram)
                this.isCompliance = true;
              else
                this.isCompliance = false;

              this.complianceTestWhoPays = this.inputData[0].MBuySideWhoPays
              this.noTPComplienceTested = this.inputData[0].MBuySideNoTPComTest;
              this.provideLabel = this.inputData[0].MBuySideProvideLabels;
              if (this.provideLabel)
                this.isProvideLabel = true;
              else
                this.isProvideLabel = false;

              this.noRetailerDivisionLabels = this.inputData[0].MBuySideRetailerNeedLabels;
              this.hubPayingForSupplier = this.inputData[0].MBuySideIsHubPaying;
              if (this.hubPayingForSupplier)
                this.isHubPaying = true;
              else
                this.isHubPaying = false;

              this.isPrivatePortal = this.inputData[0].MBuySideIsPrivatePortal;
              this.noTPusingPortal = this.inputData[0].MBuySideNoTPUsingPortal;
              this.noEdiDocs = this.inputData[0].MNoEdi;
              this.noNonEdiDocs = this.inputData[0].MNoNonEdi;
              this.noTPInScope = this.inputData[0].MnoTPInScope;
              this.selectedKBPlan = this.inputData[0].MKBPlan;
              this.isAdditionalPlanDetails = true;
              if (this.selectedKBPlan == "Drop Ship Volume Plan") {
                this.isDropShipVolumePlan = true;
                this.isMsKbPlan = false;
                this.selectedDropShipVolumePlan = this.inputData[0].MSelectedKBPlan;
                this.headerPlan = "Volume Plan";
                this.headerPlanSub = "MAX Orders"
              }
              else {
                this.isMsKbPlan = true;
                this.isDropShipVolumePlan = false;
                this.selectedMSKBPlan = this.inputData[0].MSelectedKBPlan;
                this.headerPlan = "KB Plan";
                this.headerPlanSub = "MAX Kb's";
              }
              this.dsvpSelectedServicePlan = this.inputData[0].MServicePlan;
              this.dsvpSelectedProgram = this.inputData[0].MServicePlan1;
              this.dsvpSelectedPlan = this.inputData[0].MServicePlan2;

              this.selectedPrimaryIntegrationMethod = this.inputData[0].MPrimaryInteration;
              this.moreIntegrationMethodology = this.inputData[0].MSecondaryIntegration == null || this.inputData[0].MSecondaryIntegration == '' ? false : true;
              if (this.moreIntegrationMethodology)
                this.isIntegrationMethodology = true;
              else
                this.isIntegrationMethodology = false;

              this.selectedSecondaryIntegrationMethod = this.inputData[0].MSecondaryIntegration;
              this.tpUsingOnlyEdiStandards = this.inputData[0].MTPUsingEDIStandard;
              if (this.tpUsingOnlyEdiStandards)
                this.isTpUsingEdiStandards = false;
              else
                this.isTpUsingEdiStandards = true;

              this.noElectronicallyIntegratedNonEdiTp = this.inputData[0].MElectoicallyNonEdiTp;
              if (this.noElectronicallyIntegratedNonEdiTp > 0)
                this.isEcommerceTable = true;
              else
                this.isEcommerceTable = false;

              this.contractMonths = this.inputData[0].TCVMonths;
              this.isClientNeedAdditionalSerices = this.inputData[0].MAdditionalServices;
              this.diPulse = this.inputData[0].ADiPulse;
              if (this.diPulse)
                this.additionServiceTab1 = false;
              else
                this.additionServiceTab1 = true;

              this.diMetrics = this.inputData[0].ADiMetrics;
              if (this.diMetrics)
                this.additionServiceTab2 = false;
              else
                this.additionServiceTab2 = true;

              this.serviceBureau = this.inputData[0].AServiceBureau;
              if (this.serviceBureau)
                this.additionServiceTab3 = false;
              else
                this.additionServiceTab3 = true;

              this.communicationSoftware = this.inputData[0].ACommunicationSoftware;
              if (this.communicationSoftware)
                this.additionServiceTab4 = false;
              else
                this.additionServiceTab4 = true;

              this.onsiteProfessionalServices = this.inputData[0].AOnsiteProfessionalServices;
              if (this.onsiteProfessionalServices)
                this.additionServiceTab5 = false;
              else
                this.additionServiceTab5 = true;

              if (this.diPulse || this.diMetrics || this.serviceBureau || this.communicationSoftware || this.onsiteProfessionalServices) {
                this.isAdditionalService = true;
                this.isAdditionalTab = true;
              }
              this.noDiPulseIdNeeded = this.inputData[0].ADiPulseNoAdditionalId;
              this.noBusinessRules = this.inputData[0].ADiMetricsBusinessRule;
              this.noDocUsedInBusinessRules = this.inputData[0].ADiMetricsNoDocuments;
              this.isDiMetricsHost = this.inputData[0].ADiMetricsHostCustomer;
              this.noKBHostedEachMonth = this.inputData[0].ADiMetricsNoKBAssociated;
              this.noDocServiceBureauUsers = this.inputData[0].AServiceBureauHowManyDocs;
              this.sponsorPayingServiceBureauUsers = this.inputData[0].AServiceBureauSponsorUsers;
              this.serviceBureauUsersInProject = this.inputData[0].AServiceBureauUsersInProject;
              this.docsPerMonth = this.inputData[0].AServiceBureau850855865810DocsPerMonth;
              this.docs856PerMonth = this.inputData[0].AServiceBureau856DocsPerMonth;
              this.labelsServiceBureauUsersPerMonth = this.inputData[0].AServiceBureauLabelsPerMonth;
              this.lineItemsPerMonth = this.inputData[0].AServiceBureauLineItemsUsers;
              this.identifyTheSwYes = this.inputData[0].ACommunicationSoftwareForIntegration;
              this.protocolConnectToDicenter = this.inputData[0].ACommunicationSoftwareProtocol;
              this.howManyHoursNeeded = this.inputData[0].AOnsiteProfessionalServicesHours;

              this.service.getEdiDetails(this.inputData[0].Id)
                .subscribe(data1 => {
                  if (data1.length > 0) {
                    this.ediLoop = [];
                    for (let i = 0; i < data1.length; i++) {
                      let ediModel = {
                        ediDocs: data1[i].EdiDocs,
                        noOfTP: data1[i].NoOfTP,
                        integratedERPDiPulse: data1[i].IntegratedErpDiPulse
                      }
                      this.ediLoop.push(ediModel)
                    }
                    this.totalEdiDocs = 0;
                    this.ediLoop.forEach(element => {
                      this.totalEdiDocs += element.noOfTP;
                    });
                    this.isEDI = true;
                  }
                  this.service.getNonEdiDetails(this.inputData[0].Id)
                    .subscribe(data2 => {
                      if (data2.length > 0) {
                        this.nonEdiLoop = [];
                        for (let i = 0; i < data2.length; i++) {
                          let ediModel = {
                            nonEdiDocs: data2[i].NonEdiDocs,
                            noOfNonEdiTP: data2[i].NoOfTP,
                          }
                          this.nonEdiLoop.push(ediModel)
                        }
                        this.totalNonEdiDocs = 0;
                        this.nonEdiLoop.forEach(element => {
                          this.totalNonEdiDocs += element.noOfNonEdiTP;
                        });
                        this.isNonEDI = true;
                      }
                      this.service.getEcommerceDetails(this.inputData[0].Id)
                        .subscribe(data3 => {
                          if (data3.length > 0) {
                            let m = data3.filter(a => a.Name == 'Magento');
                            this.ecommerceData[0].orders = m[0].Orders;
                            this.ecommerceData[0].product = m[0].Product;
                            this.ecommerceData[0].fullfilment = m[0].Fullfilment;
                            this.ecommerceData[0].payment = m[0].Inventory;
                            this.ecommerceData[0].inventory = m[0].Payment;

                            let s = data3.filter(a => a.Name == 'Shopify');
                            this.ecommerceData[1].orders = s[0].Orders;
                            this.ecommerceData[1].product = s[0].Product;
                            this.ecommerceData[1].fullfilment = s[0].Fullfilment;
                            this.ecommerceData[1].payment = s[0].Inventory;
                            this.ecommerceData[1].inventory = s[0].Payment;

                            let w = data3.filter(a => a.Name == 'Woo Commerce');
                            this.ecommerceData[2].orders = w[0].Orders;
                            this.ecommerceData[2].product = w[0].Product;
                            this.ecommerceData[2].fullfilment = w[0].Fullfilment;
                            this.ecommerceData[2].payment = w[0].Inventory;
                            this.ecommerceData[2].inventory = w[0].Payment;

                            let a = data3.filter(a => a.Name == 'Amazon Seller Central');
                            this.ecommerceData[3].orders = a[0].Orders;
                            this.ecommerceData[3].product = a[0].Product;
                            this.ecommerceData[3].fullfilment = a[0].Fullfilment;
                            this.ecommerceData[3].payment = a[0].Inventory;
                            this.ecommerceData[3].inventory = a[0].Payment;

                            this.ecommerceData.forEach(e => {
                              if (e.orders)
                                this.totalEcommerce += 1;
                              else if (e.product)
                                this.totalEcommerce += 1;
                              else if (e.fullfilment)
                                this.totalEcommerce += 1;
                              else if (e.payment)
                                this.totalEcommerce += 1;
                              else if (e.inventory)
                                this.totalEcommerce += 1;
                            });
                          }
                        });
                    });
                });

              this.service.getUsersFeeDetails(this.inputData[0].Id)
                .subscribe(data4 => {
                  if (data4.length > 0) {
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'communicationServices'), 'communicationServices');
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'integrationServices'), 'integrationServices');
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'tpAndDocumentActivation'), 'tpAndDocumentActivation');
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'administrativeAndManagementServices'), 'administrativeAndManagementServices');
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'communityManagement'), 'communityManagement');
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'projectManagement'), 'projectManagement');
                    this.updateOneTimeFeeSection(data4.filter(a => a.FeeType == 'OneTime' && a.Section == 'other'), 'other');

                    this.updateRecurringFeeSection(data4.filter(a => a.FeeType == 'Recurring' && a.Section == 'monthlySupportService'), 'monthlySupportService');
                    this.updateRecurringFeeSection(data4.filter(a => a.FeeType == 'Recurring' && a.Section == 'volumePlan'), 'volumePlan');
                    this.updateRecurringFeeSection(data4.filter(a => a.FeeType == 'Recurring' && a.Section == 'serviceBureau'), 'serviceBureau');
                    this.updateRecurringFeeSection(data4.filter(a => a.FeeType == 'Recurring' && a.Section == 'nonEdiFormattedFees'), 'nonEdiFormattedFees');
                    this.updateRecurringFeeSection(data4.filter(a => a.FeeType == 'Recurring' && a.Section == 'other'), 'other');
                  }
                });
            }
          });
      }
    });
  }

  updateOneTimeFeeSection(data, section) {
    data.forEach(e => {
      this.oneTimeFeeData[section][e.RowId - 1].item = e.Item;
      this.oneTimeFeeData[section][e.RowId - 1].oneTimeDeliverable = e.OneTimeDeliverable;
      this.oneTimeFeeData[section][e.RowId - 1].erp = e.Erp;
      this.oneTimeFeeData[section][e.RowId - 1].unitPrice = e.UnitPrice;
      this.oneTimeFeeData[section][e.RowId - 1].quantity = e.Quantity;
      this.oneTimeFeeData[section][e.RowId - 1].price = e.Price;
      this.oneTimeFeeData[section][e.RowId - 1].discount = e.Discount;
      this.oneTimeFeeData[section][e.RowId - 1].afterDiscountPrice = e.AfterDiscountPrice;
    });
  }

  updateRecurringFeeSection(data, section) {
    data.forEach(e => {
      this.recurringFeeData[section][e.RowId - 1].item = e.Item;
      this.recurringFeeData[section][e.RowId - 1].monthlyRecurringDeliverable = e.OneTimeDeliverable;
      this.recurringFeeData[section][e.RowId - 1].instructions = e.Erp;
      this.recurringFeeData[section][e.RowId - 1].unitPrice = e.UnitPrice;
      this.recurringFeeData[section][e.RowId - 1].quantity = e.Quantity;
      this.recurringFeeData[section][e.RowId - 1].price = e.Price;
      this.recurringFeeData[section][e.RowId - 1].discount = e.Discount;
      this.recurringFeeData[section][e.RowId - 1].afterDiscountPrice = e.AfterDiscountPrice;
    });
  }

  editPopup() {
    this.openDialog();
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

  exportExcel() {
    let d = [];
    d.push(this.oneTimeFeeData);
    d.push(this.recurringFeeData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement, { raw: true });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "Pricing Report");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

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
      if (this.validateManagedServiceTab() && this.validatePricingTab()) {
        this.isTab1 = false;
        this.isTab2 = false;
        this.isTab3 = true;
        this.isTab4 = false;
        this.addNonEdiFormattedFees2();
        this.addNonEdiFormattedFees3();
        this.addNonEdiFormattedFees4();
        this.addNonEdiFormattedFees5();
        this.changeServicePlan(this.dsvpSelectedServicePlan);
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
    window.scrollTo(0, 0);
  }

  validatePricingTab() {
    // if (this.contractMonths == 0) {
    //   this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Contract Period can not be zero' });
    //   return false;
    // } else
    if (this.isClientNeedAdditionalSerices) {
      if (this.noBusinessRules == 0 && this.diMetrics) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'A Business Rule is needed' });
        return false;
      } else if (this.noBusinessRules > 26 && this.diMetrics) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'A Business Rule should not be greater than 26' });
        return false;
      } else if (this.noDocUsedInBusinessRules > this.totalEdiDocs && this.diMetrics) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'ERROR TOO many Documents' });
        return false;
      } else if (this.noDocUsedInBusinessRules > 10 && this.diMetrics) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents used in Business Rule should not be greater than 10' });
        return false;
      } else if (this.noKBHostedEachMonth > 10000 && this.diMetrics) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of KB hosted each month should not be greater than 10000' });
        return false;
      } else if (this.noDocServiceBureauUsers == 0 && this.serviceBureau) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'ERROR- Need Document Count for Service Bureau' });
        return false;
      } else if (this.docsPerMonth >= 4000 && this.serviceBureau) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents (850, 855, 865, 810) per month should not be greater than 3999' });
        return false;
      } else if (this.docs856PerMonth >= 4000 && this.serviceBureau) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents (856) per month should not be greater than 3999' });
        return false;
      } else if (this.lineItemsPerMonth >= 4000 && this.serviceBureau) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Monthly Line Items for all Users should not be greater than 3999' });
        return false;
      } else if (this.labelsServiceBureauUsersPerMonth >= 4000 && this.serviceBureau) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Labels are the Service Bureau users planning per month should not be greater than 3999' });
        return false;
      } else
        return true;
    } else
      return true;
  }

  validateManagedServiceTab() {
    if (this.ediLoop.length > 0) {
      let loop = this.ediLoop;
      this.maxEDITpNo = Math.max(...this.ediLoop.map(d => d.noOfTP))
    }
    let valid;
    if (this.selectedSecondaryIntegrationMethod == "Embedded Adapter" || this.selectedPrimaryIntegrationMethod == "Embedded Adapter") {
      let type = this.selectedSecondaryIntegrationMethod + ' ' + (this.buySideCheck ? "Buy Side" : "Sell Side");
      let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
      valid = erp.length > 0 ? (erp[0].Valid == 1 ? true : false) : false;
    } else
      valid = true;

    if (this.dealId == 0 || !this.dealId) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Deal ID is require' });
      return false;
    } else if (this.customerName == '') {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Customer Name is require' });
      return false;
    } else if (this.noTPComplienceTested > 1500) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of trading partners is the sponsor paying to have compliance tested cannot be more than 1500, Contact your manager for special pricing' });
      return false;
    } else if (this.noRetailerDivisionLabels > 1500) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of retailer divisions need labels cannot be more than 1500, Contact your manager for special pricing' });
      return false;
    } else if (this.noTPusingPortal > 2000) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of trading partners using the Portal cannot be more than 2000, Contact your manager for special pricing' });
      return false;
    } else if (this.noEdiDocs == 0 || this.noEdiDocs == null) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Number of Documents on Scope is require' });
      return false;
    } else if (this.noTPInScope < this.maxEDITpNo) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter a number equal or higher than the max of the tps per doc' });
      return false;
    } else if ((this.selectedKBPlan == "" || !this.selectedKBPlan) && this.selectedKBPlan != "No Plan") {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose min no. of KB' });
      return false;
    } else if ((this.dsvpSelectedServicePlan == "" || !this.dsvpSelectedServicePlan) && this.selectedKBPlan != "No Plan") {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose Service Plan Offered' });
      return false;
    } else if ((this.dsvpSelectedProgram == "" || !this.dsvpSelectedProgram) && this.selectedKBPlan != "No Plan") {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose Standard Replenishment or Drop Ship Program' });
      return false;
    } else if ((this.dsvpSelectedPlan == "" || !this.dsvpSelectedPlan) && this.selectedKBPlan != "No Plan") {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose Annual Plan or Monthly Plan' });
      return false;
    } else if (this.moreIntegrationMethodology && this.selectedSecondaryIntegrationMethod == "") {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Secondary integration method is require' });
      return false;
    } else if (this.selectedSecondaryIntegrationMethod == this.selectedPrimaryIntegrationMethod) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Secondary integration method can not be same as primary integration method' });
      return false;
    } else if (!valid) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Embedded Adapter does not exist for this ERP' });
      return false;
    } else if ((this.msEcommerece == 'E-Commerce' || this.msEcommerece == 'Both') && this.totalEcommerce == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Fill values in E-commerce matrix by unchecking "Are all TPs using only EDI Standards?"' });
      return false;
    } else if (this.noElectronicallyIntegratedNonEdiTp > 0 && this.totalEcommerce == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Fill values in E-commerce matrix' });
      return false;
    } else if (this.contractMonths == null) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Contract Period required' });
      return false;
    } else {
      return true;
    }
  }

  postUserData() {
    this.totalContractValue = (this.contractMonths * this.getTotalRecurringFee(this.recurringFeeData)) + this.getTotalOneTimeFee(this.oneTimeFeeData);
    this.service.postUserData(this.name, this.email, this.dealId, this.customerName, this.currency, this.reportId, this.contractMonths, this.totalContractValue)
      .subscribe(data => {
        this.postUserInputData(data.Id);
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

  postUserInputData(id) {
    this.totalContractValue = (this.contractMonths * this.getTotalRecurringFee(this.recurringFeeData)) + this.getTotalOneTimeFee(this.oneTimeFeeData);
    let inputs = {
      MERP: this.selectedErp,
      MMsEcommerce: this.msEcommerece,
      MBuySide: this.buySideCheck,
      MSellSide: this.sellSideCheck,
      MBuySideEdiSpecBookletTP: this.buySideCreateEdiSpecForBookletTp,
      MBuySideComTestProgram: this.buySideImplementComplianceTestProgram,
      MBuySideWhoPays: this.complianceTestWhoPays,
      MBuySideNoTPComTest: this.noTPComplienceTested,
      MBuySideProvideLabels: this.provideLabel,
      MBuySideRetailerNeedLabels: this.noRetailerDivisionLabels,
      MBuySideIsHubPaying: this.hubPayingForSupplier,
      MBuySideIsPrivatePortal: this.isPrivatePortal,
      MBuySideNoTPUsingPortal: this.noTPusingPortal,
      MNoEdi: this.noEdiDocs,
      MNoNonEdi: this.noNonEdiDocs,
      MnoTPInScope: this.noTPInScope,
      MKBPlan: this.selectedKBPlan,
      MSelectedKBPlan: this.selectedKBPlan == "MS KB Plan" ? this.selectedMSKBPlan : this.selectedDropShipVolumePlan,
      MServicePlan: this.dsvpSelectedServicePlan,
      MServicePlan1: this.dsvpSelectedProgram,
      MServicePlan2: this.dsvpSelectedPlan,
      MPrimaryInteration: this.selectedPrimaryIntegrationMethod,
      MSecondaryIntegration: this.moreIntegrationMethodology ? this.selectedSecondaryIntegrationMethod : "",
      MTPUsingEDIStandard: this.tpUsingOnlyEdiStandards,
      MElectoicallyNonEdiTp: this.noElectronicallyIntegratedNonEdiTp,
      MAdditionalServices: this.isClientNeedAdditionalSerices,
      ADiPulse: this.diPulse,
      ADiMetrics: this.diMetrics,
      AServiceBureau: this.serviceBureau,
      ACommunicationSoftware: this.communicationSoftware,
      AOnsiteProfessionalServices: this.onsiteProfessionalServices,
      ADiPulseNoAdditionalId: this.noDiPulseIdNeeded,
      ADiMetricsBusinessRule: this.noBusinessRules,
      ADiMetricsNoDocuments: this.noDocUsedInBusinessRules,
      ADiMetricsHostCustomer: this.isDiMetricsHost,
      ADiMetricsNoKBAssociated: this.noKBHostedEachMonth,
      AServiceBureauHowManyDocs: this.noDocServiceBureauUsers,
      AServiceBureauSponsorUsers: this.sponsorPayingServiceBureauUsers,
      AServiceBureauUsersInProject: this.serviceBureauUsersInProject,
      AServiceBureau850855865810DocsPerMonth: this.docsPerMonth,
      AServiceBureau856DocsPerMonth: this.docs856PerMonth,
      AServiceBureauLabelsPerMonth: this.labelsServiceBureauUsersPerMonth,
      AServiceBureauLineItemsUsers: this.lineItemsPerMonth,
      ACommunicationSoftwareForIntegration: this.identifyTheSwYes,
      ACommunicationSoftwareProtocol: this.protocolConnectToDicenter,
      AOnsiteProfessionalServicesHours: this.howManyHoursNeeded,
    };

    this.service.postUserInputData(id, this.name, this.email, this.dealId, this.customerName, this.currency, this.reportId, this.contractMonths, this.totalContractValue, inputs)
      .subscribe(data => {
        if (this.ediLoop.length > 0) {
          this.ediLoop.forEach(e => {
            this.service.postEdiDocsData(data.Id, e.ediDocs, e.noOfTP, e.integratedERPDiPulse)
              .subscribe(data => {
              });
          });
        }
        if (this.nonEdiLoop.length > 0) {
          this.nonEdiLoop.forEach(e => {
            this.service.postNonEdiDocsData(data.Id, e.nonEdiDocs, e.noOfNonEdiTP)
              .subscribe(data => {
              });
          });
        }
        if (this.ecommerceData.length > 0) {
          this.ecommerceData.forEach(e => {
            this.service.postEcommerceData(data.Id, e.name, e.orders, e.product, e.fullfilment, e.inventory, e.payment)
              .subscribe(data => {
              });
          });
        }
      });
  }

  postUserReportData(id, type, section, data) {
    if (data.length > 0 && type == "OneTime") {
      data.forEach(e => {
        this.service.postUserReportData(id, type, section, e.id, e.item, e.oneTimeDeliverable, e.erp, e.unitPrice, e.quantity, e.price, e.discount, e.afterDiscountPrice)
          .subscribe(data => {
          });
      });
    } else if (data.length > 0 && type == "Recurring") {
      data.forEach(e => {
        this.service.postUserReportData(id, type, section, e.id, e.item, e.monthlyRecurringDeliverable, e.instructions, e.unitPrice, e.quantity, e.price, e.discount, e.afterDiscountPrice)
          .subscribe(data => {
          });
      });
    }
  }

  downloadReport() {
    let doc = new jsPDF();
    let totalPagesExp = "{total_pages_count_string}";
    let str1 = 'User Name: ' + this.name + ' | ' + 'Email: ' + this.email + ' | ' + 'Date: ' + new Date().toLocaleString();
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
      let a = [];
      if (this.recurringFeeData != null) {
        for (let i = 0; i < this.recurringFeeData.volumePlan.length; i++) {
          if (i == 0 || i == 5 || i == 6) {
            if (this.recurringFeeData.volumePlan[i].afterDiscountPrice != 0 && this.recurringFeeData.volumePlan[i].afterDiscountPrice != '')
              a.push(this.recurringFeeData.volumePlan[i])
          } else if (i == 1 || i == 2 || i == 4) {
            if (this.recurringFeeData.volumePlan[i].quantity != 0 && this.recurringFeeData.volumePlan[i].quantity != '')
              a.push(this.recurringFeeData.volumePlan[i])
          } else if (i == 3) {
            if (this.recurringFeeData.volumePlan[i].instructions != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (i == this.recurringFeeData.volumePlan.length - 1)
            return a;
        }
      } else
        return [];
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
      let a = [];
      if (this.recurringFeeData != null) {
        for (let i = 0; i < this.recurringFeeData.volumePlan.length; i++) {
          if (i == 0 || i == 5 || i == 6) {
            if (this.recurringFeeData.volumePlan[i].afterDiscountPrice != 0 && this.recurringFeeData.volumePlan[i].afterDiscountPrice != '')
              a.push(this.recurringFeeData.volumePlan[i])
          } else if (i == 1 || i == 2 || i == 4) {
            if (this.recurringFeeData.volumePlan[i].quantity != 0 && this.recurringFeeData.volumePlan[i].quantity != '')
              a.push(this.recurringFeeData.volumePlan[i])
          } else if (i == 3) {
            if (this.recurringFeeData.volumePlan[i].instructions != '')
              a.push(this.recurringFeeData.volumePlan[i])
          }
          if (i == this.recurringFeeData.volumePlan.length - 1)
            return a.length > 0 ? true : false;
        }
      } else
        return false;
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
    this.addPrimaryIntegrationService();
    this.addSecondaryIntegrationServices(this.noEdiDocs);
    if (!this.tpUsingOnlyEdiStandards)
      this.addOneTimeFeeOthersService();
  }

  ediChange(e) {
    this.ediLoop = [];
    for (let index = 0; index < e.target.value; index++) {
      let ediModel = {
        ediDocs: 128,
        noOfTP: 0,
        integratedERPDiPulse: 'Inbound from Trading Partner'
      }
      this.ediLoop.push(ediModel)
    }
    if (e.target.value > 0) {
      this.isEDI = true;
      if (this.buySideCreateEdiSpecForBookletTp)
        this.addTPEDIImplementationGuideCreation(this.communityManagementFeesData.filter(a => a.Name == "Building EDI Implementation Guidelines Spec")[0].Fee, e.target.value);

      let qty = this.complianceTestWhoPays == "Trading Partner (Paid)" ? 0 : (e.target.value * this.noTPComplienceTested);
      let fd = this.complieanceFeeData.filter(a => a.Name == "Compliance Testing per TP per document" && a.Scope == this.complianceTestWhoPays);
      this.addComplienceTestingPerTPperDocument(this.complianceTestWhoPays, fd[0].Fee, qty)
      this.addTpAndDocument();
    } else {
      this.isEDI = false;
      this.totalEdiDocs = 0;
      this.addComplienceTestingPerTPperDocument('', 0, 0);
      this.addPrimaryIntegrationService();
      this.addSecondaryIntegrationServices(0);
      this.addTPAndDocumentService("TP and Documents", '', '', 0, 0);
      this.projectManagement(0, 0);
    }
    //this.isNonEDI = false;
  }

  changeEdiTP(e) {
    let total = 0;
    this.ediLoop.forEach(element => {
      total += element.noOfTP;
    });
    this.totalEdiDocs = total;

    this.addPrimaryIntegrationService();
    this.addSecondaryIntegrationServices(this.noEdiDocs);
    this.addTpAndDocument();
    this.addProjectManagement();
  }

  ediDocsSelectChange(e) {
    this.addProjectManagement();
    this.addPrimaryIntegrationService();
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
    let fee = this.communityManagementFeesData.filter(a => a.Name == "Trading Partner Enablement Fee")[0].Fee;
    this.oneTimeFeeData.communityManagement[0].unitPrice = fee * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[0].quantity = qty;
    this.oneTimeFeeData.communityManagement[0].price = fee * qty * this.convertedCurrency;
    this.oneTimeFeeData.communityManagement[0].afterDiscountPrice = fee * qty * this.convertedCurrency;
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
    if (e.target.value > 0) {
      this.isNonEDI = true;
    } else {
      this.isNonEDI = false;
      this.totalNonEdiDocs = 0;
    }
  }

  changeNonEdiTP(e) {
    let total = 0;
    this.nonEdiLoop.forEach(element => {
      total += element.noOfNonEdiTP;
    });
    this.totalNonEdiDocs = total;
    if (!this.tpUsingOnlyEdiStandards)
      this.addOneTimeFeeOthersService();
  }

  buySide(e) {
    if (e.checked) {
      this.sellSideCheck = false;
    } else {
      this.sellSideCheck = true;
      this.oneTimeFeeCommunityManagement = [];
      this.buySideCreateEdiSpecForBookletTp = false;
      this.buySideImplementComplianceTestProgram = false;
      this.isCompliance = false;
      this.complianceTestWhoPays = "Trading Partner (Paid)";
      this.noTPComplienceTested = 0;
      this.provideLabel = false;
      this.noRetailerDivisionLabels = 0;
      this.hubPayingForSupplier = false;
      this.isPrivatePortal = false;
      this.noTPusingPortal = 0;
      this.isProvideLabel = false;
      this.isHubPaying = false;
      this.addComplienceTestingPerTPperDocument('', 0, 0);
      this.addSetupComplianceTestSite('', 0, 0);
      this.addTPEDIImplementationGuideCreation(0, 0);
      this.addSetupSponsorPaidPortal(0, 0);
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
      this.addVolumeForDiWeb('', 0, 0);
      this.addCreateLabels(0, 0);
    }
    this.addPrimaryIntegrationService();
    this.addSecondaryIntegrationServices(this.noEdiDocs);
    this.addTpAndDocument();
    if (!this.tpUsingOnlyEdiStandards)
      this.addOneTimeFeeOthersService();
  }

  sellSide(e) {
    if (e.checked) {
      this.buySideCheck = false;
      this.buySideCreateEdiSpecForBookletTp = false;
      this.buySideImplementComplianceTestProgram = false;
      this.isCompliance = false;
      this.complianceTestWhoPays = "Trading Partner (Paid)";
      this.noTPComplienceTested = 0;
      this.provideLabel = false;
      this.noRetailerDivisionLabels = 0;
      this.hubPayingForSupplier = false;
      this.isPrivatePortal = false;
      this.noTPusingPortal = 0;
      this.isProvideLabel = false;
      this.isHubPaying = false;
      this.addComplienceTestingPerTPperDocument('', 0, 0);
      this.addSetupComplianceTestSite('', 0, 0);
      this.addTPEDIImplementationGuideCreation(0, 0);
      this.addSetupSponsorPaidPortal(0, 0);
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
      this.addVolumeForDiWeb('', 0, 0);
      this.addCreateLabels(0, 0);
    } else {
      this.buySideCheck = true;

    }
    this.oneTimeFeeCommunityManagement = [];
    this.addPrimaryIntegrationService();
    this.addSecondaryIntegrationServices(this.noEdiDocs);
    this.addTpAndDocument();
    if (!this.tpUsingOnlyEdiStandards)
      this.addOneTimeFeeOthersService();
  }

  changeComplianceTestWhoPays(pays) {
    this.addComplianceTestAndSetup();
  }

  addComplianceTestAndSetup() {
    let fd = this.complieanceFeeData.filter(a => a.Name == "Compliance Testing per TP per document" && a.Scope == this.complianceTestWhoPays);
    let qty = this.complianceTestWhoPays == "Trading Partner (Paid)" ? 0 : (this.noEdiDocs * this.noTPComplienceTested);
    this.addComplienceTestingPerTPperDocument(this.complianceTestWhoPays, fd[0].Fee, qty)

    let fee = this.complieanceFeeData.filter(a => a.Name == "Set Up Compliance Test Site" && a.Scope == this.complianceTestWhoPays);
    let qty1 = this.complianceTestWhoPays == "Project Sponsor (Paid)" ? 1 : null;
    this.addSetupComplianceTestSite(this.complianceTestWhoPays, fee[0].Fee, qty1)
  }

  changeNoTPComplienceTested(e) {
    if (e.target.value > 0) {
      if (e.target.value > 1500)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of trading partners is the sponsor paying to have compliance tested cannot be more than 1500, Contact your manager for special pricing' });
      else {
        let qty = this.complianceTestWhoPays == "Trading Partner (Paid)" ? 0 : (this.noEdiDocs * e.target.value);
        this.addComplienceTestingPerTPperDocument(this.complianceTestWhoPays, this.oneTimeFeeData.communityManagement[3].unitPrice, qty);
      }
    } else {
      this.addComplienceTestingPerTPperDocument('', 0, 0)
    }
  }

  createEdiSpecBooklet(e) {
    if (e.checked) {
      this.addTPEDIImplementationGuideCreation(this.communityManagementFeesData.filter(a => a.Name == "Building EDI Implementation Guidelines Spec")[0].Fee, this.noEdiDocs);
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
      this.dsvpChange('');
      this.headerPlan = "KB Plan";
      this.headerPlanSub = "MAX Kb's";
      this.isAdditionalPlanDetails = true;
    }
    else if (e.value == "Drop Ship Volume Plan") {
      this.isMsKbPlan = false;
      this.isDropShipVolumePlan = true;
      this.dsvpChange('');
      this.headerPlan = "Volume Plan";
      this.headerPlanSub = "MAX Orders";
      this.isAdditionalPlanDetails = true;
    } else {
      this.isMsKbPlan = false;
      this.isDropShipVolumePlan = false;
      this.isAdditionalPlanDetails = false;
      this.selectedMSKBPlan = "1";
      this.selectedDropShipVolumePlan = "1";
      this.dsvpSelectedServicePlan = "";
      this.dsvpSelectedProgram = "";
      this.dsvpSelectedPlan = "";
      this.addDropShipPlanRecurringFee1("", 0, 0);
      this.addDropShipPlanRecurringFee2("", "", 0);
      this.addDropShipPlanRecurringFee3("");
      this.addTransactionFees2(0);
      this.addTransactionFees4(0);
      this.addTransactionFees5(0, 0);
      this.addNonEdiFormattedFees('', 0, 0);
    }
  }

  complianceTest(e) {
    if (e.checked) {
      this.isCompliance = true;
      this.addComplianceTestAndSetup();
    }
    else {
      this.isCompliance = false;
      this.noTPComplienceTested = 0;
      this.addSetupComplianceTestSite('', 0, 0);
      this.addComplienceTestingPerTPperDocument('', 0, 0);
    }
  }

  provideLabels(e) {
    if (e.checked) {
      this.isProvideLabel = true;
    }
    else {
      this.isProvideLabel = false;
      this.noRetailerDivisionLabels = 0;
      this.addCreateLabels(0, 0);
    }
  }

  lablesChange(e) {
    if (e.target.value > 0)
      if (e.target.value > 1500)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of retailer divisions need labels cannot be more than 1500, Contact your manager for special pricing' });
      else
        this.addCreateLabels(this.communityManagementFeesData.filter(a => a.Name == "Building out UCC 128 Labels for a singular Division")[0].Fee, e.target.value);
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
      this.addVolumeForDiWeb('Number of User IDs', this.communityManagementFeesData.filter(a => a.Name == "DiPulse Additional ID Fee")[0].Fee, this.noTPusingPortal);
    }
    else {
      this.addSetupSponsorPaidPortal(0, 0);
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
      this.addVolumeForDiWeb('', 0, 0);
      this.isPrivatePortal = false;
      this.noTPusingPortal = 0;
      this.isHubPaying = false;
    }
  }

  //Recurring Fees - Volume Plan - Volume for DiWeb - 7 - array 6
  addVolumeForDiWeb(instructions, unitPrice, qty) {
    this.recurringFeeData.volumePlan[6].instructions = instructions;
    this.recurringFeeData.volumePlan[6].unitPrice = qty;
    this.recurringFeeData.volumePlan[6].quantity = unitPrice * this.convertedCurrency;
    this.recurringFeeData.volumePlan[6].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.volumePlan[6].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  privatePortal(e) {
    if (e.checked) {
      this.addSetupSponsorPaidPortal(this.communityManagementFeesData.filter(a => a.Name == "Setup of Private Portal for Sponsor")[0].Fee, 1);
      this.addTradingPartnerFeesSponsorPaidPortal(this.communityManagementFeesData.filter(a => a.Name == "Sponsor paid ID to Private Portal")[0].Fee, this.noTPusingPortal);
    }
    else {
      this.addSetupSponsorPaidPortal(0, 0);
      this.addTradingPartnerFeesSponsorPaidPortal(0, 0);
    }
  }

  tpPortalChange(e) {
    if (e.target.value > 0) {
      if (e.target.value > 2000)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of trading partners using the Portal cannot be more than 2000, Contact your manager for special pricing' });
      else {
        this.addTradingPartnerFeesSponsorPaidPortal(this.communityManagementFeesData.filter(a => a.Name == "Sponsor paid ID to Private Portal")[0].Fee, this.noTPusingPortal);
        this.addVolumeForDiWeb('Number of User IDs', this.communityManagementFeesData.filter(a => a.Name == "DiPulse Additional ID Fee")[0].Fee, this.noTPusingPortal);
      }
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
      this.addSecondaryIntegrationServices(this.noEdiDocs);
    }
    else {
      this.isIntegrationMethodology = false;
      this.selectedSecondaryIntegrationMethod = '';
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
    this.addPrimaryIntegrationService();
  }

  changeSecondaryMethod(secondary) {
    this.selectedSecondaryIntegrationMethod = secondary;
    this.checkIntegrationMethod();
    this.addSecondaryIntegrationServices(this.noEdiDocs);
  }

  checkIntegrationMethod() {
    if (this.selectedSecondaryIntegrationMethod == this.selectedPrimaryIntegrationMethod)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Secondary integration method can not be same as primary integration method' });
    else
      if (this.selectedSecondaryIntegrationMethod == "Embedded Adapter" || this.selectedPrimaryIntegrationMethod == "Embedded Adapter") {
        let type = this.selectedSecondaryIntegrationMethod + ' ' + (this.buySideCheck ? "Buy Side" : "Sell Side");
        let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
        let valid = erp.length > 0 ? (erp[0].Valid == 1 ? true : false) : false;
        if (!valid)
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Embedded Adapter does not exist for this ERP' });
      }
  }

  tpUsingEdiStandards(e) {
    if (e.checked) {
      this.isTpUsingEdiStandards = false;
      this.isEcommerceTable = false;
      this.totalEcommerce = 0;
      this.addOneTimeFeeOthers('', '', '', 0, 0);
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
    this.addTpAndDocument();
    if (this.oneTimeFeeData.other[3].oneTimeDeliverable != "") {
      let price = (this.oneTimeFeeData.other[3].price * this.recurringFeeData.monthlySupportService[0].unitPrice) / 100;
      this.addNonEdiFormattedFees(this.recurringFeeData.monthlySupportService[0].instructions,
        this.recurringFeeData.monthlySupportService[0].unitPrice, price);
    }
    this.addProjectManagement();
    this.addNonEdiFormattedFees2();
    this.addNonEdiFormattedFees3();
    this.addNonEdiFormattedFees4();
    this.addNonEdiFormattedFees5();
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
        fixedFee = k[0].MonthlyPriceByMonthlyPlan;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedFee = k[0].MonthlyPrice3ByAnnualPlan;
      } else {
        fixedFee = 0;
      }

      let instructions;
      if (this.dsvpSelectedProgram == "Standard Replenishment" && this.dsvpSelectedPlan == "Annual Plan")
        instructions = "Overage when annual KB exceeded";
      else if (this.dsvpSelectedProgram != "Standard Replenishment" && this.dsvpSelectedPlan == "Annual Plan")
        instructions = "Overage when annual Orders exceeded";
      else if (this.dsvpSelectedProgram == "Standard Replenishment" && this.dsvpSelectedPlan == "Monthly Plan")
        instructions = "Overage when monthly KB exceeded";
      else if (this.dsvpSelectedProgram != "Standard Replenishment" && this.dsvpSelectedPlan == "Monthly Plan")
        instructions = "Overage when monthly Orders exceeded";

      let fixedRate;
      if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        fixedRate = k[0].OverKBRateMonthlyPlan;
      } else if (deliverable == "Measured in Kilo Bytes" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.msKbPlansData.filter(a => a.Id == this.selectedMSKBPlan);
        fixedRate = k[0].OverKBRateAnnualPlan;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Monthly Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedRate = k[0].OverageFeeByMonthlyPlan;
      } else if (deliverable == "Measured in 850/Orders" && this.dsvpSelectedPlan == "Annual Plan") {
        let k = this.dropShipVolumePlanData.filter(a => a.Id == this.selectedDropShipVolumePlan);
        fixedRate = k[0].OverageFee5ByAnnualPlan;
      } else {
        fixedRate = 0;
      }

      this.addDropShipPlanRecurringFee1(deliverable, maxKB, fixedFee);
      this.addDropShipPlanRecurringFee2(deliverable, instructions, fixedRate);
      if (this.dsvpSelectedProgram != "Standard Replenishment") {
        this.addDropShipPlanRecurringFee3("No Fee");
        this.addTransactionFees2(this.recurringFeeData.volumePlan[0].quantity == 0 ? 0 : this.communityManagementFeesData.filter(a => a.Name == "Transaction Fees")[0].Fee);
        this.addTransactionFees4(this.recurringFeeData.volumePlan[0].quantity == 0 ? 0 : this.communityManagementFeesData.filter(a => a.Name == "Transaction Fees2")[0].Fee);
        this.addTransactionFees5(this.recurringFeeData.volumePlan[0].quantity == 0 ? 0 : this.communityManagementFeesData.filter(a => a.Name == "Transaction Fees3")[0].Fee, 1);
      }
      else {
        this.addDropShipPlanRecurringFee3("");
        this.addTransactionFees2(0);
        this.addTransactionFees4(0);
        this.addTransactionFees5(0, 0);
      }
      if (this.oneTimeFeeData.other[3].oneTimeDeliverable != "") {
        let price = (this.oneTimeFeeData.other[3].price * this.recurringFeeData.monthlySupportService[0].unitPrice) / 100;
        this.addNonEdiFormattedFees(this.recurringFeeData.monthlySupportService[0].instructions,
          this.recurringFeeData.monthlySupportService[0].unitPrice, price)
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
  addDropShipPlanRecurringFee2(deliverable, instructions, fixedRate) {
    this.recurringFeeData.volumePlan[1].monthlyRecurringDeliverable = deliverable;
    this.recurringFeeData.volumePlan[1].instructions = instructions;
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
    this.recurringFeeData.volumePlan[5].afterDiscountPrice = price * this.convertedCurrency;
  }

  //Recurring Fees - Volume Plan - 	855/ORDRSP, 810/INVOIC and 856/DESADV - 4 - array 3
  addDropShipPlanRecurringFee3(instructions) {
    this.recurringFeeData.volumePlan[3].instructions = instructions;
  }

  //Recurring Fees - NON EDI Formatted Fees - Integration Service NON-EDI - 1 - array 0
  addNonEdiFormattedFees(instructions, unitPrice, price) {
    this.recurringFeeData.nonEdiFormattedFees[0].instructions = instructions;
    this.recurringFeeData.nonEdiFormattedFees[0].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.nonEdiFormattedFees[0].price = price * this.convertedCurrency;
    this.recurringFeeData.nonEdiFormattedFees[0].afterDiscountPrice = price * this.convertedCurrency;
  }

  addPrimaryIntegrationService() {
    let tp = 0;
    this.ediLoop.forEach(e => {
      if (e.integratedERPDiPulse == "Outbound from Trading Partner" || e.integratedERPDiPulse == "Inbound from Trading Partner") {
        tp += 1;
      }
    });
    let type = this.selectedPrimaryIntegrationMethod + ' ' + (this.buySideCheck == true ? "Buy Side" : "Sell Side");
    let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
    let qty = erp[0].Methodology.toString().indexOf('Per Document Fee') == -1 ? 1 : tp;
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
    if (e != "") {
      this.dsvpSelectedServicePlan = e;
      let instructions = this.dsvpSelectedServicePlan + ' Support';
      let up;
      if (this.dsvpSelectedServicePlan == "Standard")
        up = this.communityManagementFeesData.filter(a => a.Name == "Standard")[0].Fee;
      else if (this.dsvpSelectedServicePlan == "Advanced")
        up = this.communityManagementFeesData.filter(a => a.Name == "Advanced")[0].Fee;
      else if (this.dsvpSelectedServicePlan == "Premium")
        up = this.communityManagementFeesData.filter(a => a.Name == "Premium")[0].Fee;

      let price = ((this.oneTimeFeeData.integrationServices[0].price + this.oneTimeFeeData.integrationServices[1].price) * up) / 100;
      this.addMSPIntegrationService(instructions, up, price);

      let price1 = ((this.oneTimeFeeData.communityManagement[0].price + this.oneTimeFeeData.communityManagement[1].price
        + this.oneTimeFeeData.communityManagement[2].price + this.oneTimeFeeData.communityManagement[3].price
        + this.oneTimeFeeData.communityManagement[4].price + this.oneTimeFeeData.communityManagement[5].price
        + this.oneTimeFeeData.communityManagement[6].price) * up) / 100;
      this.addMSPCommunityManagement(instructions, up, price1);

      let price2 = ((this.oneTimeFeeData.communicationServices[0].price + this.oneTimeFeeData.communicationServices[1].price) * up) / 100;
      this.addMSPCommunicationsServices(instructions, up, price2);
    } else {
      this.addMSPIntegrationService('', 0, 0);
      this.addMSPCommunityManagement('', 0, 0);
      this.addMSPCommunicationsServices('', 0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Communications Services - 1 - array 0
  addMSPCommunicationsServices(instructions, unitPrice, price) {
    this.recurringFeeData.monthlySupportService[0].instructions = instructions;
    this.recurringFeeData.monthlySupportService[0].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[0].price = price * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[0].quantity = "";
    this.recurringFeeData.monthlySupportService[0].afterDiscountPrice = price * this.convertedCurrency;
  }

  //Recurring Fees - Monthly Support Service - Integration Service - 2 - array 1
  addMSPIntegrationService(instructions, unitPrice, price) {
    this.recurringFeeData.monthlySupportService[1].instructions = instructions;
    this.recurringFeeData.monthlySupportService[1].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[1].price = price * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[1].quantity = "";
    this.recurringFeeData.monthlySupportService[1].afterDiscountPrice = price * this.convertedCurrency;
  }

  //Recurring Fees - Monthly Support Service - Community management - 3 - array 2
  addMSPCommunityManagement(instructions, unitPrice, price) {
    this.recurringFeeData.monthlySupportService[2].instructions = instructions;
    this.recurringFeeData.monthlySupportService[2].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[2].price = price * this.convertedCurrency;
    this.recurringFeeData.monthlySupportService[2].quantity = "";
    this.recurringFeeData.monthlySupportService[2].afterDiscountPrice = price * this.convertedCurrency;
  }

  noElectronicallyIntegratedNonEdiTpChange(e) {
    if (e.target.value == null || e.target.value == 0) {
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
      this.addNonEdiFormattedFees2();
      this.addNonEdiFormattedFees3();
      this.addNonEdiFormattedFees4();
      this.addNonEdiFormattedFees5();
    }
    else {
      this.isEcommerceTable = true;
      this.addTpAndDocument();
    }
    this.addProjectManagement();
  }

  addTpAndDocument() {
    let type = this.buySideCheck == true ? "Buy Side - per document (all TP's)" : "Sell Side - per document per TP";
    let erp = this.erpData.filter(a => a.Name == this.selectedErp && a.Type.toString().indexOf(type.toString()) !== -1);
    let qty;
    if (type == "Buy Side - per document (all TP's)")
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
    let amount = this.varienceFee.filter(a => a.Size == erp[0].Size && a.Type == (this.buySideCheck == true ? "Buy Side" : "Sell Side"))[0].Fee;
    let qty = this.totalNonEdiDocs + this.totalEcommerce;
    this.addOneTimeFeeOthers("Non-EDI TP Integration", type, '', amount, qty)
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
    if (this.oneTimeFeeData.other[3].oneTimeDeliverable != "") {
      let price = (this.oneTimeFeeData.other[3].price * this.recurringFeeData.monthlySupportService[0].unitPrice) / 100;
      this.addNonEdiFormattedFees(this.recurringFeeData.monthlySupportService[0].instructions,
        this.recurringFeeData.monthlySupportService[0].unitPrice, price)
    }
  }

  addProjectManagement() {
    //if (this.totalEcommerce > 0) {
    let transactionType = 0;
    let tp = this.noTPInScope;
    this.ediLoop.forEach(e => {
      if (e.integratedERPDiPulse == "Outbound from Trading Partner" || e.integratedERPDiPulse == "Inbound from Trading Partner") {
        transactionType += 1;
        //tp += e.noOfTP; 
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

    let valuePMHours = ecom.length > 0 ? ecom[0].PMHours : 0;
    let finalTotalPMHours = adjustedPmHours + valuePMHours;
    this.projectManagement(this.communityManagementFeesData.filter(a => a.Name == "Project Management")[0].Fee, finalTotalPMHours);
    // }
    // else
    //   this.projectManagement(0, 0);
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
    let magento = this.ecommerceData.filter(a => a.name == "Magento");
    let count = 0;
    count = magento[0].orders ? 1 : 0;
    count += magento[0].payment ? 1 : 0;
    count += magento[0].product ? 1 : 0;
    count += magento[0].fullfilment ? 1 : 0;
    count += magento[0].inventory ? 1 : 0;

    let price = 0;
    let fee = this.communityManagementFeesData.filter(a => a.Name == "Magento")[0].Fee;
    let aFee = this.communityManagementFeesData.filter(a => a.Name == "Ecommerce Additional Fees")[0].Fee;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = fee;
    else if (count > 1)
      price = fee + ((count - 1) * aFee);

    if (magento[0].orders || magento[0].payment || magento[0].product || magento[0].fullfilment || magento[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[1].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[1].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[1].afterDiscountPrice = price * this.convertedCurrency;
    } else {
      this.recurringFeeData.nonEdiFormattedFees[1].quantity = 0;
      this.recurringFeeData.nonEdiFormattedFees[1].price = 0;
      this.recurringFeeData.nonEdiFormattedFees[1].afterDiscountPrice = 0;
    }
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 3 - array 2
  addNonEdiFormattedFees3() {
    let shopify = this.ecommerceData.filter(a => a.name == "Shopify");
    let count = 0;
    count = shopify[0].orders ? 1 : 0;
    count += shopify[0].payment ? 1 : 0;
    count += shopify[0].product ? 1 : 0;
    count += shopify[0].fullfilment ? 1 : 0;
    count += shopify[0].inventory ? 1 : 0;

    let price = 0;
    let fee = this.communityManagementFeesData.filter(a => a.Name == "Shopify")[0].Fee;
    let aFee = this.communityManagementFeesData.filter(a => a.Name == "Ecommerce Additional Fees")[0].Fee;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = fee;
    else if (count > 1)
      price = fee + ((count - 1) * aFee);

    if (shopify[0].orders || shopify[0].payment || shopify[0].product || shopify[0].fullfilment || shopify[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[2].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[2].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[2].afterDiscountPrice = price * this.convertedCurrency;
    } else {
      this.recurringFeeData.nonEdiFormattedFees[2].quantity = 0;
      this.recurringFeeData.nonEdiFormattedFees[2].price = 0;
      this.recurringFeeData.nonEdiFormattedFees[2].afterDiscountPrice = 0;
    }
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 4 - array 3
  addNonEdiFormattedFees4() {
    let wc = this.ecommerceData.filter(a => a.name == "Woo Commerce");
    let count = 0;
    count = wc[0].orders ? 1 : 0;
    count += wc[0].payment ? 1 : 0;
    count += wc[0].product ? 1 : 0;
    count += wc[0].fullfilment ? 1 : 0;
    count += wc[0].inventory ? 1 : 0;

    let price = 0;
    let fee = this.communityManagementFeesData.filter(a => a.Name == "Woo Commerce")[0].Fee;
    let aFee = this.communityManagementFeesData.filter(a => a.Name == "Ecommerce Additional Fees")[0].Fee;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = fee;
    else if (count > 1)
      price = fee + ((count - 1) * aFee);

    if (wc[0].orders || wc[0].payment || wc[0].product || wc[0].fullfilment || wc[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[3].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[3].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[3].afterDiscountPrice = price * this.convertedCurrency;
    } else {
      this.recurringFeeData.nonEdiFormattedFees[3].quantity = 0;
      this.recurringFeeData.nonEdiFormattedFees[3].price = 0;
      this.recurringFeeData.nonEdiFormattedFees[3].afterDiscountPrice = 0;
    }
  }

  //Recurring Fees - NON EDI Formatted Fees - 	Ecommerce Web Site Traffic - 5 - array 4
  addNonEdiFormattedFees5() {
    let asc = this.ecommerceData.filter(a => a.name == "Amazon Seller Central");
    let count = 0;
    count = asc[0].orders ? 1 : 0;
    count += asc[0].payment ? 1 : 0;
    count += asc[0].product ? 1 : 0;
    count += asc[0].fullfilment ? 1 : 0;
    count += asc[0].inventory ? 1 : 0;

    let price = 0;
    let fee = this.communityManagementFeesData.filter(a => a.Name == "Amazon Seller Central")[0].Fee;
    let aFee = this.communityManagementFeesData.filter(a => a.Name == "Ecommerce Additional Fees")[0].Fee;
    if (count == 0)
      price = 0;
    else if (count == 1)
      price = fee;
    else if (count > 1)
      price = fee + ((count - 1) * aFee);

    if (asc[0].orders || asc[0].payment || asc[0].product || asc[0].fullfilment || asc[0].inventory) {
      this.recurringFeeData.nonEdiFormattedFees[4].quantity = count;
      this.recurringFeeData.nonEdiFormattedFees[4].price = price * this.convertedCurrency;
      this.recurringFeeData.nonEdiFormattedFees[4].afterDiscountPrice = price * this.convertedCurrency;
    } else {
      this.recurringFeeData.nonEdiFormattedFees[4].quantity = 0;
      this.recurringFeeData.nonEdiFormattedFees[4].price = 0;
      this.recurringFeeData.nonEdiFormattedFees[4].afterDiscountPrice = 0;
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
    this.noTPInScope = 0;
    this.contractMonths = 0;
    this.ecommerceData = [
      { "name": "Magento", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
      { "name": "Shopify", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
      { "name": "Woo Commerce", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false },
      { "name": "Amazon Seller Central", "orders": false, "product": false, "fullfilment": false, "inventory": false, "payment": false }
    ];
    this.service.getOneTimeFeeData().then(data => this.oneTimeFeeData = data);
    this.service.getRecurringFeeData().then(data => this.recurringFeeData = data);
    this.addPrimaryIntegrationService();
  }

  addServices(e, index) {
    this.isAdditionalTab = true;
    if (e.checked && index == 1) {
      this.additionServiceTab1 = false;
      let fee = this.communityManagementFeesData.filter(a => a.Name == "DiPulse Set Up Fee")[0].Fee;
      this.addAdminAndManagementService(fee, fee, 1);
    } else if (!e.checked && index == 1) {
      this.additionServiceTab1 = true;
      this.noDiPulseIdNeeded = 0;
      this.addMSPAdditionalUserAccount(0, 0);
      this.addAdminAndManagementService(0, 0, 0);
    } else if (e.checked && index == 2) {
      this.additionServiceTab2 = false;
      let fee = this.communityManagementFeesData.filter(a => a.Name == "Dimetrics Setup")[0].Fee;
      this.addDimetricsSetup(fee, 1, fee);
      this.addMSPDimetrics();
    } else if (!e.checked && index == 2) {
      this.additionServiceTab2 = true;
      this.addDimetricsSetup(0, 0, 0);
      this.noBusinessRules = 0;
      this.noDocUsedInBusinessRules = 0;
      this.isDiMetricsHost = false;
      this.noKBHostedEachMonth = 0;
      this.addMSPDimetrics();
      this.emptyDimetricsOtherTable();
    } else if (e.checked && index == 3) {
      this.additionServiceTab3 = false;
      let fee = this.communityManagementFeesData.filter(a => a.Name == "Service Bureau 1st Document Build")[0].Fee;
      this.addServiceBureauSetup(fee, 1, fee);
    } else if (!e.checked && index == 3) {
      this.additionServiceTab3 = true;
      this.noDocServiceBureauUsers = 0;
      this.sponsorPayingServiceBureauUsers = 'No';
      this.serviceBureauUsersInProject = 0;
      this.docsPerMonth = 0;
      this.docs856PerMonth = 0;
      this.lineItemsPerMonth = 0;
      this.labelsServiceBureauUsersPerMonth = 0;
      this.editServiceBureauDocs1(0, 0);
      this.editServiceBureauDocs2(0, 0);
      this.editServiceBureauDocs3(0, 0);
      this.editServiceBureauDocs4(0, 0);
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
    this.addMSPAdditionalUserAccount(0, 0);
    this.addAdminAndManagementService(0, 0, 0);

    this.additionServiceTab2 = true;
    this.noBusinessRules = 0;
    this.noDocUsedInBusinessRules = 0;
    this.isDiMetricsHost = false;
    this.noKBHostedEachMonth = 0;
    this.addMSPDimetrics();
    this.emptyDimetricsOtherTable();
    this.addDimetricsSetup(0, 0, 0);

    this.additionServiceTab3 = true;
    this.noDocServiceBureauUsers = 0;
    this.sponsorPayingServiceBureauUsers = 'No';
    this.serviceBureauUsersInProject = 0;
    this.docsPerMonth = 0;
    this.docs856PerMonth = 0;
    this.lineItemsPerMonth = 0;
    this.labelsServiceBureauUsersPerMonth = 0;
    this.editServiceBureauDocs1(0, 0);
    this.editServiceBureauDocs2(0, 0);
    this.editServiceBureauDocs3(0, 0);
    this.editServiceBureauDocs4(0, 0);
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
    if (e.target.value > 0) {
      this.addMSPAdditionalUserAccount(this.communityManagementFeesData.filter(a => a.Name == "DiPulse Additional ID Fee")[0].Fee, e.target.value)
    } else {
      this.addMSPAdditionalUserAccount(0, 0);
    }
  }

  noBusinessRulesChange(e) {
    if (e.target.value == 0)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'A Business Rule is needed' });
    else if (e.target.value > 26)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'A Business Rule should not be greater than 26' });

    if (e.target.value > 0)
      this.addMSPDimetrics();
  }

  noDocUsedInBusinessRulesChange(e) {
    if (e.target.value > this.totalEdiDocs)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'ERROR TOO many Documents' });
    else if (e.target.value > 10)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents used in Business Rule should not be greater than 10' });

    if (e.target.value > 0)
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
    if (e.target.value > 0 && e.target.value <= 10000)
      this.addDimetricsOtherTable();
    else {
      if (e.target.value > 10000)
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'No. of KB hosted each month should not be greater than 10000' });

      this.emptyDimetricsOtherTable();
    }
  }

  noTPInScopeChange(e) {
    let fee = this.communityManagementFeesData.filter(a => a.Name == "Trading Community")[0].Fee;
    if (e.target.value > 0) {
      this.maxEDITpNo = Math.max(...this.ediLoop.map(d => d.noOfTP))
      if (e.target.value < this.maxEDITpNo) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter a number equal or higher than the max of the tps per doc' });
        this.addMSPTradingCommunity(fee, 0);
      }
      else {
        this.addMSPTradingCommunity(fee, e.target.value);
        this.addTradingPartnerEnable(e.target.value);
      }
      this.addProjectManagement();
    } else {
      this.noTPInScope = 0;
      this.addProjectManagement();
      this.addMSPTradingCommunity(fee, 0);
      this.addTradingPartnerEnable(0);
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
        if (this.noTPInScope <= fee[i].TradingPartnerCommunitySize) {
          up = fee[i].Fee;
          this.recurringFeeData.monthlySupportService[3].unitPrice = up * this.convertedCurrency;
          this.recurringFeeData.monthlySupportService[3].price = up * this.convertedCurrency;
          this.recurringFeeData.monthlySupportService[3].quantity = 1;
          this.recurringFeeData.monthlySupportService[3].afterDiscountPrice = up * this.convertedCurrency;
          break;
        }
      }
    } else {
      this.recurringFeeData.monthlySupportService[3].unitPrice = 0;
      this.recurringFeeData.monthlySupportService[3].price = 0;
      this.recurringFeeData.monthlySupportService[3].quantity = 0;
      this.recurringFeeData.monthlySupportService[3].afterDiscountPrice = 0;
    }
  }

  //Recurring Fees - Other -Custom Tables - 1 -array 0
  addDimetricsOtherTable() {
    let fee = 0;
    if (this.noKBHostedEachMonth > 0)
      fee = this.diametricsThirdPartData.filter(a => a.Min <= this.noKBHostedEachMonth && a.Max >= this.noKBHostedEachMonth)[0].Fee;

    this.recurringFeeData.other[0].unitPrice = fee * this.convertedCurrency;
    this.recurringFeeData.other[0].price = fee * this.convertedCurrency;
    this.recurringFeeData.other[0].quantity = 1;
    this.recurringFeeData.other[0].afterDiscountPrice = fee * this.convertedCurrency;
  }

  //Recurring Fees - Other -Custom Tables - 1 -array 0
  emptyDimetricsOtherTable() {
    this.recurringFeeData.other[0].unitPrice = 0;
    this.recurringFeeData.other[0].price = 0;
    this.recurringFeeData.other[0].quantity = 0;
    this.recurringFeeData.other[0].afterDiscountPrice = 0;
  }

  noDocServiceBureauUsersChange(e) {
    if (e.target.value == 0)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'ERROR- Need Document Count for Service Bureau' });
    else {
      if (e.target.value > 1) {
        let fee1 = this.communityManagementFeesData.filter(a => a.Name == "Setup Additional Doc")[0].Fee;
        let price = fee1 * (e.target.value - 1);
        this.addServiceBureauSetupAdditionalDoc(fee1, (e.target.value - 1), price);
      } else {
        this.addServiceBureauSetupAdditionalDoc(0, 0, 0);
      }
    }
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
    if (e == 'No') {
      this.serviceBureauUsersInProject = 0;
      this.docsPerMonth = 0;
      this.docs856PerMonth = 0;
      this.lineItemsPerMonth = 0;
      this.labelsServiceBureauUsersPerMonth = 0;
      this.editServiceBureauDocs1(0, 0);
      this.editServiceBureauDocs2(0, 0);
      this.editServiceBureauDocs3(0, 0);
      this.editServiceBureauDocs4(0, 0);
    }
  }

  docsPerMonthChange(e) {
    if (e.target.value >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents (850, 810, 855, 865) per month should not be greater than 3999' });
    else {
      if (e.target.value > 0)
        this.addServiceBureauDocs1();
      else
        this.editServiceBureauDocs1(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 1 -array 0
  addServiceBureauDocs1() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Documents (850, 810, 855, 865)" && a.Min <= this.docsPerMonth && a.Max >= this.docsPerMonth);
    let up = doc.length > 0 ? doc[0].Fee : 0;
    let qty = this.docsPerMonth * this.serviceBureauUsersInProject;
    this.editServiceBureauDocs1(up, qty)
  }

  editServiceBureauDocs1(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[0].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[0].quantity = qty;
    this.recurringFeeData.serviceBureau[0].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[0].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  docs856PerMonthChange(e) {
    if (e.target.value >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Documents (856) per month should not be greater than 3999' });
    else {
      if (e.target.value > 0)
        this.addServiceBureauDocs2();
      else
        this.editServiceBureauDocs2(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 2 -array 1
  addServiceBureauDocs2() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Documents (856)" && a.Min <= this.docs856PerMonth && a.Max >= this.docs856PerMonth);
    let up = doc.length > 0 ? doc[0].Fee : 0;
    let qty = this.docs856PerMonth * this.serviceBureauUsersInProject;
    this.editServiceBureauDocs2(up, qty);
  }

  editServiceBureauDocs2(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[1].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[1].quantity = qty;
    this.recurringFeeData.serviceBureau[1].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[1].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  lineItemsPerMonthChange(e) {
    if (e.target.value >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Monthly Line Items for all Users should not be greater than 3999' });
    else {
      if (e.target.value > 0)
        this.addServiceBureauDocs3();
      else
        this.editServiceBureauDocs3(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 3 -array 2
  addServiceBureauDocs3() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Line Items" && a.Min <= this.lineItemsPerMonth && a.Max >= this.lineItemsPerMonth);
    let up = doc.length > 0 ? doc[0].Fee : 0;
    this.editServiceBureauDocs3(up, this.lineItemsPerMonth);
  }

  editServiceBureauDocs3(unitPrice, qty) {
    this.recurringFeeData.serviceBureau[2].unitPrice = unitPrice * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[2].quantity = qty;
    this.recurringFeeData.serviceBureau[2].price = unitPrice * qty * this.convertedCurrency;
    this.recurringFeeData.serviceBureau[2].afterDiscountPrice = unitPrice * qty * this.convertedCurrency;
  }

  labelsServiceBureauUsersPerMonthChange(e) {
    if (e.target.value >= 4000)
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Labels are the Service Bureau users planning per month should not be greater than 3999' });
    else {
      if (e.target.value > 0)
        this.addServiceBureauDocs4();
      else
        this.editServiceBureauDocs4(0, 0);
    }
  }

  //Recurring Fees - Monthly Support Service - Service Bureau - 4 -array 3
  addServiceBureauDocs4() {
    let doc = this.serviceBureauFeesData.filter(a => a.Item == "Labels (does not include shipping costs)" && a.Min <= this.labelsServiceBureauUsersPerMonth && a.Max >= this.labelsServiceBureauUsersPerMonth);
    let up = doc.length > 0 ? doc[0].Fee : 0;
    this.editServiceBureauDocs4(up, this.labelsServiceBureauUsersPerMonth);
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
      up = this.communicationFeesData.filter(a => a.Name == "DiConnect Lite")[0].Fee;
    else if (this.identifyTheSwYes == "DiConnect Enterprice")
      up = this.communicationFeesData.filter(a => a.Name == "DiConnect Enterprise")[0].Fee;
    else
      up = 0;
    this.addSoftware(this.identifyTheSwYes, up, 1)
  }

  protocolConnectToDicenterChange(e) {
    let up;
    if (this.protocolConnectToDicenter == "AS2")
      up = this.communicationFeesData.filter(a => a.Name == "AS2")[0].Fee;
    else if (this.protocolConnectToDicenter == "FTP")
      up = this.communicationFeesData.filter(a => a.Name == "FTP")[0].Fee;
    else if (this.protocolConnectToDicenter == "SFTP")
      up = this.communicationFeesData.filter(a => a.Name == "SFTP")[0].Fee;
    else if (this.protocolConnectToDicenter == "FTP/s")
      up = this.communicationFeesData.filter(a => a.Name == "FTP/S")[0].Fee;
    else if (this.protocolConnectToDicenter == "Web Services")
      up = this.communicationFeesData.filter(a => a.Name == "Web Services")[0].Fee;
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
    if (e.target.value > 0)
      this.addDiCentralHours(this.communityManagementFeesData.filter(a => a.Name == "DiCentral hours")[0].Fee, this.howManyHoursNeeded);
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
    if (value > this.discountData[0].Discount) {
      let msg = 'Discount cannot exceed ' + this.discountData[0].Discount + '%. You need to get approval from Steve Scala.'
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
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

  newReport() {
    if (confirm("Are you sure you want to create new report that leads to refresh application?")) {
      window.location.reload();
    }
  }


}

@Component({
  selector: 'user-dialog',
  templateUrl: 'userDialog.html',
  providers: [MessageService, HomeService],
})
export class DialogOverviewExampleDialog {
  form: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(dicentral)\.com$')
    ])),
    dealId: new FormControl('', [Validators.required]),
    customerName: new FormControl('', [Validators.required]),
    currency: new FormControl('USD', [Validators.required]),
  });

  form1: FormGroup = new FormGroup({
    reportId: new FormControl('', Validators.required)
  });
  isFirstEntry = true;
  isExisting = false;
  isNew = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: HomeService, private messageService: MessageService) {
    this.form.controls['userName'].setValue(this.data.name);
    this.form.controls['email'].setValue(this.data.email);
    this.form.controls['dealId'].setValue(this.data.dealId);
    this.form.controls['customerName'].setValue(this.data.customerName);
    this.form.controls['currency'].setValue(this.data.currency);
  }

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
      this.data.reportId = '';
      this.data.userId = 0;
      this.onNoClick();
    }
  }

  firstEntry(type) {
    this.isFirstEntry = false;
    if (type == 'new') {
      this.isNew = true;
      this.isExisting = false;
    } else {
      this.isNew = false;
      this.isExisting = true;
    }
  }

  goBack() {
    this.form.reset();
    this.isFirstEntry = true;
    this.isNew = false;
    this.isExisting = false;
  }

  submit1() {
    let form1 = this.form1.value;
    this.service.getReportDetails(form1.reportId)
      .subscribe(data => {
        if (data == null)
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Quotation details not available.Please enter valid Quotation number' });
        else {
          this.data.name = data.Name;
          this.data.email = data.Email;
          this.data.dealId = data.DealId;
          this.data.customerName = data.CustomerName;
          this.data.currency = data.Currency;
          this.data.reportId = data.ReportId;
          this.data.userId = data.Id;
          this.onNoClick();
        }
      });
  }


}