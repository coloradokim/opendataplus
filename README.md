# Open Data Plus

Open data server for data and application specific data integration

## Getting Started

These setup steps assume you're running OS X.  If you don't have [Homebrew](http://brew.sh) installed yet, do that first.

Install Node.js v0.10
* ```brew tap homebrew/versions```
* ```brew install node010```

Install MongoDB
* ```brew install mongodb```
* Follow additional setup steps [here](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x)

Within the opendataplus directory
* ```npm install```
* Open ```app.js``` and change the Mongo address to ```mongodb://127.0.0.1:27017/odp```

## Running the App

Open two terminal windows and launch the following:

Start MongoDB
* ```mongod```

Within the opendataplus directory
* ```npm start```
