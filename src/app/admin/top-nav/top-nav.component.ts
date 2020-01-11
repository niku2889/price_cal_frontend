import { Component, OnInit } from '@angular/core';
import { NavService } from '../nav.service';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
    name;
    isSA;
    constructor(public navService: NavService) {
        this.name = localStorage.getItem('name');
        this.isSA = localStorage.getItem('superAdmin');
     }

    ngOnInit() {
    }

}