pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import {IBridge} from "./IBridge.sol";


contract MockBridge is IBridge {
    // default is 5000 (50 * 100 (price * multiplier))
    string public encodedPrice = "8813000000000000";

    function setPriceToBe50() public {
        // price * multiplier
        // 50 * 100
        encodedPrice = "8813000000000000";
    }

    function setPriceToBe100() public {
        // price * multiplier
        // 100 * 100
        encodedPrice = "1027000000000000";
    }

    function relayAndVerify(bytes calldata _data)
        external
        returns (RequestPacket memory, ResponsePacket memory)
    {
        RequestPacket memory req;
        ResponsePacket memory res;

        // oraclescript for stock price
        req.oracleScriptId = 12;

        // strcut {symbol: "^GSPC", multiplier: 100}
        req.params = "050000005e475350436400000000000000";

        res.result = encodedPrice;

        return (req, res);
    }
}
