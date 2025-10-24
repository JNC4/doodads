'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PulleyCanvas from '@/components/pulleys/PulleyCanvas';
import { Pulley, Load } from '@/lib/types/types';
import { pulleyPresets } from '@/lib/utils/presets';
import { generateId } from '@/lib/utils/calculations';
import {
  calculatePulleySystemMetrics,
  calculateWeight,
} from '@/lib/physics/pulleyMechanics';

export default function PulleysPage() {
  const [pulleys, setPulleys] = useState<Pulley[]>([]);
  const [load, setLoad] = useState<Load>({
    id: generateId(),
    position: { x: 300, y: 350 },
    mass: 100,
    weight: calculateWeight(100),
    supportingRopes: [],
  });
  const [effortForce, setEffortForce] = useState(50);
  const [showForces, setShowForces] = useState(true);

  const calculations = pulleys.length > 0 ? calculatePulleySystemMetrics(pulleys, load) : null;

  const handlePresetLoad = (presetKey: string) => {
    const preset = pulleyPresets[presetKey];
    if (!preset) return;

    const newPulleys: Pulley[] = preset.pulleys.map((pulleyData) => ({
      id: generateId(),
      ...pulleyData,
      angle: 0,
      connectedRopes: [],
    }));

    const newLoad: Load = {
      id: generateId(),
      position: { x: 300, y: 350 },
      mass: preset.loadMass,
      weight: calculateWeight(preset.loadMass),
      supportingRopes: [],
    };

    setPulleys(newPulleys);
    setLoad(newLoad);

    // Set default effort force based on MA
    if (newPulleys.length > 0) {
      const metrics = calculatePulleySystemMetrics(newPulleys, newLoad);
      setEffortForce(metrics.requiredEffort);
    }
  };

  const handleReset = () => {
    setPulleys([]);
    setLoad({
      id: generateId(),
      position: { x: 300, y: 350 },
      mass: 100,
      weight: calculateWeight(100),
      supportingRopes: [],
    });
  };

  const handleLoadMassChange = (mass: number) => {
    setLoad({
      ...load,
      mass,
      weight: calculateWeight(mass),
    });
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
                className="px-3 py-2 hover:bg-gray-700 rounded"
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
                className="px-3 py-2 bg-purple-600 rounded font-medium"
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
        <div className="flex-1 p-4">
          <div className="h-full">
            <PulleyCanvas
              pulleys={pulleys}
              load={load}
              effortForce={effortForce}
              showForces={showForces}
            />
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Pulley Controls</h2>

          {/* Controls */}
          <div className="mb-6">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 rounded font-medium bg-red-500 hover:bg-red-600 text-white"
            >
              🔄 Reset
            </button>
          </div>

          {/* Load Settings */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Load Settings</h3>
            <div className="mb-3">
              <label className="block text-sm mb-2 text-gray-600">
                Load Mass: <span className="monospace font-bold">{load.mass} kg</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={load.mass}
                onChange={(e) => handleLoadMassChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="text-sm text-gray-600">
              Weight: <span className="monospace font-bold">{load.weight.toFixed(1)} N</span>
            </div>
          </div>

          {/* Effort Force */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Effort Force</h3>
            <div className="mb-3">
              <label className="block text-sm mb-2 text-gray-600">
                Applied Force: <span className="monospace font-bold">{effortForce.toFixed(1)} N</span>
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={effortForce}
                onChange={(e) => setEffortForce(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {calculations && (
              <div className="text-sm">
                {effortForce >= calculations.requiredEffort ? (
                  <div className="text-green-600 font-semibold">✓ Load will rise</div>
                ) : (
                  <div className="text-red-600 font-semibold">✗ Load will fall</div>
                )}
              </div>
            )}
          </div>

          {/* Calculations */}
          {calculations && (
            <div className="mb-6 bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3 text-gray-700">Calculations</h3>
              <div className="space-y-2 text-sm monospace">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ideal MA:</span>
                  <span className="font-bold">{calculations.idealMA.toFixed(1)}:1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actual MA:</span>
                  <span className="font-bold">{calculations.actualMA.toFixed(2)}:1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Effort:</span>
                  <span className="font-bold">{calculations.requiredEffort.toFixed(1)} N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance Ratio:</span>
                  <span className="font-bold">{calculations.distanceRatio.toFixed(1)}:1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-bold">{(calculations.efficiency * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Presets</h3>
            <div className="space-y-2">
              {Object.entries(pulleyPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetLoad(key)}
                  className="w-full text-left px-3 py-2 bg-white rounded shadow hover:shadow-md transition-shadow text-sm"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Display</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showForces}
                onChange={() => setShowForces(!showForces)}
                className="w-4 h-4"
              />
              <span className="text-sm">Show Force Vectors</span>
            </label>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-gray-100 border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          <strong>How to use:</strong> Load a preset to see pulley systems • Adjust load mass and effort force •
          Watch calculations update in real-time • Green = sufficient force to lift • Red = insufficient force •
          Mechanical advantage reduces required effort
        </div>
      </div>
    </div>
  );
}
