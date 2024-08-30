// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20("USDC","USDC"){

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
    
}