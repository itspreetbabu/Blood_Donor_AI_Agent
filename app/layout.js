// ============================================================
//  app/layout.js — Root Layout
// ============================================================

import "./globals.css";

export const metadata = {
  title: "HemoAgent — AI-Powered Blood Donation Intelligence",
  description: "Autonomous AI agent for real-time blood inventory monitoring, shortage prediction, donor matching, and proactive emergency alerts.",
  keywords: "blood donation, AI agent, inventory monitoring, shortage prediction, donor matching",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#070b14" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🩸</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
