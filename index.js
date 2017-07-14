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
var TransactionListener = require("./TransactionListener2");
//Web 3 libs
var Web3 = require('web3');
const ETH_NODE = '' // To be defined
var web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE));

// Firebase database
const firebase = require("firebase");
const config = require("./config");
firebase.initializeApp(config)
var database = firebase.database(); // Get database instance

// configure app to use bodyParser()
// this will let us get the data from a POST
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
