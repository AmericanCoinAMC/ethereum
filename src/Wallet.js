/**
 * Created by jessdotjs on 10/07/17.
 */
var ethereumjsWallet = require('ethereumjs-wallet');
const firebase = require('firebase');
var Web3 = require("web3");

const ABI = [ { "constant": false, "inputs": [ { "name": "newSellPrice", "type": "uint256" }, { "name": "newBuyPrice", "type": "uint256" } ], "name": "setPrices", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "Atomic Coin" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "1000000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "sellPrice", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "standard", "outputs": [ { "name": "", "type": "string", "value": "Token 0.1" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "buyPrice", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x3180b9744a88fc1571edd9862999633380578db3" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "ATC" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "minimumBalanceInFinney", "type": "uint256" } ], "name": "setMinBalance", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "suicide", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "sell", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "1000000" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "Atomic Coin" }, { "name": "decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "decimal Units", "template": "elements_input_uint", "value": "0" }, { "name": "tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "ATC" } ], "payable": false, "type": "constructor" }, { "payable": true, "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" } ];
//Import ABI

function Wallet (web3Node,firebaseInstance,address){
    this.web3 = new Web3(new Web3.providers.HttpProvider(web3Node));
    if(this.web3.isConnected()) {
        const contractAddress = "0x57DC85B60e17002e141F523fF6910511fDb4Cf85"; //Modify
        var MyContract = this.web3.eth.contract(ABI);
        this.myContractInstance = MyContract.at(contractAddress);
    }
    if(firebaseInstance) {
        this.firebaseInstance = firebaseInstance;
    }
    if(address && typeof address === 'string'){
        this.address = (address.length === 42) ? address.substring(2) : address ;
    }
};

Wallet.prototype.create = function(password) {
    const generatedWallet = ethereumjsWallet.generate([true]);
    if(generatedWallet) {
        var walletFile = generatedWallet.toV3String(password);

        return {
            privateKey: generatedWallet.getPrivateKey(),
            publicKey: generatedWallet.getPublicKey(),
            address: generatedWallet.getAddress(),
            privateKeyString: generatedWallet.getPrivateKeyString(),
            publicKeyString: generatedWallet.getPublicKeyString(),
            addressString: generatedWallet.getAddressString(),
            checksumAddress: generatedWallet.getChecksumAddressString(),
            walletFileName: this.generateWalletName(),
            //This shoudlnt be here, the object must not know anything about http protocol.
            walletFile: 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(walletFile))
        }
    }else {
        return false;
    }
};

Wallet.prototype.generateWalletName = function () {
    const todayDate = new Date();
    var dd = todayDate.getDate();
    var mm = todayDate.getMonth() + 1; //January is 0!

    const yyyy = todayDate.getFullYear();
    if(dd < 10){
        dd = '0' + dd;
    }
    if(mm < 10){
        mm = '0' + mm;
    }
    return 'amc_wallet_' + mm +'-'+ dd + '-' + yyyy + '.json';
};


Wallet.prototype.decryptWithFile = function (file, password){
    parsedResult = JSON.parse(file);
    const walletInstance = ethereumjsWallet.fromV3(parsedResult, password);
    if(walletInstance) {
        return({
            privateKey: walletInstance.getPrivateKey(),
            publicKey: walletInstance.getPublicKey(),
            address: walletInstance.getAddress(),
            privateKeyString: walletInstance.getPrivateKeyString(),
            publicKeyString: walletInstance.getPublicKeyString(),
            addressString: walletInstance.getAddressString(),
            checksumAddress: walletInstance.getChecksumAddressString()
        });
    }else {
        return false;
    }
};


Wallet.prototype.decryptWithPrivateKey = function (privateKey){
    const cleanPrivateKey = this.cleanPrefix(privateKey);
    const privateKeyBuffer = Buffer.from(cleanPrivateKey, 'hex');
    const walletInstance = ethereumjsWallet.fromPrivateKey(privateKeyBuffer);
    if(walletInstance) {
        return({
            privateKey: walletInstance.getPrivateKey(),
            publicKey: walletInstance.getPublicKey(),
            address: walletInstance.getAddress(),
            privateKeyString: walletInstance.getPrivateKeyString(),
            publicKeyString: walletInstance.getPublicKeyString(),
            addressString: walletInstance.getAddressString(),
            checksumAddress: walletInstance.getChecksumAddressString()
        });
    }else {
        return false;
    }
};

Wallet.prototype.cleanPrefix = function(key) {
    if(key[0] === '0' && key[1] === 'x'){
        return key.substring(2);
    }else{
        return key;
    }
};

//To be tested
Wallet.prototype.getTransactions = function(limit,address) {
    var addrAux = (address) ? address : this.address;
    var err;
    //If I dont have an address I will throw an error be prepare to catch it.
    if (!addrAux){
        err =  new Error('No address found');
        err.name = 'NoAddressError';
        return err;
    }
    //Query the database.
    // We don't know how much time this will take so better return a promise
    return new Promise((resolve,reject) => {
        this.firebaseInstance.ref('address/'+addrAux)
            .limitToFirst(limit)
            .once("value",
            (snapshot,opionalString) => {
                resolve(snapshot.val());
            },
            (errorObject) => {
                reject(errorObject);
            });
    });
}

Wallet.prototype.getBalance = function (address){
    return new Promise((resolve,reject) => {
        var self = this;
        if(!self.web3.isConnected()) {
            reject("error");
        } else {
            var balance = self.myContractInstance.balanceOf(address).c[0];
            resolve(balance);
        }
    })
}



// export the class
module.exports = Wallet;