export type HandoverPacketRecord = {
  id: number;
  project_key: string;
  task_id: number | null;
  work_item_id: number | null;
  status: string;
  completed_work: string;
  next_action: string;
  blockers: string;
  verification: string;
  recovery_note: string;
  branch: string | null;
  commit_ref: string | null;
  created_at: string;
};

function recorded(value: string | null | undefined): string {
  const normalized = value?.trim();
  return normalized || "Not recorded";
}

export function formatHandoverPacket(
  checkpoint: HandoverPacketRecord,
  projectLabel: string,
): string {
  return [
    "# Resume handoff",
    "",
    `Checkpoint: #${checkpoint.id}`,
    `Project: ${projectLabel} (${checkpoint.project_key})`,
    `Task ID: ${checkpoint.task_id === null ? "None linked" : `#${checkpoint.task_id}`}`,
    `Work item ID: ${checkpoint.work_item_id === null ? "None linked" : `#${checkpoint.work_item_id}`}`,
    `Status: ${recorded(checkpoint.status)}`,
    `Completed work: ${recorded(checkpoint.completed_work)}`,
    `Next action: ${recorded(checkpoint.next_action)}`,
    `Blockers: ${recorded(checkpoint.blockers)}`,
    `Verification: ${recorded(checkpoint.verification)}`,
    `Recovery note: ${recorded(checkpoint.recovery_note)}`,
    `Branch: ${recorded(checkpoint.branch)}`,
    `Commit: ${recorded(checkpoint.commit_ref)}`,
    `Checkpoint timestamp: ${recorded(checkpoint.created_at)}`,
    "",
    "## Guardrails",
    "- Read the current saved project work control first. Respect OFF; this checkpoint is not authorization to enable or continue work.",
    "- DDG Finance remains hard-held until Claude review.",
    "- DDG Music is unchanged; do not alter its name, data, or work status.",
    "- No agent was started to create or copy this handoff.",
    "- No model/API switch was made for this handoff.",
    "- Verify the repository, worktree, and current branch before editing; do not assume they match the recorded branch or commit.",
    "",
    "## Limits",
    "- Checkpoints are manual. No automatic five-minute capture is connected.",
    "- This handoff does not detect ChatGPT quota or automatically transfer to or start another AI.",
  ].join("\n");
}

export async function writeHandoverPacket(
  checkpoint: HandoverPacketRecord,
  projectLabel: string,
  writeText: (packet: string) => Promise<void>,
): Promise<void> {
  await writeText(formatHandoverPacket(checkpoint, projectLabel));
}
