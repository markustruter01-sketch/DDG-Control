import { useEffect, useState } from 'react';

// Five small idle moves (keyframes in night-glass.css). Each avatar picks one at random every few seconds.
const IDLES = ['idle-bob', 'idle-look-left', 'idle-look-right', 'idle-hop', 'idle-wiggle'] as const;
const MOVE_MS = 1600; // longest keyframe runs 1.6 s
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function BotAvatar({ file, size }: { file: string; size: number }) {
  const [move, setMove] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      timer = setTimeout(() => {
        setMove(IDLES[Math.floor(Math.random() * IDLES.length)]!);
        timer = setTimeout(() => { setMove(null); next(); }, MOVE_MS);
      }, rand(4_000, 14_000)); // a quiet gap between moves, different for every bot
    };
    next();
    return () => clearTimeout(timer);
  }, []);

  return (
    <img className={`avatar-img${move ? ` ${move}` : ''}`} src={`${import.meta.env.BASE_URL}avatars/${file}`}
      alt="" width={size} height={size} />
  );
}
