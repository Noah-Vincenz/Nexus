/**
 * @author Noah-Vincenz Noeh <noah-vincenz.noeh18@imperial.ac.uk>
 */

/* jshint esversion: 6 */

import {CODE_HEX, ABI} from "./resources.mjs";

var abi;
var codeHex;
var smartContract;
var smartContractInstance;

window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {

        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name);
        console.log("Web3 Version: " + web3.version.api);
        abi = ABI;
        codeHex = web3.toHex(CODE_HEX);
        smartContract = web3.eth.contract(abi);

    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
});

export function getSelectedMetaMaskAccount() {
    return web3.eth.accounts[0];
}

export function createContract(holderAddress, counterPartyAddress) {
  web3.eth.defaultAccount = holderAddress;
  instantiateNew(holderAddress, counterPartyAddress, codeHex).then(instantiationTxHash => {
      waitForReceipt(instantiationTxHash).then(instantiationReceipt => {
          smartContractInstance = smartContract.at(instantiationReceipt.contractAddress);
      });
  });
}

export function deposit(party, depositAmount) {
  var partyString = "";
  if (party === 1) {
    partyString = "holder";
    holderAddress().then(function(address) {
        console.log("Contract Holder: " + address);
        depositCollateral(address, depositAmount).then(holderDepositTxHash => {
            waitForReceipt(holderDepositTxHash).then(_ => {
                console.log("Deposit of " + depositAmount + " Ether has been added to " + partyString + " account.");
            });
        });
    });
  } else {
    partyString = "counter-party";
    counterPartyAddress().then(function(address) {
        console.log("Contract Counter-Party: " + address);
        depositCollateral(address, depositAmount).then(counterPartyDepositTxHash => {
            waitForReceipt(counterPartyDepositTxHash).then(_ => {
                console.log("Deposit of " + depositAmount + " Ether has been added to " + partyString + " account.");
            });
        });
    });
  }
}

// this does not exist for Kovan chain
function unlockAccount(address) {
    return new Promise (function (resolve, reject) {
        web3.personal.unlockAccount(address, "user", web3.toHex(0), function(err, result) {
            if (err) {
              reject(err);
            } else {
              console.log("Account has been unlocked: " + JSON.stringify(result));
              resolve();
            }
        });
    });
}

function estimateGas(dataIn) {
    return new Promise (function (resolve, reject) {
        web3.eth.estimateGas({to: web3.eth.defaultAccount, data: dataIn}, function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result * 1.2);
            }
        });
    });
}

function getGasLimit() {
    return new Promise (function (resolve, reject) {
        web3.eth.getBlock("latest", function(err, block) {
            if (err) {
                reject(err);
            } else {
                resolve(block.gasLimit);
            }
        });
    });
}

function instantiateNew (holderAddress, counterPartyAddress, dataIn) {
    return new Promise (function (resolve, reject) {
        smartContract.new(holderAddress, counterPartyAddress, {data: dataIn, from: web3.eth.defaultAccount}, function (err, contractInstance) {
        //smartContract.new({data: dataIn, from: web3.eth.defaultAccount, gasPrice: 4000000000, gas: gasLimit}, function (err, contractInstance) {
            if (err) {
                reject(err);
            } else {
                var transactionHash = contractInstance.transactionHash;
                console.log("TransactionHash: " + transactionHash + " waiting to be mined...");
                resolve(transactionHash);
            }
        });
    });
}

function stringToBin(str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
}

function depositCollateral(senderAddress, amount) {
    return new Promise (function (resolve, reject) {
        console.log(senderAddress);
        console.log(web3.toChecksumAddress(senderAddress));
        console.log(smartContractInstance);
        smartContractInstance.depositCollateral(amount, {from: senderAddress, value: web3.toWei(amount, "ether")}, function (err, result) {
            if(err) {
                  reject(err);
            } else {
                  resolve(result.toString(10));
            }
        });
    });
}

export function holderBalance() {
    return new Promise (function (resolve, reject) {
        smartContractInstance.holderBalance(function (err, result) {
            if(err) {
                  reject(err);
            } else {
                  resolve(web3.toDecimal(result));
            }
        });
    });
}

export function counterPartyBalance() {
    return new Promise (function (resolve, reject) {
        smartContractInstance.counterPartyBalance(function (err, result) {
            if(err) {
                  reject(err);
            } else {
                  resolve(web3.toDecimal(result));
            }
        });
    });
}

export function holderAddress() {
    return new Promise (function (resolve, reject) {
        smartContractInstance.holderAddress(function (err, result) {
            if(err) {
                  reject(err);
            } else {
                  var unpaddedAddr = web3.toHex(result.toString(10));
                  // pad address to length of 42
                  var paddedAddr = unpaddedAddr.split("0x")[1].padStart(40, '0');
                  resolve("0x" + paddedAddr);
            }
        });
    });
}

export function counterPartyAddress() {
    return new Promise (function (resolve, reject) {
        smartContractInstance.counterPartyAddress(function (err, result) {
            if(err) {
                  reject(err);
            } else {
                  var unpaddedAddr = web3.toHex(result.toString(10));
                  // pad address to length of 42
                  var paddedAddr = unpaddedAddr.split("0x")[1].padStart(40, '0');
                  resolve("0x" + paddedAddr);
            }
        });
    });
}

export function balanceOfAddress(address) {
    return new Promise (function (resolve, reject) {
        smartContractInstance.balanceOfAddress(web3.toChecksumAddress(address), function (err, result) {
            if(err) {
                  reject(err);
            } else {
                  resolve(web3.toDecimal(result));
            }
        });
    });
}


export function transfer(fromAddress, toAddress, amount) {
  return new Promise (function (resolve, reject) {
      smartContractInstance.transfer(fromAddress, toAddress, amount, function(err, result) {
          if (err) {
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
}

export function waitForReceipt(transactionHash) {
  return new Promise (function (resolve, reject) {
      web3.eth.getTransactionReceipt(transactionHash, function (err, receipt) {

            if (err) {
                reject(err);
            } else {
              if (receipt !== null) {
                // Transaction went through
                resolve(receipt);
              } else {
                // Try again in 1 second
                window.setTimeout(function () {
                  waitForReceipt(transactionHash);
                }, 1000);
              }
            }
      });
  });
}

function transferEther(fromAddress, toAddress, amount) {
    web3.eth.sendTransaction({
      to: toAddress,
      from: fromAddress,
      gasPrice: "20000000000",
      gas: "210000",
      value: web3.toWei(amount, "ether")}, function(err, transactionHash) {
        if (!err) {
          console.log("Transferred ether.");
          console.log("TransactionHash: " + transactionHash);
        }
    });
}