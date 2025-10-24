import { Joint, Link, Point, Vector } from '@/lib/types/types';

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function getAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export function rotatePoint(point: Point, center: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

export function solveCircleIntersection(
  center1: Point,
  radius1: number,
  center2: Point,
  radius2: number
): Point[] {
  const dx = center2.x - center1.x;
  const dy = center2.y - center1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // No solution if circles don't intersect
  if (dist > radius1 + radius2 || dist < Math.abs(radius1 - radius2) || dist === 0) {
    return [];
  }

  const a = (radius1 * radius1 - radius2 * radius2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(radius1 * radius1 - a * a);

  const px = center1.x + (a * dx) / dist;
  const py = center1.y + (a * dy) / dist;

  const intersection1: Point = {
    x: px + (h * dy) / dist,
    y: py - (h * dx) / dist,
  };

  const intersection2: Point = {
    x: px - (h * dy) / dist,
    y: py + (h * dx) / dist,
  };

  return [intersection1, intersection2];
}

export function solveFourBarLinkage(
  ground: Link,
  crank: Link,
  coupler: Link,
  rocker: Link,
  joints: Joint[],
  crankAngle: number
): Joint[] {
  const updatedJoints = joints.map(j => ({ ...j }));

  // Find joint indices
  const groundJoint1 = updatedJoints.find(j => j.isFixed);
  if (!groundJoint1) return updatedJoints;

  const groundJoint2 = updatedJoints.find(j => j.isFixed && j.id !== groundJoint1.id);
  if (!groundJoint2) return updatedJoints;

  // Position crank endpoint
  const crankEndpoint: Point = {
    x: groundJoint1.position.x + crank.length * Math.cos(crankAngle),
    y: groundJoint1.position.y + crank.length * Math.sin(crankAngle),
  };

  // Find intersection of coupler and rocker circles
  const intersections = solveCircleIntersection(
    crankEndpoint,
    coupler.length,
    groundJoint2.position,
    rocker.length
  );

  if (intersections.length === 0) return updatedJoints;

  // Choose the correct intersection (usually the first one for continuous motion)
  const couplerEndpoint = intersections[0];

  // Update joint positions
  const crankJoint = updatedJoints.find(j => !j.isFixed && j.id === crank.joint2Id);
  if (crankJoint) {
    crankJoint.position = crankEndpoint;
  }

  const rockerJoint = updatedJoints.find(
    j => !j.isFixed && j.id !== crank.joint2Id
  );
  if (rockerJoint) {
    rockerJoint.position = couplerEndpoint;
  }

  return updatedJoints;
}

export function solveJansenLinkage(time: number, scale: number = 1): Joint[] {
  // Theo Jansen's Strandbeest leg dimensions (normalized)
  const a = 38 * scale;
  const b = 41.5 * scale;
  const c = 39.3 * scale;
  const d = 40.1 * scale;
  const e = 55.8 * scale;
  const f = 39.4 * scale;
  const g = 36.7 * scale;
  const h = 65.7 * scale;
  const i = 49 * scale;
  const j = 50 * scale;
  const k = 61.9 * scale;
  const l = 7.8 * scale;
  const m = 15 * scale;

  const crankAngle = time;

  // Fixed points
  const origin: Point = { x: 0, y: 0 };
  const fixedPoint: Point = { x: -m, y: -l };

  // Crank rotation
  const crank: Point = {
    x: origin.x + a * Math.cos(crankAngle),
    y: origin.y + a * Math.sin(crankAngle),
  };

  // This is a simplified version - full Jansen linkage requires iterative solving
  // For now, return approximate positions
  const joints: Joint[] = [
    { id: 'j0', position: origin, isFixed: true },
    { id: 'j1', position: fixedPoint, isFixed: true },
    { id: 'j2', position: crank, isFixed: false },
    // Additional joints would be calculated through circle intersections
  ];

  return joints;
}

export function calculateVelocity(
  currentPos: Point,
  previousPos: Point,
  dt: number
): Vector {
  return {
    x: (currentPos.x - previousPos.x) / dt,
    y: (currentPos.y - previousPos.y) / dt,
  };
}

export function calculateAcceleration(
  currentVel: Vector,
  previousVel: Vector,
  dt: number
): Vector {
  return {
    x: (currentVel.x - previousVel.x) / dt,
    y: (currentVel.y - previousVel.y) / dt,
  };
}

export function traceCouplerCurve(
  joints: Joint[],
  links: Link[],
  duration: number,
  steps: number
): Point[] {
  const path: Point[] = [];
  const dt = duration / steps;

  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    // Calculate linkage position at time t
    // Store coupler point position
    // This would need the full linkage solver
  }

  return path;
}

export function drawLink(
  ctx: CanvasRenderingContext2D,
  joint1: Joint,
  joint2: Joint,
  color: string = '#424242',
  lineWidth: number = 6
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(joint1.position.x, joint1.position.y);
  ctx.lineTo(joint2.position.x, joint2.position.y);
  ctx.stroke();

  ctx.restore();
}

export function drawJoint(
  ctx: CanvasRenderingContext2D,
  joint: Joint,
  radius: number = 8,
  isDriver: boolean = false
) {
  ctx.save();

  if (joint.isFixed) {
    // Fixed joint - black fill
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#666';
  } else {
    // Moving joint - white fill
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
  }

  if (isDriver) {
    // Driver joint glows
    ctx.shadowColor = '#4CAF50';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
  } else {
    ctx.lineWidth = 2;
  }

  ctx.beginPath();
  ctx.arc(joint.position.x, joint.position.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawVelocityVector(
  ctx: CanvasRenderingContext2D,
  position: Point,
  velocity: Vector,
  scale: number = 0.1,
  color: string = '#2196F3'
) {
  const arrowLength = Math.sqrt(velocity.x ** 2 + velocity.y ** 2) * scale;
  if (arrowLength < 1) return;

  const angle = Math.atan2(velocity.y, velocity.x);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
  ctx.lineTo(
    position.x + arrowLength * Math.cos(angle),
    position.y + arrowLength * Math.sin(angle)
  );
  ctx.stroke();

  // Draw arrowhead
  const headLength = 10;
  const headAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(
    position.x + arrowLength * Math.cos(angle),
    position.y + arrowLength * Math.sin(angle)
  );
  ctx.lineTo(
    position.x + arrowLength * Math.cos(angle) - headLength * Math.cos(angle - headAngle),
    position.y + arrowLength * Math.sin(angle) - headLength * Math.sin(angle - headAngle)
  );
  ctx.lineTo(
    position.x + arrowLength * Math.cos(angle) - headLength * Math.cos(angle + headAngle),
    position.y + arrowLength * Math.sin(angle) - headLength * Math.sin(angle + headAngle)
  );
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawPath(
  ctx: CanvasRenderingContext2D,
  path: Point[],
  color: string = '#00BCD4',
  lineWidth: number = 2
) {
  if (path.length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);

  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }

  ctx.stroke();
  ctx.restore();
}
