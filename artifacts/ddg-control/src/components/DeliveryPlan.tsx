import { useState } from 'react';
import { deliveryItems, deliveryPlanVersion, deliveryRules, deliveryStateLabels } from '@/lib/ddg-control-delivery-plan';

export function DeliveryPlan() {
  const [phase, setPhase] = useState('all');
  const items = deliveryItems.filter((item) => phase === 'all' || item.phase === phase);
  const phases = [...new Set(deliveryItems.map((item) => item.phase))];
  return (
    <details className="ai-stack-cockpit-category delivery-plan" id="delivery-plan">
      <summary><strong>Finish line and shared build plan</strong><small>Version {deliveryPlanVersion} · repository snapshot</small></summary>
      <p className="ai-stack-help">What remains to finish DDG Control. This is a versioned planning record, not the executable work queue. Source saved does not mean verified or live.</p>
      <label htmlFor="delivery-phase">Milestone</label>
      <select id="delivery-phase" value={phase} onChange={(event) => setPhase(event.target.value)}>
        <option value="all">All milestones</option>{phases.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <div className="delivery-item-grid">{items.map((item) => <details className="delivery-item" key={item.id}>
        <summary><span className="delivery-id">{item.id}</span><strong>{item.title}</strong><span className={`delivery-state state-${item.state}`}>{deliveryStateLabels[item.state]}</span></summary>
        <p className="delivery-evidence">{item.evidence}</p>
        <h3>Finished when</h3><ul>{item.acceptance.map((check) => <li key={check}>{check}</li>)}</ul>
      </details>)}</div>
      <details className="delivery-rules"><summary>Standing boundaries</summary><ul>{deliveryRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></details>
      <p className="ai-stack-help">Update this plan through reviewed Git changes. Automatic chat imports, agent-scoped distribution and owner acceptance are separate work; no self-updating or completion guarantee is implied.</p>
    </details>
  );
}
