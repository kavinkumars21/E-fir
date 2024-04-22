import React, { useEffect, useState } from 'react';
import { AddFacePhoto } from './faceGallery/addFacePhoto';
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "../Util/SimpleStorage.json";

function FirForm() {

  const [firstName, setfirstname] = useState();
  const [lastName, setlastname] = useState();
  const [age, setage] = useState();
  const [addressInfo, setaddress] = useState();
  const [phoneNumber, setphonenumber] = useState();
  const [section, setsection] = useState();
  const [Image, setimage] = useState();
  const [faceDescriptor, setFaceDescriptor] = useState();

  const contractAddress = '0x8ceb750b98b6f266fb725d2d41fb8af043e90235';
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

  const handlesubmit = async (event) => {
    event.preventDefault();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    try {
      await contract.setPerson(firstName, lastName, age, addressInfo, phoneNumber, section, faceDescriptor);
      alert('Data stored successfully.');
    } catch (error) {
      console.error('Error storing data:', error);
      alert('Error storing data.');
    }
  };

  const imagedetails = (data) => {
    setimage(data.photoData);
    setFaceDescriptor(data.faceDescriptor);
  }
  
  console.log(firstName, lastName, age, addressInfo, phoneNumber, section, Image, faceDescriptor);

  return (
    <div>
      <form onSubmit={handlesubmit}>
        <label for="firstname">Firstname</label>
        <br />
        <input type="text" id="firstname" placeholder="Firstname" onChange={e => setfirstname(e.target.value)} />
        <br />
        <label for="lastname">Lastname</label>
        <br />
        <input type="text" id="lastname" placeholder="Lastname" onChange={e => setlastname(e.target.value)} />
        <br />
        <label for="age">Age</label>
        <br />
        <input type="number" id="age" placeholder="Age" onChange={e => setage(e.target.value)} />
        <br />
        <label for="address">Address</label>
        <br />
        <input type="text" id="address" placeholder="Address" onChange={e => setaddress(e.target.value)} />
        <br />
        <label for="phonenumber">Phone number</label>
        <br />
        <input type="tel" id="phonenumber" placeholder="Phone number" onChange={e => setphonenumber(e.target.value)} />
        <br />
        <label for="section">Des</label>
        <br />
        <input type="text" id="section" placeholder="Des" onChange={e => setsection(e.target.value)} />
        <br />
        <br />
        <p>Upload Picture</p>
        <AddFacePhoto imagedetails={imagedetails}/> {/* Pass imagedetails function as prop */}
        <button>Submit</button>
        <br />
        <br />
      </form>
    </div>
  )
}

export default FirForm;
