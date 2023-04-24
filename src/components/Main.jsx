import { ethers } from "ethers";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TOKEN_MACHINE_ADDRESS } from "../../constants";
import "./Main.css";
import "react-toastify/dist/ReactToastify.css";

function Main({ provider, tokenMachine, stakingToken }) {
  // ***************
  // State variables
  // ***************

  const [tokenAmount, setTokenAmount] = useState("");
  const [etherAmount, setEtherAmount] = useState("");
  const [wantBuy, setWantBuy] = useState(true);

  // **************
  // Event handlers
  // **************

  const handleSubmit = async function (event) {
    event.preventDefault();
    if (wantBuy) {
      try {
        await toast.promise(buyTokens(), {
          pending: "Transaction is pending",
          success: "Tokens Bought",
          error: "Error",
        });
      } catch (e) {}
    } else if (!wantBuy) {
      try {
        await toast.promise(sellTokens(), {
          pending: "Transaction is pending",
          success: "Tokens Sold",
          error: "Error",
        });
      } catch (e) {}
    }
  };

  const handleAllowance = async () => {
    try {
      await toast.promise(approveTokens(), {
        pending: "Transaction is pending",
        success: "Tokens Approved",
        error: "Error",
      });
    } catch (e) {}
  };

  const handleSwitch = () => {
    setWantBuy(!wantBuy);
    setEtherAmount("");
    setTokenAmount("");
  };

  // ************************
  // Smart Contract functions
  // ************************

  const buyTokens = async () => {
    const signer = await provider.getSigner();
    const transaction = await tokenMachine
      .connect(signer)
      .buyTokens({ value: ethers.parseEther(etherAmount) });
    await transaction.wait();
  };

  const sellTokens = async () => {
    const signer = await provider.getSigner();
    const transaction = await tokenMachine
      .connect(signer)
      .sellTokens(ethers.parseEther(tokenAmount));
    await transaction.wait();
  };

  const approveTokens = async () => {
    const signer = await provider.getSigner();
    const transaction = await stakingToken
      .connect(signer)
      .approve(TOKEN_MACHINE_ADDRESS, ethers.parseEther(tokenAmount));
    await transaction.wait();
  };

  return (
    <div className="main__dashboard">
      <form
        className="main__form"
        onSubmit={async (event) => await handleSubmit(event)}
      >
        {wantBuy ? (
          <div className="main__inputs">
            <div>
              <button
                className="switch__button"
                onClick={handleSwitch}
                type="button"
              >
                Switch Currency
              </button>
            </div>
            <input
              className="inputs__input"
              type="number"
              placeholder="0 ETH"
              value={etherAmount}
              onChange={(event) => {
                setEtherAmount(event.target.value);
              }}
            ></input>
            <p className="main__amount">Token Amount: {etherAmount * 1000}</p>
          </div>
        ) : (
          <div className="main__inputs">
            <div>
              <button
                className="switch__button"
                onClick={handleSwitch}
                type="button"
              >
                Switch Currency
              </button>
            </div>
            <input
              className="inputs__input"
              type="number"
              placeholder="0 STK"
              value={tokenAmount}
              onChange={(event) => {
                setTokenAmount(event.target.value);
              }}
            ></input>
            <p className="main__amount">Ether Amount: {tokenAmount / 1000}</p>
            <button
              className="approve__button"
              onClick={handleAllowance}
              type="button"
            >
              Approve Tokens
            </button>
          </div>
        )}

        <button className="submit__button" type="submit">
          {wantBuy ? "Buy Tokens" : "Sell Tokens"}
        </button>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Main;
