import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import { Loading, Complete, ClickMe, Bio, Header } from "./components"
import abi from "./utils/affirmingPortal.json";

const DisplayCount = (totalCount) => {
  return <h3>{totalCount}</h3>
}

const ButtonContent = ({ miningInProgress, affirmCompleted, totalCount }) => {

  if (miningInProgress) {
    return (
      <>
        <Loading />
        <div className="buttonText">Mining...</div>
      </>
    )
  }

  if (affirmCompleted) {
    return (
      <>
        <Complete />
        <div className="buttonText">You just submitted Affirmation #{totalCount} Your future self thanks you!</div>
      </>
    )
  }

  return (
    <>
      <ClickMe />
      <div className="buttonText">Affirm Your Vision!</div>
    </>
  )
}

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalCount, setTotalCount] = useState(0)
  const [miningInProgress, setMiningInProgress] = useState(false);
  const [affirmCompleted, setAffirmCompleted] = useState(false);

  const contractAddress = "0xfeA9Ceb2D86b9847DC48067503F3523CdEe32550";

  const contractABI = abi.abi;

  async function isWalletConnected() {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const affirm = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const affirmPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const getTotalCount = async () => {
          const count = await affirmPortalContract.getTotalAffirmed();
          console.log("Retrieved total affirmation count...", count.toNumber());
          setTotalCount(count.toNumber());
        }

        getTotalCount();

        // time to affirm
        const affirmIt = await affirmPortalContract.affirm();
        console.log("Mining... ", affirmIt.hash);
        setMiningInProgress(true);

        await affirmIt.wait();
        console.log("Mined -- ", affirmIt.hash);
        setMiningInProgress(false);

        getTotalCount();
        setAffirmCompleted(true);

        useEffect(() => {
          getTotalCount();
        }, [])

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // run on page load
  useEffect(() => {
    isWalletConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <Header />

        <Bio />

        {currentAccount ? <div className="bio">Click below to affirm your vision! {totalCount}</div> :
          <div className="bio">Connect your Ethereum wallet and affirm your vision! {totalCount}</div>}

        {currentAccount ? <button className="affirmButton" onClick={affirm} disabled={miningInProgress}>
          <div className="buttonContent">
            {ButtonContent({ miningInProgress, affirmCompleted, totalCount })}
          </div>
        </button> :
          <button className="affirmButton" onClick={connectWallet}>
            Connect Wallet
          </button>}
      </div>
    </div>
  );
}
