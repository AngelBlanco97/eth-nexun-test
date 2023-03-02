export class AirlineService{
    constructor(contract){
        this.contract = contract;
    }

    async getTotalFlights(){
        return (await this.contract.totalFlights()).toNumber();
    }

    async getFlights() {
        let total = await this.getTotalFlights();
        let flights = [];
        for(var i = 0; i < total; i++){
            let flight = await this.contract.flights(i);
            flights.push(flight);
        }
    }

    mapFlights(flights) {
        return flights.map(flight => {
            return {
                name: flight[0],
                price: flight[1].toNumber()
            }
        });
    }

    async buyFlight(flightIndex, from,value){
        return this.contract.buyFlight(flightIndex, {from, value});
    }
}