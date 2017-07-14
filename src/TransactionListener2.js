// const firebase = require("firebase");
var Web3 = require("web3");
const ABI = require("./Contract").abi;
const contractAddress = require("./Contract").address; //Modify
const firebase = require("firebase");

function TransactionListener(web3Node) {
    var err;
    if(web3Node.isConnected()){
        this.web3 = web3Node;
        var MyContract = this.web3.eth.contract(ABI);
        this.myContractInstance = MyContract.at(contractAddress);
        this.event = this.myContractInstance.Transfer();
    }
    else {
        err = new Error("A web3 valid instance must be provided");
        err.name = "NoWeb3InstanceError";
        throw err;
    }

}

TransactionListener.prototype.listenToEvent=function(){
    this.event.watch(function(error, result){
        if (!error){
            var self = this;
            console.log("NEW TRANSACTION");
            firebase.database().ref('AMC/Transactions').push({
                from: result.args.from,
                to: result.args.to,
                amount: result.args.value.toNumber(),
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber
            });
       }
     });        
}

TransactionListener.prototype.stopListening = function(){
    this.event.stopWatching();
}

module.exports = TransactionListener;