// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    struct Person {
        string firstName;
        string lastName;
        uint256 age;
        string addressInfo;
        string phoneNumber;
        string section;
        string faceDescriptor;
    }

    mapping(address => Person) public people;

    function setPerson(
        string memory _firstName,
        string memory _lastName,
        uint256 _age,
        string memory _addressInfo,
        string memory _phoneNumber,
        string memory _section,
        string memory _faceDescriptor
    ) public {
        people[msg.sender] = Person({
            firstName: _firstName,
            lastName: _lastName,
            age: _age,
            addressInfo: _addressInfo,
            phoneNumber: _phoneNumber,
            section: _section,
            faceDescriptor: _faceDescriptor
        });
    }

    function getPerson() public view returns (
        string memory firstName,
        string memory lastName,
        uint256 age,
        string memory addressInfo,
        string memory phoneNumber,
        string memory section,
        string memory faceDescriptor
    ) {
        Person memory person = people[msg.sender];
        return (
            person.firstName,
            person.lastName,
            person.age,
            person.addressInfo,
            person.phoneNumber,
            person.section,
            person.faceDescriptor
        );
    }
}
