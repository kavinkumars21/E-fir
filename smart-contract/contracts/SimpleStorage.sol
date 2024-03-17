// SimpleStorage.sol
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
        Person storage person = people[msg.sender];
        person.firstName = _firstName;
        person.lastName = _lastName;
        person.age = _age;
        person.addressInfo = _addressInfo;
        person.phoneNumber = _phoneNumber;
        person.section = _section;
        person.faceDescriptor = _faceDescriptor;
    }

    function getPerson() public view returns (
        string memory,
        string memory,
        uint256,
        string memory,
        string memory,
        string memory,
        string memory
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
