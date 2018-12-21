/* global BigNumber, Web3, factoryABI, exchangeABI, tokenABI, ERC20_ABI, tokenDB, $ */

let UniswapConvertWidget = async function(config) {
    
    const ERC20_ABI=[{constant:!0,inputs:[],name:"name",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_spender",type:"address"},{name:"_value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"totalSupply",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"symbol",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{name:"_owner",type:"address"},{name:"_spender",type:"address"}],name:"allowance",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{payable:!0,stateMutability:"payable",type:"fallback"},{anonymous:!1,inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"}];
    const factoryABI = [{"name": "NewExchange", "inputs": [{"type": "address", "name": "token", "indexed": true}, {"type": "address", "name": "exchange", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "initializeFactory", "outputs": [], "inputs": [{"type": "address", "name": "template"}], "constant": false, "payable": false, "type": "function", "gas": 35725}, {"name": "createExchange", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "token"}], "constant": false, "payable": false, "type": "function", "gas": 187911}, {"name": "getExchange", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "token"}], "constant": true, "payable": false, "type": "function", "gas": 715}, {"name": "getToken", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "address", "name": "exchange"}], "constant": true, "payable": false, "type": "function", "gas": 745}, {"name": "getTokenWithId", "outputs": [{"type": "address", "name": "out"}], "inputs": [{"type": "uint256", "name": "token_id"}], "constant": true, "payable": false, "type": "function", "gas": 736}, {"name": "exchangeTemplate", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 633}, {"name": "tokenCount", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 663}];
    const tokenABI = [{"name": "Transfer", "inputs": [{"type": "address", "name": "_from", "indexed": true}, {"type": "address", "name": "_to", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Approval", "inputs": [{"type": "address", "name": "_owner", "indexed": true}, {"type": "address", "name": "_spender", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "__init__", "outputs": [], "inputs": [{"type": "bytes32", "name": "_name"}, {"type": "bytes32", "name": "_symbol"}, {"type": "uint256", "name": "_decimals"}, {"type": "uint256", "name": "_supply"}], "constant": false, "payable": false, "type": "constructor"}, {"name": "deposit", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function", "gas": 74279}, {"name": "withdraw", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 108706}, {"name": "totalSupply", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 543}, {"name": "balanceOf", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}], "constant": true, "payable": false, "type": "function", "gas": 745}, {"name": "transfer", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 74698}, {"name": "transferFrom", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_from"}, {"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 110600}, {"name": "approve", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_spender"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 37888}, {"name": "allowance", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}, {"type": "address", "name": "_spender"}], "constant": true, "payable": false, "type": "function", "gas": 1025}, {"name": "name", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 723}, {"name": "symbol", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 753}, {"name": "decimals", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 783}];
    const exchangeABI = [{"name": "TokenPurchase", "inputs": [{"type": "address", "name": "buyer", "indexed": true}, {"type": "uint256", "name": "eth_sold", "indexed": true}, {"type": "uint256", "name": "tokens_bought", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "EthPurchase", "inputs": [{"type": "address", "name": "buyer", "indexed": true}, {"type": "uint256", "name": "tokens_sold", "indexed": true}, {"type": "uint256", "name": "eth_bought", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "AddLiquidity", "inputs": [{"type": "address", "name": "provider", "indexed": true}, {"type": "uint256", "name": "eth_amount", "indexed": true}, {"type": "uint256", "name": "token_amount", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "RemoveLiquidity", "inputs": [{"type": "address", "name": "provider", "indexed": true}, {"type": "uint256", "name": "eth_amount", "indexed": true}, {"type": "uint256", "name": "token_amount", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "Transfer", "inputs": [{"type": "address", "name": "_from", "indexed": true}, {"type": "address", "name": "_to", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Approval", "inputs": [{"type": "address", "name": "_owner", "indexed": true}, {"type": "address", "name": "_spender", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "setup", "outputs": [], "inputs": [{"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 175875}, {"name": "addLiquidity", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_liquidity"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 82605}, {"name": "removeLiquidity", "outputs": [{"type": "uint256", "name": "out"}, {"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "amount"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 116814}, {"name": "__default__", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function"}, {"name": "ethToTokenSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 12757}, {"name": "ethToTokenTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": true, "type": "function", "gas": 12965}, {"name": "ethToTokenSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 50463}, {"name": "ethToTokenTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": true, "type": "function", "gas": 50671}, {"name": "tokenToEthSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 47503}, {"name": "tokenToEthTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": false, "type": "function", "gas": 47712}, {"name": "tokenToEthSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 50175}, {"name": "tokenToEthTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": false, "type": "function", "gas": 50384}, {"name": "tokenToTokenSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 51007}, {"name": "tokenToTokenTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 51098}, {"name": "tokenToTokenSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 54928}, {"name": "tokenToTokenTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 55019}, {"name": "tokenToExchangeSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 49342}, {"name": "tokenToExchangeTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 49532}, {"name": "tokenToExchangeSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 53233}, {"name": "tokenToExchangeTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 53423}, {"name": "getEthToTokenInputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_sold"}], "constant": true, "payable": false, "type": "function", "gas": 5542}, {"name": "getEthToTokenOutputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}], "constant": true, "payable": false, "type": "function", "gas": 6872}, {"name": "getTokenToEthInputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}], "constant": true, "payable": false, "type": "function", "gas": 5637}, {"name": "getTokenToEthOutputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}], "constant": true, "payable": false, "type": "function", "gas": 6897}, {"name": "tokenAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1413}, {"name": "factoryAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1443}, {"name": "balanceOf", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}], "constant": true, "payable": false, "type": "function", "gas": 1645}, {"name": "transfer", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 75034}, {"name": "transferFrom", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_from"}, {"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 110907}, {"name": "approve", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_spender"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 38769}, {"name": "allowance", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}, {"type": "address", "name": "_spender"}], "constant": true, "payable": false, "type": "function", "gas": 1925}, {"name": "name", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1623}, {"name": "symbol", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1653}, {"name": "decimals", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1683}, {"name": "totalSupply", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1713}]
    let web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
    
    let exchangeAddresses
    let tokenSymbols
    let tokenAddressess = {}
    let exchangeContracts = {}
    let tokenContracts = {}
    const ALLOWED_SLIPPAGE = 0.025;
    let mainToken = config.mainToken
    let tokenDB
    // get Token list
    $.getJSON(config.tokenListUrl)
        .done(data => {
            tokenDB = data
            init()
        })

    function init() {
        exchangeAddresses = tokenDB.exchangeAddresses
        tokenSymbols = Object.keys(exchangeAddresses)
        
        for (let i = 0; i < tokenSymbols.length; i += 1) {
            exchangeContracts[tokenSymbols[i]] = new web3.eth.Contract(exchangeABI, exchangeAddresses[tokenSymbols[i]])
        }
        
        tokenSymbols.forEach(async token => {
            const contract = exchangeContracts[token]
            tokenAddressess[token] = await contract.methods.tokenAddress().call()
            tokenContracts[token] = new web3.eth.Contract(tokenABI, tokenAddressess[token])
        })
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
              $('#outputCurrency').val(mainToken.symbol)
              $('#input-select-btn').text('ETH')
              $('#output-select-btn').text(mainToken.symbol)
              $('#convert-btn').text('BUY')
          } else if (action === 'sell') {
              $('.pay-group button').attr('disabled', true)
              $('.receive-group button').attr('disabled', false)
              $('#inputCurrency').val(mainToken.symbol)
              $('#outputCurrency').val('ETH')
              $('#input-select-btn').text(mainToken.symbol)
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
        
        $('#inputValue').on('change keydown paste input', () => {
            updateInputOutput('input')
        })
        
        $('#outputValue').on('change keydown paste input', () => {
            updateInputOutput('output')
        })
    }
    
    // function list
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
        const amount = new BigNumber(10 ** 18).multipliedBy(10 ** 8).toFixed(0)
        
        const tokenAddress = tokenAddressess[currency]
        const exchangeAddress = exchangeAddresses[currency]
        const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
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
    
    async function calcuateInputOutput(inputCurrency, outputCurrency, inputType, value) {
        
        const swapType = getSwapType(inputCurrency, outputCurrency)
    
        if (swapType === 'ETH_TO_TOKEN') {
            let tokenExchangeAddress = exchangeAddresses[outputCurrency]
            let tokenContract = tokenContracts[outputCurrency]
            if (inputType === 'EXACT_INPUT') {
                let inputAmount = new BigNumber(value).multipliedBy(10 ** 18)
                let inputReserve = await web3.eth.getBalance(tokenExchangeAddress)
                let outputReserve = await tokenContract.methods.balanceOf(tokenExchangeAddress).call()
                
                inputReserve = new BigNumber(inputReserve)
                outputReserve = new BigNumber(outputReserve)
                /*
                numerator = inputAmount * outputReserve * 997
                denominator = inputReserve * 1000 + inputAmount * 997
                outputAmount = numerator / denominator
                */
                let numerator = inputAmount.multipliedBy(outputReserve).multipliedBy(997)
                let denominator = (inputReserve.multipliedBy(1000)).plus(inputAmount.multipliedBy(997))
                const outputAmount = numerator.dividedBy(denominator).dividedBy(10 ** 18)
                return outputAmount
            } else if (inputType === 'EXACT_OUTPUT') {
                let outputAmount = new BigNumber(value).multipliedBy(10 ** 18)
                let inputReserve = await web3.eth.getBalance(tokenExchangeAddress)
                let outputReserve = await tokenContract.methods.balanceOf(tokenExchangeAddress).call()
                
                inputReserve = new BigNumber(inputReserve)
                outputReserve = new BigNumber(outputReserve)
                /*
                numerator = outputAmount * inputReserve * 1000
                denominator = (outputReserve - outputAmount) * 997
                inputAmount = numerator / (denominator + 1) 
                */
                let numerator = outputAmount.multipliedBy(inputReserve).multipliedBy(1000)
                let denominator = (outputReserve.minus(outputAmount)).multipliedBy(997)
                let inputAmount = numerator.dividedBy(denominator.plus(1)).dividedBy(10 ** 18)
                return inputAmount
            }
        } else if (swapType === 'TOKEN_TO_ETH') {
            let tokenExchangeAddress = exchangeAddresses[inputCurrency]
            let tokenContract = tokenContracts[inputCurrency]
            if (inputType === 'EXACT_INPUT') {
                
                let inputAmount = new BigNumber(value).multipliedBy(10 ** 18)
                let inputReserve = await tokenContract.methods.balanceOf(tokenExchangeAddress).call()
                let outputReserve = await web3.eth.getBalance(tokenExchangeAddress)
                
                inputReserve = new BigNumber(inputReserve)
                outputReserve = new BigNumber(outputReserve)
                /*
                numerator = inputAmount * outputReserve * 997
                denominator = inputReserve * 1000 + inputAmount * 997
                outputAmount = numerator / denominator
                */
                let numerator = inputAmount.multipliedBy(outputReserve).multipliedBy(997)
                let denominator = (inputReserve.multipliedBy(1000)).plus(inputAmount.multipliedBy(997))
                let outputAmount = numerator.dividedBy(denominator).dividedBy(10 ** 18)
                return outputAmount
            } else if (inputType === 'EXACT_OUTPUT') {
                let outputAmount = new BigNumber(value).multipliedBy(10 ** 18)
                let inputReserve = await tokenContract.methods.balanceOf(tokenExchangeAddress).call()
                let outputReserve = await web3.eth.getBalance(tokenExchangeAddress)
                
                inputReserve = new BigNumber(inputReserve)
                outputReserve = new BigNumber(outputReserve)
                /*
                numerator = outputAmount * inputReserve * 1000
                denominator = (outputReserve - outputAmount) * 997
                inputAmount = numerator / (denominator + 1)
                */
                let numerator = outputAmount.multipliedBy(inputReserve).multipliedBy(1000)
                let denominator = (outputReserve.minus(outputAmount)).multipliedBy(997)
                let inputAmount = numerator.dividedBy(denominator.plus(1)).dividedBy(10 ** 18)
                return inputAmount
            }
        } else if (swapType === 'TOKEN_TO_TOKEN') {
            let tokenContractA = tokenContracts[inputCurrency]
            let exchangeAddressA = exchangeAddresses[inputCurrency]
            let tokenContractB = tokenContracts[outputCurrency]
            let exchangeAddressB = exchangeAddresses[outputCurrency]
            if (inputType === 'EXACT_INPUT') {
                let inputAmountA = new BigNumber(value).multipliedBy(10 ** 18)
                // TokenA (ERC20) to ETH conversion
                let inputReserveA = await tokenContractA.methods.balanceOf(exchangeAddressA).call()
                let outputReserveA = await web3.eth.getBalance(exchangeAddressA)
                inputReserveA = new BigNumber(inputReserveA)
                outputReserveA = new BigNumber(outputReserveA)
        
                // let numeratorA = inputAmountA * outputReserveA * 997
                // let denominatorA = inputReserveA * 1000 + inputAmountA * 997
                // let outputAmountA = numeratorA / denominatorA
                let numeratorA = inputAmountA.multipliedBy(outputReserveA).multipliedBy(997)
                let denominatorA = (inputReserveA.multipliedBy(1000)).plus(inputAmountA * 997)
                let outputAmountA = numeratorA.dividedBy(denominatorA)
    
                // ETH to TokenB conversion 
                let inputAmountB = outputAmountA    
                let inputReserveB = await web3.eth.getBalance(exchangeAddressB)
                let outputReserveB = await tokenContractB.methods.balanceOf(exchangeAddressB).call()
                inputReserveB = new BigNumber(inputReserveB)
                outputReserveB = new BigNumber(outputReserveB)
        
                // let numeratorB = inputAmountB * outputReserveB * 997
                // let denominatorB = inputReserveB * 1000 + inputAmountB * 997
                // let outputAmountB = numeratorB / denominatorB
                let numeratorB = inputAmountB.multipliedBy(outputReserveB).multipliedBy(997)
                let denominatorB = (inputReserveB.multipliedBy(1000)).plus(inputAmountB.multipliedBy(997))
                let outputAmountB = numeratorB.dividedBy(denominatorB).dividedBy(10 ** 18)
                return outputAmountB
            } else if (inputType === 'EXACT_OUTPUT') {
                // Buy TokenB with ETH
                let outputAmountB = new BigNumber(value).multipliedBy(10 ** 18)
                let inputReserveB = await web3.eth.getBalance(exchangeAddressB)
                let outputReserveB = await tokenContractB.methods.balanceOf(exchangeAddressB).call()
                inputReserveB = new BigNumber(inputReserveB)
                outputReserveB = new BigNumber(outputReserveB)
    
                // let numeratorB = outputAmountB * inputReserveB * 1000
                // let denominatorB = (outputReserveB - outputAmountB) * 997
                // let inputAmountB = numeratorB / (denominatorB + 1)
                let numeratorB = outputAmountB.multipliedBy(inputReserveB).multipliedBy(1000)
                let denominatorB = (outputReserveB.minus(outputAmountB)).multipliedBy(997)
                let inputAmountB = numeratorB.dividedBy(denominatorB.plus(1))
                // Buy ETH with TokenA
                let outputAmountA = inputAmountB
                let inputReserveA = await tokenContractA.methods.balanceOf(exchangeAddressA).call()
                let outputReserveA = await web3.eth.getBalance(exchangeAddressA)
                inputReserveA = new BigNumber(inputReserveA)
                outputReserveA = new BigNumber(outputReserveA)
    
                // let numeratorA = outputAmountA * inputReserveA * 1000
                // let denominatorA = (outputReserveA - outputAmountA) * 997
                // let inputAmountA = numeratorA / (denominatorA + 1)
                let numeratorA = outputAmountA.multipliedBy(inputReserveA).multipliedBy(1000)
                let denominatorA = (outputReserveA.minus(outputAmountA)).multipliedBy(997)
                let inputAmountA = numeratorA.dividedBy(denominatorA.plus(1)).dividedBy(10 ** 18)
                return inputAmountA
            }
        }
    }
    
    function drawUI() {
        
        const baseWidgetTemplate = `
        <h3>Convert Tokens on Uniswap Exchange</h3>
        <div class="row">
            <div class="col-md-4">
                <img class="shardus-logo" src="assets/img/logo.svg" alt="shardus-logo">
                <span>ULT</span>
            </div>
            <div class="col-md-4">
                <p>Current Price</p>
                <p id="ULT-price">--</p>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#swapModal" data-action="buy" id="buy-btn">Buy</button>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#swapModal" data-action="sell" id="sell-btn">Sell</button>
                <div class="modal fade" id="swapModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Convert ULT using ETH or ERC20 TOkens</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                          <div class="alert alert-warning alert-dismissible alert-unlock hide" role="alert">
                              Please unlock your token to allow Metamask wallet to spend
                          </div>
                          <div class="alert alert-primary alert-dismissible alert-wait hide" role="alert">
                              Waiting util your approval is confirmed on ethereum blockchain
                          </div>
                          <div class="alert alert-success alert-dismissible alert-approved hide" role="alert">
                              Your approval to spend token is successfully confirmed !
                          </div>
                          <div class="alert alert-info alert-dismissible alert-check hide" role="alert">
                              Check your wallet to Confirm or Cancel the transaction
                          </div>
                          <div class="alert alert-success alert-dismissible alert-submitted hide" role="alert">
                              Transaction submitted.
                          </div>
                        <form id="uniswap-form">
                          <div class="form-group pay-group">
                            <label class="col-form-label">PAY WITH</label>
                            <div class="input-group">
                              <input type="text" class="form-control" aria-label="inputValue" id="inputValue" name="inputValue">
                              <input type="hidden" class="form-control" aria-label="inputCurrency" id="inputCurrency" name="inputCurrency">
                              <div class="input-group-append">
                                <a class="btn" id="unlock-token-btn">Unlock</a>
                                <button type="button" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="input-select-btn">ETH</button>
                                <div class="dropdown-menu">
                                  <a class="dropdown-item" token-name="ULT" href="#">ULT</a>
                                  <a class="dropdown-item" token-name="ETH" href="#">ETH</a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="form-group receive-group">
                            <label class="col-form-label">RECEIVE</label>
                            <div class="input-group">
                              <input type="text" class="form-control" aria-label="outputValue" id="outputValue" name="outputValue">
                              <input type="hidden" class="form-control" aria-label="outputCurrency" id="outputCurrency" name="outputCurrency">
                              <div class="input-group-append">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="output-select-btn">ULT</button>
                                <div class="dropdown-menu">
                                  <a class="dropdown-item" token-name="ULT" href="#">ULT</a>
                                  <a class="dropdown-item" token-name="ETH" href="#">ETH</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <div class="row" id="exchange-info">
                            <div class="col-md-6">
                                <p><strong>Rate</strong></p>
                                <p>1 ULT = <span>0.0002</span></p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Slippage</strong></p>
                                <p>2.5 %</p>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" id="convert-btn" class="btn btn-primary">Convert</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!--submitted modal-->
                <div class="modal" tabindex="-1" role="dialog" id="submittedModal">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Success</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <p>Your transaction successfully submitted to Ethereum Network</p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>`
        
        $('#uniswap-convert-section').html(baseWidgetTemplate)
        
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
        let price = await calcuateInputOutput(mainToken.symbol, 'DAI', 'EXACT_INPUT', 1)
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
            if (!$.isNumeric(inputValue)) {
                $('#outputValue').val('')
                return
            }
            outputValue = await calcuateInputOutput(inputCurrency, outputCurrency, 'EXACT_INPUT', inputValue)
            $('#outputValue').val(outputValue.toFixed(7))
        } else if (lastChangedField === 'output') {
            outputValue = $('#outputValue').val()
            if (!$.isNumeric(outputValue)) {
                $('#inputValue').val('')
                return
            }
            inputValue = await calcuateInputOutput(inputCurrency, outputCurrency, 'EXACT_OUTPUT', outputValue)
            $('#inputValue').val(inputValue.toFixed(7))
        }
        renderUnlockButton(inputCurrency, inputValue)
    }
}

let config = {
    mainToken: {
        symbol: 'ULT',
        exchangeAddress: '0x28d9353611C5A0d5a026A648c05E5d6523e41CBf'
    },
    tokenListUrl: 'https://shardus-uniswap-thantsintoe.c9users.io/assets/js/tokenDB.json',
    colorScheme: {
        mainColor: 'red',
        secondaryColor: 'black'
    },
    logoUrl: 'https://shardus-uniswap-thantsintoe.c9users.io/assets/img/logo.svg'
}
UniswapConvertWidget(config)
