import React from "react";
import dayjs from "dayjs";

import { Reaction } from "../../hooks/useWallet";

import "./Affirm.css";

const ReactionEmojis = {
	[Reaction.Affirm]: "💪",
	[Reaction.Quote]: "🍰",
	[Reaction.Hype]: "👋",
};

export default function Affirm({ reaction, message, waver, timestamp }) {
	return (
		<div className="affirm">
			<div className="reaction">{ReactionEmojis[reaction]}</div>
			<div className="body">
				<dl>
					<dt>From:</dt>
					<dd>{waver}</dd>
					<dt>Time:</dt>
					<dd>
						{formatDate(timestamp)} at {formatTime(timestamp)}
					</dd>
				</dl>
				<div className="message">{message}</div>
			</div>
		</div>
	);
}

function formatDate(timestamp) {
	return dayjs(timestamp).format("MMM D, YYYY");
}

function formatTime(timestamp) {
	return dayjs(timestamp).format("h:mm:ss a");
}
