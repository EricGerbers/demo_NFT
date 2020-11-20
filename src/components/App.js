import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import Color from "../abis/Color.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      colors: []
    };
  }

  async componentWillMount() {
    this.web3 = await getWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    // Load account
    const accounts = await this.web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await this.web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new this.web3.eth.Contract(abi, address);
      this.setState({ contract });
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      // Load Colors
      for (var i = 0; i < totalSupply; i++) {
        const color = await contract.methods.colors(i).call();
        this.setState({
          colors: [...this.state.colors, color]
        });
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }

  mint = color => {
    this.state.contract.methods
      .mint(color)
      .send({ from: this.state.account })
      .once("receipt", receipt => {
        this.setState({
          colors: [...this.state.colors, color]
        });
      });
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">{this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    const color = this.color.value;
                    this.mint(color);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="e.g. #FFFFFF"
                    ref={input => {
                      this.color = input;
                    }}
                  />
                  <input
                    type="submit"
                    className="btn btn-block btn-primary"
                    value="MINT"
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.colors.map((color, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div
                    className="token"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>{color}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
