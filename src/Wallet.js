/**
 * Created by jessdotjs on 10/07/17.
 */
var ethereumjsWallet = require('ethereumjs-wallet');
const firebase = require('firebase');
var Tx = require('ethereumjs-tx');
const ABI = require("./Contract").abi;
const contractAddress = require("./Contract").address; //Modify

function Wallet (web3Node,firebaseInstance,address){
    if(web3Node.isConnected()){
        this.web3 = web3Node;
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
    var balance = this.myContractInstance.balanceOf(address).toNumber();
    return balance;
}

Wallet.prototype.getEthereumBalance = function (address){ //Ethereum balance
    var balance = this.web3.eth.getBalance(address);
    return this.web3.fromWei(balance.toNumber(),"ether");
}

Wallet.prototype.sendTransaction = function(fromAddress,toAddress,amount,gasLimit,PrivateKey){
    return new Promise((resolve,reject) => {
        var self = this;          
        var nonceHex = self.web3.toHex(self.web3.eth.getTransactionCount(fromAddress));
        var gasPriceHex = self.web3.toHex(self.web3.eth.gasPrice);
        var gasLimitHex = self.web3.toHex(gasLimit);
        var payloadData = self.myContractInstance.transfer.getData(toAddress,amount);
        var privateKey =PrivateKey;
        var rawTx = {
          nonce: nonceHex,
          gasPrice: gasPriceHex, 
          gasLimit: gasLimitHex,
          to: contractAddress, 
          value: '0x00',
          data:payloadData 
        }
        var tx = new Tx(rawTx);
        tx.sign(privateKey); //Sign transaction
        var serializedTx = '0x'+ tx.serialize().toString('hex');
        self.web3.eth.sendRawTransaction(serializedTx, function(err, hash) {
            if (err) {
                reject(err);
            }
        });
    });
}



// export the class
module.exports = Wallet;