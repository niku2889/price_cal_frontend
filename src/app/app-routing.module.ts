import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
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
import { ReportsComponent } from './admin/reports/reports.component';
import { LogsComponent } from './admin/logs/logs.component';
import { DiscountComponent } from './admin/tables/discount/discount.component';
import { DiametricsFee3Component } from './admin/tables/diametrics-fee3/diametrics-fee3.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: AdminHomeComponent, pathMatch: 'full' },
      { path: 'erp', component: ErpComponent, pathMatch: 'full' },
      { path: 'edidocs', component: EdiDocsComponent, pathMatch: 'full' },
      { path: 'mskbplan', component: MsKbPlanComponent, pathMatch: 'full' },
      { path: 'dropshipvolumeplan', component: DropShipVolumePlanComponent, pathMatch: 'full' },
      { path: 'admincmf', component: AdminCMFComponent, pathMatch: 'full' },
      { path: 'communicationfees', component: CommFeesComponent, pathMatch: 'full' },
      { path: 'complaincefee', component: ComplainceFeeComponent, pathMatch: 'full' },
      { path: 'currencyconvertion', component: ConvertionComponent, pathMatch: 'full' },
      { path: 'diametricsfee', component: DiametricsFeesComponent, pathMatch: 'full' },
      { path: 'diametricsfee2', component: DiametricsFees2Component, pathMatch: 'full' },
      { path: 'diametricsfee3', component: DiametricsFee3Component, pathMatch: 'full' },
      { path: 'ecommerceprocess', component: EcomProcessComponent, pathMatch: 'full' },
      { path: 'pmfees', component: PmFeesComponent, pathMatch: 'full' },
      { path: 'servicebureaufees', component: ServiceBureauFeesComponent, pathMatch: 'full' },
      { path: 'users', component: AdminUsersComponent, pathMatch: 'full' },
      { path: 'reports', component: ReportsComponent, pathMatch: 'full' },
      { path: 'logs', component: LogsComponent, pathMatch: 'full' },
      { path: 'discount', component: DiscountComponent, pathMatch: 'full' },
    ]
  },
  { path: 'login', component: AdminLoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
