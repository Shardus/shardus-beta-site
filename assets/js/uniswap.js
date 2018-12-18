/* global BigNumber, Web3, factoryABI, exchangeABI, tokenABI */

let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
let swapForm = document.getElementById('uniswap-form')

// const factoryAddress = "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36" // Rinkeby Testnet
const factoryAddress = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95' // Ethereum Mainet 
const ULTtokenAddress = '0x09617f6fd6cf8a71278ec86e23bbab29c04353a7' // ULT Token
const ULTexchangeAddress = '0x28d9353611C5A0d5a026A648c05E5d6523e41CBf'

let exchangeContract = new web3.eth.Contract(exchangeABI, ULTexchangeAddress)
let tokenContract = new web3.eth.Contract(tokenABI, ULTtokenAddress)
const ALLOWED_SLIPPAGE = 0.025;

let inputCurrency
let outputCurrency
let inputValue
let outputValue

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
                else alert('Swap from ETH to ULT is submitted...')
            })
    } else if (type === 'ULT_TO_ETH') {
        const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
        const minEth = new BigNumber(2).toFixed(0)
        
        exchangeContract.methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
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

document.getElementById('swap-amount').addEventListener('change', updateUI)

async function getOutputValue(inputCurrency, outputCurrency, inputValue) {
    const inputAmount = inputValue
    let type
    let inputReserve
    let outputReserve
    if (inputCurrency === 'ETH') type = 'ETH_TO_TOKEN'
    else if (outputCurrency === 'ETH') type = 'TOKEN_TO_ETH'
    else if (inputCurrency !== 'ETH' && outputCurrency !== 'ETH') type = 'TOKEN_TO_TOKEN'
    if (type === 'ETH_TO_TOKEN') {
        inputReserve = await web3.eth.getBalance(ULTexchangeAddress)
        outputReserve = await tokenContract.methods.balanceOf(ULTexchangeAddress).call()
    } else if (type === 'TOKEN_TO_ETH') {
        inputReserve = await tokenContract.methods.balanceOf(ULTexchangeAddress).call()
        outputReserve = await web3.eth.getBalance(ULTexchangeAddress)
    }
    // Output amount
    let numerator = inputAmount * outputReserve * 997
    let denominator = inputReserve * 1000 + inputAmount * 997
    const outputAmount = numerator / denominator
    return outputAmount
}

async function updateUI() {
    let { inputCurrency, outputCurrency, inputValue } = getDataFromUI()
    const output = await getOutputValue(inputCurrency, outputCurrency, inputValue)
    document.getElementById('outputValue').textContent = output.toFixed(6)
    document.getElementById('outputUnit').textContent = outputCurrency
}

function getDataFromUI() {
    inputCurrency = document.getElementById('convert-from').value
    outputCurrency = document.getElementById('convert-to').value
    inputValue = document.getElementById('swap-amount').value
    return { inputCurrency, outputCurrency, inputValue }
}
