const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoDb  = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser());

const nPerPage = 15;

app.get('/', function (req, res) {
	res.send('Hello, This is my Forexo API');
});

app.get('/updateStatus', function (req, res) {
	console.log('Update was triggered!');
	const pageNumber = 1;
	mongoDb( function (client, db, objectID) {
		db.collection('SgOneToMany').find({}).forEach(
			function(doc) {
				db.collection('ClientOneToMany').find({
					'We Sell currency' : doc['We Buy currency'],
					'We Buy Ccy' : doc['We Sell Ccy'],
					'We Buy Amount' : doc['We Sell Amount'],
					'Contract Date': doc['Contract Date'],
					'Value Date' : doc['Value Date'],
					'Exchange Rate' : doc['Exchange Rate'],
					'Party A': doc['Party B'],
					'Party B' : doc['Party A'],
					'Intermediary (1)' : doc['Intermediary (1)'],
					'Settlement (1)' : doc['Settlement (1)'],
					'Beneficiary (1)' : doc['Beneficiary (1)'],
				}).toArray((function(err, results){
					if(results.length > 0) {
						db.collection('SgOneToMany').update({_id:doc._id},{$set: {status: 'Matched'}});
					}
					else {
						db.collection('SgOneToMany').update({_id:doc._id},{$set: {status: 'Unmatched'}});
					}
				}));

			}
		);
	}, function(err, results){
		if(results) {
			res.status(200).json({
				error: false,
				updatedStatus: true
			})
		}
		else {
			res.status(500).json({
				error: true,
				updatedStatus: false
			})
		}
	});
});

app.post('/getStockData/:currentPage', function (req, res) {
	const pageNumber = req.params.currentPage;
	const sortby = req.body.sortby;
	const minDate = req.body.minDate;
	const maxDate = req.body.maxDate;
	const search = req.body.search;
	const symbol = req.body.symbol;
	const filters = {};
	const sortCondition = {};
	const date = {};
	const totalItems = 1;
	if(sortby !== 'NoSort') {
		for(key in sortby){
			sortCondition[key] = sortby[key];
		}
	} else {
		sortCondition['Contract Date'] = -1;
	}
	if(symbol !== 'NoSymbol'){
		filters.symbol = { $eq: symbol };
	}
	if(maxDate != 'NoDate') {
		date['$lte'] = maxDate;
		filters['Contract Date'] = date;
	}
	if(minDate != 'NoDate') {
		date['$gte'] = minDate;
		filters['Contract Date'] = date;
	}
	if(search != 'NoSearch' && symbol === 'NoSymbol') {
		filters.symbol = { $regex: search.toUpperCase() };
	}
	mongoDb( function (client, db, objectID) {
		const totalItems = db.collection('SgOneToMany').find(filters).count();

		db.collection('SgOneToMany').find(filters).sort(sortCondition).skip((pageNumber-1)*nPerPage).limit(nPerPage).toArray(function (err, results) {
			if (err) {
				res.status(500).json({
					error: true,
					StockData: [],
					totalItems: 0
				});
			} else {
				res.status(200).json({
					error: false,
					StockData: results,
					totalItems: 100
				});
			}
		});
    });    
});


app.get('/filterStockData/:symbol/:page', function (req, res) {
	const symbolName = req.params.symbol;
	const pageNumber = req.params.page;
	mongoDb( function (client, db, objectID) {
		const totalItems = db.collection('SgOneToMany').count();
    	db.collection('SgOneToMany').find({symbol:symbolName}).skip((pageNumber-1)*nPerPage).limit(nPerPage).toArray(function (err, results) {
			if (err) {
				res.status(500).json({
					error: true,
					StockData: [],
					totalItems: 0
				});
			} else {
				res.status(200).json({
					error: false,
					StockData: results,
					totalItems: 100
				});
			}
      	});
    }); 
});

app.get('/getCompanies', function (req, res) {
	mongoDb( function (client, db, objectID) {
		db.collection('SgOneToMany').distinct('symbol',function (err, results) {
			if (err) {
				res.status(500).json({
					error: true,
					companyData: [],
					totalItems: 0
				});
			} else {
				res.status(200).json({
					error: false,
					companyData: results.sort(),
					totalItems: 100
				});
			}
      	});
    });    
});

app.get('/getCompany/:symbol/:page', function (req, res) {
	const symbolName = req.params.symbol;
	const pageNumber = req.params.page;
	mongoDb( function (client, db, objectID) {
		const totalItems = db.collection('SgOneToMany').find({symbol: symbolName}).count();
    	db.collection('SgOneToMany').find({symbol: symbolName}).skip((pageNumber-1)*nPerPage).limit(nPerPage).toArray(function (err, results) {
			if (err) {
				res.status(500).json({
					error: true,
					StockData: [],
					totalItems: 0
				});
			} else {
				res.status(200).json({
					error: false,
					StockData: results,
					totalItems: 100
				});
			}
      	});
    });    
});


app.all('**', function (req, res) {
  	res.send(`404`)
});


app.listen(3000, function () {	
	console.log('CORS-enabled web server listening on port 3000')
})
