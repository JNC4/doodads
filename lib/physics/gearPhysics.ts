import { Gear, Point, GearCalculations } from '@/lib/types/types';

export const GEAR_MODULE = 8; // Size of each tooth in pixels
export const FRICTION_COEFFICIENT = 0.95; // 95% efficiency per gear pair

export function getGearRadius(teeth: number): number {
  return (teeth * GEAR_MODULE) / 2;
}

export function getPitchRadius(teeth: number): number {
  return getGearRadius(teeth);
}

export function areGearsMeshing(gear1: Gear, gear2: Gear): boolean {
  const distance = getDistance(gear1.position, gear2.position);
  const radius1 = getGearRadius(gear1.teeth);
  const radius2 = getGearRadius(gear2.teeth);
  const idealDistance = radius1 + radius2;

  // Allow 5% tolerance for meshing
  return Math.abs(distance - idealDistance) < idealDistance * 0.05;
}

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function calculateGearRatio(driverGear: Gear, drivenGear: Gear): number {
  return drivenGear.teeth / driverGear.teeth;
}

export function calculateDirection(gear1: Gear, gear2: Gear, connectionType: 'mesh' | 'chain' | 'axle'): 1 | -1 {
  if (connectionType === 'chain') {
    return 1; // Same direction for chain/belt
  }
  if (connectionType === 'axle') {
    return 1; // Same direction on same axle
  }
  // Meshed gears rotate opposite directions
  return -1;
}

export function calculateGearSpeed(driverRpm: number, driverTeeth: number, drivenTeeth: number): number {
  return (driverRpm * driverTeeth) / drivenTeeth;
}

export function calculateGearTorque(driverTorque: number, driverTeeth: number, drivenTeeth: number, efficiency: number = FRICTION_COEFFICIENT): number {
  const ratio = drivenTeeth / driverTeeth;
  return driverTorque * ratio * efficiency;
}

export function calculateCompoundGearRatio(gears: Gear[], connections: Array<{gear1Id: string, gear2Id: string}>): number {
  let totalRatio = 1;

  for (const connection of connections) {
    const gear1 = gears.find(g => g.id === connection.gear1Id);
    const gear2 = gears.find(g => g.id === connection.gear2Id);

    if (gear1 && gear2) {
      const ratio = calculateGearRatio(gear1, gear2);
      totalRatio *= ratio;
    }
  }

  return totalRatio;
}

export function propagateGearMotion(
  gears: Gear[],
  driverGear: Gear,
  driverRpm: number,
  driverTorque: number
): Gear[] {
  const updatedGears = gears.map(g => ({ ...g }));
  const visited = new Set<string>();
  const queue: Array<{gear: Gear, rpm: number, torque: number, direction: 1 | -1}> = [];

  // Find driver gear in updated array
  const driver = updatedGears.find(g => g.id === driverGear.id);
  if (!driver) return updatedGears;

  driver.rpm = driverRpm;
  driver.torque = driverTorque;
  driver.direction = 1;
  driver.angularVelocity = (driverRpm * 2 * Math.PI) / 60;

  queue.push({ gear: driver, rpm: driverRpm, torque: driverTorque, direction: 1 });
  visited.add(driver.id);

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const connectedId of current.gear.connectedTo) {
      if (visited.has(connectedId)) continue;

      const connectedGear = updatedGears.find(g => g.id === connectedId);
      if (!connectedGear) continue;

      const rpm = calculateGearSpeed(current.rpm, current.gear.teeth, connectedGear.teeth);
      const torque = calculateGearTorque(current.torque, current.gear.teeth, connectedGear.teeth);
      const direction = (current.direction * -1) as 1 | -1; // Meshed gears reverse

      connectedGear.rpm = rpm;
      connectedGear.torque = torque;
      connectedGear.direction = direction;
      connectedGear.angularVelocity = (rpm * 2 * Math.PI) / 60 * direction;

      visited.add(connectedId);
      queue.push({ gear: connectedGear, rpm, torque, direction });
    }
  }

  return updatedGears;
}

export function calculateSystemEfficiency(gearCount: number): number {
  return Math.pow(FRICTION_COEFFICIENT, gearCount - 1);
}

export function calculateGearSystemMetrics(
  inputRpm: number,
  inputTorque: number,
  gears: Gear[],
  driverGearId: string,
  outputGearId: string
): GearCalculations {
  const driver = gears.find(g => g.id === driverGearId);
  const output = gears.find(g => g.id === outputGearId);

  if (!driver || !output) {
    return {
      gearRatio: 1,
      speedRatio: 1,
      torqueMultiplication: 1,
      mechanicalAdvantage: 1,
      efficiency: 1,
      outputRpm: inputRpm,
      outputTorque: inputTorque,
    };
  }

  const gearRatio = output.teeth / driver.teeth;
  const speedRatio = 1 / gearRatio;
  const efficiency = calculateSystemEfficiency(gears.length);
  const outputRpm = inputRpm * speedRatio;
  const outputTorque = inputTorque * gearRatio * efficiency;

  return {
    gearRatio,
    speedRatio,
    torqueMultiplication: gearRatio,
    mechanicalAdvantage: gearRatio,
    efficiency,
    outputRpm,
    outputTorque,
  };
}

export function drawGear(
  ctx: CanvasRenderingContext2D,
  gear: Gear,
  color: string = '#B0C4DE'
) {
  const radius = getGearRadius(gear.teeth);
  const toothHeight = GEAR_MODULE * 0.4;
  const toothWidth = (2 * Math.PI * radius) / gear.teeth / 2;

  ctx.save();
  ctx.translate(gear.position.x, gear.position.y);
  ctx.rotate(gear.angle);

  // Draw gear body
  ctx.fillStyle = color;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius - toothHeight, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw teeth
  ctx.fillStyle = color;
  ctx.strokeStyle = '#333';
  for (let i = 0; i < gear.teeth; i++) {
    const angle = (i / gear.teeth) * Math.PI * 2;
    const nextAngle = ((i + 0.5) / gear.teeth) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(0, 0, radius - toothHeight, angle, nextAngle);
    ctx.arc(0, 0, radius, nextAngle, nextAngle, false);
    ctx.arc(0, 0, radius, nextAngle, angle, true);
    ctx.arc(0, 0, radius - toothHeight, angle, angle, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Draw center hub
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw center hole
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawGearInfo(
  ctx: CanvasRenderingContext2D,
  gear: Gear
) {
  ctx.save();
  ctx.font = '12px monospace';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';

  const radius = getGearRadius(gear.teeth);
  const y = gear.position.y + radius + 20;

  ctx.fillText(`${Math.abs(gear.rpm).toFixed(1)} RPM`, gear.position.x, y);
  ctx.fillText(`${gear.torque.toFixed(1)} Nm`, gear.position.x, y + 15);

  ctx.restore();
}
