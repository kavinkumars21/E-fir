import React, { useEffect } from 'react'
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "../Util/FirStorage.json";

function Sample() {

    const contractAddress = '';
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
            const result = await contract.getAllFIR();
            console.log('Data from smart contract:');
          const data = result.map((fir, index) => {
            return {
                _id: `${index + 1}`,
                name: fir[0],
                dob: fir[1],
                address: fir[2],
                phoneNumber: fir[3],
                doi: fir[4],
                toi: fir[5],
                poi: fir[6],
                descriptor: fir[7],
                faceDescriptor: fir[8],
                image: fir[9],
            };
        });
        console.log('Data from smart contract:', data);
        return data;
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
