import React, { useState } from 'react'
import { AddFacePhoto } from './addFacePhoto'
import axios from 'axios'

function FirForm() {

    const [firstName, setfirstname] = useState();
    const [lastName, setlastname] = useState();
    const [age, setage] = useState();
    const [addressInfo, setaddress] = useState();
    const [phoneNumber, setphonenumber] = useState();
    const [section, setsection] = useState();
    const [Image, setimage] = useState();
    const [faceDescriptor, setFaceDescriptor] = useState();

    const imagedetails = (data) => {
        setimage(data.photoData);
        setFaceDescriptor(data.faceDescriptor)
    }

    console.log(firstName,lastName,age,addressInfo,phoneNumber,section,Image,faceDescriptor);

    const handlesubmit = () => {
        const data = { firstName,lastName,age,addressInfo,phoneNumber,section,faceDescriptor };
        axios.post("http://localhost:5000/setData", data)
    }

    return (
        <div>
            <form onSubmit={handlesubmit}>
                <label for="firstname">Firstname</label>
                <br />
                <input type="text" id="firstname" placeholder="Firstname" onChange={e => setfirstname(e.target.value)}/>
                <br />
                <label for="lastname">Lastname</label>
                <br />
                <input type="text" id="lastname" placeholder="Lastname" onChange={e => setlastname(e.target.value)}/>
                <br />
                <label for="age">Age</label>
                <br />
                <input type="number" id="age" placeholder="Age" onChange={e => setage(e.target.value)}/>
                <br />
                <label for="address">Address</label>
                <br />
                <input type="text" id="address" placeholder="Address" onChange={e => setaddress(e.target.value)}/>
                <br />
                <label for="phonenumber">Phone number</label>
                <br />
                <input type="tel" id="phonenumber" placeholder="Phone number" onChange={e => setphonenumber(e.target.value)}/>
                <br />
                <label for="section">Des</label>
                <br />
                <input type="text" id="section" placeholder="Des" onChange={e => setsection(e.target.value)}/>
                <br />
                <br />
                <p>Upload Picture</p>
                <AddFacePhoto imagedetails={imagedetails}/>
                <button>Submit</button>
                <br />
                <br />
            </form>
        </div>
    )
}

export default FirForm
