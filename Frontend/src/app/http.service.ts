import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface HttpResponse {
    error: boolean;
    message: string;
}

interface Stock {
    _id: string;
    symbol: string;
    open: string;
    close: string;
    low: string;
    high: string;
    volume: string;
}
@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) {
        this.updateStatus();
    }


    updateStatus(): Observable<any> {
        return this.http.get(`${environment.API_URL}/updateStatus`);
    }

    getStockData(sortby, minDate, maxDate, search, symbol, currentPage): Observable<any> {
        return this.http.post(`${environment.API_URL}/getStockData/${currentPage}`, {sortby, minDate, maxDate, search, symbol});
    }

    getSubscribedData(symbols): Observable<any> {
        return this.http.post(`${environment.API_URL}/getSubscribedData`, {symbols});
    }

    filterStockData(currentPage): Observable<any> {
        return this.http.get(`${environment.API_URL}/filterStockData/${currentPage}`);
    }

    getCompanies(): Observable<any> {
        return this.http.get(`${environment.API_URL}/getCompanies`);
    }

    getCompany(symbol, currentPage): Observable<any> {
        return this.http.get(`${environment.API_URL}/getCompany/${symbol}/${currentPage}`);
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }

}
