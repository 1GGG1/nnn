const addressContractDepositHelper = ''

const addressContractDAI = ''
const addressContractDAIVault = ''
const addressContractDAIPool = ''

const addressContractUSDC = ''
const addressContractUSDCVault = ''
const addressContractUSDCPool = ''

const addressContractUSDT = ''
const addressContractUSDTVault = ''
const addressContractUSDTPool = ''


let token = [
    {
        'token' : 'DAI',
        'decimals': 18,
        'address': addressContractDAI,
        'addressVault': addressContractDAIVault,
        'addressPool': addressContractDAIPool
    },
    {
        'token': 'USDC',
        'decimals': 6,
        'address': addressContractUSDC,
        'addressVault': addressContractUSDCVault,
        'addressPool': addressContractUSDCPool
    },
    {
        'token': 'USDT',
        'decimals': 6,
        'address': addressContractUSDT,
        'addressVault': addressContractUSDTVault,
        'addressPool': addressContractUSDTPool
    },
];


let decimals = {
    'DAI': 18,
    'USDC': 6,
    'USDT': 6,
    'yfBETA': 18
};

let rewardToken = 'yfBETA';