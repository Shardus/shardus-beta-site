/* global BigNumber, Web3, factoryABI, exchangeABI */

let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
let swapForm = document.getElementById('uniswap-form')

const factoryAddress = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95' // Ethereum Mainet 
const tokenAddress = '0x09617f6fd6cf8a71278ec86e23bbab29c04353a7' // ULT Token

let factoryContract = new web3.eth.Contract(factoryABI, factoryAddress)
let exchangeAddress = factoryContract.methods.getExchange(tokenAddress)
let exchangeContract = new web3.eth.Contract(exchangeABI, exchangeAddress)

exchangeContract.options.address = '0x09617f6fd6cf8a71278ec86e23bbab29c04353a7'
exchangeContract.options.gasPrice = '200000000' // default gas price in wei
exchangeContract.options.gas = 5000000 // provide as fallback always 5M gas

const ALLOWED_SLIPPAGE = 0.025
const TOKEN_ALLOWED_SLIPPAGE = 0.04

async function swap (type, inputValue) {
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
                else alert('Swap from ETH to ULT is successful...')
            })
    } else if (type === 'ULT_TO_ETH') {
        let outputValue = 0.00001
        let tokenSold = new BigNumber(inputValue).toFixed(0)
        let minEth = new BigNumber(outputValue).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
        exchangeContract.methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
            .send({ from: accounts[0] }, (err, data) => {
              if (err) console.log(err) 
              alert('Swap from ULT to ETH is successful...')
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