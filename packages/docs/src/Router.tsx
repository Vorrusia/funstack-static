"use client";

import { Router as FunStackRotuter, type RouterProps } from "@funstack/router";
import { useEffect } from "react";

export const Router: React.FC<RouterProps> = (props) => {
  // Auto scroll to top - this should be handled by the browser per spec,
  // but currently Chrome and Safari do not follow the spec.
  useEffect(() => {
    // @ts-expect-error -- TypeScript does not yet know about the Navigation API
    const navigation = window.navigation;
    if (!navigation) {
      return;
    }
    const controller = new AbortController();
    navigation.addEventListener(
      "navigatesuccess",
      () => {
        const transition = navigation.transition;
        if (
          transition.navigationType === "push" ||
          transition.navigationType === "replace"
        ) {
          window.scrollTo(0, 0);
        }
      },
      { signal: controller.signal },
    );
    return () => {
      controller.abort();
    };
  }, []);
  return <FunStackRotuter {...props} />;
};
