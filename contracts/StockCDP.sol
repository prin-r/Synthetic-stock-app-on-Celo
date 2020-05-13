pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import {ERC20Base} from "./ERC20Base.sol";
import {IBridge} from "./IBridge.sol";
import {BytesStringLib} from "./BytesStringLib.sol";
import {ParamsDecoder, ResultDecoder} from "./Decoders.sol";


contract StockCDP is Ownable, ERC20Base {
    using SafeMath for uint256;
    using ResultDecoder for bytes;
    using ParamsDecoder for bytes;
    using BytesStringLib for string;

    struct Config {
        IBridge bridge;
        ERC20Base dollar;
        uint256 timeTolerance;
        uint64 oracleScriptId;
        string symbol;
        uint64 multiplier;
    }

    struct CDP {
        uint256 collateralAmount;
        uint256 debtAmount;
    }

    Config public config;

    mapping(address => CDP) public cdps;

    constructor(
        IBridge bridge,
        ERC20Base dollar,
        uint256 timeTolerance,
        uint64 oracleScriptId,
        string memory symbol,
        uint64 multiplier
    ) public ERC20Base("S&P500", "SPX") {
        config.bridge = bridge;
        config.dollar = dollar;
        config.timeTolerance = timeTolerance;
        config.oracleScriptId = oracleScriptId;
        config.symbol = symbol;
        config.multiplier = multiplier;
    }

    function setConfig(
        IBridge bridge,
        ERC20Base dollar,
        uint256 timeTolerance,
        uint64 oracleScriptId,
        string memory symbol,
        uint64 multiplier
    ) public onlyOwner {
        config.bridge = bridge;
        config.dollar = dollar;
        config.timeTolerance = timeTolerance;
        config.oracleScriptId = oracleScriptId;
        config.symbol = symbol;
        config.multiplier = multiplier;
    }

    function verifyAndGetPrice(bytes memory _data) public returns (uint256) {
        (
            IBridge.RequestPacket memory latestReq,
            IBridge.ResponsePacket memory latestRes
        ) = config.bridge.relayAndVerify(_data);
        ParamsDecoder.Params memory params = latestReq
            .params
            .fromHex()
            .decodeParams();
        require(
            latestReq.oracleScriptId == config.oracleScriptId,
            "ERROR_ORACLE_SCRIPT_ID_DOES_NOT_MATCH_WITH_THE_CONFIG"
        );
        require(
            keccak256(abi.encodePacked(params.symbol)) ==
                keccak256(abi.encodePacked(config.symbol)),
            "ERROR_SYMBOL_DOES_NOT_MATCH_WITH_THE_CONFIG"
        );
        require(
            params.multiplier == config.multiplier,
            "ERROR_MULTIPLIER_DOES_NOT_MATCH_WITH_THE_CONFIG"
        );

        // If config.timeTolerance is zero, it is considered unused.
        if (config.timeTolerance > 0) {
            require(
                latestRes.resolveTime >= now - config.timeTolerance,
                "ERROR_DATA_TOO_OLD"
            );
            require(
                latestRes.resolveTime <= now + config.timeTolerance,
                "ERROR_DATA_TOO_FUTURE"
            );
        }

        ResultDecoder.Result memory result = latestRes
            .result
            .fromHex()
            .decodeResult();

        return uint256(result.px);
    }

    function lockCollateral(uint256 amount) public {
        // transfer dollar from sender to this contract
        require(
            config.dollar.transferFrom(msg.sender, address(this), amount),
            "LOCK_COLLATERAL_FAIL_TO_TRANSFER_FROM"
        );

        // update CDP of the sender
        CDP storage cdp = cdps[msg.sender];
        cdp.collateralAmount = amount.add(cdp.collateralAmount);
    }

    function unlockCollateral(uint256 amount, bytes memory _data) public {
        CDP storage cdp = cdps[msg.sender];
        uint256 remainingCollateral = cdp.collateralAmount.sub(amount);

        uint256 price = verifyAndGetPrice(_data);

        require(
            remainingCollateral.mul(2).mul(config.multiplier) >=
                cdp.debtAmount.mul(price).mul(3),
            "COLLATERAL_RATIO_IS_LOWER_THAN_TWO_THIRDS"
        );

        require(
            config.dollar.transfer(msg.sender, amount),
            "UNLOCK_COLLATERAL_FAIL_TO_TRANSFER"
        );

        cdp.collateralAmount = remainingCollateral;
    }

    function borrowDebt(uint256 amount, bytes memory _data) public {
        CDP storage cdp = cdps[msg.sender];
        uint256 debtAmount = cdp.debtAmount.add(amount);

        uint256 price = verifyAndGetPrice(_data);

        require(
            cdp.collateralAmount.mul(2).mul(config.multiplier) >=
                debtAmount.mul(price).mul(3),
            "FAIL_TO_BORROW_EXCEED_COLLATERAL_VALUE"
        );

        _mint(msg.sender, amount);

        cdp.debtAmount = debtAmount;
    }

    function returnDebt(uint256 amount) public {
        _burn(msg.sender, amount);

        CDP storage cdp = cdps[msg.sender];
        cdp.debtAmount = cdp.debtAmount.sub(amount);
    }

    function liquidate(address who, bytes memory _data) public {
        uint256 price = verifyAndGetPrice(_data);

        CDP storage cdp = cdps[who];
        require(
            cdp.collateralAmount.mul(2).mul(config.multiplier) <
                cdp.debtAmount.mul(price).mul(3),
            "FAIL_TO_LIQUIDATE_COLLATERAL_RATIO_IS_OK"
        );

        _burn(msg.sender, cdp.debtAmount);

        require(
            config.dollar.transfer(msg.sender, cdp.collateralAmount),
            "LIQUIDATE_FAIL_TO_TRANSFER"
        );

        // Reset CDP
        cdp.collateralAmount = 0;
        cdp.debtAmount = 0;
    }
}
