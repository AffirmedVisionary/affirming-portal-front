import React from "react";
import classNames from "classnames";
import "./Wallet.css";
import Loading from '../Loading';

export default function Wallet({
  loading,
  walletInstalled,
  walletConnected,
  networkName,
  isRinkeby,
  connectWallet,
  totalCount
}) {
  if (loading) {
    return <div className="buttonGroup">
      <button className="button disabled">
        <Loading /> Loading...
				</button>
    </div>;
  }

  return (
    <div className="buttonGroup fading">
      {!walletInstalled && (
      <div className="status button buttonNoWallet">
            <div className="statusColor">⭕</div>
        <a
          className="noWallet network"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install MetaMask
				</a>
      </div>
      )}
      {walletInstalled && !walletConnected && (
          <div className="status button buttonMetaMask" onClick={connectWallet}>
          <div className="statusColor">🟢</div>
        <span >
          Connect MetaMask
				</span>
      </div>
      )}

      {walletConnected && (

          <div className="status button disabled">
            {isRinkeby ? <div className="statusColor">🟢</div> : 
            <div className="statusColor">🟠</div>}
					<span
              className={classNames(
                "network",
                isRinkeby ? "networkValid" : "networkInvalid",
              )}
            >
              Network: <span className="networkName">{networkName}</span>
            <span>{totalCount}</span>
            </span>
            {!isRinkeby && (
              <span className="network networkInvalid">
                Please switch to Rinkeby
						</span>
            )}
          </div>
      )}

      <div className="button status count disabled">
        <div className="statusColor">👤</div>
        <span>{totalCount}</span>
      </div>
      
    </div>
  );
}