'use client';

import { useEffect, useRef, useState } from 'react';
import { Joint, Link as LinkType } from '@/lib/types/types';
import { drawLink, drawJoint, drawPath } from '@/lib/physics/linkageKinematics';
import { clearCanvas, getCanvasMousePos } from '@/lib/utils/calculations';

interface LinkageCanvasProps {
  joints: Joint[];
  links: LinkType[];
  onJointsUpdate: (joints: Joint[]) => void;
  isPlaying: boolean;
  time: number;
  showPaths: boolean;
  tracePoints: Array<{ jointId: string; path: { x: number; y: number }[] }>;
}

export default function LinkageCanvas({
  joints,
  links,
  onJointsUpdate,
  isPlaying,
  time,
  showPaths,
  tracePoints,
}: LinkageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
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

      // Draw paths if enabled
      if (showPaths && tracePoints.length > 0) {
        tracePoints.forEach((trace, index) => {
          const colors = ['#00BCD4', '#FF4081', '#4CAF50', '#FFC107'];
          drawPath(ctx, trace.path, colors[index % colors.length], 3);
        });
      }

      // Draw links
      links.forEach((link) => {
        const joint1 = joints.find((j) => j.id === link.joint1Id);
        const joint2 = joints.find((j) => j.id === link.joint2Id);
        if (joint1 && joint2) {
          drawLink(ctx, joint1, joint2, link.isDriver ? '#4CAF50' : '#424242');
        }
      });

      // Draw joints
      joints.forEach((joint) => {
        const isDriver = links.some((l) => l.isDriver && (l.joint1Id === joint.id || l.joint2Id === joint.id));
        drawJoint(ctx, joint, 8, isDriver);
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [joints, links, showPaths, tracePoints]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getCanvasMousePos(canvas, e.nativeEvent);

    for (const joint of joints) {
      const dist = Math.sqrt(
        Math.pow(pos.x - joint.position.x, 2) + Math.pow(pos.y - joint.position.y, 2)
      );
      if (dist <= 10) {
        setDraggingId(joint.id);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !draggingId) return;

    const pos = getCanvasMousePos(canvas, e.nativeEvent);

    const updatedJoints = joints.map((joint) => {
      if (joint.id === draggingId && !joint.isFixed) {
        return { ...joint, position: pos };
      }
      return joint;
    });

    onJointsUpdate(updatedJoints);
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-white rounded-lg shadow-inner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
