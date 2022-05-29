import React from "react";

import Affirm from "../Affirm";

import "./AffirmList.css";

export default function AffirmList({ affirmList }) {
	if (!affirmList) {
		return null;
	}

	return (
		<div className="affirmList">
			{affirmList.map((affirm) => (
				<Affirm
					key={affirm.timestamp}
					reaction={affirm._reaction}
					message={affirm.message}
					affirmr={affirm.affirmr}
					timestamp={affirm.timestamp}
				/>
			))}
		</div>
	);
}