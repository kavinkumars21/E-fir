import React, { useEffect, useState } from 'react';
import { AddFacePhoto } from './faceGallery/addFacePhoto';
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "../Util/FirStorage.json";
import "./style.css"

function FirForm() {

  const [name, setName] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [addressInfo, setAddressInfo] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [dateOfIncident, setDateOfIncident] = useState();
  const [timeOfIncident, setTimeOfIncident] = useState();
  const [placeOfIncident, setPlaceOfIncident] = useState();
  const [description, setDescription] = useState();
  const [faceDescriptor, setFaceDescriptor] = useState();
  const [image, setImage] = useState();

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

  const handlesubmit = async (event) => {
    event.preventDefault();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    try {
      await contract.setFIR(
        name, dateOfBirth, addressInfo, phoneNumber, dateOfIncident, timeOfIncident, placeOfIncident, description, faceDescriptor, image
      );
      alert('Data stored successfully.');
    } catch (error) {
      console.error('Error storing data:', error);
      alert('Error storing data.');
    }
  };

  const imagedetails = (data) => {
    setImage("null");
    setFaceDescriptor(data.faceDescriptor);
  }

  console.log(name, dateOfBirth, addressInfo, phoneNumber, dateOfIncident, timeOfIncident, placeOfIncident, description, faceDescriptor, image);

  return (
    <div className='main-component'>
      <h1 className='register-header'>Register FIR</h1>
      <form onSubmit={handlesubmit} className='form'>
        <div className='form-inner'>
          <div className='form-left'>
            <label for="name">Name</label>
            <input type="text" id="name" placeholder="Name" onChange={e => setName(e.target.value)} />
            <br />
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" placeholder="Date of Birth" onChange={e => setDateOfBirth(e.target.value)} />
            <br />
            <label for="address">Address</label>
            <input type="text" id="address" placeholder="Address" onChange={e => setAddressInfo(e.target.value)} />
            <br />
            <label for="phonenumber">Phone number</label>
            <input type="tel" id="phonenumber" placeholder="Phone number" onChange={e => setPhoneNumber(e.target.value)} />
            <br />
            <label for="dateofincident">Date of Incident</label>
            <input type="date" id="dateofincident" placeholder="Date of Incident" onChange={e => setDateOfIncident(e.target.value)} />
            <br />
            <label for="timeofincident">Time of Incident</label>
            <input type="time" id="timeofincident" placeholder="Time of Incident" onChange={e => setTimeOfIncident(e.target.value)} />
            <br />
            <label for="placeofincident">Place of Incident</label>
            <input type="text" id="placeofincident" placeholder="Place of Incident" onChange={e => setPlaceOfIncident(e.target.value)} />
            <br />
            <label for="description">Description</label>
            <textarea type="" id="description" placeholder="Description" rows="1" onChange={e => setDescription(e.target.value)} />
            <br />
          </div>
          <div className='form-right'>
            <p>Upload Picture</p>
            <AddFacePhoto imagedetails={imagedetails} /> {/* Pass imagedetails function as prop */}
          </div>
        </div>
        <button className='submitbutton'>Submit</button>
      </form>
    </div>
  )
}

export default FirForm;
