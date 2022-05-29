
import React, { useEffect, useState } from "react";
import classNames from "classnames";

import AffirmStatus from "../AffirmStatus";

import "./SendAffirmation.css";
import { WriteStatus } from "../../hooks/useWallet";

export default function SendAffirmation({
	walletInstalled,
	walletConnected,
	isRinkeby,
	loading,
	writeLoading,
	totalCount,
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

	useEffect(() => {
		if (writeLoading === WriteStatus.None) {
			setMessage("");
		}
	}, [writeLoading]);

	return (
		<div>
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
					<span className="buttonEmoji" role="img" aria-label="Affirm">
						💪
					</span>
					Affirm Your Vision
				</button>
				<button className="button buttonQuote buttonFlex" onClick={() => sendQuote(message)}>
					<span className="buttonEmoji" role="img" aria-label="Quote">
						📖
					</span>
					Send me a quote
				</button>
				<button className="button buttonFire buttonFlex" onClick={() => sendHype(message)}>
					<span className="buttonEmoji" role="img" aria-label="Fire">
						👋
					</span>
					Share some hype
				</button>
			</section>
			<AffirmStatus
				loading={loading}
				writeLoading={writeLoading}
				totalCount={totalCount}
			/>
		</div>
	);
}