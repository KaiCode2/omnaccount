// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {BaseModule} from "./safe/BaseModule.sol";
import {OmnaccountErrors as Errors} from "./interfaces/Errors.sol";
import {HandlerContext} from "@safe-global/safe-contracts/contracts/handler/HandlerContext.sol";
import {CompatibilityFallbackHandler} from "@safe-global/safe-contracts/contracts/handler/CompatibilityFallbackHandler.sol";
import {IAccount} from "@account-abstraction/contracts/interfaces/IAccount.sol";
import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";
import {_packValidationData} from "@account-abstraction/contracts/core/Helpers.sol";


/**
 * @title OmnaccountModule
 * @author KDon.eth
 * @notice ERC-4337 abstract account module enabling cross-chain userOp execution powered by Across V3 Bridge and Safe
 */
contract OmnaccountModule is BaseModule, HandlerContext, CompatibilityFallbackHandler, Errors {

    
    constructor(address entrypoint, address spokePool) BaseModule(entrypoint) {
        
    }
}
