/* global BigNumber, Web3, factoryABI, exchangeABI, tokenABI, ERC20_ABI, tokenDB, $ */

let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
let exchangeAddresses = tokenDB.exchangeAddresses
let tokenSymbols = Object.keys(exchangeAddresses)
let tokenAddressess = {}
let exchangeContracts = {}
let tokenContracts = {}
const ALLOWED_SLIPPAGE = 0.025;

for (let i = 0; i < tokenSymbols.length; i += 1) {
    exchangeContracts[tokenSymbols[i]] = new web3.eth.Contract(exchangeABI, exchangeAddresses[tokenSymbols[i]])
}

tokenSymbols.forEach(async token => {
    const contract = exchangeContracts[token]
    tokenAddressess[token] = await contract.methods.tokenAddress().call()
    tokenContracts[token] = new web3.eth.Contract(tokenABI, tokenAddressess[token])
    
})

function getSwapType(inputCurrency, outputCurrency) {
    if (inputCurrency !== 'ETH' && outputCurrency === 'ETH') return 'TOKEN_TO_ETH'
    else if (inputCurrency === 'ETH' && outputCurrency !== 'ETH') return 'ETH_TO_TOKEN'
    else if (inputCurrency !== 'ETH' && outputCurrency !== 'ETH') return 'TOKEN_TO_TOKEN'
}

async function swap (data) {
    let { inputValue, inputCurrency, outputValue, outputCurrency } = data
    let type = getSwapType(inputCurrency, outputCurrency)
    
    const blockNumber = await web3.eth.getBlockNumber()
    const block = await web3.eth.getBlock(blockNumber)
    const deadline =  block.timestamp + 300;
    const accounts = await web3.eth.getAccounts()
    let exchangeContract
    if (type === 'ETH_TO_TOKEN') {
        exchangeContract = exchangeContracts[outputCurrency]
        const max_tokens = new BigNumber(100000).toFixed(0)
        const amount = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
        
        exchangeContract.methods.ethToTokenSwapInput(max_tokens,deadline)
            .send({from: accounts[0], value: amount}, (err, data) => {
                if (err) console.log(err)
                else {
                    $('.alert').hide()
                    $('#swapModal').modal('hide')
                    $('#submittedModal').modal('show')
                }
            })
    } else if (type === 'TOKEN_TO_ETH') {
        exchangeContract = exchangeContracts[inputCurrency]
        const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
        const minEth = new BigNumber(2).toFixed(0)
        
        exchangeContract.methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
            .send({ from: accounts[0] }, (err, data) => {
              if (err) console.log(err) 
              else {
                $('.alert').hide()
                $('#swapModal').modal('hide')
                $('#submittedModal').modal('show')
              }
            })
    } else if (type === 'TOKEN_TO_TOKEN') {
        exchangeContract = exchangeContracts[inputCurrency]
        const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
        const minToken = new BigNumber(outputValue).multipliedBy(10 ** 18).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
        const minEth = new BigNumber(1).toFixed(0)
        const outputTokenAddress = tokenAddressess[outputCurrency]
        
        exchangeContract.methods.tokenToTokenSwapInput(
            tokenSold,
            minToken,
            minEth,
            deadline,
            outputTokenAddress
        ).send({ from: accounts[0] }, (err, data) => {
              if (err) console.log(err) 
              else {
                $('.alert').hide()
                $('#swapModal').modal('hide')
                $('#submittedModal').modal('show')
              }
            })
    }
}

async function unlockToken(currency, account) {
    $('.alert').hide()
    $('.alert-wait').show()
    const inputValue = $('#inputValue').val()
    const tokenAddress = tokenAddressess[currency]
    const exchangeAddress = exchangeAddresses[currency]
    const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
    const amount = new BigNumber(10 ** 18).multipliedBy(10 ** 8).toFixed(0)
    await contract.methods.approve(exchangeAddress, amount).send({ from: account })
    
    // check the allowance
    const check = setInterval(async () => {
        let allowance = await getAllowance(currency, inputValue)
        if (allowance > inputValue) {
            clearInterval(check)
            hideUnlockButton()
            $('.alert').hide()
            $('.alert-approved').show()
        }
    }, 1000)
}

async function getOutputValue(inputCurrency, outputCurrency, inputValue) {
    const inputAmount = inputValue
    const type = getSwapType(inputCurrency, outputCurrency)

    if (type === 'ETH_TO_TOKEN') {
        let tokenExchangeAddress = exchangeAddresses[outputCurrency]
        let tokenContract = tokenContracts[outputCurrency]
        let inputReserve = await web3.eth.getBalance(tokenExchangeAddress)
        let outputReserve = await tokenContract.methods.balanceOf(tokenExchangeAddress).call()

        let numerator = inputAmount * outputReserve * 997
        let denominator = inputReserve * 1000 + inputAmount * 997
        const outputAmount = numerator / denominator
        return outputAmount
    } else if (type === 'TOKEN_TO_ETH') {
        let tokenExchangeAddress = exchangeAddresses[inputCurrency]
        let tokenContract = tokenContracts[inputCurrency]
        let inputReserve = await tokenContract.methods.balanceOf(tokenExchangeAddress).call()
        let outputReserve = await web3.eth.getBalance(tokenExchangeAddress)
        
        let numerator = inputAmount * outputReserve * 997
        let denominator = inputReserve * 1000 + inputAmount * 997
        const outputAmount = numerator / denominator
        return outputAmount
    } else if (type === 'TOKEN_TO_TOKEN') {
        let inputAmountA = inputValue
        let tokenContractA = tokenContracts[inputCurrency]
        let exchangeAddressA = exchangeAddresses[inputCurrency]
        let tokenContractB = tokenContracts[outputCurrency]
        let exchangeAddressB = exchangeAddresses[outputCurrency]
        
        // TokenA (ERC20) to ETH conversion
        let inputReserveA = await tokenContractA.methods.balanceOf(exchangeAddressA).call()
        let outputReserveA = await web3.eth.getBalance(exchangeAddressA)

        let numeratorA = inputAmountA * outputReserveA * 997
        let denominatorA = inputReserveA * 1000 + inputAmountA * 997
        let outputAmountA = numeratorA / denominatorA
        
        // ETH to TokenB conversion 
        let inputAmountB = outputAmountA    
        let inputReserveB = await web3.eth.getBalance(exchangeAddressB)
        let outputReserveB = await tokenContractB.methods.balanceOf(exchangeAddressB).call()

        let numeratorB = inputAmountB * outputReserveB * 997
        let denominatorB = inputReserveB * 1000 + inputAmountB * 997
        let outputAmountB = numeratorB / denominatorB
        
        return outputAmountB
    }
}

function drawUI() {
    let selectHTML = `<a class="dropdown-item" token-name="ETH" href="#">ETH</a>`
    for (let i = 0; i < tokenSymbols.length; i += 1) {
        selectHTML += `<a class="dropdown-item" token-name="${tokenSymbols[i]}" href="#">${tokenSymbols[i]}</a>`
    }
    $('#uniswap-form .dropdown-menu').html(selectHTML)
    setTimeout(() => {
        calculateULTPrice().then(price => {
            $('#ULT-price').html(`<strong>${price.toFixed(6)}</strong> $`)
            $('#exchange-info span').text(`${price.toFixed(6)} $`)
        })
    }, 3000)

}

async function calculateULTPrice() {
    let price = await getOutputValue('ULT', 'DAI', 1)
    return price
}

async function renderUnlockButton(inputCurrency, inputValue) {
    if (inputCurrency === 'ETH' || !inputValue || inputValue == 0) hideUnlockButton()
    const allowance = await getAllowance(inputCurrency, inputValue)
    if (inputValue > allowance) displayUnlockButton()
    else hideUnlockButton()
}

async function getAllowance(inputCurrency, inputValue) {
    let exchangeAddress = exchangeAddresses[inputCurrency]
    let tokenAddress = tokenAddressess[inputCurrency]
    const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
    const accounts = await web3.eth.getAccounts()
    let allowance = await contract.methods.allowance(
        accounts[0],
        exchangeAddress
    ).call()
    return allowance
}

function displayUnlockButton() {
    $('#unlock-token-btn').css('display', 'inline-block')
    $('#convert-btn').attr('disabled', true)
    $('.alert').hide()
    $('.alert-unlock').show()
}

function hideUnlockButton() {
    $('#unlock-token-btn').css('display', 'none')
    $('#convert-btn').attr('disabled', false)
    $('.alert').hide()
}

async function updateInputOutput(lastChangedField) {
    const inputCurrency = $('#inputCurrency').val()
    const outputCurrency = $('#outputCurrency').val()
    let inputValue
    let outputValue
    if (lastChangedField === 'input') {
        inputValue = $('#inputValue').val()
        outputValue = await getOutputValue(inputCurrency, outputCurrency, inputValue)
        $('#outputValue').val(outputValue)
    } else if (lastChangedField === 'output') {
        outputValue = $('#outputValue').val()
        inputValue = await getOutputValue(outputCurrency, inputCurrency, outputValue)
        $('#inputValue').val(inputValue)
    }
    renderUnlockButton(inputCurrency, inputValue)
}

function init() {
    drawUI()
    $('#convert-btn').on('click', function(e) {
        let data = {}
        $('#uniswap-form')
            .serializeArray()
            .forEach(input => {
                data[input.name]= input.value
            })
        $('.alert').hide()
        $('.alert-check').show()
        swap(data)
    })
    
    $('#unlock-token-btn').on('click', async e => {
        e.preventDefault()
        const accounts = await web3.eth.getAccounts()
        const inputCurrency = $('#inputCurrency').val()
        await unlockToken(inputCurrency, accounts[0])
    })
    
    $('#swapModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget) // Button that triggered the modal
      var action = button.data('action') // Extract info from data-* attributes
      var modal = $(this)
      if (action === 'buy') modal.find('.modal-title').text('Buy ULT using ETH or ERC20 TOkens')
      else if (action === 'sell') modal.find('.modal-title').text('Sell ULT to receive ETH or ERC20 TOkens')
      modal.find('.modal-body input').val('')
      if (action === 'buy') {
          $('.pay-group button').attr('disabled', false)
          $('.receive-group button').attr('disabled', true)
          $('#inputCurrency').val('ETH')
          $('#outputCurrency').val('ULT')
          $('#input-select-btn').text('ETH')
          $('#output-select-btn').text('ULT')
          $('#convert-btn').text('BUY')
      } else if (action === 'sell') {
          $('.pay-group button').attr('disabled', true)
          $('.receive-group button').attr('disabled', false)
          $('#inputCurrency').val('ULT')
          $('#outputCurrency').val('ETH')
          $('#input-select-btn').text('ULT')
          $('#output-select-btn').text('ETH')
          $('#convert-btn').text('SELL')
      }
      $('.alert').hide()
    })
    
    $('.pay-group .dropdown-menu .dropdown-item').on('click', async function(e) {
        e.preventDefault()
        const selectedToken = this.getAttribute('token-name')
        $('#inputCurrency').val(selectedToken)
        $('#input-select-btn').text(selectedToken)
        updateInputOutput('input')
    })
    
    $('.receive-group .dropdown-menu .dropdown-item').on('click', function(e) {
        e.preventDefault()
        const selectedToken = this.getAttribute('token-name')
        $('#outputCurrency').val(selectedToken)
        $('#output-select-btn').text(selectedToken)
        updateInputOutput('input')
    })
    
    $('#inputValue').on('change', () => {
        updateInputOutput('input')
    })
    
    $('#outputValue').on('change', () => {
        updateInputOutput('output')
    })
}

// start listening events on widget
init ()
