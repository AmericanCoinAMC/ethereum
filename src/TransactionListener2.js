const firebase = require("firebase");
var Web3 = require("web3");
const ABI = require("./Contract").abi;
const contractAddress = require("./Contract").address; //Modify

function TransactionListener(web3Node,firebaseDatabase) {
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

    if(firebaseDatabase){
        this.firebaseDatabase = firebaseDatabase;
    }
    else {
        err = new Error("A firebaseDatabase valid instance must be provided");
        err.name = "NoFirebaseDatabaseInstanceError";
        throw err;
    }
}

TransactionListener.prototype.listenToEvent=function(){
	console.log("------WATCHING FOR EVENT:-----");
	this.event.watch(function(error, result){
		if (!error){
		    console.log("NEW TRANSACTION");
		   // console.log(result);
		    console.log("Transaction hash:",result.transactionHash);
		    console.log("Block number:",result.blockNumber);
		    console.log("From:",result.args.from);
		    console.log("To:",result.args.to);
		    console.log("Amount:",result.args.value.c[0],"AMC");
	   }
	 });		
}

TransactionListener.prototype.stopListening = function(){
	this.event.stopWatching();
}

module.exports = TransactionListener;