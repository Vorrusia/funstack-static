import type React from "react";
import "./styles/globals.css";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FUNSTACK Static - docs</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script>
          {`
// GitHub Pages SPA redirect hack - restore URL from query params
// See: https://github.com/rafgraph/spa-github-pages
(function (l) {
  if (l.search[1] === "p") {
    var decoded = l.search
      .slice(3)
      .split("&")
      .map(function (s) {
        return s.replace(/~and~/g, "&");
      })
      .join("?");
    window.history.replaceState(
      null,
      "",
      l.pathname.slice(0, -1) + "/" + decoded + l.hash,
    );
  }
})(window.location);
            `}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
