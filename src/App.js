import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    // need to specify sender
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have entered lottery!" });
  };

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Picking winner..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const winner = await lottery.methods.lastWinner().call();

    this.setState({ message: "A winner has been picked! " + winner });
  };

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>Contract Manager: {this.state.manager}</p>
        <p>Players Num: {this.state.players.length}</p>
        <p>Balance: {web3.utils.fromWei(this.state.balance, "ether")} ether</p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to enter lottery?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
            <button>enter</button>
          </div>
        </form>
        <hr />
        <h4>Pick a winner!</h4>
        <button onClick={this.pickWinner}>pick</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
