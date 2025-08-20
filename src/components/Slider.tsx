import React, { useEffect, useMemo, useRef, useState } from "react";

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (value: number) => void;
  onValueChange?: (value: [number]) => void;
};

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  disabled = false,
  className = "",
  onChange,
  onValueChange,
}: SliderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const val = isControlled ? (value as number) : internal;

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const range = Math.max(max - min, 0.000001);
  const percent = useMemo(() => {
    const p = ((val - min) / range) * 100;
    return Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 0;
  }, [val, min, range]);

  const roundToStep = (n: number) => {
    if (step <= 0) return n;
    const r = Math.round((n - min) / step) * step + min;
    return Math.min(max, Math.max(min, r));
  };

  const setVal = (n: number) => {
    const next = roundToStep(n);
    if (!isControlled) setInternal(next);
    onChange?.(next);
    onValueChange?.([next]);
  };

  const valueFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.min(1, Math.max(0, ratio));
    const raw = min + clampedRatio * (max - min);
    setVal(raw);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    draggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    valueFromClientX(e.clientX);
    e.preventDefault();
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current || disabled) return;
    valueFromClientX(e.clientX);
    e.preventDefault();
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    (e.currentTarget as HTMLDivElement).releasePointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    if (val < min || val > max) setVal(val);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max]);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(val)}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={[
        "group relative w-40 h-2 select-none touch-none cursor-pointer",
        "rounded-full bg-[#535353]",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].join(" ")}
      style={{ touchAction: "none" }}
    >
      {/* Progreso */}
      <div
        className="absolute left-0 top-0 h-2 rounded-full 
                   bg-[#b3b3b3] group-hover:bg-[#1DB954]"
        style={{ width: `${percent}%` }}
      />

      {/* Thumb (invisible hasta hover) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 
                   w-4 h-4 rounded-full bg-white shadow
                   opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100
                   transition duration-150"
        style={{ left: `calc(${percent}% - 8px)` }}
      />
    </div>
  );
}
