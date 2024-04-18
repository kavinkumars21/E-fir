import React, { useEffect } from 'react'
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "./faceGallery/SimpleStorage.json";

function Sample() {

    const contractAddress = '0x4fc6Dcc0ADd89F9D61705309F192a433238CE3e8';
  const contractAbi = abi;

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        console.log('Connected accounts:', accounts);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }
    loadWeb3();
  }, []);

    async function fetchData() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const result = await contract.getPerson();
            console.log('Data from smart contract:', result);
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    }

  return (
    <div>
        <button onClick={fetchData}>Get data</button>
    </div>
  )
}

export default Sample
