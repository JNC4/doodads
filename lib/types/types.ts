// Shared types for the mechanical systems playground

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

// Gear types
export interface Gear {
  id: string;
  teeth: number;
  position: Point;
  angle: number;
  angularVelocity: number;
  rpm: number;
  torque: number;
  isDriver: boolean;
  direction: 1 | -1; // 1 = clockwise, -1 = counterclockwise
  connectedTo: string[]; // IDs of connected gears
  type: 'spur' | 'planetary' | 'bevel' | 'rack';
}

export interface GearConnection {
  gear1Id: string;
  gear2Id: string;
  type: 'mesh' | 'chain' | 'axle';
}

export interface GearPreset {
  name: string;
  description: string;
  gears: Omit<Gear, 'id' | 'angle' | 'angularVelocity' | 'rpm' | 'torque' | 'direction' | 'connectedTo'>[];
  connections?: GearConnection[];
}

// Linkage types
export interface Joint {
  id: string;
  position: Point;
  isFixed: boolean;
  velocity?: Vector;
  acceleration?: Vector;
}

export interface Link {
  id: string;
  joint1Id: string;
  joint2Id: string;
  length: number;
  isDriver: boolean;
}

export interface LinkagePreset {
  name: string;
  description: string;
  joints: Omit<Joint, 'id' | 'velocity' | 'acceleration'>[];
  links: Omit<Link, 'id'>[];
  driverJointIndex?: number;
}

// Pulley types
export interface Pulley {
  id: string;
  position: Point;
  radius: number;
  isFixed: boolean; // true = fixed to ceiling, false = movable with load
  angle: number;
  connectedRopes: string[];
}

export interface Rope {
  id: string;
  segments: Point[];
  tension: number;
  pulleyIds: string[];
}

export interface Load {
  id: string;
  position: Point;
  mass: number; // kg
  weight: number; // N (mass * 9.81)
  supportingRopes: string[];
}

export interface PulleySystem {
  pulleys: Pulley[];
  ropes: Rope[];
  load: Load;
  effortForce: number;
  mechanicalAdvantage: number;
}

export interface PulleyPreset {
  name: string;
  description: string;
  pulleys: Omit<Pulley, 'id' | 'angle' | 'connectedRopes'>[];
  loadMass: number;
}

// Calculation results
export interface GearCalculations {
  gearRatio: number;
  speedRatio: number;
  torqueMultiplication: number;
  mechanicalAdvantage: number;
  efficiency: number;
  outputRpm: number;
  outputTorque: number;
}

export interface LinkageCalculations {
  couplerPath: Point[];
  velocities: Map<string, Vector>;
  accelerations: Map<string, Vector>;
  mechanicalAdvantage: number;
  hasDeadPoint: boolean;
}

export interface PulleyCalculations {
  idealMA: number;
  actualMA: number;
  requiredEffort: number;
  distanceRatio: number;
  ropeLength: number;
  efficiency: number;
}

// Animation state
export interface AnimationState {
  isPlaying: boolean;
  speed: number; // 0.1 to 2.0
  time: number;
  fps: number;
}

// UI state
export type Mode = 'gears' | 'linkages' | 'pulleys';

export interface CanvasState {
  zoom: number;
  pan: Point;
  isDragging: boolean;
  selectedId: string | null;
  hoveredId: string | null;
}
