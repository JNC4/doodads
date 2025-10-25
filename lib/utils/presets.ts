import { GearPreset, LinkagePreset, PulleyPreset } from '@/lib/types/types';

export const gearPresets: Record<string, GearPreset> = {
  simple: {
    name: 'Simple Reduction',
    description: '2 gears (60T → 20T = 3:1 speedup)',
    gears: [
      { teeth: 60, position: { x: 200, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 20, position: { x: 200 + (60 * 8 / 2) + (20 * 8 / 2), y: 300 }, type: 'spur', isDriver: false },
    ],
  },
  compound: {
    name: 'Compound Gear Train',
    description: '4 gears achieving high ratio (9:1)',
    gears: [
      { teeth: 60, position: { x: 150, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 20, position: { x: 150 + (60 * 8 / 2) + (20 * 8 / 2), y: 300 }, type: 'spur', isDriver: false },
      { teeth: 60, position: { x: 150 + (60 * 8 / 2) + (20 * 8 / 2), y: 200 }, type: 'spur', isDriver: false },
      { teeth: 20, position: { x: 150 + (60 * 8 / 2) + (20 * 8 / 2) + (60 * 8 / 2) + (20 * 8 / 2), y: 200 }, type: 'spur', isDriver: false },
    ],
  },
  clockwork: {
    name: 'Clock Mechanism',
    description: 'Hour/minute hand ratios (12:1 and 60:1)',
    gears: [
      { teeth: 10, position: { x: 200, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 40, position: { x: 200 + (10 * 8 / 2) + (40 * 8 / 2), y: 300 }, type: 'spur', isDriver: false },
      { teeth: 10, position: { x: 200 + (10 * 8 / 2) + (40 * 8 / 2), y: 200 }, type: 'spur', isDriver: false },
      { teeth: 60, position: { x: 200 + (10 * 8 / 2) + (40 * 8 / 2) + (10 * 8 / 2) + (60 * 8 / 2), y: 200 }, type: 'spur', isDriver: false },
    ],
  },
  bicycle: {
    name: 'Bicycle Drivetrain',
    description: 'Chainring to cassette (2.5:1 ratio)',
    gears: [
      { teeth: 40, position: { x: 200, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 16, position: { x: 200 + (40 * 8 / 2) + (16 * 8 / 2), y: 300 }, type: 'spur', isDriver: false },
    ],
  },
  reversal: {
    name: 'Direction Reversal',
    description: '3 gears to reverse direction twice',
    gears: [
      { teeth: 30, position: { x: 150, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 30, position: { x: 150 + (30 * 8 / 2) + (30 * 8 / 2), y: 300 }, type: 'spur', isDriver: false },
      { teeth: 30, position: { x: 150 + 2 * ((30 * 8 / 2) + (30 * 8 / 2)), y: 300 }, type: 'spur', isDriver: false },
    ],
  },
};

export const linkagePresets: Record<string, LinkagePreset> = {
  fourbar: {
    name: 'Four-Bar Linkage',
    description: 'Basic four-bar mechanism',
    joints: [
      { position: { x: 150, y: 300 }, isFixed: true },
      { position: { x: 450, y: 300 }, isFixed: true },
      { position: { x: 250, y: 200 }, isFixed: false },
      { position: { x: 400, y: 220 }, isFixed: false },
    ],
    links: [
      { joint1Id: '0', joint2Id: '2', length: 120, isDriver: true },
      { joint1Id: '2', joint2Id: '3', length: 180, isDriver: false },
      { joint1Id: '3', joint2Id: '1', length: 140, isDriver: false },
      { joint1Id: '0', joint2Id: '1', length: 300, isDriver: false },
    ],
    driverJointIndex: 0,
  },
  slider: {
    name: 'Slider-Crank (Engine)',
    description: 'Converts rotary to linear motion',
    joints: [
      { position: { x: 200, y: 300 }, isFixed: true },
      { position: { x: 400, y: 300 }, isFixed: false },
      { position: { x: 280, y: 200 }, isFixed: false },
    ],
    links: [
      { joint1Id: '0', joint2Id: '2', length: 100, isDriver: true },
      { joint1Id: '2', joint2Id: '1', length: 200, isDriver: false },
    ],
    driverJointIndex: 0,
  },
  wiper: {
    name: 'Windshield Wiper',
    description: 'Parallel motion four-bar',
    joints: [
      { position: { x: 150, y: 350 }, isFixed: true },
      { position: { x: 450, y: 350 }, isFixed: true },
      { position: { x: 200, y: 200 }, isFixed: false },
      { position: { x: 500, y: 200 }, isFixed: false },
    ],
    links: [
      { joint1Id: '0', joint2Id: '2', length: 160, isDriver: true },
      { joint1Id: '2', joint2Id: '3', length: 300, isDriver: false },
      { joint1Id: '3', joint2Id: '1', length: 160, isDriver: false },
      { joint1Id: '0', joint2Id: '1', length: 300, isDriver: false },
    ],
    driverJointIndex: 0,
  },
  oscillator: {
    name: 'Oscillating Rocker',
    description: 'Crank converts to rocking motion',
    joints: [
      { position: { x: 200, y: 300 }, isFixed: true },
      { position: { x: 500, y: 300 }, isFixed: true },
      { position: { x: 280, y: 250 }, isFixed: false },
      { position: { x: 450, y: 250 }, isFixed: false },
    ],
    links: [
      { joint1Id: '0', joint2Id: '2', length: 90, isDriver: true },
      { joint1Id: '2', joint2Id: '3', length: 200, isDriver: false },
      { joint1Id: '3', joint2Id: '1', length: 80, isDriver: false },
      { joint1Id: '0', joint2Id: '1', length: 300, isDriver: false },
    ],
    driverJointIndex: 0,
  },
  draglink: {
    name: 'Drag-Link (Double Crank)',
    description: 'Both cranks rotate fully',
    joints: [
      { position: { x: 200, y: 300 }, isFixed: true },
      { position: { x: 400, y: 300 }, isFixed: true },
      { position: { x: 260, y: 240 }, isFixed: false },
      { position: { x: 360, y: 240 }, isFixed: false },
    ],
    links: [
      { joint1Id: '0', joint2Id: '2', length: 75, isDriver: true },
      { joint1Id: '2', joint2Id: '3', length: 120, isDriver: false },
      { joint1Id: '3', joint2Id: '1', length: 75, isDriver: false },
      { joint1Id: '0', joint2Id: '1', length: 200, isDriver: false },
    ],
    driverJointIndex: 0,
  },
};

export const pulleyPresets: Record<string, PulleyPreset> = {
  single_fixed: {
    name: 'Single Fixed Pulley',
    description: 'MA = 1 (direction change only)',
    pulleys: [
      { position: { x: 300, y: 100 }, radius: 30, isFixed: true },
    ],
    loadMass: 50,
  },
  single_movable: {
    name: 'Single Movable Pulley',
    description: 'MA = 2',
    pulleys: [
      { position: { x: 300, y: 100 }, radius: 30, isFixed: true },
      { position: { x: 300, y: 250 }, radius: 30, isFixed: false },
    ],
    loadMass: 100,
  },
  block_tackle_4: {
    name: 'Block and Tackle (4:1)',
    description: '2 fixed, 2 movable pulleys',
    pulleys: [
      { position: { x: 250, y: 100 }, radius: 30, isFixed: true },
      { position: { x: 350, y: 100 }, radius: 30, isFixed: true },
      { position: { x: 250, y: 250 }, radius: 30, isFixed: false },
      { position: { x: 350, y: 250 }, radius: 30, isFixed: false },
    ],
    loadMass: 200,
  },
  block_tackle_6: {
    name: 'Block and Tackle (6:1)',
    description: '3 fixed, 3 movable pulleys',
    pulleys: [
      { position: { x: 200, y: 100 }, radius: 25, isFixed: true },
      { position: { x: 300, y: 100 }, radius: 25, isFixed: true },
      { position: { x: 400, y: 100 }, radius: 25, isFixed: true },
      { position: { x: 200, y: 250 }, radius: 25, isFixed: false },
      { position: { x: 300, y: 250 }, radius: 25, isFixed: false },
      { position: { x: 400, y: 250 }, radius: 25, isFixed: false },
    ],
    loadMass: 300,
  },
  crane: {
    name: 'Crane System',
    description: 'Complex 8:1 ratio',
    pulleys: [
      { position: { x: 200, y: 80 }, radius: 25, isFixed: true },
      { position: { x: 280, y: 80 }, radius: 25, isFixed: true },
      { position: { x: 360, y: 80 }, radius: 25, isFixed: true },
      { position: { x: 440, y: 80 }, radius: 25, isFixed: true },
      { position: { x: 200, y: 220 }, radius: 25, isFixed: false },
      { position: { x: 280, y: 220 }, radius: 25, isFixed: false },
      { position: { x: 360, y: 220 }, radius: 25, isFixed: false },
      { position: { x: 440, y: 220 }, radius: 25, isFixed: false },
    ],
    loadMass: 500,
  },
  z_rig: {
    name: 'Z-Rig (3:1)',
    description: 'Rock climbing rescue system',
    pulleys: [
      { position: { x: 300, y: 100 }, radius: 30, isFixed: true },
      { position: { x: 300, y: 200 }, radius: 30, isFixed: false },
      { position: { x: 300, y: 300 }, radius: 30, isFixed: false },
    ],
    loadMass: 150,
  },
};
