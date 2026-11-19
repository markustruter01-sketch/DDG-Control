// The icons the copied Finance dashboard uses (ddg-control does not depend on lucide-react).
type P = { size?: number; 'aria-hidden'?: boolean | 'true' | 'false' };
export function Download({ size = 16, ...rest }: P) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...rest}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>;
}
