const web3 = new Web3(Web3.givenProvider);
const CONTRACT_ADDRESS = '0x9C8b0a4b76E47D5EABF559298cdC3F1e95EFAA73';
let contractInstance;

window.addEventListener('DOMContentLoaded', () => {
  window.ethereum.enable().then((accounts) => {
    console.log(accounts);
    contractInstance = new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from: accounts[0] });
    updateStats(accounts[0]);
  })
  
  document.getElementById('makeBetButton').addEventListener('click', makeBet);
  document.getElementById('depositButton').addEventListener('click', depositFunds);
  document.getElementById("withdrawPlayerBalance").addEventListener('click', withdrawPlayerBalance);
  document.getElementById("withdrawContractBalance").addEventListener('click', withdrawContractBalance);
});

const updateStats = (account) => {
  document.getElementById('playerAddress').innerText = account;
  document.getElementById('contractAddress').innerText = CONTRACT_ADDRESS;
  getContractBalance();
  getPlayerBalance();
  checkIfOwner();
}

const checkIfOwner = () => {
  contractInstance.methods.isOwner().call()
    .then(response => {
      if (response) {
        document.getElementById("ifOwner").innerText = 'Owner';
      }
    })
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
    .on('transactionHash', hash => {
      console.log('Transaction hash: ', hash);
      startAnimation();
    })
    .on('confirmation', confNum => console.log('Deposit confirmation number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      stopAnimation();
      console.log('Receipt depositFunds: ', receipt);
    });
}

const getContractBalance = () => {
  contractInstance.methods.getAvailableContractBalance().call()
    .then(response => {
      const contractBalance = web3.utils.fromWei(response, 'ether');
      document.getElementById("contractBalance").innerText = contractBalance;
      document.getElementById("withdrawContractAmount").value = contractBalance;
    })
}

const getPlayerBalance = () => {
  contractInstance.methods.getPlayerBalance().call()
    .then(response => {
      const playerBalance = web3.utils.fromWei(response, 'ether');
      document.getElementById("playerBalance").innerText = playerBalance;
      document.getElementById("withdrawPlayerAmount").value = playerBalance;
    })
}

const withdrawPlayerBalance = () => {
  const amount = document.getElementById("withdrawPlayerAmount").value.trim();
  if (isNaN(amount)) {
    alert('Invalid withdraw amount.');
    return;
  }
  const amountInWei = web3.utils.toWei(amount, 'ether');
  contractInstance.methods.withdrawPlayerBalance(amountInWei).send()
    .on('transactionHash', hash => {
      console.log('Transaction hash: ', hash);
      startAnimation();
    })
    .on('confirmation', confNum => console.log('Withdraw player balance confirmation number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      getPlayerBalance();
      stopAnimation();
      console.log('Receipt withdraw: ', receipt);
    });
}

const withdrawContractBalance = () => {
  const amount = document.getElementById("withdrawContractAmount").value.trim();
  if (isNaN(amount)) {
    alert('Invalid withdraw amount.');
    return;
  }
  const amountInWei = web3.utils.toWei(amount, 'ether');
  console.log('withdrawContractBalance', amountInWei);
  contractInstance.methods.withdrawContractBalance(amountInWei).send()
    .on('transactionHash', hash => {
      console.log('Transaction hash: ', hash);
      startAnimation();
    })
    .on('confirmation', confNum => console.log('Withdraw contract balance confirmation number: ', confNum))
    .on('receipt', receipt => {
      getContractBalance();
      getPlayerBalance();
      stopAnimation();
      console.log('Receipt withdrawContractBalance: ', receipt);
    });
}


const makeBet = () => {
  const betInput = document.getElementById('betAmountInput');
  if (isNaN(betInput.value)) {
    alert('Invalid bet amount.');
    return;
  }
  const config = {
    value: web3.utils.toWei(betInput.value, 'ether')
  }
  contractInstance.methods.makeBet().send(config)
    .on('transactionHash', hash => {
      console.log('Make bet transaction hash: ', hash);
      startAnimation();
    })
    .on('confirmation', confNum => console.log('Make bet confirmation number: ', confNum))
    .on('receipt', receipt => {
      stopAnimation();
      getContractBalance();
      getPlayerBalance();
      console.log('Receipt makeBet: ', receipt);
      if (Object.keys(receipt.events).length) {
        console.log('You won!');
      } else {
        console.log('You lost...');
      }
    })
    .catch((err) => {
      stopAnimation();
      console.log('then err', err);
    });
}

const startAnimation = () => {
  document.getElementById('ethLogo').classList.add('rotation');
}

const stopAnimation = () => {
  document.getElementById('ethLogo').classList.remove('rotation');
}
