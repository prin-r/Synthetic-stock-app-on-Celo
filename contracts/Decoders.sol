pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import {Borsh} from "./Borsh.sol";


library ParamsDecoder {
    using Borsh for Borsh.Data;

    struct Params {
        string symbol;
        uint64 multiplier;
    }

    function decodeParams(bytes memory _data)
        internal
        pure
        returns (Params memory result)
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
