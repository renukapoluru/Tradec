import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {formatDate} from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { HttpService } from './http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Tradec';
    StockData = [];
    companyData: [] = [];
    dataFetched = false;
    filtersForm: FormGroup;
    selectedID = null;
    isSymbolSelected = false;
    selectedSymbol = null;
    showingFilters = true;
    showingFilteredData = false;
    currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    sortOptions = [
        {
            name : 'Date Desc',
            value: { date : -1 }
        },
        {
            name : 'Date Asc',
            value: { date : 1 }
        },
        {
            name : 'Open High',
            value: { open : -1 }
        },
        {
            name : 'Open Low',
            value: { open : 1 }
        },
        {
            name : 'Close High',
            value: { close : -1 }
        },
        {
            name : 'Close Low',
            value: { close : 1 }
        },
        {
            name : 'High',
            value: { high : -1 }
        },
        {
            name : 'Low',
            value: { low : 1 }
        },
        {
            name : 'Volume High',
            value: { volume : -1 }
        },
        // tslint:disable-next-line:indent
        {
            name : 'Volume Low',
            value: { volume : 1 }
        },
    ];

    /* Pagination */

    numberOfPages = 1;
    pagesArray = [];
    currentPage = 1;
    perPage = 20;

    /* Paginations Ends Here */

    constructor(private httpService: HttpService) {
        this.filters();
    }

    showFilters() {
        this.showingFilters = !this.showingFilters;
    }

    ngOnInit() {
        this.getCompanies();
    }

    filters() {
        this.filtersForm = new FormGroup({
            symbol : new FormControl('', Validators.compose([
                Validators.required
            ])),
            search : new FormControl('', Validators.compose([
                Validators.required
            ])),
            sortby : new FormControl('', Validators.compose([
                Validators.required
            ])),
            minDate : new FormControl('', Validators.compose([
                Validators.required
            ])),
            maxDate : new FormControl(this.currentDate, Validators.compose([
                Validators.required
            ]))
        });
        this.filtersForm.valueChanges.pipe(debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            if (value !== '') {
                this.getStockData(value);
            }
        });
    }

    async updateStatus() {
        await this.httpService.updateStatus();
        this.getStockData(this.filtersForm.controls.value);
    }

    getStockData(formValue) {
        const filters = {
            search: '',
            sortby: '',
            symbol: '',
            minDate: '',
            maxDate: ''
        };
        if (formValue === undefined) {
            filters.search = 'NoSearch';
            filters.sortby = 'NoSort';
            filters.symbol = 'NoSymbol';
            filters.minDate = 'NoDate';
            filters.maxDate = 'NoDate';
        } else {
            filters.search = formValue.search || 'NoSearch';
            filters.sortby = formValue.sortby || 'NoSort';
            filters.symbol = formValue.symbol || 'NoSymbol';
            filters.minDate = formValue.minDate || 'NoDate';
            filters.maxDate = formValue.maxDate || 'NoDate';
        }
        console.log(filters.sortby);
        this.httpService.getStockData(filters.sortby, filters.minDate, filters.maxDate, filters.search, filters.symbol, this.currentPage)
        .subscribe(
            (response) => {
                if (response.error) {
                    alert('Error in fetching Stock Data.');
                } else {
                    this.StockData = response.StockData;
                    this.numberOfPages = 100 / this.perPage;
                    this.pagesArray.length = this.numberOfPages;
                    setTimeout(() => {
                        this.dataFetched = true;
                    }, 1000);
                }
            },
            (error) => {
                alert('Error in fetching Stock Data.');
            }
        );
    }

    getCompanies() {
        this.httpService.getCompanies()
        .subscribe(
            (response) => {
                if (response.error) {
                    alert('Error in fetching Company Data.');
                } else {
                    this.companyData = response.companyData;
                    this.numberOfPages = response.totalItems / this.perPage;
                    this.dataFetched = true;
                }
            },
            (error) => {
                alert('Error in fetching Company Data.');
            }
        );
    }

    selectCompany(symbol) {
        this.isSymbolSelected = true;
        this.selectedSymbol = symbol;
        this.showingFilteredData = true;
        this.filtersForm.controls.symbol.setValue(symbol);
        this.httpService.getCompany(symbol, this.currentPage)
        .subscribe(
            (response) => {
                if (response.error) {
                } else {
                    this.StockData = response.StockData;
                    this.numberOfPages = response.totalItems / this.perPage;
                }
            },
            (error) => {
                alert('Error in Fetching StockData.');
            }
        );
    }

    showAllResults() {
        this.selectedID = null;
        this.isSymbolSelected = false;
        this.selectedSymbol = null;
        this.filtersForm.controls.symbol.setValue('');
        this.showingFilteredData = false;
        this.getStockData(this.filtersForm.controls.value);
    }

    filterData() {
        this.showingFilteredData = true;
        const selectedFilters = {
            sort : this.filtersForm.controls.sortby.value,
            symbol : this.filtersForm.controls.symbol.value,
            searchString : this.filtersForm.controls.search.value,
            minDate : this.filtersForm.controls.minDate.value,
            maxDate : this.filtersForm.controls.maxDate.value
        };
        this.filterStockData();
    }

    filterStockData() {
        this.httpService.filterStockData(this.currentPage)
        .subscribe(
            (response) => {
                if (response.error) {
                    alert('Error in fetching Stock Data.');
                } else {
                    this.StockData = response.StockData;
                    this.numberOfPages = response.totalItems / this.perPage;
                    this.dataFetched = true;
                }
            },
            (error) => {
                alert('Error in fetching Stock Data.');
            }
        );
    }

}
