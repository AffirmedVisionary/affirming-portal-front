// Markup from https://loading.io/css/

import React from "react";
import './ClickMe.css';

export default function ClickMe() {
  return (
    <div className="lds-ripple-container">
      <div className="lds-ripple">
        <div></div><div>
        </div></div>
    </div>
  )
}
