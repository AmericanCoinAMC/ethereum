/**
 * Created by jessdotjs on 10/07/17.
 */
var ethereumjsWallet = require('ethereumjs-wallet');

function Wallet (){

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
    const walletInstance = ethereumjsWallet.fromV3(file, password);
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


// export the class
module.exports = Wallet;