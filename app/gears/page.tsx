'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GearCanvas from '@/components/gears/GearCanvas';
import GearControls from '@/components/gears/GearControls';
import { Gear } from '@/lib/types/types';
import { generateId } from '@/lib/utils/calculations';
import { propagateGearMotion } from '@/lib/physics/gearPhysics';

export default function GearsPage() {
  const [gears, setGears] = useState<Gear[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputRpm, setInputRpm] = useState(60);
  const [inputTorque, setInputTorque] = useState(10);
  const [showInfo, setShowInfo] = useState(true);
  const [selectedTeeth, setSelectedTeeth] = useState(30);
  const [smartSnap, setSmartSnap] = useState(true);

  // Update gear motion when driver changes or input changes
  useEffect(() => {
    const driverGear = gears.find((g) => g.isDriver);
    if (driverGear) {
      const updatedGears = propagateGearMotion(gears, driverGear, inputRpm, inputTorque);
      setGears(updatedGears);
    }
  }, [inputRpm, inputTorque, gears.length, gears.find((g) => g.isDriver)?.id]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'CANVAS') {
      const canvas = target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Check if clicking on an existing gear - if so, don't spawn
      const clickedOnGear = gears.some((gear) => {
        const radius = (gear.teeth * 8) / 2; // GEAR_MODULE = 8
        const dist = Math.sqrt(Math.pow(x - gear.position.x, 2) + Math.pow(y - gear.position.y, 2));
        return dist <= radius;
      });

      if (clickedOnGear) {
        return; // Don't spawn if clicking on existing gear
      }

      const newGearRadius = (selectedTeeth * 8) / 2;

      // Smart snap: find nearest gear and snap to perfect mesh position
      if (smartSnap && gears.length > 0) {
        let closestGear: Gear | null = null;
        let closestDist = Infinity;

        for (const gear of gears) {
          const gearRadius = (gear.teeth * 8) / 2;
          const dist = Math.sqrt(
            Math.pow(x - gear.position.x, 2) + Math.pow(y - gear.position.y, 2)
          );

          // Check if within snap range (within 100px of ideal meshing distance)
          const idealDist = gearRadius + newGearRadius;
          if (Math.abs(dist - idealDist) < 100 && dist < closestDist) {
            closestGear = gear;
            closestDist = dist;
          }
        }

        // Snap to closest gear
        if (closestGear) {
          const gearRadius = (closestGear.teeth * 8) / 2;
          const idealDist = gearRadius + newGearRadius;
          const angle = Math.atan2(y - closestGear.position.y, x - closestGear.position.x);

          x = closestGear.position.x + idealDist * Math.cos(angle);
          y = closestGear.position.y + idealDist * Math.sin(angle);
        }
      }

      const newGear: Gear = {
        id: generateId(),
        teeth: selectedTeeth,
        position: { x, y },
        angle: 0,
        angularVelocity: 0,
        rpm: 0,
        torque: 0,
        isDriver: gears.length === 0, // First gear is driver
        direction: 1,
        connectedTo: [],
        type: 'spur',
      };

      // Auto-connect to nearby gears
      const updatedGears = [...gears];

      updatedGears.forEach((gear) => {
        const gearRadius = (gear.teeth * 8) / 2;
        const dist = Math.sqrt(
          Math.pow(x - gear.position.x, 2) + Math.pow(y - gear.position.y, 2)
        );
        const idealDist = gearRadius + newGearRadius;

        // If within 5% of ideal meshing distance, connect them
        if (Math.abs(dist - idealDist) < idealDist * 0.05) {
          newGear.connectedTo.push(gear.id);
          gear.connectedTo.push(newGear.id);
        }
      });

      setGears([...updatedGears, newGear]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold hover:text-blue-300">
              ⚙️ Mechanical Systems Playground
            </Link>
            <div className="flex gap-4">
              <Link
                href="/gears"
                className="px-3 py-2 bg-blue-600 rounded font-medium"
              >
                Gears
              </Link>
              <Link
                href="/linkages"
                className="px-3 py-2 hover:bg-gray-700 rounded"
              >
                Linkages
              </Link>
              <Link
                href="/pulleys"
                className="px-3 py-2 hover:bg-gray-700 rounded"
              >
                Pulleys
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 p-4" onClick={handleCanvasClick}>
          <div className="h-full">
            <GearCanvas
              gears={gears}
              onGearsUpdate={setGears}
              isPlaying={isPlaying}
              inputRpm={inputRpm}
              inputTorque={inputTorque}
              showInfo={showInfo}
            />
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 border-l border-gray-200">
          <GearControls
            gears={gears}
            onGearsUpdate={setGears}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            inputRpm={inputRpm}
            onInputRpmChange={setInputRpm}
            inputTorque={inputTorque}
            onInputTorqueChange={setInputTorque}
            showInfo={showInfo}
            onShowInfoToggle={() => setShowInfo(!showInfo)}
            selectedTeeth={selectedTeeth}
            onSelectedTeethChange={setSelectedTeeth}
            smartSnap={smartSnap}
            onSmartSnapToggle={() => setSmartSnap(!smartSnap)}
          />
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-gray-100 border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          <strong>How to use:</strong> Click canvas to add gears • Drag to reposition • Right-click to delete •
          Gears auto-connect when touching • Set driver gear to start motion •
          <span className="text-blue-600 ml-2">Green = Driver</span> •
          <span className="text-blue-600 ml-1">Blue = CW</span> •
          <span className="text-red-600 ml-1">Red = CCW</span>
        </div>
      </div>
    </div>
  );
}
