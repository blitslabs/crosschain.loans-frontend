module.exports.ABI = {
    CrosschainLoans: {
        abi: [
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "contractAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "maxLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "minLoanAmount",
                        "type": "uint256"
                    }
                ],
                "name": "AddAssetType",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "AddAuthorization",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "secretB1",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "CancelLoan",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "contractAddress",
                        "type": "address"
                    }
                ],
                "name": "DisableAssetType",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "DisableContract",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "contractAddress",
                        "type": "address"
                    }
                ],
                "name": "EnableAssetType",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "EnableContract",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "secretHashA1",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "LoanAssignedAndApproved",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    }
                ],
                "name": "LoanCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "LoanFunded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "secretA1",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "LoanPrincipalWithdrawn",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "LoanRepaymentAccepted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "parameter",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "data",
                        "type": "uint256"
                    }
                ],
                "name": "ModifyAssetTypeLoanParameters",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "parameter",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "data",
                        "type": "uint256"
                    }
                ],
                "name": "ModifyLoanParameters",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_referral",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_referrer",
                        "type": "address"
                    }
                ],
                "name": "NewReferral",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_referral",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_referrer",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "PayReferrer",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "Payback",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "name": "RefundPayback",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "RemoveAuthorization",
                "type": "event"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "acceptExpirationPeriod",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretB1",
                        "type": "bytes32"
                    }
                ],
                "name": "acceptRepayment",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_maxLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_minLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_baseRatePerYear",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_multiplierPerYear",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_referralFees",
                        "type": "uint256"
                    }
                ],
                "name": "addAssetType",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "addAuthorization",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_marketAddress",
                        "type": "address"
                    }
                ],
                "name": "addMoneyMarket",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "assetTypes",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "maxLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "supply",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "demand",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "baseRatePerPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "multiplierPerPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "enabled",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "contractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "referralFees",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "authorizedAccounts",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretB1",
                        "type": "bytes32"
                    }
                ],
                "name": "cancelLoanBeforePrincipalWithdraw",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "contractEnabled",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "_secretHashB1",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_principal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_aCoinLenderAddress",
                        "type": "address"
                    }
                ],
                "name": "createLoan",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "_secretHashB1",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_principal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_aCoinLenderAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_referrer",
                        "type": "address"
                    }
                ],
                "name": "createLoan",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    }
                ],
                "name": "disableAssetType",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "disableContract",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    }
                ],
                "name": "enableAssetType",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "enableContract",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "fetchLoan",
                "outputs": [
                    {
                        "internalType": "address payable[2]",
                        "name": "actors",
                        "type": "address[2]"
                    },
                    {
                        "internalType": "bytes32[2]",
                        "name": "secretHashes",
                        "type": "bytes32[2]"
                    },
                    {
                        "internalType": "bytes32[2]",
                        "name": "secrets",
                        "type": "bytes32[2]"
                    },
                    {
                        "internalType": "uint256[2]",
                        "name": "expirations",
                        "type": "uint256[2]"
                    },
                    {
                        "internalType": "uint256[2]",
                        "name": "details",
                        "type": "uint256[2]"
                    },
                    {
                        "internalType": "address",
                        "name": "aCoinLenderAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "enum CrosschainLoansMoneyMarket.State",
                        "name": "state",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "contractAddress",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_account",
                        "type": "address"
                    }
                ],
                "name": "getAccountLoans",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    }
                ],
                "name": "getAssetInterestRate",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    }
                ],
                "name": "getAssetType",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "maxLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minLoanAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "supply",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "demand",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "baseRatePerPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "multiplierPerPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestRate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "enabled",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "contractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "referralFees",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_account",
                        "type": "address"
                    }
                ],
                "name": "getReferrer",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "loanExpirationPeriod",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "loanIdCounter",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_contractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_parameter",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_data",
                        "type": "uint256"
                    }
                ],
                "name": "modifyAssetTypeLoanParameters",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "_parameter",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_data",
                        "type": "uint256"
                    }
                ],
                "name": "modifyLoanParameters",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "internalType": "contract CToken",
                        "name": "_market",
                        "type": "address"
                    }
                ],
                "name": "modifyMoneyMarket",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "moneyMarkets",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "isEnabled",
                        "type": "bool"
                    },
                    {
                        "internalType": "contract CToken",
                        "name": "market",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "payback",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "referrals",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "referrers",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "refundPayback",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "removeAuthorization",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_referrer",
                        "type": "address"
                    }
                ],
                "name": "saveReferrer",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "secondsPerYear",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "_borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretHashA1",
                        "type": "bytes32"
                    }
                ],
                "name": "setBorrowerAndApprove",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "_status",
                        "type": "bool"
                    }
                ],
                "name": "toggleMoneyMarket",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "totalReferrals",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "userLoans",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "userLoansCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_supply",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_demand",
                        "type": "uint256"
                    }
                ],
                "name": "utilizationRate",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretA1",
                        "type": "bytes32"
                    }
                ],
                "name": "withdraw",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    },
    CollateralLockV2: {
        abi: [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "AddAuthorization",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "DisableContract",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "EnableContract",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "lender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "collateral",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "collateralValue",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "bCoinLoanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "loansContractAddress",
                        "type": "address"
                    }
                ],
                "name": "LockCollateral",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "parameter",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "data",
                        "type": "uint256"
                    }
                ],
                "name": "ModifyLoanParameters",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "RemoveAuthorization",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "lender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "SeizeCollateral",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "collateral",
                        "type": "uint256"
                    }
                ],
                "name": "UnlockAndClose",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "UnlockRefundableCollateral",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "addAuthorization",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "authorizedAccounts",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [],
                "name": "collateralizationRatio",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [],
                "name": "contractEnabled",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [],
                "name": "disableContract",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "enableContract",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "loanExpirationPeriod",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [],
                "name": "loanIdCounter",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "removeAuthorization",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "userLoans",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "userLoansCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "_lender",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretHashA1",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretHashB1",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "_bCoinBorrowerAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_bCoinLoanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "_loansContractAddress",
                        "type": "address"
                    }
                ],
                "name": "lockCollateral",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function",
                "payable": true
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretB1",
                        "type": "bytes32"
                    }
                ],
                "name": "unlockCollateralAndCloseLoan",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "_secretA1",
                        "type": "bytes32"
                    }
                ],
                "name": "seizeCollateral",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "fetchLoan",
                "outputs": [
                    {
                        "internalType": "address[3]",
                        "name": "actors",
                        "type": "address[3]"
                    },
                    {
                        "internalType": "bytes32[2]",
                        "name": "secretHashes",
                        "type": "bytes32[2]"
                    },
                    {
                        "internalType": "bytes32[2]",
                        "name": "secrets",
                        "type": "bytes32[2]"
                    },
                    {
                        "internalType": "uint256[2]",
                        "name": "expirations",
                        "type": "uint256[2]"
                    },
                    {
                        "internalType": "uint256[4]",
                        "name": "details",
                        "type": "uint256[4]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bCoinLoanId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "loansContractAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "enum CollateralLockV2.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_account",
                        "type": "address"
                    }
                ],
                "name": "getAccountLoans",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "_parameter",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_data",
                        "type": "uint256"
                    }
                ],
                "name": "modifyLoanParameters",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    },
    ERC20: {
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "symbol",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    },
    AggregatorTest: {
        abi: [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "int256",
                        "name": "current",
                        "type": "int256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "roundId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "name": "AnswerUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "roundId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "startedBy",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "startedAt",
                        "type": "uint256"
                    }
                ],
                "name": "NewRound",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "latestAnswer",
                "outputs": [
                    {
                        "internalType": "int256",
                        "name": "",
                        "type": "int256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [],
                "name": "latestTimestamp",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [],
                "name": "latestRound",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "roundId",
                        "type": "uint256"
                    }
                ],
                "name": "getAnswer",
                "outputs": [
                    {
                        "internalType": "int256",
                        "name": "",
                        "type": "int256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "roundId",
                        "type": "uint256"
                    }
                ],
                "name": "getTimestamp",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function",
                "constant": true
            },
            {
                "inputs": [
                    {
                        "internalType": "int256",
                        "name": "price",
                        "type": "int256"
                    }
                ],
                "name": "updateAnswer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    }
}