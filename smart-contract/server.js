const express = require('express');
const bodyParser = require('body-parser');
const { ethers, JsonRpcProvider  } = require("ethers");
const abi = require("./artifacts/contracts/SimpleStorage.sol/SimpleStorage.json")
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const provider = new JsonRpcProvider("http://localhost:8545"); // Connect to your local Ethereum node
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with deployed contract address
const contractabi = abi.abi; // Replace with contract ABI

const contract = new ethers.Contract(contractAddress, contractabi, provider);

app.post('/setData', async (req, res) => {
    const { firstName, lastName, age, addressInfo, phoneNumber, section, faceDescriptor } = req.body;
    try {
        await contract.setPerson(firstName, lastName, age, addressInfo, phoneNumber, section, faceDescriptor);
        res.send('Data stored successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error storing data.');
    }
});

app.get('/getData', async (req, res) => {
    try {
        const data = await contract.getPerson();
        const serializedData = {
            firstName: data[0],
            lastName: data[1],
            age: data[2].toString(),
            addressInfo: data[3],
            phoneNumber: data[4],
            section: data[5],
            faceDescriptor: data[6]
        };
        res.send({ serializedData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data.');
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
