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
