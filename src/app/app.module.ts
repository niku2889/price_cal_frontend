import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HomeComponent, DialogOverviewExampleDialog } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from './admin/header/header.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { MenuListItemComponent } from './admin/menu-list-item/menu-list-item.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ErpComponent } from './admin/tables/erp/erp.component';
import { EdiDocsComponent } from './admin/tables/edi-docs/edi-docs.component';
import { MsKbPlanComponent } from './admin/tables/ms-kb-plan/ms-kb-plan.component';
import { DropShipVolumePlanComponent } from './admin/tables/drop-ship-volume-plan/drop-ship-volume-plan.component';
import { AdminCMFComponent } from './admin/tables/admin-cmf/admin-cmf.component';
import { CommFeesComponent } from './admin/tables/comm-fees/comm-fees.component';
import { ComplainceFeeComponent } from './admin/tables/complaince-fee/complaince-fee.component';
import { ConvertionComponent } from './admin/tables/convertion/convertion.component';
import { DiametricsFeesComponent } from './admin/tables/diametrics-fees/diametrics-fees.component';
import { DiametricsFees2Component } from './admin/tables/diametrics-fees2/diametrics-fees2.component';
import { EcomProcessComponent } from './admin/tables/ecom-process/ecom-process.component';
import { PmFeesComponent } from './admin/tables/pm-fees/pm-fees.component';
import { ServiceBureauFeesComponent } from './admin/tables/service-bureau-fees/service-bureau-fees.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { TopNavComponent } from './admin/top-nav/top-nav.component';
import { NavService } from './admin/nav.service';
import { ReportsComponent } from './admin/reports/reports.component';
import { LogsComponent } from './admin/logs/logs.component';
import { TooltipModule } from 'primeng/tooltip';
import { DiscountComponent } from './admin/tables/discount/discount.component';
import { DiametricsFee3Component } from './admin/tables/diametrics-fee3/diametrics-fee3.component';
import { RoundPipe } from './home/roundPipe'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    HeaderComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    DialogOverviewExampleDialog,
    ErpComponent,
    EdiDocsComponent,
    MsKbPlanComponent,
    DropShipVolumePlanComponent,
    AdminCMFComponent,
    CommFeesComponent,
    ComplainceFeeComponent,
    ConvertionComponent,
    DiametricsFeesComponent,
    DiametricsFees2Component,
    EcomProcessComponent,
    PmFeesComponent,
    ServiceBureauFeesComponent,
    AdminUsersComponent,
    MenuListItemComponent,
    TopNavComponent,
    ReportsComponent,
    LogsComponent,
    DiscountComponent,
    DiametricsFee3Component,
    RoundPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,
    ToastModule,

    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    TooltipModule,
  ],
  providers: [NavService],
  entryComponents: [DialogOverviewExampleDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
