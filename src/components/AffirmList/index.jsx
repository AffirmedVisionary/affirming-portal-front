import React from "react";

import Affirm from "../Affirm";

import "./AffirmList.css";

export default function AffirmList({ affirmList }) {
	if (!affirmList) {
    console.log("Affirmed List")
		return null;
	}

	return (
		<div className="affirmList">
			{affirmList.map((affirm) => (
				<Affirm
					key={affirm.timestamp}
					reaction={affirm.reaction}
					message={affirm.message}
					waver={affirm.waver}
					timestamp={affirm.timestamp}
				/>
			))}
		</div>
	);
}