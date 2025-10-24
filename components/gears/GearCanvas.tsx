'use client';

import { useEffect, useRef, useState } from 'react';
import { Gear } from '@/lib/types/types';
import {
  drawGear,
  drawGearInfo,
  getGearRadius,
  areGearsMeshing,
  propagateGearMotion,
  GEAR_MODULE,
} from '@/lib/physics/gearPhysics';
import { clearCanvas, getCanvasMousePos, isPointInCircle } from '@/lib/utils/calculations';

interface GearCanvasProps {
  gears: Gear[];
  onGearsUpdate: (gears: Gear[]) => void;
  isPlaying: boolean;
  inputRpm: number;
  inputTorque: number;
  showInfo: boolean;
}

export default function GearCanvas({
  gears,
  onGearsUpdate,
  isPlaying,
  inputRpm,
  inputTorque,
  showInfo,
}: GearCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = (time: number) => {
      const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = time;

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

      let updatedGears = [...gears];

      // Update angles if playing
      if (isPlaying) {
        updatedGears = updatedGears.map((gear) => {
          if (gear.angularVelocity !== 0) {
            return {
              ...gear,
              angle: gear.angle + gear.angularVelocity * dt,
            };
          }
          return gear;
        });
        onGearsUpdate(updatedGears);
      }

      // Draw connection lines between meshed gears
      ctx.save();
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      updatedGears.forEach((gear) => {
        gear.connectedTo.forEach((connectedId) => {
          const connectedGear = updatedGears.find((g) => g.id === connectedId);
          if (connectedGear) {
            ctx.beginPath();
            ctx.moveTo(gear.position.x, gear.position.y);
            ctx.lineTo(connectedGear.position.x, connectedGear.position.y);
            ctx.stroke();
          }
        });
      });
      ctx.restore();

      // Draw gears
      updatedGears.forEach((gear) => {
        let color = '#B0C4DE'; // Default steel blue

        if (gear.id === hoveredId) {
          color = '#FFD700'; // Gold when hovered
        } else if (gear.isDriver) {
          color = '#4CAF50'; // Green for driver
        } else if (gear.direction === 1) {
          color = '#2196F3'; // Blue for clockwise
        } else if (gear.direction === -1) {
          color = '#F44336'; // Red for counterclockwise
        }

        drawGear(ctx, gear, color);

        if (showInfo) {
          drawGearInfo(ctx, gear);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gears, isPlaying, hoveredId, showInfo, onGearsUpdate, inputRpm, inputTorque]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getCanvasMousePos(canvas, e.nativeEvent);

    // Check if clicking on a gear
    for (const gear of gears) {
      const radius = getGearRadius(gear.teeth);
      if (isPointInCircle(pos, gear.position, radius)) {
        setDraggingId(gear.id);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getCanvasMousePos(canvas, e.nativeEvent);

    // Update hovered gear
    let newHoveredId: string | null = null;
    for (const gear of gears) {
      const radius = getGearRadius(gear.teeth);
      if (isPointInCircle(pos, gear.position, radius)) {
        newHoveredId = gear.id;
        break;
      }
    }
    setHoveredId(newHoveredId);

    // Handle dragging
    if (draggingId) {
      const updatedGears = gears.map((gear) => {
        if (gear.id === draggingId) {
          return {
            ...gear,
            position: pos,
            connectedTo: [], // Break connections when moving
          };
        }
        // Remove this gear from other gears' connections
        return {
          ...gear,
          connectedTo: gear.connectedTo.filter((id) => id !== draggingId),
        };
      });
      onGearsUpdate(updatedGears);
    }
  };

  const handleMouseUp = () => {
    if (draggingId) {
      // Check for new connections
      const updatedGears = gears.map((gear) => ({ ...gear }));
      const draggedGear = updatedGears.find((g) => g.id === draggingId);

      if (draggedGear) {
        updatedGears.forEach((otherGear) => {
          if (otherGear.id !== draggingId && areGearsMeshing(draggedGear, otherGear)) {
            if (!draggedGear.connectedTo.includes(otherGear.id)) {
              draggedGear.connectedTo.push(otherGear.id);
            }
            if (!otherGear.connectedTo.includes(draggedGear.id)) {
              otherGear.connectedTo.push(draggedGear.id);
            }
          }
        });
      }

      onGearsUpdate(updatedGears);
    }
    setDraggingId(null);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getCanvasMousePos(canvas, e.nativeEvent);

    // Find and delete gear at position
    const updatedGears = gears.filter((gear) => {
      const radius = getGearRadius(gear.teeth);
      return !isPointInCircle(pos, gear.position, radius);
    });

    // Remove deleted gear from connections
    const deletedIds = gears
      .filter((g) => !updatedGears.find((ug) => ug.id === g.id))
      .map((g) => g.id);

    const cleanedGears = updatedGears.map((gear) => ({
      ...gear,
      connectedTo: gear.connectedTo.filter((id) => !deletedIds.includes(id)),
    }));

    onGearsUpdate(cleanedGears);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-white rounded-lg shadow-inner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    />
  );
}
