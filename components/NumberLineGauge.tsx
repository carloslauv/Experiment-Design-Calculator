"use client";

import { useEffect, useRef } from "react";

interface Props {
  ciLow: number;
  ciHigh: number;
  significant: boolean;
  positive?: boolean;  // significant AND lift > 0 → green; else red
}

export default function NumberLineGauge({ ciLow, ciHigh, significant, positive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const fg  = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#1B1B1B";
    const mu  = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#7A7060";
    const sig = "#2F7D55";
    const noi = "#BC4A2C";
    const color = (significant && positive) ? sig : noi;

    const PAD = 28;
    const L = PAD;
    const R = W - PAD;
    const AY = H / 2;
    const CX = (L + R) / 2;

    // Scale: fit CI + some padding
    const absMax = Math.max(Math.abs(ciLow), Math.abs(ciHigh), 0.01) * 1.6;
    const scale = (R - L) / 2 / absMax; // px per unit

    // Axis
    ctx.strokeStyle = fg;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(L, AY);
    ctx.lineTo(R, AY);
    ctx.stroke();

    // Arrowheads
    ctx.fillStyle = fg;
    ([[ R, -1], [L, 1]] as [number, number][]).forEach(([x, d]) => {
      ctx.beginPath();
      ctx.moveTo(x + d * 8, AY - 4);
      ctx.lineTo(x, AY);
      ctx.lineTo(x + d * 8, AY + 4);
      ctx.fill();
    });

    // Ticks: 5 on each side + zero
    const tickCount = 5;
    const tickStep = absMax / tickCount;
    for (let i = -tickCount; i <= tickCount; i++) {
      const x = CX + i * tickStep * scale;
      const h = i === 0 ? 13 : 5;
      ctx.lineWidth = i === 0 ? 2.5 : 1;
      ctx.strokeStyle = i === 0 ? fg : mu;
      ctx.beginPath();
      ctx.moveTo(x, AY - h);
      ctx.lineTo(x, AY + h);
      ctx.stroke();
    }

    // Zero label
    ctx.fillStyle = fg;
    ctx.font = `13px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.fillText("0", CX, AY + 22);

    // CI bracket
    const x1 = CX + ciLow * scale;
    const x2 = CX + ciHigh * scale;
    const BY = AY - 38;

    // Shaded band on axis
    ctx.fillStyle = color + "28";
    ctx.fillRect(x1, AY - 7, x2 - x1, 14);

    // Horizontal bracket line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, BY);
    ctx.lineTo(x2, BY);
    ctx.stroke();

    // Endcaps
    [x1, x2].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, BY - 7);
      ctx.lineTo(x, BY + 7);
      ctx.stroke();
    });

    // Midpoint dot
    const midX = (x1 + x2) / 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(midX, BY, 3, 0, Math.PI * 2);
    ctx.fill();

    // CI label
    const fmt = (v: number) => (v >= 0 ? "+" : "") + (v * 100).toFixed(1) + "%";
    ctx.fillStyle = color;
    ctx.font = `12px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.fillText(`${fmt(ciLow)}  to  ${fmt(ciHigh)}`, midX, BY - 13);

    // Zero-crossing indicator
    if (!significant) {
      ctx.strokeStyle = noi;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(CX, AY - 20);
      ctx.lineTo(CX, AY + 20);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(canvas);
  });

  return (
    <canvas
      ref={canvasRef}
      width={460}
      height={120}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}
