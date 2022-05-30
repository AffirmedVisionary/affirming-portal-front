import React from "react";
import dayjs from "dayjs";

import { Reaction } from "../../hooks/useWallet";

import "./Affirm.css";

const ReactionEmojis = {
  [Reaction.Affirm]: "💪",
  [Reaction.Quote]: "💯",
  [Reaction.Hype]: "🤩",
};

export default function Affirm({ reaction, message, waver, timestamp }) {
  return (
    <div className="oneMess">
<div className="affirm">
      <div className="body">
        <div className="message-block">
          <div className="reaction marginRigtOne">{ReactionEmojis[reaction]}</div>
          <div className="message">{message}</div>
        </div>
      </div>
</div>
      <div className="informDetails">
        <dl>
          <dt>👤</dt>
          <dd>{waver}</dd>
          <dt>🕒</dt>
          <dd>
            {formatDate(timestamp)} at {formatTime(timestamp)}
          </dd>
        </dl>
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
