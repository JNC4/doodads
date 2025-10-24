import { GearPreset, LinkagePreset, PulleyPreset } from '@/lib/types/types';

export const gearPresets: Record<string, GearPreset> = {
  simple: {
    name: 'Simple Reduction',
    description: '2 gears (60T → 20T = 3:1 speedup)',
    gears: [
      { teeth: 60, position: { x: 200, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 20, position: { x: 400, y: 300 }, type: 'spur', isDriver: false },
    ],
  },
  compound: {
    name: 'Compound Gear Train',
    description: '4 gears achieving high ratio (9:1)',
    gears: [
      { teeth: 60, position: { x: 150, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 20, position: { x: 350, y: 300 }, type: 'spur', isDriver: false },
      { teeth: 60, position: { x: 350, y: 300 }, type: 'spur', isDriver: false },
      { teeth: 20, position: { x: 550, y: 300 }, type: 'spur', isDriver: false },
    ],
  },
  clockwork: {
    name: 'Clock Mechanism',
    description: 'Hour/minute hand ratios (12:1 and 60:1)',
    gears: [
      { teeth: 10, position: { x: 200, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 40, position: { x: 320, y: 300 }, type: 'spur', isDriver: false },
      { teeth: 10, position: { x: 320, y: 300 }, type: 'spur', isDriver: false },
      { teeth: 60, position: { x: 480, y: 300 }, type: 'spur', isDriver: false },
    ],
  },
  bicycle: {
    name: 'Bicycle Drivetrain',
    description: 'Chainring to cassette (2.5:1 ratio)',
    gears: [
      { teeth: 40, position: { x: 200, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 16, position: { x: 500, y: 300 }, type: 'spur', isDriver: false },
    ],
  },
  reversal: {
    name: 'Direction Reversal',
    description: '3 gears to reverse direction twice',
    gears: [
      { teeth: 30, position: { x: 150, y: 300 }, type: 'spur', isDriver: true },
      { teeth: 30, position: { x: 330, y: 300 }, type: 'spur', isDriver: false },
      { teeth: 30, position: { x: 510, y: 300 }, type: 'spur', isDriver: false },
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
  jansen: {
    name: 'Jansen Linkage',
    description: "Theo Jansen's walking mechanism",
    joints: [
      { position: { x: 300, y: 250 }, isFixed: true },
      { position: { x: 285, y: 242 }, isFixed: true },
      { position: { x: 338, y: 250 }, isFixed: false },
      { position: { x: 379, y: 289 }, isFixed: false },
      { position: { x: 397, y: 331 }, isFixed: false },
      { position: { x: 365, y: 364 }, isFixed: false },
      { position: { x: 349, y: 299 }, isFixed: false },
      { position: { x: 341, y: 340 }, isFixed: false },
      { position: { x: 320, y: 400 }, isFixed: false }, // Foot
    ],
    links: [
      { joint1Id: '0', joint2Id: '2', length: 38, isDriver: true },
      { joint1Id: '2', joint2Id: '3', length: 41.5, isDriver: false },
      { joint1Id: '3', joint2Id: '4', length: 39.3, isDriver: false },
      { joint1Id: '4', joint2Id: '5', length: 40.1, isDriver: false },
      { joint1Id: '1', joint2Id: '6', length: 15, isDriver: false },
      { joint1Id: '6', joint2Id: '3', length: 55.8, isDriver: false },
      { joint1Id: '6', joint2Id: '7', length: 39.4, isDriver: false },
      { joint1Id: '5', joint2Id: '7', length: 36.7, isDriver: false },
      { joint1Id: '7', joint2Id: '8', length: 65.7, isDriver: false },
      { joint1Id: '5', joint2Id: '8', length: 49, isDriver: false },
      { joint1Id: '2', joint2Id: '6', length: 50, isDriver: false },
      { joint1Id: '1', joint2Id: '4', length: 61.9, isDriver: false },
    ],
    driverJointIndex: 0,
  },
  pantograph: {
    name: 'Pantograph',
    description: 'Scaling/copying mechanism',
    joints: [
      { position: { x: 200, y: 300 }, isFixed: true },
      { position: { x: 300, y: 250 }, isFixed: false },
      { position: { x: 400, y: 300 }, isFixed: false },
      { position: { x: 500, y: 250 }, isFixed: false },
    ],
    links: [
      { joint1Id: '0', joint2Id: '1', length: 120, isDriver: false },
      { joint1Id: '1', joint2Id: '2', length: 120, isDriver: false },
      { joint1Id: '2', joint2Id: '3', length: 120, isDriver: false },
      { joint1Id: '0', joint2Id: '2', length: 240, isDriver: false },
    ],
    driverJointIndex: 1,
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
