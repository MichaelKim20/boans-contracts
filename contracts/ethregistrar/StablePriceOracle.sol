pragma solidity >=0.8.4;

import "./PriceOracle.sol";
import "./SafeMath.sol";
import "./StringUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface AggregatorInterface {
  function latestAnswer() external view returns (int256);
}


// StablePriceOracle sets a price in USD, based on an oracle.
contract StablePriceOracle is Ownable, PriceOracle {
    using SafeMath for *;
    using StringUtils for *;

    // Rent in base price units by length
    uint256 public immutable price1Letter;
    uint256 public immutable price2Letter;
    uint256 public immutable price3Letter;
    uint256 public immutable price4Letter;
    uint256 public immutable price5Letter;

    // Oracle address
    AggregatorInterface public usdOracle;

    event OracleChanged(address oracle);

    event RentPriceChanged(uint[] prices);

    bytes4 constant private INTERFACE_META_ID = bytes4(keccak256("supportsInterface(bytes4)"));
    bytes4 constant private ORACLE_ID = bytes4(keccak256("price(string,uint256,uint256)") ^ keccak256("premium(string,uint256,uint256)"));

    constructor(AggregatorInterface _usdOracle, uint[] memory _rentPrices) public {
        usdOracle = _usdOracle;
        price1Letter = _rentPrices[0];
        price2Letter = _rentPrices[1];
        price3Letter = _rentPrices[2];
        price4Letter = _rentPrices[3];
        price5Letter = _rentPrices[4];
    }

    function price(string calldata name, uint expires, uint duration) external view override returns(uint) {
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5Letter * duration;
        } else if (len == 4) {
            basePrice = price4Letter * duration;
        } else if (len == 3) {
            basePrice = price3Letter * duration;
        } else if (len == 2) {
            basePrice = price2Letter * duration;
        } else {
            basePrice = price1Letter * duration;
        }

        basePrice = basePrice + _premium(name, expires, duration);

        return attoUSDToWei(basePrice);
    }

    /**
     * @dev Returns the pricing premium in wei.
     */
    function premium(string calldata name, uint expires, uint duration) external view returns(uint) {
        return attoUSDToWei(_premium(name, expires, duration));
    }

    /**
     * @dev Returns the pricing premium in internal base units.
     */
    function _premium(string memory name, uint expires, uint duration) virtual internal view returns(uint) {
        return 0;
    }

    function attoUSDToWei(uint amount) internal view returns(uint) {
        uint ethPrice = uint(usdOracle.latestAnswer());
        return amount.mul(1e8).div(ethPrice);
    }

    function weiToAttoUSD(uint amount) internal view returns(uint) {
        uint ethPrice = uint(usdOracle.latestAnswer());
        return amount.mul(ethPrice).div(1e8);
    }

    function supportsInterface(bytes4 interfaceID) public view virtual returns (bool) {
        return interfaceID == INTERFACE_META_ID || interfaceID == ORACLE_ID;
    }
}
