import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        CompanyDetailsComponent,
        SubscriptionsComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    bootstrap: [AppComponent],
    providers: [DatePipe]
})
export class AppModule { }
