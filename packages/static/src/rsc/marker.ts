/**
 * Prefix of marker for App entry point.
 */
const markerPrefix = "__FUNSTACK_APP_ENTRY__";

/**
 * Generates an HTML ID for marking App entry point.
 */
export function generateAppMarker(): string {
  return `${markerPrefix}${crypto.randomUUID()}`;
}
