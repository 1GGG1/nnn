$('input[name="currentPool"]').attr('disabled', true);
const initDisplay = () => {
    $('#input--balance').attr('disabled', true);
    $('#btn-stake').attr('disabled', true);
    $('#btn-claim').attr('disabled', true);
    $('#btn-unstake').attr('disabled', true);
}
initDisplay();

const initApp = () => {

    $('input[name="currentPool"]').removeAttr('disabled');
    $('input[name="currentPool"]').on('change', function() {
        currentPool = $(this).val();
        currentToken = $(this).data('token');
        log('selected pool is now: ' + currentPool);

        contractsPool[currentToken].balanceOf(window.web3.eth.accounts[0], (error, result) => {
            if(result) {
                balancesStaked[currentToken] = result / (10 ** decimals[currentToken]);
                processApp();
            }
        });
        contractsPool[currentToken].earned(window.web3.eth.accounts[0], (error, result) => {
            if(result) {
                balancesClaimable[currentToken] = round(result / (10 ** decimals[rewardToken]), 6);
                processApp();
            }
        });
        contractsVault[currentToken].balanceOf(window.web3.eth.accounts[0], (error, result) => {
            if(result) {
                balances[currentToken] = result / (10 ** decimals[currentToken]);
                processApp();
            }
        });

    });

    $('.btn-max').on('click', function(event) {
        $('#input--balance').val(balances[currentToken]);
    });

    $('#btn-stake').on('click', function(event) {
        var _amount = $('#input--balance').val();
        _amount = _amount * (10 ** decimals[currentToken]);
        log('stake process initiated, please confirm');
        contractsPool[currentToken].stake.sendTransaction(_amount, function(error, hash){
            if(hash) {
                log(false, hash);
                log('-- please wait until confirmation and reload page --');
            } else {
                log('stake canceled');
            }
        });
    });

    $('#btn-claim').on('click', function(event) {
        contractsPool[currentToken].getReward.sendTransaction(function(error, hash){
            if(hash) {
                log(false, hash);
                log('-- please wait until confirmation and reload page --');
            } else {
                log('reward claim canceled');
            }
        });
    });

    $('#btn-unstake').on('click', function(event) {
        contractsPool[currentToken].exit.sendTransaction(function(error, hash){
            if(hash) {
                log(false, hash);
                log('-- please wait until confirmation and reload page --');
            } else {
                log('unstake canceled');
            }
        });
    });

}

const processApp = () => {
    initDisplay();

    $('#balance-unstaked').html(balances[currentToken]);
    $('#balance-claimable').html(balancesClaimable[currentToken]);
    $('#balance-staked').html(balancesStaked[currentToken]);

    if(balances[currentToken] > 0) {
        $('#btn-stake').removeAttr('disabled');
        $('#input--balance').removeAttr('disabled');
    }
    if(balancesClaimable[currentToken] > 0) {
        $('#btn-claim').removeAttr('disabled');
    }
    if(balancesStaked[currentToken] > 0) {
        $('#btn-unstake').removeAttr('disabled');
    }
}