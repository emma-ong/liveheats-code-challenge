import React from "react";
import "./globals.css";

export const metadata = {
  title: "Liveheats Coding Challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
