/* global BigNumber, Web3, factoryABI, exchangeABI */

let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
let swapForm = document.getElementById('uniswap-form')

// const factoryAddress = "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36" // Rinkeby Testnet
const factoryAddress = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95' // Ethereum Mainet 
const ULTtokenAddress = '0x09617f6fd6cf8a71278ec86e23bbab29c04353a7' // ULT Token
const ULTexchangeAddress = '0x28d9353611C5A0d5a026A648c05E5d6523e41CBf'

let exchangeContract = new web3.eth.Contract(exchangeABI, ULTexchangeAddress)

async function swap (type, inputValue) {
    var gasPriceEst = await web3.eth.getGasPrice();
    exchangeContract.options.gasPrice = gasPriceEst
    
    const blockNumber = await web3.eth.getBlockNumber()
    const block = await web3.eth.getBlock(blockNumber)
    const deadline =  block.timestamp + 300;
    const accounts = await web3.eth.getAccounts()
    
    if (type === 'ETH_TO_ULT') {
        const max_tokens = new BigNumber(100000).toFixed(0)
        const amount = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
        
        exchangeContract.methods.ethToTokenSwapInput(max_tokens,deadline)
            .send({from: accounts[0], value: amount}, (err, data) => {
                if (err) console.log(err)
                else alert('Swap from ETH to ULT is submitted...')
            })
    } else if (type === 'ULT_TO_ETH') {
        let outputValue = 2
        let tokenSold = new BigNumber(inputValue).toFixed(0)
        let minEth = new BigNumber(outputValue).toFixed(0)
        // exchangeContract.methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
        new web3.eth.Contract(exchangeABI, ULTexchangeAddress).methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
            .send({ from: accounts[0] }, (err, data) => {
              if (err) console.log(err) 
              else alert('Swap from ULT to ETH is submitted...')
            })
    }
}

swapForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let from = document.getElementById('convert-from').value
    let to = document.getElementById('convert-to').value
    let inputValue = document.getElementById('swap-amount').value
    let swapType
    if (from === 'ULT' && to === 'ETH') swapType = 'ULT_TO_ETH'
    else if (from === 'ETH' && to === 'ULT') swapType = 'ETH_TO_ULT'
    else return
    swap(swapType, inputValue)
})