// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Withdraw} from "../utils/Withdraw.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract UsdcReceiver is CCIPReceiver, Withdraw {
    bytes32 latestMessageId;
    uint64 latestSourceChainSelector;
    address latestSender;
    string latestMessage;
    address lastReceivedTokenAddress;
    uint256 lastReceivedTokenAmount;

    event MessageReceived(
        bytes32 latestMessageId,
        uint64 latestSourceChainSelector,
        address latestSender,
        address lastReceivedTokenAddress,
        uint256 lastReceivedTokenAmount
    );

    constructor(address router) CCIPReceiver(router) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        latestMessageId = message.messageId;
        latestSourceChainSelector = message.sourceChainSelector;
        latestSender = abi.decode(message.sender, (address));
        // latestMessage = ""; // abi.decode(message.data, (string));

        lastReceivedTokenAddress = address(0); // message.destTokenAmounts[0].token;
        lastReceivedTokenAmount = 0; // message.destTokenAmounts[0].amount;

        emit MessageReceived(
            latestMessageId,
            latestSourceChainSelector,
            latestSender,
            lastReceivedTokenAddress,
            lastReceivedTokenAmount
        );
    }

    function getLatestMessageDetails()
        public
        view
        returns (bytes32, uint64, address, address, uint256)
    {
        return (
            latestMessageId,
            latestSourceChainSelector,
            latestSender,
            lastReceivedTokenAddress,
            lastReceivedTokenAmount
        );
    }
}