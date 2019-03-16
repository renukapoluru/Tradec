import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
	selector: 'app-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

	subscribedSymbols = ['DISCA', 'DIS'];
	subscriptions = [];
	dataFetched = false;
	constructor(private httpService: HttpService) { }

	ngOnInit() {
		this.subscribedData(this.subscribedSymbols);
	}

	subscribedData(symbols) {
		this.httpService.getSubscribedData(symbols).subscribe(
			(response) => {
				if (response.error) {
					console.log('Error in fetching Subscribed Data.');
				} else {
					this.subscriptions = response.SubscribedData;
					this.dataFetched = true;
				}
			},
			(error) => {
				alert('Error in fetching Subscribed Data.');
			}
		);
	}

}
