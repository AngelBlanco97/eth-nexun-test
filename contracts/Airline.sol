pragma solidity ^0.4.24;

contract Airline {

    address public owner;
    uint etherPerPoint = 0.5 ether;

    constructor() public {
        owner = msg.sender;
        //El precio debe ser superior a 2.5 porque se dan 5 puntos por compra, cada punto es 0.5
        flights.push(Flight('Tokyo', 4 ether));
        flights.push(Flight('Paris', 3 ether));
        flights.push(Flight('Madrid', 3 ether));
    }

    struct Customer{
        uint loyaltyPoints;
        uint totalFlights;
    }

    struct Flight{
        string name;
        uint price;
    }

    Flight[] public flights;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint) public customerTotalFlights;

    function buyFlight(uint flightIndex) public payable{
        Flight storage flight = flights[flightIndex];
        require(msg.value == flight.price);
        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints+=5;
        customer.totalFlights+=1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender] ++;

        emit onFlightPurchased(msg.sender, flight.price);
    }

    event onFlightPurchased(address indexed customer, uint price);

    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public{
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        address airlineAddress = this;
        return airlineAddress.balance;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }
}