/**
 * Server-only: safe derived flags from environment (never expose secrets).
 */
export type HostEmailEnvStatus = "ready" | "disabled" | "incomplete";

export function getHostEmailEnvStatus(): HostEmailEnvStatus {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return "disabled";

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  if (!user || !pass) return "incomplete";

  return "ready";
}
