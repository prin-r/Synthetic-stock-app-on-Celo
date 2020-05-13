pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import {IBridge} from "./IBridge.sol";


contract MockBridge is IBridge {
    string public encodedPrice = "3200000000000000";

    function setPriceToBe50() public {
        encodedPrice = "3200000000000000";
    }

    function setPriceToBe100() public {
        encodedPrice = "6400000000000000";
    }

    function relayAndVerify(bytes calldata _data)
        external
        returns (RequestPacket memory, ResponsePacket memory)
    {
        RequestPacket memory req;
        ResponsePacket memory res;

        req.oracleScriptId = 12;
        req.params = "050000005e475350436400000000000000";

        res.result = encodedPrice;

        return (req, res);
    }
}
