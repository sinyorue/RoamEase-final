"use client";
import React from "react";

/**
 * Provider component that wraps children elements in a div.
 * Can be used to provide context/state to child components.
 */
function Provider({ children }) {
  return <div>{children}</div>;
}

export default Provider;
