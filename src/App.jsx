import React from "react";

import { Bio, Header, SendAffirmation, AffirmList, Wallet } from './components/index'

// import { Bio2 } from './components/Bio2'

import useWallet from "./hooks/useWallet";

import "./App.css";

export default function App() {

  console.log("I am trying")

  const {
    walletInstalled,
    walletConnected,
    networkName,
    isRinkeby,
    connectWallet,
    loading,
    writeLoading,
    affirmationList,
    totalCount,
    sendAffirmation,
    sendQuote,
    sendHype,
  } = useWallet();

  return (
    <>
      <div className="mainContainer">
        <div className="dataContainer">
          <Wallet
            loading={loading}
            walletInstalled={walletInstalled}
            walletConnected={walletConnected}
            isRinkeby={isRinkeby}
            networkName={networkName}
            connectWallet={connectWallet}
          />
          <Header />
          <Bio />
          <SendAffirmation
            walletInstalled={walletInstalled}
            walletConnected={walletConnected}
            isRinkeby={isRinkeby}
            loading={loading}
            writeLoading={writeLoading}
            totalCount={totalCount}
            sendAffirmation={sendAffirmation}
            sendQuote={sendQuote}
            sendHype={sendHype}
          />
          <AffirmList affirmList={affirmationList} />
        </div>
      </div>
    </>
  )
}
