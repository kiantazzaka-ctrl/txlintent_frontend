import { useCanvas } from '../art/useCanvas';

/** Canvas artwork filling its parent. */
export default function Art({ draw, fps = 0, className, label }) {
  const ref = useCanvas(draw, { fps });
  return <canvas ref={ref} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
