import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  name;
  isSA;

  constructor() {
    this.name = localStorage.getItem('name');
    this.isSA = localStorage.getItem('superAdmin');
  }



  ngOnInit() {
  }

}
