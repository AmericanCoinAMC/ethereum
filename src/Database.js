/**
 * Created by jessdotjs on 15/07/17.
 */


const firebase = require("firebase");
var TransactionListener = require('./TransactionListener.js');

function Database() {
    this.config = {
        apiKey: "AIzaSyDkbUvURJTxHHc8nAw9Hifis_L9VWjZkAM",
        authDomain: "americancoin-47230.firebaseapp.com",
        databaseURL: "https://americancoin-47230.firebaseio.com",
        projectId: "americancoin-47230",
        storageBucket: "americancoin-47230.appspot.com",
        messagingSenderId: "59474180269"
    };

    this.email = 'americancoin.amc@gmail.com';
    this.password = 'Am$C.F.CO1n-';

    this.rootRef = null;
};


Database.prototype.init = function () {
    const self = this;
    return new Promise(function (resolve, reject){
        firebase.initializeApp(self.config);
        self.rootRef = firebase.database().ref();
        // Authenticate API
        firebase.auth()
            .signInWithEmailAndPassword(self.email, self.password)
            .then(function (response) {
                resolve(true);
            })
            .catch(function(err) {
                reject(err);
            });
    });
};


Database.prototype.processFanoutObject = function(fanoutObj) {
    const self = this;
    return new Promise(function(resolve, reject) {
        self.rootRef.update(fanoutObj)
            .then(function(response) {
                resolve(response);
            }).catch(function(err){reject(err)});
    });
};

Database.prototype.listenToEvents = function(contract,web3) {
    this.transactionListener = new TransactionListener(web3);
    this.transactionListener.loadContract(contract,contract.address);
    this.transactionListener.listenToEvent('Transfer',null, (err, result) => {
        var paramsObject;
        var refFrom, refTo,refTransactions;
        var database = firebase.database();
        console.log(result);
        if(err){
            console.log(err);
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
    });
}

module.exports = Database;