const firebase = require("firebase");
var Web3 = require("web3");
const fs = require("fs");

function TransactionListener(web3Node,firebaseDatabase) {
    var err;
    if(web3Node){
        this.web3Node = web3Node;
    }
    else {
        err = new Error("A web3 valid instance must be provided");
        err.name = "NoWeb3InstanceError";
        throw err;
    }

    if(firebaseDatabase){
        this.firebaseDatabase = firebaseDatabase;
    }
    else {
        err = new Error("A firebaseDatabase valid instance must be provided");
        err.name = "NoFirebaseDatabaseInstanceError";
        throw err;
    }
    this.eventIndex = {};
}

TransactionListener.prototype.loadContract = function(contractObject){
    var err;
    var contract;
    if(!contractObject){
        err = new Error("Not given contract");
        err.msg = "NoContractGiven";
        throw err;
    }
    if(contractObject.abi){
        contract = web3.eth.contract(contractObject.abi);
    }
    this.contract = contract;
}

TransactionListener.prototype.listenToEvent = function(eventName,customName) {
    var err;
    var eventFuntion;
    var eventObject;
    if(!this.contract){
        err = new Error("Cotract attribute undefined");
        err.message = "UndefinedContractError";
        throw err;
    }
    if(!eventName){
        err = new Error("Event name not given");
        err.message = "NoEventNameGiven";
        throw err;
    } else if (typeof eventName !== 'string'){
        rr = new Error("Event name must be string");
        err.message = "EventNameNotString";
        throw err;
    }
    eventFuntion = this.contract[eventName] // This is the event function of the contract.
    //Lesther, fill this with the transaction listenining.


    if(customName && typeof customName !== 'string'){
        err = new Error("Custom name must be string and not empty");
        err.message = "EventNameNotString";
        throw err;
    }
    this.eventIndex[(customName) ? customName : eventName] = eventObject;
}

