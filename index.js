/**
 * Created by jessdotjs on 10/07/17.
 */


// BASE SETUP
// =============================================================================

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cors = require('cors');
//Web 3 libs
var Web3 = require('web3');
var Wallet = require('./src/Wallet.js');
const firebase = require("firebase");
const ETH_NODE = "http://localhost:8080" // To be defined
var TransactionListener = require("./src/TransactionListener2");

// Firebase database
const config = require("./src/config");
firebase.initializeApp(config)
var web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE));
//var database = firebase.database(); // Get database instance

// configure app to use bodyParser()
// // this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());

var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

//--------------------Event Listener ----------------------------------
const transactionListener = new TransactionListener(web3);
transactionListener.listenToEvent();
//---------------------------------------------------------------------


const wallet = new Wallet(web3);
var balance = wallet.getBalance("0x4AD40c0660f467C94cfA314Bae24c15DAeBd02EB");
var EthereumBalance = wallet.getEthereumBalance("0x4AD40c0660f467C94cfA314Bae24c15DAeBd02EB");
console.log(balance);
console.log(EthereumBalance);
var privateKey = new Buffer('25c5aed1ffaf6572c6ead5f61164a798a63145b380acff0e8644f9f74c691e52', 'hex');
wallet.sendTransaction("0x4AD40c0660f467C94cfA314Bae24c15DAeBd02EB","0xF77E9a8906Dd09FECD356A5405A871ba1262a865",15,300000,privateKey)
	.catch(function(err){
		console.log(err);
	})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: "Welcome to AmericanCoin's Api" });
});


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


// /*
//  * Decrypt with File
//  * Params - password: string, file: tbd
//  * */
router.route('/decryptWithFile').post(function(req, res) {
    var file = req.query.file;
    var password = req.query.password;
    if(file && password) {
        res.send(wallet.decryptWithFile(file, password));
    }else {
        res.send(false);
    }
});



//  * Decrypt with Key
//  * Params - password: string
//  * 
router.route('/decryptWithPrivateKey').post(function(req, res) {
    var privateKey = req.query.privateKey;
    if(privateKey) {
        res.send(wallet.decryptWithPrivateKey(privateKey));
    }else {
        res.send(false);
    }
});


// // REGISTER OUR ROUTES -------------------------------
// // all of our routes will be prefixed with /api
app.use('/api', router);

// // START THE SERVER
// // =============================================================================
app.listen(port);
console.log('Server Initialized on Port: ' + port);
