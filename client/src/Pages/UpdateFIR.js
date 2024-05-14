import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import abi from "../Util/FirStorage.json";

function UpdateFIR() {
    const contractAddress = '';
    const contractAbi = abi;

    const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
    const [result, setResult] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDOB, setNewDOB] = useState('');
    const [newAddressInfo, setNewAddressInfo] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newDateOfIncident, setNewDateOfIncident] = useState('');
    const [newTimeOfIncident, setNewTimeOfIncident] = useState('');
    const [newPlaceOfIncident, setNewPlaceOfIncident] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newFaceDescriptor, setNewFaceDescriptor] = useState('');
    const [newImage, setNewImage] = useState('');
    const [contract, setContract] = useState(null);
    const [message, setMessage] = useState();

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

    const searchFIR = async () => {
        try {
            const results  = await contract.methods.getIndexByPhoneNumber(searchPhoneNumber).call();
            console.log('Result from contract:', results);
            const status = results[0].toString();
            const index = parseInt(results[1]);
            console.log(status);
            console.log(index);
            if (status === '0') {
                const FirData = await contract.methods.getFIR(index).call();
                setNewName(FirData.name);
                setNewDOB(FirData.dateOfBirth);
                setNewAddressInfo(FirData.addressInfo);
                setNewPhoneNumber(FirData.phoneNumber);
                setNewDateOfIncident(FirData.dateOfIncident);
                setNewTimeOfIncident(FirData.timeOfIncident);
                setNewPlaceOfIncident(FirData.placeOfIncident);
                setNewDescription(FirData.description);
                setNewFaceDescriptor(FirData.faceDescriptor);
                setNewImage(FirData.image);
                setResult(true);
                setMessage("")
            }else {
                console.error('FIR record not found');
                setResult(false);
                setMessage('FIR record not found for the provided phone number.');
              }
        } catch (error) {
            console.error('Error searching for FIR:', error);
        }
    };

    const updateData = async () => {
        try {
            const index = await contract.methods.getIndexByPhoneNumber(newPhoneNumber).call();
            const name = newName;
            const dateOfBirth = newDOB;
            const addressInfo = newAddressInfo;
            const dateOfIncident = newDateOfIncident;
            const timeOfIncident = newTimeOfIncident;
            const placeOfIncident = newPlaceOfIncident;
            const description = newDescription;
            const faceDescriptor = newFaceDescriptor;
            const image = newImage;

            const fromAddress = window.ethereum.selectedAddress;
            await contract.methods.updateFIR(
                newPhoneNumber,
                name,
                dateOfBirth,
                addressInfo,
                dateOfIncident,
                timeOfIncident,
                placeOfIncident,
                description,
                faceDescriptor,
                image
            ).send({ from: fromAddress });

            console.log('Data updated in smart contract');
            setMessage("Fir record updated");
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="App">
            <div className="update-main">
                <h1 className="heading">Update FIR Record</h1>
                <div className="search-section">
                    <input type="search" placeholder="Enter phone number to search..." value={searchPhoneNumber} 
                    onChange={(e) => setSearchPhoneNumber(e.target.value)} className="search-bar" />
                    <button onClick={searchFIR} className="search-button">Search</button>
                </div>
                {result === true && 
                <div className="update-form">
                    <div>
                        <label className="form-label" for='name'>Update Name</label>
                        <input type="text" placeholder="New First Name" value={newName} id="name"
                            onChange={(e) => setNewName(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='dob'>Update Date of Birth</label>
                        <input type="date" placeholder="update Date of Birth" value={newDOB} id="dob"
                            onChange={(e) => setNewDOB(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='address'>Update Address</label>
                        <input type="text" placeholder="New Address Info" value={newAddressInfo} id="address"
                            onChange={(e) => setNewAddressInfo(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='doi'>Update Date Of Incident</label>
                        <input type="date" placeholder="Update Date Of Incident" value={newDateOfIncident} id="doi"
                            onChange={(e) => setNewDateOfIncident(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='toi'>Update Time Of Incident</label>
                        <input type="time" placeholder="Update Time Of Incident" value={newTimeOfIncident} id="toi"
                            onChange={(e) => setNewTimeOfIncident(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='poi'>Update Place Of Incident</label>
                        <input type="text" placeholder="Update Place Of Incident" value={newPlaceOfIncident} id="poi"
                            onChange={(e) => setNewPlaceOfIncident(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='description'>Update Description</label>
                        <input type="text" placeholder="Update Description" value={newDescription} id="description"
                            onChange={(e) => setNewDescription(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='faceDescriptor'>Update Face Descriptor</label>
                        <input type="text" placeholder="New Face Descriptor" value={newFaceDescriptor} id="faceDescriptor"
                            onChange={(e) => setNewFaceDescriptor(e.target.value)} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label" for='image'>Update Image</label>
                        <input type="text" placeholder="New Image" value={newImage} id="image"
                            onChange={(e) => setNewImage(e.target.value)} className="form-input" />
                    </div>
                    <button onClick={updateData} className="update-button">Update FIR Record</button>
                </div>
                }
                {message && <span className="update-message">{message}</span>}
            </div>
        </div>
    )
}

export default UpdateFIR;
