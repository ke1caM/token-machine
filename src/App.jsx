import { ethers } from "ethers";
import { useState, useEffect } from "react";

// Components
import Navbar from "./components/Navbar.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

// Contract Data
import {
  TOKEN_MACHINE_ADDRESS,
  TOKEN_MACHINE_ABI,
  STAKING_TOKEN_ADDRESS,
  STAKING_TOKEN_ABI,
} from "../constants.js";

function App() {
  const [provider, setProvider] = useState(null);
  const [tokenMachine, setTokenMachine] = useState(null);
  const [stakingToken, setStakingToken] = useState(null);
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const tokenMachine = new ethers.Contract(
      TOKEN_MACHINE_ADDRESS,
      TOKEN_MACHINE_ABI,
      provider
    );
    setTokenMachine(tokenMachine);

    const stakingToken = new ethers.Contract(
      STAKING_TOKEN_ADDRESS,
      STAKING_TOKEN_ABI,
      provider
    );
    setStakingToken(stakingToken);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="app">
      <Navbar account={account} setAccount={setAccount} />
      <Main
        provider={provider}
        tokenMachine={tokenMachine}
        stakingToken={stakingToken}
      />
      <Footer />
    </div>
  );
}

export default App;
