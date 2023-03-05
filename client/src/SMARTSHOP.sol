// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WebTicketing is ERC721URIStorage {
    address public owner;

    struct Event {
        string name;
        uint256 totalTickets;
        uint256 pricePerTicket;
        bool exists;
    }

    event newTicketsBooked(
        uint256 indexed eventId,
        uint256 numTickets,
        address indexed booker,
        uint256 price,
        uint256 timestamp
    );

    event ticketsResold(
        uint256 indexed eventId,
        uint256 numTickets,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 timestamp
    );

    mapping(uint256 => Event) events;
    mapping(uint256 => bool) public eventIds;

    constructor() ERC721("WebTicketing", "TICKET") {
        owner = msg.sender;
    }

    function createEvent(
        uint256 eventId,
        string memory name,
        uint256 totalTickets,
        uint256 pricePerTicket
    ) public {
        require(
            msg.sender == owner,
            "Only owner of smart contract can create events"
        );
        require(!eventIds[eventId], "Event ID already exists");
        Event storage newEvent = events[eventId];
        newEvent.name = name;
        newEvent.totalTickets = totalTickets;
        newEvent.pricePerTicket = pricePerTicket;
        newEvent.exists = true;
        eventIds[eventId] = true;
    }

    function bookTickets(uint256 eventId, uint256 numTickets)
        public
        payable
        returns (
            bytes32,
            address,
            address,
            uint256
        )
    {
        require(events[eventId].exists, "Event does not exist");
        require(
            events[eventId].totalTickets >= numTickets,
            "Not enough tickets available"
        );
        uint256 totalPrice = events[eventId].pricePerTicket *
            1 ether *
            numTickets;
        require(msg.value == totalPrice, "Insufficient funds");

        for (uint256 i = 0; i < numTickets; i++) {
            uint256 tokenId = eventId * 10000 + events[eventId].totalTickets;
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, tokenURI(tokenId));
            events[eventId].totalTickets--;
        }

        address sender = msg.sender;
        address receiver = owner;
        payable(owner).transfer(msg.value);

        emit newTicketsBooked(
            eventId,
            numTickets,
            sender,
            events[eventId].pricePerTicket,
            block.timestamp
        );
        return (blockhash(block.number), sender, receiver, totalPrice);
    }

    function getEvent(uint256 eventId)
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            bool
        )
    {
        Event memory e = events[eventId];
        return (e.name, e.totalTickets, e.pricePerTicket, e.exists);
    }

    function getEvents() public view returns (string memory) {
    string memory output = "[";
    uint256 eventCount = 0;

    // Store the number of events in a variable
    for (uint256 i = 0; i < 2**256-1; i++) {
        if (eventIds[i]) {
            eventCount++;
        } else {
            break;
        }
    }

    for (uint256 i = 0; i < eventCount; i++) {
        Event memory e = events[i];
        string memory eventString = string(abi.encodePacked(
            '{"name":"', e.name, '", "totalTickets":', 
            uintToString(e.totalTickets), 
            ', "pricePerTicket":', uintToString(e.pricePerTicket),
            ', "exists":', e.exists ? 'true' : 'false', 
            '}'
        ));
        output = string(abi.encodePacked(output, eventString));
        if (i < eventCount - 1) {
            output = string(abi.encodePacked(output, ","));
        }
    }
    output = string(abi.encodePacked(output, "]"));
    return output;
}

function uintToString(uint256 v) internal pure returns (string memory) {
    if (v == 0) {
        return "0";
    }
    uint256 j = v;
    uint256 len;
    while (j != 0) {
        len++;
        j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint256 k = len;
    while (v != 0) {
        bstr[--k] = bytes1(uint8(48 + v % 10));
        v /= 10;
    }
    return string(bstr);
}

    function deleteEvent(uint256 eventId) public {
        require(msg.sender == owner,"Only owner of smart contract can delete events");
        require(events[eventId].exists, "Event does not exist");
        // Remove the event from the mapping
        delete events[eventId];
        eventIds[eventId] = false;
    }

}
