import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable()
export class HomeService {

    //url: string = 'http://localhost:56201/api/';
    url: string = 'http://niku281189-001-site1.itempurl.com/api/';

    constructor(private _http: HttpClient) {
    }

    getAllErp() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'ERP')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllEdi() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'EDI')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllMsKbPlans() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'KBPlans')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllDropShipVolumePlans() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'DropShipVolumePlan')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }


    getAllComplieanceFee() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'ComplienceFee')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllDiMetricsFee() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'DimetricsFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllDimetricsFeesSecondPart() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'DimetricsFeesSecondPart')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllServiceBureauFees() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'ServiceBureauFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getPMFees() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'PMFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getEcomFees() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'EcommerceNoOfProcessAutomate')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getOneTimeFeeData() {
        return this._http.get<any>('./assets/oneTimeFee.json')
            .toPromise()
            .then(res => <any[]>res)
            .then(data => { return data; });
    }

    getRecurringFeeData() {
        return this._http.get<any>('./assets/recurringFee.json')
            .toPromise()
            .then(res => <any[]>res)
            .then(data => { return data; });
    }

    postUserData(name, email, dealId, custName, currency, reportId, tcvMonth, tcv) {
        const body1 = JSON.stringify({
            "Name": name,
            "Email": email,
            "DateTime": new Date(),
            "DealId": dealId,
            "CustomerName": custName,
            "Currency": currency,
            "ReportId": reportId,
            "TCVMonths": tcvMonth,
            "TCV": tcv
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post(this.url + 'Users', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    postUserReportData(userId, feeType, section, item, deliverable, erp, up, qty, price, discount, afterDiscountPrice) {
        const body1 = JSON.stringify({
            "UserId": userId,
            "FeeType": feeType,
            "Section": section,
            "Item": item,
            "OneTimeDeliverable": deliverable,
            "Erp": erp,
            "UnitPrice": up,
            "Quantity": qty,
            "Price": price,
            "Discount": discount,
            "AfterDiscountPrice": afterDiscountPrice
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post(this.url + 'UsersFee', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

}
