"use client";

import React, { startTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

/**
 * Whole-page error boundary for unexpected errors during development
 */
export const GlobalErrorBoundary: React.FC<React.PropsWithChildren> = (
  props,
) => {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>{props.children}</ErrorBoundary>
  );
};

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const Fallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <html>
      <head>
        <title>Unexpected Error</title>
      </head>
      <body
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          placeContent: "center",
          placeItems: "center",
          fontSize: "24px",
          fontWeight: 400,
          lineHeight: "1.5em",
        }}
      >
        <h1>Caught an unexpected error</h1>
        <p>See the console for details.</p>
        <pre>Error: {error.message}</pre>
        <button
          onClick={() => {
            startTransition(() => {
              resetErrorBoundary();
            });
          }}
        >
          Reset
        </button>
      </body>
    </html>
  );
};
