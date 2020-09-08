const browserOkay = () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        return true;
    }
    return false;
}

if (browserOkay()) {

} else {
    alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
}



const round = (value, decimals) => {
    value = value*(10**decimals);
    value = Math.round(value);
    value = value / (10**decimals);
    return value.toString();
}

const log = (message, tx_hash) => {
    if(tx_hash) {
        $('#log-container').append('tx sent: <a href="https://etherscan.io/tx/' + tx_hash + '" target="_blank">view on etherscan.io</a><br>');
    } else {
        $('#log-container').append(message + '<br>');
    }
}

$('#btn-wallet-connect').click(async () => {
    $('#btn-wallet-connect').attr('disabled', true);
    if(window.web3.eth.accounts.length > 0) {
        log('wallet connected: ' + window.web3.eth.accounts[0]);
        $('#container-wallet-connect').hide();
        initApp();
    } else {
        try {
            await window.ethereum.enable();
            log('wallet connected: ' + window.web3.eth.accounts[0]);
            $('#container-wallet-connect').hide();
            initApp();
        } catch (error) {

        }
    }
})


let contracts = [];
let contractDepositHelper = web3.eth.contract(abiDepositHelper).at(addressContractDepositHelper);
let contractsVault = [];
let contractsPool = [];
let balances = [];
let allowances = [];
let balancesVault = [];
let balancesVaultUnderlying = [];
let balancesClaimable = [];
let balancesStaked = [];
let currentToken = null;
let currentPool = null;


for(var i = 0; i < token.length; i++) {
    var _token = token[i]['token'];
    var _tokenAddress = token[i]['address'];
    var _vaultAddress = token[i]['addressVault'];
    var _poolAddress = token[i]['addressPool'];
    contracts[_token] = web3.eth.contract(abiERC20).at(_tokenAddress);
    contractsVault[_token] = web3.eth.contract(abiVault).at(_vaultAddress);
    contractsPool[_token] = web3.eth.contract(abiPool).at(_poolAddress);
}