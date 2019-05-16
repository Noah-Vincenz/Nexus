#!/bin/bash

# Runs the parity node
start-node () {
    parity --chain ./wasm-dev-chain.json --jsonrpc-apis=all --jsonrpc-cors=all --geth
}

# Initialises an admin account on the blockchain after a delay
init-account () {
    sleep 2
    curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["user", "user"],"id":0}' -H "Content-Type: application/json" -X POST localhost:8545
}

# Initialise the account after a delay, and start the parity node
init-account & start-node
