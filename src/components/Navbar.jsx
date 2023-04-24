import { ethers } from "ethers";
import "./Navbar.css";

function Navbar({ account, setAccount }) {
  // ***************
  // Connect handler
  // ***************

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };
  return (
    <nav>
      <div className="navbar__logo">TOKEN MACHINE</div>
      {account ? (
        <button type="button" className="connect__button">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className="connect__button"
          onClick={connectHandler}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}

export default Navbar;
