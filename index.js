const web3 = new Web3(Web3.givenProvider);
let contractInstance;

window.addEventListener('DOMContentLoaded', () => {
  window.ethereum.enable().then((accounts) => {
    console.log(accounts);
    const addressCoinFlipContract = '0x22f3C81818cc3Ab27458a36B7Ea28D3b5F627030';
    contractInstance = new web3.eth.Contract(abi, addressCoinFlipContract, { from: accounts[0] });
    // getContractBalance();
  })
  

  const head = document.getElementById("coin-head");
  const tail = document.getElementById("coin-tail");
  const coinSelection = document.getElementById("coin-selection");
  head.addEventListener("click", () => selectHead(head, tail, coinSelection));
  tail.addEventListener("click", () => selectTail(head, tail, coinSelection));

  document.getElementById('bet-button').addEventListener('click', makeBet);
  document.getElementById('deposit-button').addEventListener('click', depositFunds);
  document.getElementById('contract-balance-button').addEventListener('click', getContractBalance);
  document.getElementById("withdraw-button").addEventListener('click', withdraw);
  document.getElementById("withdraw-all-button").addEventListener('click', withdrawAll);
});

const selectHead = (head, tail, coinSelection) => {
  tail.classList.remove("selected");
  head.classList.add("selected");
  coinSelection.textContent = 'Head';
}

const selectTail = (head, tail, coinSelection) => {
  head.classList.remove("selected");
  tail.classList.add("selected");
  coinSelection.textContent = 'Tail';
}

const depositFunds = () => {
  const depositAmount = (document.getElementById("deposit-amount").value).trim();
  if (isNaN(depositAmount)) {
    return;
  }
  const config = {
    value: web3.utils.toWei(depositAmount, 'ether')
  }
  contractInstance.methods.depositFunds().send(config)
    .on('transactionHash', hash => console.log('Transaction hash: ', hash))
    .on('confirmation', confNum => console.log('Conf. number: ', confNum))
    .on('receipt', receipt => console.log('Receipt: ', receipt));
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
  contractInstance.methods.withdraw(weiAmount).call()
    .then(response => {
      console.log('withdraw response: ', response);
    })
}

const withdrawAll = () => {
  contractInstance.methods.withdrawAll().call()
    .then(response => {
      console.log('withdraw response: ', response);
    })
}


const makeBet = () => {
  const betInput = document.getElementById('bet-input');
  const config = {
    value: web3.utils.toWei('1', 'ether')
  }

  // contractInstance.methods.
  console.log('make bet:', betInput.value, isNaN(betInput.value));
}