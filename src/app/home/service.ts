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

    getAllVarienceFees() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'VarienceFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllCommunicationFees() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'CommunicationFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllDimetricsFeesThirdPart() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'DimetricsFeesThirdPart')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllAdminCommunityManagementFees() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'AdminCommunityManagementFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    //Discount limitation
    getDiscountLimitations() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'DiscountLimitations')
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

    postUserReportData(userId, feeType, section, rowid, item, deliverable, erp, up, qty, price, discount, afterDiscountPrice) {
        const body1 = JSON.stringify({
            "UserId": userId,
            "FeeType": feeType,
            "Section": section,
            "RowId": rowid,
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

    //Currency Convertion
    getAllCC() {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'CurrencyConvertion')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    postUserInputData(userId, name, email, dealid, custname, currency, reportid, months, tcv, userInputs) {
        const body1 = JSON.stringify({
            "UserId": userId,
            "UserName": name,
            "UserEmail": email,
            "DealId": dealid,
            "CustomerName": custname,
            "Currency": currency,
            "ReportId": reportid,
            "TCVMonths": months,
            "TCV": tcv,
            "MERP": userInputs.MERP,
            "MMsEcommerce": userInputs.MMsEcommerce,
            "MBuySide": userInputs.MBuySide,
            "MSellSide": userInputs.MSellSide,
            "MBuySideEdiSpecBookletTP": userInputs.MBuySideEdiSpecBookletTP,
            "MBuySideComTestProgram": userInputs.MBuySideComTestProgram,
            "MBuySideWhoPays": userInputs.MBuySideWhoPays,
            "MBuySideNoTPComTest": userInputs.MBuySideNoTPComTest,
            "MBuySideProvideLabels": userInputs.MBuySideProvideLabels,
            "MBuySideRetailerNeedLabels": userInputs.MBuySideRetailerNeedLabels,
            "MBuySideIsHubPaying": userInputs.MBuySideIsHubPaying,
            "MBuySideIsPrivatePortal": userInputs.MBuySideIsPrivatePortal,
            "MBuySideNoTPUsingPortal": userInputs.MBuySideNoTPUsingPortal,
            "MNoEdi": userInputs.MNoEdi,
            "MNoNonEdi": userInputs.MNoNonEdi,
            "MEdiTpsScope": userInputs.MEdiTpsScope,
            "MNonEdiTpsScope": userInputs.MNonEdiTpsScope,
            "MnoTPInScope": userInputs.MnoTPInScope,
            "MKBPlan": userInputs.MKBPlan,
            "MSelectedKBPlan": userInputs.MSelectedKBPlan,
            "MServicePlan": userInputs.MServicePlan,
            "MServicePlan1": userInputs.MServicePlan1,
            "MServicePlan2": userInputs.MServicePlan2,
            "MPrimaryInteration": userInputs.MPrimaryInteration,
            "MSecondaryIntegration": userInputs.MSecondaryIntegration,
            "MTPUsingEDIStandard": userInputs.MTPUsingEDIStandard,
            "MElectoicallyNonEdiTp": userInputs.MElectoicallyNonEdiTp,
            "MSelectedEcommerce": userInputs.MSelectedEcommerce,
            "MAdditionalServices": userInputs.MAdditionalServices,
            "ADiPulse": userInputs.ADiPulse,
            "ADiPulseNoAdditionalId": userInputs.ADiPulseNoAdditionalId,
            "ADiMetrics": userInputs.ADiMetrics,
            "ADiMetricsBusinessRule": userInputs.ADiMetricsBusinessRule,
            "ADiMetricsNoDocuments": userInputs.ADiMetricsNoDocuments,
            "ADiMetricsHostCustomer": userInputs.ADiMetricsHostCustomer,
            "ADiMetricsNoKBAssociated": userInputs.ADiMetricsNoKBAssociated,
            "AServiceBureau": userInputs.AServiceBureau,
            "AServiceBureauHowManyDocs": userInputs.AServiceBureauHowManyDocs,
            "AServiceBureauSponsorUsers": userInputs.AServiceBureauSponsorUsers,
            "AServiceBureauUsersInProject": userInputs.AServiceBureauUsersInProject,
            "AServiceBureau850855865810DocsPerMonth": userInputs.AServiceBureau850855865810DocsPerMonth,
            "AServiceBureau856DocsPerMonth": userInputs.AServiceBureau856DocsPerMonth,
            "AServiceBureauLineItemsUsers": userInputs.AServiceBureauLineItemsUsers,
            "AServiceBureauLabelsPerMonth": userInputs.AServiceBureauLabelsPerMonth,
            "ACommunicationSoftware": userInputs.ACommunicationSoftware,
            "ACommunicationSoftwareForIntegration": userInputs.ACommunicationSoftwareForIntegration,
            "ACommunicationSoftwareProtocol": userInputs.ACommunicationSoftwareProtocol,
            "AOnsiteProfessionalServices": userInputs.AOnsiteProfessionalServices,
            "AOnsiteProfessionalServicesHours": userInputs.AOnsiteProfessionalServicesHours
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post(this.url + 'UserInputes', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    postEdiDocsData(inputId, edidocs, tp, dipulse) {
        const body1 = JSON.stringify({
            "UserInputId": inputId,
            "EdiDocs": edidocs,
            "NoOfTP": tp,
            "IntegratedErpDiPulse": dipulse
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post(this.url + 'UserInputesEdis', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    postNonEdiDocsData(inputId, nonedidocs, tp) {
        const body1 = JSON.stringify({
            "UserInputId": inputId,
            "NonEdiDocs": nonedidocs,
            "NoOfTP": tp
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post(this.url + 'UserInputesNonEdis', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    postEcommerceData(inputId, name, orders, product, fullfillment, inventory, payment) {
        const body1 = JSON.stringify({
            "UserInputId": inputId,
            "Name": name,
            "Orders": orders,
            "Product": product,
            "Fullfilment": fullfillment,
            "Inventory": inventory,
            "Payment": payment
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this._http.post(this.url + 'UserInputesEcommerces', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getDealIdData(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'Users/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getReportDetails(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'Users/' + id + '?flag=true')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getEdiDetails(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'UserInputesEdis/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getNonEdiDetails(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'UserInputesNonEdis/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getEcommerceDetails(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'UserInputesEcommerces/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getInputDetails(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'UserInputes/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getUsersFeeDetails(id) {
        return Observable.create((observer) => {
            return this._http.get(this.url + 'UsersFee/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }
}
