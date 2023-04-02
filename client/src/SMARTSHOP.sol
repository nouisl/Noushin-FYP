// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WebTicketing is ERC721URIStorage {
    address public owner;
    uint256 public maxEventId;

    struct Event {
        string name;
        uint256 totalTickets;
        uint256 pricePerTicket;
        bool exists;
    }

    event newTicketsBooked(
        uint256 indexed eventId,
        address indexed booker,
        uint256 tokenId,
        uint256 timestamp
    );

    mapping(uint256 => Event) events;
    mapping(uint256 => bool) public eventIds;

    constructor() ERC721("WebTicketing", "TICKET") {
        owner = msg.sender;
    }

    function createEvent(
        uint256 eventId, string memory name, uint256 totalTickets, uint256 pricePerTicket) public {
        require(msg.sender == owner, "Only owner of smart contract can create events");
        require(!eventIds[eventId], "Event ID already exists");
        Event storage newEvent = events[eventId];
        newEvent.name = name;
        newEvent.totalTickets = totalTickets;
        newEvent.pricePerTicket = pricePerTicket;
        newEvent.exists = true;
        eventIds[eventId] = true;
        if (eventId > maxEventId) {
            maxEventId = eventId;
        }
    }

    function bookTickets(uint256 eventId, uint256 numTickets) public payable returns (bytes32, uint256, address, uint256, uint256, uint256[] memory) {
        require(events[eventId].exists, "Event does not exist");
        require(events[eventId].totalTickets >= numTickets, "Not enough tickets available");
        uint256 totalPrice = events[eventId].pricePerTicket * 1 ether * numTickets;
        require(msg.value == totalPrice, string(abi.encodePacked("Insufficient funds. You sent: ", msg.value, ", but the total price is: ", totalPrice)));
       
        uint256[] memory tokenIds = new uint256[](numTickets);
        string[] memory tokenURIs = new string[](numTickets);

        for (uint256 i = 0; i < numTickets; i++) {
            bytes32 hash = keccak256(abi.encodePacked(eventId * 10000 + events[eventId].totalTickets));
            uint256 tokenId = uint256(hash);
            _mint(msg.sender, tokenId);
            _setTokenURI(tokenId, tokenURI(tokenId));

            tokenIds[i] = tokenId;
            tokenURIs[i] = tokenURI(tokenId);
            events[eventId].totalTickets--;

            emit newTicketsBooked(eventId, msg.sender, tokenId, block.timestamp);
        }

        address sender = msg.sender;
        payable(owner).transfer(msg.value);
        return (blockhash(block.number), block.timestamp, sender, eventId, totalPrice, tokenIds);
    }

    function getEvent(uint256 eventId) public view returns (string memory, uint256, uint256, bool){
        Event memory e = events[eventId];
        return (e.name, e.totalTickets, e.pricePerTicket, e.exists);
    }

    /*function getEvents() public view returns (Event[] memory) {
        
    }*/

    function deleteEvent(uint256 eventId) public {
        require(msg.sender == owner, "Only owner of smart contract can delete events");
        require(events[eventId].exists, "Event does not exist");

        uint256[] memory tokensToRemove = new uint256[](
            events[eventId].totalTickets
        );

        for (uint256 i = 0; i < events[eventId].totalTickets; i++) {
            bytes32 hash = keccak256(abi.encodePacked(eventId * 10000 + i));
            uint256 tokenId = uint256(hash);
            tokensToRemove[i] = tokenId;
        }

        for (uint256 i = 0; i < tokensToRemove.length; i++) {
            uint256 tokenId = tokensToRemove[i];
            if (_exists(tokenId)) {
                _burn(tokenId);
            }
        }

        delete events[eventId];
        delete eventIds[eventId];
    }
}
