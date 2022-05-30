
import React, { useEffect, useState } from "react";
import classNames from "classnames";

import "./SendAffirmation.css";
import { WriteStatus } from "../../hooks/useWallet";

export default function SendAffirmation({
  walletInstalled,
  walletConnected,
  isRinkeby,
  loading,
  writeLoading,
  sendAffirmation,
  sendQuote,
  sendHype,
}) {
  const [message, setMessage] = useState("");
  const disableInput = Boolean(writeLoading);
  const disableButtons =
    !walletInstalled ||
    !walletConnected ||
    !isRinkeby ||
    loading ||
    writeLoading ||
    message.length === 0;

  console.log(message)

  useEffect(() => {
    if (writeLoading === WriteStatus.None) {
      setMessage("");
    }
  }, [writeLoading]);

  return (
    <div className="sendAffirmation">
      <div className="textWrapper">
        <label htmlFor="message">Write your message below:</label>
        <textarea
          id="message"
          className={classNames("textBox")}
          disabled={disableInput}
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
        />
      </div>
      <section
        className={classNames("buttonGroup", disableButtons && "disabled")}
      >
        <button className="button buttonAffirm buttonFlex" onClick={() => sendAffirmation(message)}>
          <span className="buttonEmoji reaction" role="img" aria-label="Affirm">
            💪
					</span>
          <span className="buttonText">
            Affirm Your Vision
            </span>
        </button>
        <button className="button buttonQuote buttonFlex" onClick={() => sendQuote(message)}>
          <span className="buttonEmoji reaction" role="img" aria-label="Quote">
            💯
					</span>
          <span className="buttonText">
            Send me a quote
            </span>
        </button>
        <button className="button buttonFire buttonFlex" onClick={() => sendHype(message)}>
          <span className="buttonEmoji reaction" role="img" aria-label="Fire">
            🤩
					</span>
          <span className="buttonText">
            Share some hype
            </span>
        </button>
      </section>
    </div>
  );
}
