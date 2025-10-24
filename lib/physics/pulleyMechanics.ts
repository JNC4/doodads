import { Pulley, Rope, Load, Point, PulleyCalculations } from '@/lib/types/types';

export const GRAVITY = 9.81; // m/s²
export const PULLEY_FRICTION = 0.9; // 90% efficiency per pulley

export function calculateWeight(mass: number): number {
  return mass * GRAVITY;
}

export function countSupportingRopes(pulleys: Pulley[], load: Load): number {
  // Count rope segments that directly support the load
  // For a basic system, this is the number of rope segments attached to movable pulleys
  let count = 0;

  for (const pulley of pulleys) {
    if (!pulley.isFixed) {
      // Movable pulley - rope segments on both sides support the load
      count += 2;
    }
  }

  // If no movable pulleys, at least one rope supports the load
  return Math.max(count, 1);
}

export function calculateIdealMA(pulleys: Pulley[], load: Load): number {
  return countSupportingRopes(pulleys, load);
}

export function calculateActualMA(pulleys: Pulley[], load: Load): number {
  const idealMA = calculateIdealMA(pulleys, load);
  const efficiency = Math.pow(PULLEY_FRICTION, pulleys.length);
  return idealMA * efficiency;
}

export function calculateRequiredEffort(load: Load, actualMA: number): number {
  return load.weight / actualMA;
}

export function calculateDistanceRatio(ma: number): number {
  // Distance ratio equals mechanical advantage
  // If MA = 4, you pull 4m of rope to lift load 1m
  return ma;
}

export function calculateRopeLength(pulleys: Pulley[], load: Load): number {
  let totalLength = 0;

  // Calculate rope length through all pulleys
  for (let i = 0; i < pulleys.length - 1; i++) {
    const p1 = pulleys[i].position;
    const p2 = pulleys[i + 1].position;
    totalLength += getDistance(p1, p2);
  }

  // Add distance from last pulley to load
  if (pulleys.length > 0) {
    const lastPulley = pulleys[pulleys.length - 1];
    totalLength += getDistance(lastPulley.position, load.position);
  }

  return totalLength;
}

export function calculatePulleySystemMetrics(
  pulleys: Pulley[],
  load: Load
): PulleyCalculations {
  const idealMA = calculateIdealMA(pulleys, load);
  const actualMA = calculateActualMA(pulleys, load);
  const requiredEffort = calculateRequiredEffort(load, actualMA);
  const distanceRatio = calculateDistanceRatio(idealMA);
  const ropeLength = calculateRopeLength(pulleys, load);
  const efficiency = Math.pow(PULLEY_FRICTION, pulleys.length);

  return {
    idealMA,
    actualMA,
    requiredEffort,
    distanceRatio,
    ropeLength,
    efficiency,
  };
}

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function calculateCatenaryPoints(
  start: Point,
  end: Point,
  sag: number,
  segments: number = 20
): Point[] {
  const points: Point[] = [];
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = start.x + dx * t;

    // Parabolic approximation of catenary for simplicity
    const sagAmount = sag * Math.sin(t * Math.PI);
    const y = start.y + dy * t + sagAmount;

    points.push({ x, y });
  }

  return points;
}

export function calculateRopeTension(
  effort: number,
  ma: number,
  segmentIndex: number,
  totalSegments: number
): number {
  // Tension varies along the rope
  // Effort end has lowest tension, load end has highest
  const ratio = segmentIndex / totalSegments;
  return effort * (1 + ratio * (ma - 1));
}

export function getTensionColor(tension: number, maxTension: number): string {
  // Blue (low) to Red (high) gradient
  const ratio = Math.min(tension / maxTension, 1);

  const r = Math.floor(ratio * 255);
  const g = 0;
  const b = Math.floor((1 - ratio) * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

export function drawPulley(
  ctx: CanvasRenderingContext2D,
  pulley: Pulley,
  color: string = '#8D6E63'
) {
  ctx.save();
  ctx.translate(pulley.position.x, pulley.position.y);
  ctx.rotate(pulley.angle);

  // Draw pulley wheel
  ctx.fillStyle = color;
  ctx.strokeStyle = '#5D4E37';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(0, 0, pulley.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw groove
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, pulley.radius * 0.9, 0, Math.PI * 2);
  ctx.stroke();

  // Draw center axle
  ctx.fillStyle = '#424242';
  ctx.beginPath();
  ctx.arc(0, 0, pulley.radius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Draw spokes
  ctx.strokeStyle = '#5D4E37';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
      pulley.radius * 0.8 * Math.cos(angle),
      pulley.radius * 0.8 * Math.sin(angle)
    );
    ctx.stroke();
  }

  ctx.restore();

  // Draw mounting bracket for fixed pulleys
  if (pulley.isFixed) {
    ctx.save();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pulley.position.x, pulley.position.y - pulley.radius);
    ctx.lineTo(pulley.position.x, pulley.position.y - pulley.radius - 20);
    ctx.stroke();

    // Draw ceiling attachment
    ctx.fillStyle = '#666';
    ctx.fillRect(
      pulley.position.x - 15,
      pulley.position.y - pulley.radius - 25,
      30,
      10
    );
    ctx.restore();
  }
}

export function drawRope(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  tension: number,
  maxTension: number,
  baseColor: string = '#D2B48C'
) {
  if (points.length < 2) return;

  const color = getTensionColor(tension, maxTension);
  const lineWidth = 3 + (tension / maxTension) * 3; // Thicker for more tension

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();

  // Draw rope texture (subtle lines)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  for (let i = 0; i < points.length - 1; i += 2) {
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    if (i + 1 < points.length) {
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

export function drawLoad(
  ctx: CanvasRenderingContext2D,
  load: Load,
  width: number = 60,
  height: number = 60
) {
  ctx.save();

  // Draw load box
  ctx.fillStyle = '#795548';
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 3;

  ctx.fillRect(
    load.position.x - width / 2,
    load.position.y - height / 2,
    width,
    height
  );
  ctx.strokeRect(
    load.position.x - width / 2,
    load.position.y - height / 2,
    width,
    height
  );

  // Draw weight label
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${load.mass}kg`, load.position.x, load.position.y);

  ctx.restore();
}

export function drawForceVector(
  ctx: CanvasRenderingContext2D,
  position: Point,
  force: number,
  angle: number,
  color: string,
  label: string,
  scale: number = 0.5
) {
  const arrowLength = force * scale;

  ctx.save();
  ctx.translate(position.x, position.y);

  // Draw arrow line
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(
    arrowLength * Math.cos(angle),
    arrowLength * Math.sin(angle)
  );
  ctx.stroke();

  // Draw arrowhead
  ctx.fillStyle = color;
  const headLength = 12;
  const headAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(
    arrowLength * Math.cos(angle),
    arrowLength * Math.sin(angle)
  );
  ctx.lineTo(
    arrowLength * Math.cos(angle) - headLength * Math.cos(angle - headAngle),
    arrowLength * Math.sin(angle) - headLength * Math.sin(angle - headAngle)
  );
  ctx.lineTo(
    arrowLength * Math.cos(angle) - headLength * Math.cos(angle + headAngle),
    arrowLength * Math.sin(angle) - headLength * Math.sin(angle + headAngle)
  );
  ctx.closePath();
  ctx.fill();

  // Draw label
  ctx.fillStyle = '#000';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    label,
    (arrowLength / 2) * Math.cos(angle),
    (arrowLength / 2) * Math.sin(angle) - 10
  );

  ctx.restore();
}
