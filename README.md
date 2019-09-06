# Financial-Smart-Contracts

User Manual

This chapter will walk through the actions that need to be taken in order to run the system on a local machine. It is divided into three sections. Firstly, we will explain how to install the software and required libraries. Following this, we will explain how to test, build and run the software on a local server. Lastly, we will go on to elaborate on how to interact with the web application and compose a Nexus smart contract. The given instructions are short — for more details on how to use our software, the GitHub reposi- tory at https://github.com/Noah-Vincenz/Financial-Smart-Contracts.git of- fers a more detailed set of instructions. Additionally, it should be noted that the com- mands listed in this chapter are macOS terminal commands. For usage instructions on a different operating system please refer to the aforementioned GitHub repository. First of all, the instructions in the tutorial at https://github.com/paritytech/pwasm- tutorial should be followed to set up a small pWasm project, install the libraries and tools that are required for this project, and become familiar with the pWasm and Rust environment.
C.1 Installation & Setup C.1.1 Software
In order to download the software locally one can head to the GitHub repository linked above and clone the repository onto the machine that is being used. You can then head to the root directory of the repository and run
$ npm install
This will install all missing npm libraries that are needed to run the software. This assumes that npm is installed on the machine being used. If this is not the case, the instructions on the npm website https://www.npmjs.com/get-npm can be followed to to install the missing tools.
129



C.1. Installation & Setup Nexus
C.1.2 Libra
In order to install Libra, one needs to head to https://github.com/libra/libra and clone the repository. This will download the Libra repository onto the machine that is being used. Once the download has completed, the user can change directory to the root directory of the repository. Following this, one can run Libra locally in the terminal by running


This will launch a single Libra validator node locally on your own blockchain. The running node, however, is not connected to the Libra testnet. This allows you to play around with Libra accounts and exercise the functionality offered by the Move IR. Furthermore, this can be used to send transactions that publish a module, run the transaction script and so one. As of now, the documentation for this is sparse and the Libra Association are currently working on supplying more functionality.

In addition to the above, one can change directory to libra/language/functional tests /tests/testsuite to verify the semantics and correctness of any given Libra code, al- lowing you to exercise modules that modify the global blockchain state in the same way you could do on a real blockchain. After the Move IR source code file named script.mvir, which was produced in section 6.2.6, has been successfully downloaded, this can be located inside the directory above. Running

$ cargo test script.mvir

will then execute the transactions in the downloaded module and verify its correctness.

$ ulimit -n 4096
$ cargo run -p libra_swarm -- -s
  130

C.2. Project Test, Build, and Run Nexus
  1
C.2 Project Test, Build, and Run
After the software has been downloaded and required libraries have been installed, you can test the software by running
$ npm run test -js
to execute the given set of JavaScript tests, or
$ npm run test-rust
to execute our Rust tests. Running
$ npm run build
will compile the Rust smart contract into its corresponding JSON contract code using Wasm. Following this, running
$ gulp
will bundle the JavaScript files and launch a local server hosted at localhost:9001 to execute these and launch our web application. Before accessing the web application, the user must run
$ ./run-parity-chain.sh
in a separate terminal window in order to run a local blockchain instance of the parity development chain. Heading to localhost:9001 in Google Chrome will give you access to the we application. Alternatively, you can run
$ npm start
to execute all the steps mentioned above in their order given.
     131

C.3. Using the Web Application Nexus
 C.3 Using the Web Application
The web application can be accessed at localhost:9001 using Google Chrome. The in- structions in this section assume that MetaMask is correctly installed and set up. If this
is not the case, you can head to https://metamask.io/ to follow their instructions to install MetaMask, import the parity development blockchain with http://127.0.0.1:8545 as the RPC URL, and import the accounts registered on the local parity development blockchain. Alternatively, refer to the aforementioned GitHub repository for instruc- tions. When running the application for the first time or on restarting the browser, the user will be presented with a MetaMask window, asking to allow the web ap- plication to access MetaMask. After having confirmed this, the selected network in MetaMask should be switched to the parity development blockchain network and one
of the imported blockchain accounts should be selected. Once these instructions have been followed and the web application is up and running, the user will be presented with the following user interface.
Figure C.1: Web UI Screenshot 1
 132

C.3. Using the Web Application Nexus
 The user can then provide two parity development chain account addresses to be used for the contract and press the Create Contract button to proceed. This will trigger MetaMask showing the window presented below, asking the user to confirm the trans- action.
Figure C.2: MetaMask Transaction Screenshot
Confirming this transaction will enable the deposit buttons in the web user interface, allowing the user to deposit a specified amount of Ether into both accounts. In order to deposit Ether, the account that is placing the deposit must be selected in MetaMask, otherwise the user will be notified with an error message in the user interface. After both accounts have deposited an arbitrary amount of Ether, the input textarea titled Construct Smart Contract Transactions: will be enabled and the user can start com- posing Nexus contracts by providing a syntactically correct contract from the textarea and then pressing the Make Transaction button. This will add the contract provided by the user to the list of pending contracts and display this in the table presented in figure C.3. In the following figure, the most recently added contract corresponds to zero and give (zero), where both subcontracts are displayed as a single combined supercontract.
 133

C.3. Using the Web Application Nexus
  Figure C.3: Web UI Screenshot 2
Following this, the user can freely use the web application interface to extend the lan- guage, add new contracts, evaluate and manage contracts or acquire pending contracts.