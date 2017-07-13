const firebase = require("firebase");
var Web3 = require("web3");

function TransactionListener(web3Node,firebaseDatabase) {
    var err;
    if(web3Node){
        this.web3Node = web3Node;
    }
    else {
        err = new Error("A web3 valid instance must be provided");
        err.name = "NoWeb3InstanceError";
        return err;
    }

    if(firebaseDatabase){
        this.firebaseDatabase = firebaseDatabase;
    }
    else {
        err = new Error("A firebaseDatabase valid instance must be provided");
        err.name = "NoFirebaseDatabaseInstanceError";
        return err;
    }
}

TransactionListener.prototype.loadContract = function(contractObject){
    if(!contractObject)
}