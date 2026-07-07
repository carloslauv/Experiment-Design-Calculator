"use client";

import { useEffect, useRef } from "react";

export default function NumberLineGauge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const fg = "#1B1B1B";
    const mu = "#7A7060";
    const sig = "#2F7D55";
    const noi = "#BC4A2C";

    const PAD = 24;
    const L = PAD;
    const R = W - PAD;
    const AY = H / 2;
    const CX = (L + R) / 2;
    const U = (R - L) / 14;

    // Axis
    ctx.strokeStyle = fg;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(L, AY);
    ctx.lineTo(R, AY);
    ctx.stroke();

    // Arrowheads
    ctx.fillStyle = fg;
    (
      [
        [R, -1],
        [L, 1],
      ] as [number, number][]
    ).forEach(([x, d]) => {
      ctx.beginPath();
      ctx.moveTo(x + d * 8, AY - 4);
      ctx.lineTo(x, AY);
      ctx.lineTo(x + d * 8, AY + 4);
      ctx.fill();
    });

    // Ticks
    for (let i = -6; i <= 6; i++) {
      const x = CX + i * U;
      const h = i === 0 ? 13 : 6;
      ctx.lineWidth = i === 0 ? 2.5 : 1;
      ctx.strokeStyle = i === 0 ? fg : mu;
      ctx.beginPath();
      ctx.moveTo(x, AY - h);
      ctx.lineTo(x, AY + h);
      ctx.stroke();
    }

    // Zero label
    ctx.fillStyle = fg;
    ctx.font = `12px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.fillText("0", CX, AY + 26);

    // Signal bracket (above, right of zero)
    const SL = CX + 1.8 * U;
    const SR = CX + 4.5 * U;
    const SY = AY - 44;
    ctx.strokeStyle = sig;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(SL, SY);
    ctx.lineTo(SR, SY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(SL, SY - 7);
    ctx.lineTo(SL, SY + 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(SR, SY - 7);
    ctx.lineTo(SR, SY + 7);
    ctx.stroke();
    ctx.fillStyle = sig + "2A";
    ctx.fillRect(SL, AY - 6, SR - SL, 12);
    ctx.fillStyle = sig;
    ctx.font = `10px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.fillText("+2.1%  to  +6.8%", (SL + SR) / 2, SY - 12);

    // Noise bracket (below, straddles zero)
    const NL = CX - 2.2 * U;
    const NR = CX + 1.8 * U;
    const NY = AY + 46;
    ctx.strokeStyle = noi;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(NL, NY);
    ctx.lineTo(NR, NY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(NL, NY - 7);
    ctx.lineTo(NL, NY + 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(NR, NY - 7);
    ctx.lineTo(NR, NY + 7);
    ctx.stroke();
    ctx.fillStyle = noi + "22";
    ctx.fillRect(NL, AY - 6, NR - NL, 12);
    ctx.fillStyle = noi;
    ctx.font = `10px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.fillText("−3.2%  to  +2.1%", (NL + NR) / 2, NY + 18);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={460}
      height={170}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}
