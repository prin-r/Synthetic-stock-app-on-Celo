pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import {ERC20Base} from "./ERC20Base.sol";


library Borsh {
    using SafeMath for uint256;

    struct Data {
        uint256 offset;
        bytes raw;
    }

    function from(bytes memory data) internal pure returns (Data memory) {
        return Data({offset: 0, raw: data});
    }

    modifier shift(Data memory data, uint256 size) {
        require(data.raw.length >= data.offset + size, "Borsh: Out of range");
        _;
        data.offset += size;
    }

    function finished(Data memory data) internal pure returns (bool) {
        return data.offset == data.raw.length;
    }

    function decodeU8(Data memory data)
        internal
        pure
        shift(data, 1)
        returns (uint8 value)
    {
        value = uint8(data.raw[data.offset]);
    }

    function decodeI8(Data memory data)
        internal
        pure
        shift(data, 1)
        returns (int8 value)
    {
        value = int8(data.raw[data.offset]);
    }

    function decodeU16(Data memory data) internal pure returns (uint16 value) {
        value = uint16(decodeU8(data));
        value |= (uint16(decodeU8(data)) << 8);
    }

    function decodeI16(Data memory data) internal pure returns (int16 value) {
        value = int16(decodeI8(data));
        value |= (int16(decodeI8(data)) << 8);
    }

    function decodeU32(Data memory data) internal pure returns (uint32 value) {
        value = uint32(decodeU16(data));
        value |= (uint32(decodeU16(data)) << 16);
    }

    function decodeI32(Data memory data) internal pure returns (int32 value) {
        value = int32(decodeI16(data));
        value |= (int32(decodeI16(data)) << 16);
    }

    function decodeU64(Data memory data) internal pure returns (uint64 value) {
        value = uint64(decodeU32(data));
        value |= (uint64(decodeU32(data)) << 32);
    }

    function decodeI64(Data memory data) internal pure returns (int64 value) {
        value = int64(decodeI32(data));
        value |= (int64(decodeI32(data)) << 32);
    }

    function decodeU128(Data memory data)
        internal
        pure
        returns (uint128 value)
    {
        value = uint128(decodeU64(data));
        value |= (uint128(decodeU64(data)) << 64);
    }

    function decodeI128(Data memory data) internal pure returns (int128 value) {
        value = int128(decodeI64(data));
        value |= (int128(decodeI64(data)) << 64);
    }

    function decodeU256(Data memory data)
        internal
        pure
        returns (uint256 value)
    {
        value = uint256(decodeU128(data));
        value |= (uint256(decodeU128(data)) << 128);
    }

    function decodeI256(Data memory data) internal pure returns (int256 value) {
        value = int256(decodeI128(data));
        value |= (int256(decodeI128(data)) << 128);
    }

    function decodeBool(Data memory data) internal pure returns (bool value) {
        value = (decodeU8(data) != 0);
    }

    function decodeBytes(Data memory data)
        internal
        pure
        returns (bytes memory value)
    {
        value = new bytes(decodeU32(data));
        for (uint256 i = 0; i < value.length; i++) {
            value[i] = bytes1(decodeU8(data));
        }
    }

    function decodeBytes32(Data memory data)
        internal
        pure
        shift(data, 32)
        returns (bytes1[32] memory value)
    {
        bytes memory raw = data.raw;
        uint256 offset = data.offset;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(value, mload(add(add(raw, 32), offset)))
        }
    }

    function decodeBytes64(Data memory data)
        internal
        pure
        shift(data, 64)
        returns (bytes1[64] memory value)
    {
        bytes memory raw = data.raw;
        uint256 offset = data.offset;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(value, mload(add(add(raw, 32), offset)))
            mstore(add(value, 32), mload(add(add(raw, 64), offset)))
        }
    }

    function decodeBytes65(Data memory data)
        internal
        pure
        shift(data, 65)
        returns (bytes1[65] memory value)
    {
        bytes memory raw = data.raw;
        uint256 offset = data.offset;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(value, mload(add(add(raw, 32), offset)))
            mstore(add(value, 32), mload(add(add(raw, 64), offset)))
        }
        value[64] = data.raw[data.offset + 64];
    }
}


library BSLib {
    function fromHexChar(uint8 c) internal pure returns (uint8) {
        if (bytes1(c) >= bytes1("0") && bytes1(c) <= bytes1("9")) {
            return c - uint8(bytes1("0"));
        }
        if (bytes1(c) >= bytes1("a") && bytes1(c) <= bytes1("f")) {
            return 10 + c - uint8(bytes1("a"));
        }
        if (bytes1(c) >= bytes1("A") && bytes1(c) <= bytes1("F")) {
            return 10 + c - uint8(bytes1("A"));
        }
    }

    function fromHex(string memory s) internal pure returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length % 2 == 0); // length must be even
        bytes memory r = new bytes(ss.length / 2);
        for (uint256 i = 0; i < ss.length / 2; ++i) {
            r[i] = bytes1(
                fromHexChar(uint8(ss[2 * i])) *
                    16 +
                    fromHexChar(uint8(ss[2 * i + 1]))
            );
        }
        return r;
    }
}


library ParamsDecoder {
    using Borsh for Borsh.Data;

    struct Result {
        string symbol;
        uint64 multiplier;
    }

    function decodeParams(bytes memory _data)
        internal
        pure
        returns (Result memory result)
    {
        Borsh.Data memory data = Borsh.from(_data);
        result.symbol = string(data.decodeBytes());
        result.multiplier = data.decodeU64();
    }
}


library ResultDecoder {
    using Borsh for Borsh.Data;

    struct Result {
        uint64 px;
    }

    function decodeResult(bytes memory _data)
        internal
        pure
        returns (Result memory result)
    {
        Borsh.Data memory data = Borsh.from(_data);
        result.px = data.decodeU64();
    }
}


interface IBridge {
    /// Request packet struct is similar packet on Bandchain using to re-calculate result hash.
    struct RequestPacket {
        string clientId;
        uint64 oracleScriptId;
        string params;
        uint64 askCount;
        uint64 minCount;
    }

    /// Response packet struct is similar packet on Bandchain using to re-calculate result hash.
    struct ResponsePacket {
        string clientId;
        uint64 requestId;
        uint64 ansCount;
        uint64 requestTime;
        uint64 resolveTime;
        uint8 resolveStatus;
        string result;
    }

    /// Performs oracle state relay and oracle data verification in one go. The caller submits
    /// the encoded proof and receives back the decoded data, ready to be validated and used.
    /// @param _data The encoded data for oracle state relay and data verification.
    function relayAndVerify(bytes calldata _data)
        external
        returns (RequestPacket memory, ResponsePacket memory);
}


contract StockCDP is Ownable, ERC20Base {
    using ResultDecoder for bytes;
    using BSLib for string;

    struct Config {
        IBridge bridge;
        uint64 oracleScriptId;
        string symbol;
        uint64 multiplier;
    }

    IBridge.RequestPacket public latestReq;
    IBridge.ResponsePacket public latestRes;
    Config public config;

    constructor(
        IBridge bridge,
        uint64 oracleScriptId,
        string memory symbol,
        uint64 multiplier
    ) public ERC20Base("S&P500", "SPX") {
        config.bridge = bridge;
        config.oracleScriptId = oracleScriptId;
        config.symbol = symbol;
        config.multiplier = multiplier;
    }

    function setConfig(
        IBridge bridge,
        uint64 oracleScriptId,
        string memory symbol,
        uint64 multiplier
    ) public onlyOwner {
        config.bridge = bridge;
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

        // TODO: Check the conditions first if the reported price is too old

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

        cdp.collateralAmount = 0;
        cdp.debtAmount = 0;
    }
}
