pragma solidity >=0.8.4;

contract ViewInterfaceID {

    constructor() public {
    }

    function getValue(bytes32 node, bytes32 label) public view returns (bytes32) {
        return keccak256(abi.encodePacked(node, label));
    }
}