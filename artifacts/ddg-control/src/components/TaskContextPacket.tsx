import { useEffect, useRef, useState } from "react";

type Props = { id: number; projectKey: string; planVersion: number; outcomeId: number | null; outcomeVersion: number | null; disabled: boolean };

export function TaskContextPacket(props: Props) {
  const scope = JSON.stringify([props.id, props.projectKey, props.planVersion, props.outcomeId, props.outcomeVersion]);
  const currentScope = useRef(scope);
  currentScope.current = scope;
  const [prepared, setPrepared] = useState<{ scope: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { controller.current?.abort(); setPrepared(null); setStatus(""); }, [scope, props.disabled]);
  const text = !props.disabled && prepared?.scope === scope ? prepared.text : null;
  async function prepare() {
    if (busy || props.disabled || !props.outcomeId || !props.outcomeVersion) return;
    const requestScope = scope;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true); setPrepared(null); setStatus("");
    const timeout = window.setTimeout(() => {
      abort.abort();
      if (currentScope.current === requestScope) setStatus("Context preparation timed out. Nothing was sent; retry when ready.");
    }, 15000);
    try {
      const query = new URLSearchParams({ project_key: props.projectKey, plan_version: String(props.planVersion), outcome_id: String(props.outcomeId), outcome_version: String(props.outcomeVersion) });
      const response = await fetch(`/api/work-items/${props.id}/context-packet?${query}`, { cache: "no-store", signal: abort.signal });
      const packet = await response.json();
      if (!response.ok) throw new Error(packet.error ?? "Context could not be prepared.");
      if (!abort.signal.aborted && currentScope.current === requestScope) {
        setPrepared({ scope: requestScope, text: JSON.stringify(packet, null, 2) });
        setStatus("Prepared for review only. Check for private information before copying. Nothing has been sent.");
      }
    } catch (error) {
      if (!abort.signal.aborted && currentScope.current === requestScope) setStatus(error instanceof Error ? error.message : "Context unavailable.");
    } finally { window.clearTimeout(timeout); if (controller.current === abort) setBusy(false); }
  }
  return <details>
    <summary>Task context for manual review</summary>
    <p className="ai-stack-help">Only this task and its linked outcome gate. No worker access, approval or delivery. Refresh saved tasks and outcomes before preparing; a copied snapshot can become stale.</p>
    <button type="button" className="work-toggle" disabled={busy || props.disabled || !props.outcomeId || !props.outcomeVersion} onClick={() => void prepare()}>{busy ? "Preparing…" : "Prepare current task context"}</button>
    {text && <>
      <textarea aria-label="Prepared task context, review before copying" readOnly value={text} rows={12} style={{ width: "100%" }} />
      <button type="button" className="work-toggle" onClick={async () => {
        try {
          if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable. Select and copy the reviewed text manually.");
          await navigator.clipboard.writeText(text);
          setStatus("Copied this snapshot. No worker was started or sent context; current approval is still required.");
        } catch (error) { setStatus(error instanceof Error ? error.message : "Copy failed; select the text manually."); }
      }}>Copy reviewed context</button>
    </>}
    <p role="status" aria-live="polite">{status}</p>
  </details>;
}
