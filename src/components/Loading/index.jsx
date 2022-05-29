// Markup from https://loading.io/css/

import React from "react";
import './Loading.css';

export default function Loading() {
  return (
    <div className="lds-dual-ring-container">
      <div className="lds-dual-ring"></div>
    </div>
  )
}
