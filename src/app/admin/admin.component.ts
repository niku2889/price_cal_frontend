import { Component, ViewChild, ElementRef, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material';

import { NavItem } from './nav-item';
import { NavService } from './nav.service';

@Component({
  selector: 'demo',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit, AfterViewInit {
  name;
  isSA;
  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  version = VERSION;
  navItems: NavItem[] = [
    {
      displayName: 'Tables',
      iconName: 'table',
      route: 'admin',
      children: [
        {
          displayName: 'ERP',
          iconName: '',
          route: 'admin/erp',
        },
        {
          displayName: 'EDI DOCS',
          iconName: '',
          route: 'admin/edidocs',
        },
        {
          displayName: 'MS KB PLAN',
          iconName: '',
          route: 'admin/mskbplan',
        },
        {
          displayName: 'DROP SHIP VOLUME PLAN',
          iconName: '',
          route: 'admin/dropshipvolumeplan',
        },
        {
          displayName: 'COMMUNITY MANAGEMENT FEE',
          iconName: '',
          route: 'admin/admincmf',
        },
        {
          displayName: 'COMMUNICATION FEE',
          iconName: '',
          route: 'admin/communicationfees',
        },
        {
          displayName: 'COMPLAINCE FEE',
          iconName: '',
          route: 'admin/complaincefee',
        },
        {
          displayName: 'DIAMETRICS FEE',
          iconName: '',
          route: 'admin/diametricsfee',
        },
        {
          displayName: 'DIAMETRICS FEE2',
          iconName: '',
          route: 'admin/diametricsfee2',
        },
        {
          displayName: 'DIAMETRICS FEE3',
          iconName: '',
          route: 'admin/diametricsfee3',
        },
        {
          displayName: 'ECOMMERCE PROCESS',
          iconName: '',
          route: 'admin/ecommerceprocess',
        },
        {
          displayName: 'PM FEE',
          iconName: '',
          route: 'admin/pmfees',
        },
        {
          displayName: 'SERVICE BUREAU FEE',
          iconName: '',
          route: 'admin/servicebureaufees',
        },
        {
          displayName: 'CURRENCY CONVERTION',
          iconName: '',
          route: 'admin/currencyconvertion',
        },
        {
          displayName: 'DISCOUNT LIMITATION',
          iconName: '',
          route: 'admin/discount',
        },
      ]
    },
    {
      displayName: 'Users',
      iconName: 'supervised_user_circle',
      route: 'admin/users',
    },
    {
      displayName: 'Report Management',
      iconName: 'picture_as_pdf',
      route: 'admin/reports',
    },
    {
      displayName: 'Logs',
      iconName: 'history',
      route: 'admin/logs',
    },
    
  ];
  constructor(private navService: NavService) {
    this.name = localStorage.getItem('name');
    this.isSA = localStorage.getItem('superAdmin');
    if(this.isSA == false || this.isSA == 'false')
      this.navItems = this.navItems.filter(a => a.displayName != 'Users' && a.displayName != 'Logs');
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  
}
