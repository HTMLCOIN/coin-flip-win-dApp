let coinOption;
let isHeadSelected;
const betInput = document.getElementById('betAmountInput');
const makeBetButton = document.getElementById('makeBetButton');
betInput.setAttribute('disabled', 'true');
makeBetButton.setAttribute('disabled', 'true');

function showGenre(item) {
  betInput.removeAttribute('disabled');
  makeBetButton.removeAttribute('disabled');
  coinOption = item.textContent.trim();
  document.getElementById("coinOption").innerHTML = item.innerHTML;
}

const web3 = new Web3(Web3.givenProvider);
const CONTRACT_ADDRESS = '0x9a73702dd209a3C249Cc8B860D0dfF61fEf65fa9';
let contractInstance;

window.addEventListener('DOMContentLoaded', () => {
  window.ethereum.enable().then((accounts) => {
    console.log(accounts);
    contractInstance = new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from: accounts[0] });
    getContractBalance();
  })
  
  const head = document.getElementById("coin-head");
  const tail = document.getElementById("coin-tail");
  const coinSelection = document.getElementById("coin-selection");
  selectHead(head, tail, coinSelection);
  head.addEventListener("click", () => selectHead(head, tail, coinSelection));
  tail.addEventListener("click", () => selectTail(head, tail, coinSelection));

  document.getElementById('makeBetButton').addEventListener('click', makeBet);
  document.getElementById('depositButton').addEventListener('click', depositFunds);
  document.getElementById("withdraw-button").addEventListener('click', withdraw);
  document.getElementById("withdraw-all-button").addEventListener('click', withdrawAll);
});

const selectHead = (head, tail, coinSelection) => {
  tail.classList.remove("selected");
  head.classList.add("selected");
  coinSelection.textContent = 'Head';
  isHeadSelected = true;
}

const selectTail = (head, tail, coinSelection) => {
  head.classList.remove("selected");
  tail.classList.add("selected");
  coinSelection.textContent = 'Tail';
  isHeadSelected = false;
}

const depositFunds = () => {
  console.log('depositFunds');
  const depositAmount = (document.getElementById("depositAmount").value).trim();
  if (isNaN(depositAmount)) {
    return;
  }
  const config = {
    value: web3.utils.toWei(depositAmount, 'ether')
  }
  contractInstance.methods.depositFunds().send(config)
    .on('transactionHash', hash => console.log('Transaction hash: ', hash))
    .on('confirmation', confNum => console.log('Confirmation number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      console.log('Receipt depositFunds: ', receipt);
    });
}

const getContractBalance = () => {
  const contractBalance = document.getElementById("contract-balance");
  contractInstance.methods.getContractBalance().call()
    .then(response => {
      contractBalance.value = web3.utils.fromWei(response, 'ether');
    })
}

const withdraw = () => {
  const withdrawAmount = (document.getElementById("withdraw-amount").value).trim();
  if (isNaN(withdrawAmount)) {
    return;
  }
  const weiAmount = web3.utils.toWei(withdrawAmount, 'ether');
  contractInstance.methods.withdraw(weiAmount).send()
    .on('transactionHash', hash => console.log('Transaction hash: ', hash))
    .on('confirmation', confNum => console.log('Confirmation number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      console.log('Receipt withdraw: ', receipt);
    });
}

const withdrawAll = () => {
  contractInstance.methods.withdrawAll().send()
    .on('transactionHash', hash => console.log('Transaction hash: ', hash))
    .on('confirmation', confNum => console.log('Confirmation number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      console.log('Receipt withdrawAll: ', receipt);
    });
}


const makeBet = () => {
  const betInput = document.getElementById('betAmountInput');
  if (isNaN(betInput.value)) {
    alert('Invalid bet amount.');
    return;
  }

  const coinSide = +isHeadSelected;
  const config = {
    value: web3.utils.toWei(betInput.value, coinOption)
  }
  contractInstance.methods.makeBet(coinSide).send(config)
    .on('transactionHash', hash => console.log('Transaction hash: ', hash))
    .on('confirmation', confNum => console.log('Conf. number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      console.log('Receipt makeBet: ', receipt);
      if (Object.keys(receipt.events).length) {
        console.log('You won!');
      } else {
        console.log('You lost...');
      }
    });
}