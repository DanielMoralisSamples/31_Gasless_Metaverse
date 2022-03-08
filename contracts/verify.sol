// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifyCoupon {

    event CouponClaimed (bytes32 hashedMessage, address claimant, uint timestamp);

    mapping (bytes32 => bool ) claimed;
    address constant admin = ;//admin address here

    function claimCoupon(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) external {
        require (!claimed[_hashedMessage],"coupon already claimed");
        require (verifyMessage(_hashedMessage, _v, _r, _s),"Invalid signature or incorrect hash");
        claimed[_hashedMessage] = true;
        //your logic for the copon here
        emit CouponClaimed(_hashedMessage, msg.sender, block.timestamp);
    }
    
    function verifyMessage(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns (bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessage));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return signer == admin;
    }

}