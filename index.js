/**
 * Created by jessdotjs on 10/07/17.
 */


// BASE SETUP
// =============================================================================

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var Wallet = require('./src/Wallet.js');
var TransactionListener = require('./src/TransactionListener.js');

//Web 3 libs
var Web3 = require('web3');
const ETH_NODE = '' // To be defined
var web3 = new Web3(ETH_NODE)


// Firebase database
const firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDkbUvURJTxHHc8nAw9Hifis_L9VWjZkAM",
    authDomain: "americancoin-47230.firebaseapp.com",
    databaseURL: "https://americancoin-47230.firebaseio.com",
    projectId: "americancoin-47230",
    storageBucket: "americancoin-47230.appspot.com",
    messagingSenderId: "59474180269"
};
firebase.initzializeApp(config)
var database = firebase.database(); 

// We define a function for transaction listening 
var storeTransactionInFirebase =  (err, result) => {
    var paramsObject;
    var refFrom, refTo,refTransactions;
    if(err){
        return;
    }
    if(result.removed){ 
        return;
    }
    paramsObject= result.args;
    paramsObject.blockNumber = result.blockNumber;
    paramsObject.blockHash = result.blockHash;
    refFrom = database.ref('addresses/'+paramsObject.from+'/'+result.transactionHash);
    refTo =  database.ref('addresses/'+paramsObject.to+'/'+result.transactionHash);
    if(!result.blockHash) {
        refTransactions = database.ref('pendingTransactions/'+result.transactionHash);
        refTransactions.set(
        {
            hash: result.transactionHash,
            from: paramsObject.from,
            to: paramsObject.to
        });
    }
    refTo.set(paramsObject);
    refFrom.set(paramsObject);
}


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: "Welcome to AmericanCoin's Api" });
});


const wallet = new Wallet();


/*
 * Create
 * Params - password: string
 * */
router.route('/create').post(function(req, res) {
    var password = req.query.password;
    if(password) {
        res.send(wallet.create(password));
    }else {
        res.send({});
    }
});


/*
 * Decrypt with File
 * Params - password: string, file: tbd
 * */
router.route('/decryptWithFile').post(function(req, res) {
    var file = req.query.file;
    var password = req.query.password;
    if(file && password) {
        res.send(wallet.decryptWithFile(file, password));
    }else {
        res.send(false);
    }
});


/*
 * Decrypt with Key
 * Params - password: string
 * */
router.route('/decryptWithPrivateKey').post(function(req, res) {
    var privateKey = req.query.privateKey;
    if(privateKey) {
        res.send(wallet.decryptWithPrivateKey(privateKey));
    }else {
        res.send(false);
    }
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server Initialized on Port: ' + port);
