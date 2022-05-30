
import React from "react";

import { WriteStatus } from "../../hooks/useWallet";
import Loading from "../Loading";

const WriteLoadingMessage = {
	[WriteStatus.Connect]: "Please connect your wallet to proceed...",
	[WriteStatus.Request]: "Check your wallet for the transaction...",
	[WriteStatus.Pending]: "Affirming transaction in progress...",
};

export default function AffirmStatus({ loading, writeLoading, totalCount }) {
	if (loading || !totalCount) {
		return null;
	}

	if (writeLoading) {
		return (
			<div className="affirmStatus">
				<p>{WriteLoadingMessage[writeLoading]}</p>
				<Loading />
			</div>
		);
	}

	return (
		<div className="affirmStatus fading justifyCenter">
      {totalCount} {totalCount === 1 ? `visionary` : `visionaries`} have Affirmed their Vision!
		</div>
	);
}