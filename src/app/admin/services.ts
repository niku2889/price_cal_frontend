import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

export interface Car {
    vin?;
    year?;
    brand?;
    color?;
    price?;
    saleDate?;
}

@Injectable()
export class AdminService {
    //url: string = 'http://localhost:56201/api/';
    url: string = 'http://niku281189-001-site1.itempurl.com/api/';
    constructor(private http: HttpClient) { }

    getCarsSmall() {
        return this.http.get<any>('./assets/data.json')
            .toPromise()
            .then(res => <Car[]>res.data)
            .then(data => { return data; });
    }

    getCarsMedium() {
        return this.http.get<any>('./assets/data.json')
            .toPromise()
            .then(res => <Car[]>res.data)
            .then(data => { return data; });
    }

    getCarsLarge() {
        return this.http.get<any>('./assets/data.json')
            .toPromise()
            .then(res => <Car[]>res.data)
            .then(data => { return data; });
    }

    getCarsHuge() {
        return this.http.get<any>('./assets/data.json')
            .toPromise()
            .then(res => <Car[]>res.data)
            .then(data => { return data; });
    }

    //ERP
    getAllErp() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'ERP')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteErpId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'ERP/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addErp(erp) {
        const body1 = JSON.stringify({
            Name: erp.Name,
            Size: erp.Size,
            Type: erp.Type,
            Amount: erp.Amount,
            Methodology: erp.Methodology,
            Valid: false
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'ERP', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateErp(erp) {
        const body1 = JSON.stringify({
            Name: erp.Name,
            Size: erp.Size,
            Type: erp.Type,
            Amount: erp.Amount,
            Methodology: erp.Methodology,
            Valid: false
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'ERP/' + erp.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //EDI
    getAllEdi() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'EDI')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteEdiId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'EDI/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addEdi(edi) {
        const body1 = JSON.stringify({
            EdiDocs: edi.EdiDocs
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'EDI', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateEdi(edi) {
        const body1 = JSON.stringify({
            EdiDocs: edi.EdiDocs
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'EDI/' + edi.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Ms kb plan
    getAllMsKbPlan() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'KBPlans')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteMsKbPlanId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'KBPlans/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addMsKbPlan(plan) {
        const body1 = JSON.stringify({
            Plans: plan.Plans,
            PlanNumber: plan.PlanNumber,
            TransactionalPlan: plan.TransactionalPlan,
            MonthlyMax: plan.MonthlyMax,
            AnnualMax: plan.AnnualMax,
            MinimumMonthlyFee: plan.MinimumMonthlyFee,
            OverKBRateMonthlyPlan: plan.OverKBRateMonthlyPlan,
            OverKBRateAnnualPlan: plan.OverKBRateAnnualPlan,
            EffectiveKBRate: plan.EffectiveKBRate
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'KBPlans', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateMsKbPlan(plan) {
        const body1 = JSON.stringify({
            Plans: plan.Plans,
            PlanNumber: plan.PlanNumber,
            TransactionalPlan: plan.TransactionalPlan,
            MonthlyMax: plan.MonthlyMax,
            AnnualMax: plan.AnnualMax,
            MinimumMonthlyFee: plan.MinimumMonthlyFee,
            OverKBRateMonthlyPlan: plan.OverKBRateMonthlyPlan,
            OverKBRateAnnualPlan: plan.OverKBRateAnnualPlan,
            EffectiveKBRate: plan.EffectiveKBRate
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'KBPlans/' + plan.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Drop ship volume plan
    getAllDSVPlan() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'DropShipVolumePlan')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteDSVPlanId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'DropShipVolumePlan/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addDSVPlan(plan) {
        const body1 = JSON.stringify({
            Plans: plan.Plans,
            PlanNo: plan.PlanNo,
            VolumeOrdersPerMonth: plan.VolumeOrdersPerMonth,
            VolumeOrdersPerYear: plan.VolumeOrdersPerYear,
            YearlyCostByMonthlyPlan: plan.YearlyCostByMonthlyPlan,
            MonthlyPriceByMonthlyPlan: plan.MonthlyPriceByMonthlyPlan,
            AveragePricePerOrderByMonthlyPlan: plan.AveragePricePerOrderByMonthlyPlan,
            OverageFeeByMonthlyPlan: plan.OverageFeeByMonthlyPlan,
            CostForTheYear2ByAnnualPlan: plan.CostForTheYear2ByAnnualPlan,
            MonthlyPrice3ByAnnualPlan: plan.MonthlyPrice3ByAnnualPlan,
            AveragePricePerOrder4ByAnnualPlan: plan.AveragePricePerOrder4ByAnnualPlan,
            OverageFee5ByAnnualPlan: plan.OverageFee5ByAnnualPlan
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'DropShipVolumePlan', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateDSVPlan(plan) {
        const body1 = JSON.stringify({
            Plans: plan.Plans,
            PlanNo: plan.PlanNo,
            VolumeOrdersPerMonth: plan.VolumeOrdersPerMonth,
            VolumeOrdersPerYear: plan.VolumeOrdersPerYear,
            YearlyCostByMonthlyPlan: plan.YearlyCostByMonthlyPlan,
            MonthlyPriceByMonthlyPlan: plan.MonthlyPriceByMonthlyPlan,
            AveragePricePerOrderByMonthlyPlan: plan.AveragePricePerOrderByMonthlyPlan,
            OverageFeeByMonthlyPlan: plan.OverageFeeByMonthlyPlan,
            CostForTheYear2ByAnnualPlan: plan.CostForTheYear2ByAnnualPlan,
            MonthlyPrice3ByAnnualPlan: plan.MonthlyPrice3ByAnnualPlan,
            AveragePricePerOrder4ByAnnualPlan: plan.AveragePricePerOrder4ByAnnualPlan,
            OverageFee5ByAnnualPlan: plan.OverageFee5ByAnnualPlan
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'DropShipVolumePlan/' + plan.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Community management fee
    getAllComManFee() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'AdminCommunityManagementFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteComManFeeId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'AdminCommunityManagementFees/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addComManFee(fee) {
        const body1 = JSON.stringify({
            "Name": fee.Name,
            "Fee": fee.Fee,
            "Type": fee.Type
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'AdminCommunityManagementFees', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateComManFee(fee) {
        const body1 = JSON.stringify({
            "Name": fee.Name,
            "Fee": fee.Fee,
            "Type": fee.Type
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'AdminCommunityManagementFees/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Communication fee
    getAllComFee() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'CommunicationFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteComFeeId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'CommunicationFees/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addComFee(fee) {
        const body1 = JSON.stringify({
            "Name": fee.Name,
            "Fee": fee.Fee
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'CommunicationFees', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateComFee(fee) {
        const body1 = JSON.stringify({
            "Name": fee.Name,
            "Fee": fee.Fee
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'CommunicationFees/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Complaince fee
    getAllComplainceFee() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'ComplienceFee')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteComplainceFeeId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'ComplienceFee/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addComplainceFee(fee) {
        const body1 = JSON.stringify({
            "Name": fee.Name,
            "Scope": fee.Scope,
            "Fee": fee.Fee,
            "Type": fee.Type,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'ComplienceFee', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateComplainceFee(fee) {
        const body1 = JSON.stringify({
            "Name": fee.Name,
            "Scope": fee.Scope,
            "Fee": fee.Fee,
            "Type": fee.Type,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'ComplienceFee/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Diametrics fee
    getAllDiametricsFee() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'DimetricsFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteDiametricsFeeId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'DimetricsFees/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addDiametricsFee(fee) {
        const body1 = JSON.stringify({
            "NumberRules": fee.NumberRules,
            "NumberDocuments": fee.NumberDocuments,
            "Complexity": fee.Complexity,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'DimetricsFees', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateDiametricsFee(fee) {
        const body1 = JSON.stringify({
            "NumberRules": fee.NumberRules,
            "NumberDocuments": fee.NumberDocuments,
            "Complexity": fee.Complexity,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'DimetricsFees/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Diametrics fee 2
    getAllDiametricsFee2() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'DimetricsFeesSecondPart')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteDiametricsFee2Id(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'DimetricsFeesSecondPart/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addDiametricsFee2(fee) {
        const body1 = JSON.stringify({
            "TradingPartnerCommunitySize": fee.TradingPartnerCommunitySize,
            "Complexity": fee.Complexity,
            "Fee": fee.Fee,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'DimetricsFeesSecondPart', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateDiametricsFee2(fee) {
        const body1 = JSON.stringify({
            "TradingPartnerCommunitySize": fee.TradingPartnerCommunitySize,
            "Complexity": fee.Complexity,
            "Fee": fee.Fee,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'DimetricsFeesSecondPart/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Diametrics fee 3
    getAllDiametricsFee3() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'DimetricsFeesThirdPart')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteDiametricsFee3Id(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'DimetricsFeesThirdPart/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addDiametricsFee3(fee) {
        const body1 = JSON.stringify({
            "Min": fee.Min,
            "Max": fee.Max,
            "Fee": fee.Fee
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'DimetricsFeesThirdPart', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateDiametricsFee3(fee) {
        const body1 = JSON.stringify({
            "Min": fee.Min,
            "Max": fee.Max,
            "Fee": fee.Fee
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'DimetricsFeesThirdPart/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Ecommerce Process
    getAllEcomProcess() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'EcommerceNoOfProcessAutomate')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteEcomProcessId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'EcommerceNoOfProcessAutomate/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addEcomProcess(fee) {
        const body1 = JSON.stringify({
            "EcommerceWebsites": fee.EcommerceWebsites,
            "NumberProcessesAutomated": fee.NumberProcessesAutomated,
            "PMHours": fee.PMHours,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'EcommerceNoOfProcessAutomate', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateEcomProcess(fee) {
        const body1 = JSON.stringify({
            "EcommerceWebsites": fee.EcommerceWebsites,
            "NumberProcessesAutomated": fee.NumberProcessesAutomated,
            "PMHours": fee.PMHours,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'EcommerceNoOfProcessAutomate/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //pm fee
    getAllPmFee() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'PMFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deletePmFeeId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'PMFees/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addPmFee(fee) {
        const body1 = JSON.stringify({
            TPs: fee.TPs,
            Min: fee.Min,
            Max: fee.Max,
            PMHoursPerWeek: fee.PMHoursPerWeek
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'PMFees', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updatePmFee(fee) {
        const body1 = JSON.stringify({
            TPs: fee.TPs,
            Min: fee.Min,
            Max: fee.Max,
            PMHoursPerWeek: fee.PMHoursPerWeek
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'PMFees/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Discount limitation
    getDiscountLimitations() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'DiscountLimitations')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    // deletePmFeeId(id) {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('content-Type', 'application/json;charset=utf-8');
    //     return Observable.create((observer) => {
    //         return this.http.delete(this.url + 'DiscountLimitations/' + id)
    //             .subscribe(data => {
    //                 observer.next(data);
    //             },
    //                 err => {
    //                     console.log(err)
    //                 });
    //     });
    // }

    // addPmFee(fee) {
    //     const body1 = JSON.stringify({
    //         TPs: fee.TPs,
    //         Min: fee.Min,
    //         Max: fee.Max,
    //         PMHoursPerWeek: fee.PMHoursPerWeek
    //     })
    //     let headers = new HttpHeaders();
    //     headers = headers.set('content-Type', 'application/json;charset=utf-8');
    //     return Observable.create((observer) => {
    //         return this.http.post(this.url + 'DiscountLimitations', body1, { headers: headers })
    //             .subscribe(data => {
    //                 observer.next(data);
    //             },
    //                 err => {
    //                     observer.next(err);
    //                 });
    //     });
    // }

    updateDiscountLimitations(fee) {
        const body1 = JSON.stringify({
            Discount: fee.Discount,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'DiscountLimitations/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //service bureau fee
    getAllServiceBureauFee() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'ServiceBureauFees')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteServiceBureauFeeId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'ServiceBureauFees/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addServiceBureauFee(fee) {
        const body1 = JSON.stringify({
            Item: fee.Item,
            PriceRange: fee.PriceRange,
            Fee: fee.Fee,
            Min: fee.Min,
            Max: fee.Max,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'ServiceBureauFees', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateServiceBureauFee(fee) {
        const body1 = JSON.stringify({
            Item: fee.Item,
            PriceRange: fee.PriceRange,
            Fee: fee.Fee,
            Min: fee.Min,
            Max: fee.Max,
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'ServiceBureauFees/' + fee.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Currency Convertion
    getAllCC() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'CurrencyConvertion')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteCCId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'CurrencyConvertion/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addCC(cc) {
        const body1 = JSON.stringify({
            "Currency": cc.Currency,
            "ConvertionRate": cc.ConvertionRate
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'CurrencyConvertion', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateCC(cc) {
        const body1 = JSON.stringify({
            "Currency": cc.Currency,
            "ConvertionRate": cc.ConvertionRate
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'CurrencyConvertion/' + cc.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    //Admin Users
    getAllAdminUsers() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'AdminUsers')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAdminUsers(name) {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'AdminUsers/' + name)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    deleteAdminUsersId(id) {
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.delete(this.url + 'AdminUsers/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.log(err)
                    });
        });
    }

    addAdminUsers(user) {
        const body1 = JSON.stringify({
            "Name": user.Name,
            "Email": user.Email,
            "Password": user.Password,
            "IsSuperAdmin": false
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'AdminUsers', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    updateAdminUsers(user) {
        const body1 = JSON.stringify({
            "Name": user.Name,
            "Email": user.Email,
            "Password": user.Password,
            "IsSuperAdmin": false
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.put(this.url + 'AdminUsers/' + user.Id, body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    getUsersReport() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'Users')
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
            return this.http.get(this.url + 'UsersFee/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    getAllLogs() {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'Logs')
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }

    addLogs(tableName, rowid, userName, userId, action, old, newv) {
        const body1 = JSON.stringify({
            "TableName": tableName,
            "RowId": rowid,
            "Date": new Date(),
            "UserName": userName,
            "UserId": userId,
            "OperationType": action,
            "OldValues": JSON.stringify(old),
            "NewValues": JSON.stringify(newv)
        })
        let headers = new HttpHeaders();
        headers = headers.set('content-Type', 'application/json;charset=utf-8');
        return Observable.create((observer) => {
            return this.http.post(this.url + 'Logs', body1, { headers: headers })
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        observer.next(err);
                    });
        });
    }

    getEdiDetails(id) {
        return Observable.create((observer) => {
            return this.http.get(this.url + 'UserInputesEdis/' + id)
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
            return this.http.get(this.url + 'UserInputesNonEdis/' + id)
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
            return this.http.get(this.url + 'UserInputesEcommerces/' + id)
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
            return this.http.get(this.url + 'UserInputes/' + id)
                .subscribe(data => {
                    observer.next(data);
                },
                    err => {
                        console.error(err);
                    });
        });
    }
}