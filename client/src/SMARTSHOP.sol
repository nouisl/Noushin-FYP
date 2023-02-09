pragma solidity ^0.7.0;

contract ProductStore {
    // Define the ERC721 token using OpenZeppelin's implementation
    using ERC721 for ERC721;
    ERC721 public productToken;

    // Mapping from token ID to product price
    mapping(uint256 => uint256) public prices;

    // Mapping from token ID to product owner
    mapping(uint256 => address) public owners;

    // Events for purchase and transfer of products
    event Purchase(address buyer, uint256 tokenId);
    event Transfer(address from, address to, uint256 tokenId);

    // Constructor that initializes the ERC721 token
    constructor(string memory name, string memory symbol) public {
        productToken = new ERC721(name, symbol);
    }

    // Function to add a new product for sale
    function addProduct(uint256 tokenId, uint256 price) public {
        require(price > 0, "Product price must be positive");
        require(productToken.balanceOf(msg.sender) == 1, "Only the owner of the token can add it for sale");
        require(productToken.ownerOf(tokenId) == msg.sender, "Token must be owned by the seller");
        require(prices[tokenId] == 0, "Product is already for sale");

        prices[tokenId] = price;
        owners[tokenId] = msg.sender;
    }

    // Function to purchase a product
    function purchase(uint256 tokenId) public payable {
        require(prices[tokenId] > 0, "Product is not for sale");
        require(productToken.ownerOf(tokenId) == owners[tokenId], "Token is not owned by the seller");
        require(prices[tokenId] <= msg.value, "Purchase price must be equal to or greater than the product price");

        // Transfer the token to the buyer
        productToken.transferFrom(msg.sender, msg.sender, tokenId);

        // Transfer the purchase price to the seller
        owners[tokenId].transfer(msg.value);

        // Emit the purchase and transfer events
        emit Purchase(msg.sender, tokenId);
        emit Transfer(msg.sender, msg.sender, tokenId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract smartshop {

    address public owner;
    uint256 private counter;

    constructor() {
        counter = 0;
        owner = msg.sender;
     }

    struct rentalInfo {
        string name;
        string unoDescription;
        string dosDescription;
        string imgUrl;
        uint256 price;
        uint256 id;
        address buyer;
    }

    event rentalCreated (
        string name,
        string unoDescription,
        string dosDescription,
        string imgUrl,
        uint256 pricePerDay,
        string[] datesBooked,
        uint256 id,
        address buyer
    );

    event newDatesBooked (
        uint256 id,
        address buyer,
        string imgUrl 
    );

    mapping(uint256 => dbInfo) db;
    uint256[] public dbIds;


    function addDB(
        string memory name,
        string memory unoDescription,
        string memory dosDescription,
        string memory imgUrl,
        uint256 price,
    ) public {
        require(msg.sender == owner, "Only owner of smart contract can put up products");
        rentalInfo storage newRental = rentals[counter];
        newRental.name = name;
        newRental.unoDescription = unoDescription;
        newRental.dosDescription = dosDescription;
        newRental.imgUrl = imgUrl;
        newRental.price = price;
        newRental.datesBooked = datesBooked;
        newRental.id = counter;
        newRental.renter = owner;
        rentalIds.push(counter);
        emit rentalCreated(
                name, 
                city, 
                lat, 
                long, 
                unoDescription, 
                dosDescription, 
                imgUrl, 
                maxGuests, 
                pricePerDay, 
                datesBooked, 
                counter, 
                owner);
        counter++;
    }

    function checkBookings(uint256 id, string[] memory newBookings) private view returns (bool){
        
        for (uint i = 0; i < newBookings.length; i++) {
            for (uint j = 0; j < rentals[id].datesBooked.length; j++) {
                if (keccak256(abi.encodePacked(rentals[id].datesBooked[j])) == keccak256(abi.encodePacked(newBookings[i]))) {
                    return false;
                }
            }
        }
        return true;
    }


    function addDatesBooked(uint256 id, string[] memory newBookings) public payable {
        
        require(id < counter, "No such Rental");
        require(checkBookings(id, newBookings), "Already Booked For Requested Date");
        require(msg.value == (rentals[id].pricePerDay * 1 ether * newBookings.length) , "Please submit the asking price in order to complete the purchase");
    
        for (uint i = 0; i < newBookings.length; i++) {
            rentals[id].datesBooked.push(newBookings[i]);
        }

        payable(owner).transfer(msg.value);
        emit newDatesBooked(newBookings, id, msg.sender, rentals[id].city,  rentals[id].imgUrl);
    
    }

    function getRental(uint256 id) public view returns (string memory, uint256, string[] memory){
        require(id < counter, "No such Rental");

        rentalInfo storage s = rentals[id];
        return (s.name,s.pricePerDay,s.datesBooked);
    }
}
