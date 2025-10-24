'use client';

import { useEffect, useRef } from 'react';
import { Pulley, Load } from '@/lib/types/types';
import {
  drawPulley,
  drawRope,
  drawLoad,
  drawForceVector,
  calculateCatenaryPoints,
} from '@/lib/physics/pulleyMechanics';
import { clearCanvas } from '@/lib/utils/calculations';

interface PulleyCanvasProps {
  pulleys: Pulley[];
  load: Load;
  effortForce: number;
  showForces: boolean;
}

export default function PulleyCanvas({
  pulleys,
  load,
  effortForce,
  showForces,
}: PulleyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const render = () => {
      clearCanvas(ctx);

      // Draw grid
      ctx.save();
      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw ropes between pulleys
      for (let i = 0; i < pulleys.length; i++) {
        const pulley = pulleys[i];
        const nextPulley = pulleys[i + 1];

        if (nextPulley) {
          const ropePoints = calculateCatenaryPoints(
            pulley.position,
            nextPulley.position,
            10,
            20
          );
          drawRope(ctx, ropePoints, effortForce, load.weight, '#D2B48C');
        } else {
          // Last pulley to load
          const ropePoints = calculateCatenaryPoints(
            pulley.position,
            load.position,
            15,
            20
          );
          drawRope(ctx, ropePoints, effortForce, load.weight, '#D2B48C');
        }
      }

      // Draw pulleys
      pulleys.forEach((pulley) => {
        drawPulley(ctx, pulley);
      });

      // Draw load
      drawLoad(ctx, load);

      // Draw force vectors if enabled
      if (showForces) {
        // Effort force (upward)
        drawForceVector(
          ctx,
          { x: 100, y: 400 },
          effortForce,
          -Math.PI / 2,
          '#4CAF50',
          `Effort: ${effortForce.toFixed(1)}N`,
          2
        );

        // Load weight (downward)
        drawForceVector(
          ctx,
          load.position,
          load.weight,
          Math.PI / 2,
          '#F44336',
          `Weight: ${load.weight.toFixed(1)}N`,
          0.5
        );
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pulleys, load, effortForce, showForces]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-white rounded-lg shadow-inner"
    />
  );
}
