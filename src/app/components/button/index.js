"use client";

import React from "react";
import { BUTTON } from "@/app/constants";

export const Button = ({ value, onClick, type, disabled = false }) => {
  return (
    <button
      style={{
        backgroundColor: type === BUTTON.TYPE.SUBMIT ? "green" : "orange",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        margin: 20,
      }}
      type={
        type === BUTTON.TYPE.SUBMIT ? BUTTON.TYPE.SUBMIT : BUTTON.TYPE.GENERIC
      }
      {...(onClick && { onClick: () => onClick() })}
      disabled={disabled}
    >
      {value}
    </button>
  );
};
