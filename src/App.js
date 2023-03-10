import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";
import Airline from "./airline";
import {AirlineService} from "./airlineService";
const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: undefined,
            balance: 0
        };
    }

    async componentDidMount() {
        this.web3 = await getWeb3();
        console.log(this.web3.version);
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        console.log(this.airline.buyFlight);
        this.airlineService = new AirlineService(this.airline);
        var account = (await this.web3.eth.getAccounts())[0];
        console.log(account);

        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.shouldComponentUpdate();
        });

    }

    async load() {
        this.getBalance();
        this.getFlights();
    }

    async getBalance(){
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    async getFlights(){
        let flights = await this.airlineService.getFlights();
        this.setState({
            flights
        });
    }

    async buyFlight(flightIndex, flight) {
        await this.airlineService.buyFlight(flightIndex, this.state.account, flight.price);
        
    }
    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p><strong>{this.state.account}</strong></p>
                        <span>Balance: <strong>{this.state.balance}</strong></span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">

                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map((flight, i) => {
                            return <div key={i}>
                                <span>{flight.name} - cost: {this.toEther(flight.price)}</span>
                                <button onClick={() => this.buyFlight(i, flight)}>Purchase</button>
                                </div>
                        })}
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}