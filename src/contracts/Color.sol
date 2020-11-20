pragma solidity ^0.6.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// it' same by use this command: ./node_modules/.bin/truffle-flattener ./node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol > ./src/contracts/ERC721Full.sol
import "./ERC721Full.sol";

contract Color is ERC721 {
    string[] public colors;
    mapping(string => bool) public colorExists;

    constructor() public ERC721("Color", "COLOR") {}

    function mint(string memory _color) public {
        // require unique color
        require(!colorExists[_color], "Opp! Color existed.");

        // Color - add it
        colors.push(_color);
        uint256 _id = colors.length - 1;

        // call the _mint function
        _safeMint(msg.sender, _id);

        // Color - track it
        colorExists[_color] = true;
    }
}
