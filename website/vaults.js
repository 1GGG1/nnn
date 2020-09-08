$('input[name="currentToken"]').attr('disabled', true);
const initDisplay = () => {
    $('#btn-deposit').attr('disabled', true);
    $('#btn-approve').attr('disabled', true);
    $('#btn-withdraw').attr('disabled', true);
    $('.btn-max').attr('disabled', true);
    $('.input--balance').attr('disabled', true);
}
initDisplay();

const initApp = () => {
    $('input[name="currentToken"]').removeAttr('disabled');
    $('input[name="currentToken"]').on('change', function() {
        $('.input--balance').val(0);
        $('.input--balance').attr('disabled', true);
        currentToken = $(this).val();
        log('selected asset is now: ' + currentToken);
        if(balances[currentToken] || balancesVault[currentToken]) {
            $('.input--balance').removeAttr('disabled');
            if(balances[currentToken]) {
                $('.input--balance').val(balances[currentToken]);
            } else {
                $('.input--balance').val(balancesVault[currentToken]);
            }
        }
    });

    $('.btn-max').on('click', function(e) {

        $('#btn-deposit').attr('disabled', true);
        $('#btn-withdraw').attr('disabled', true);

        if($(e.target).data('type') == 'deposit') {
            $('.input--balance').val(balances[currentToken]);
            $('#btn-deposit').removeAttr('disabled');
        } else if($(e.target).data('type') == 'withdraw') {
            $('.input--balance').val(balancesVault[currentToken]);
            $('#btn-withdraw').removeAttr('disabled');
        } else {
            $('.input--balance').val(balances[currentToken]);
            $('#btn-deposit').removeAttr('disabled');
        }
    });

    $('#btn-approve').on('click', function(e) {
        var _amount = $('.input--balance').val();
        _amount = _amount * (10 ** decimals[currentToken]);
        log('approval of ' +_amount + ' initiated, please confirm');
        contracts[currentToken].approve.sendTransaction(addressContractDepositHelper, _amount, function(error, hash){
            if(hash) {
                log(false, hash);
                log('-- please wait until confirmation and reload page --');
            } else {
                log('approval canceled');
            }
        });
    });

    $('#btn-deposit').on('click', function(e) {
        var _amount = $('.input--balance').val();
        _amount = _amount * (10 ** decimals[currentToken]);

        if(_amount > (allowances[currentToken]) * (10 ** decimals[currentToken])) {
            log('approval initiated, please confirm');
            _amountApprove = 1000000 * (10 ** decimals[currentToken]);
            contracts[currentToken].approve.sendTransaction(addressContractDepositHelper, _amountApprove, function(error, hash){
                if(hash) {
                    log(false, hash);
                    log('-- please wait until confirmation and before depositing --');
                } else {
                    log('approval canceled');
                }
            });
        } else {
            log('deposit initiated, please confirm');
            contractDepositHelper.depositAll.sendTransaction([_amount], [addressContractUSDTVault], function(error, hash){
                if(hash) {
                    log(false, hash);
                    log('-- please wait until confirmation and reload page --');
                } else {
                    log('deposit canceled');
                }
            });
        }
    });

    $('#btn-withdraw').on('click', function(e) {
        var _amount = $('.input--balance').val();
        _amount = _amount * (10 ** decimals[currentToken]);
        log('withdraw initiated, please confirm');
        contractsVault[currentToken].withdraw.sendTransaction(_amount, function(error, hash){
            if(hash) {
                log(false, hash);
            } else {
                log('withdraw canceled');
            }
        });
    });

    fetchBalance('DAI');
    fetchBalance('USDC');
    fetchBalance('USDT');
}

const fetchBalance = (token) => {
    console.log('-------- fetchBalance');
    console.log(token);
    contracts[token].balanceOf(window.web3.eth.accounts[0], (error, result) => {
        if(result) {
            balances[token] = result / (10 ** decimals[token]);
            processApp();
        }
    });
    contracts[token].allowance(window.web3.eth.accounts[0], addressContractDepositHelper, (error, result) => {
        if(result) {
            allowances[token] = result / (10 ** decimals[token]);
            processApp();
        }
    });
    contractsVault[token].balanceOf(window.web3.eth.accounts[0], (error, result) => {
        if(result) {
            balancesVault[token] = result / (10 ** decimals[token]);
            processApp();
        }
    });
    contractsVault[token].underlyingBalanceWithInvestmentForHolder(window.web3.eth.accounts[0], (error, result) => {
        if(result) {
            balancesVaultUnderlying[token] = result / (10 ** decimals[token]);
            processApp();
        }
    });
    contractsPool[token].balanceOf(window.web3.eth.accounts[0], (error, result) => {
        if(result) {
            balancesStaked[token] = result / (10 ** decimals[token]);
            processApp();
        }
    });
}

const processApp = () => {
    initDisplay();
    for(var i = 0; i < token.length; i++) {
        updateVaultDispaly(token[i].token);
    }

}

const updateVaultDispaly = (token) => {
    $('.input--balance[data-token="' + token + '"]').val(balances[token]);
    $('.display--balance[data-token="' + token + '"]').html(round(balances[token], 6));
    $('.display--balance-vault[data-token="' + token + '"]').html(round(balancesVault[token]+balancesStaked[token], 6));
    if(balances[token] > 0 || balancesVault[token] > 0) {
        $('.input--balance[data-token="' + token + '"]').removeAttr('disabled');
        if(balances[token] > 0) {
            $('.btn-max[data-token="' + token + '"]').removeAttr('disabled');
        }
        if(balancesVault[token] > 0) {
            $('.btn-max[data-token="' + token + '"]').removeAttr('disabled');
        }
    }
}



