import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "../Util/SimpleStorage.json";

function UpdateFIR() {
    const contractAddress = '';
    const contractAbi = abi;

    const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
    const [indexToUpdate, setIndexToUpdate] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newAddressInfo, setNewAddressInfo] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newSection, setNewSection] = useState('');
    const [newFaceDescriptor, setNewFaceDescriptor] = useState('');
    const [contract, setContract] = useState(null);

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
          const contract = new window.web3.eth.Contract(contractAbi, contractAddress);
        setContract(contract);
        }
        loadWeb3();
      }, []);

    const searchPerson = async () => {
        try {
            console.log(searchPhoneNumber);
            const index = await contract.methods.getIndexByPhoneNumber(searchPhoneNumber).call();
            console.log(index);
            setIndexToUpdate(index);
            const personData = await contract.methods.getPerson(index).call();
            setNewFirstName(personData.firstName);
            setNewLastName(personData.lastName);
            setNewAge(personData.age);
            setNewAddressInfo(personData.addressInfo);
            setNewPhoneNumber(personData.phoneNumber);
            setNewSection(personData.section);
            setNewFaceDescriptor(personData.faceDescriptor);
        } catch (error) {
            console.error('Error searching for person:', error);
        }
    };

    const updateData = async () => {
        try {
            const index = await contract.methods.getIndexByPhoneNumber(newPhoneNumber).call();
            const firstName = newFirstName;
            const lastName = newLastName;
            const age = newAge;
            const addressInfo = newAddressInfo;
            const section = newSection;
            const faceDescriptor = newFaceDescriptor;
            console.log(index);

            const fromAddress = window.ethereum.selectedAddress;
            await contract.methods.updatePerson(
                newPhoneNumber,
                firstName,
                lastName,
                age,
                addressInfo,
                section,
                faceDescriptor
            ).send({ from: fromAddress });

            console.log('Data updated in smart contract');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Update Person Data</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Enter Phone Number"
                        value={searchPhoneNumber}
                        onChange={(e) => setSearchPhoneNumber(e.target.value)}
                    />
                    <button onClick={searchPerson}>Search</button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="New First Name"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Last Name"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="New Age"
                        value={newAge}
                        onChange={(e) => setNewAge(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Address Info"
                        value={newAddressInfo}
                        onChange={(e) => setNewAddressInfo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Phone Number"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Section"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Face Descriptor"
                        value={newFaceDescriptor}
                        onChange={(e) => setNewFaceDescriptor(e.target.value)}
                    />
                    <button onClick={updateData}>Update FIR</button>
                </div>
            </header>
        </div>
    )
}

export default UpdateFIR;
