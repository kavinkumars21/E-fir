import React, { useEffect } from 'react'
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "../Util/SimpleStorage.json";

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
            const result = await contract.getAllPersons();
            console.log('Data from smart contract:');
          const data = result.map((person, index) => {
            return {
                _id: `${index + 1}`,
                firstName: person[0],
                lastName: person[1],
                age: person[2],
                address: person[3],
                phonenumber: person[4],
                section: person[5],
                faceDescriptor: person[6]
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
