'use client';

import { Gear } from '@/lib/types/types';
import { calculateGearSystemMetrics } from '@/lib/physics/gearPhysics';
import { gearPresets } from '@/lib/utils/presets';
import { generateId } from '@/lib/utils/calculations';

interface GearControlsProps {
  gears: Gear[];
  onGearsUpdate: (gears: Gear[]) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  inputRpm: number;
  onInputRpmChange: (rpm: number) => void;
  inputTorque: number;
  onInputTorqueChange: (torque: number) => void;
  showInfo: boolean;
  onShowInfoToggle: () => void;
  selectedTeeth: number;
  onSelectedTeethChange: (teeth: number) => void;
  smartSnap: boolean;
  onSmartSnapToggle: () => void;
}

export default function GearControls({
  gears,
  onGearsUpdate,
  isPlaying,
  onPlayPause,
  inputRpm,
  onInputRpmChange,
  inputTorque,
  onInputTorqueChange,
  showInfo,
  onShowInfoToggle,
  selectedTeeth,
  onSelectedTeethChange,
  smartSnap,
  onSmartSnapToggle,
}: GearControlsProps) {
  const driverGear = gears.find((g) => g.isDriver);
  const outputGear = gears.length > 0 ? gears[gears.length - 1] : null;

  const calculations =
    driverGear && outputGear
      ? calculateGearSystemMetrics(inputRpm, inputTorque, gears, driverGear.id, outputGear.id)
      : null;

  const handlePresetLoad = (presetKey: string) => {
    const preset = gearPresets[presetKey];
    if (!preset) return;

    const newGears: Gear[] = preset.gears.map((gearData, index) => ({
      id: generateId(),
      ...gearData,
      angle: 0,
      angularVelocity: 0,
      rpm: 0,
      torque: 0,
      direction: 1,
      connectedTo: [],
    }));

    // Auto-connect adjacent gears
    for (let i = 0; i < newGears.length - 1; i++) {
      newGears[i].connectedTo.push(newGears[i + 1].id);
      newGears[i + 1].connectedTo.push(newGears[i].id);
    }

    onGearsUpdate(newGears);
  };

  const handleSetDriver = (gearId: string) => {
    const updatedGears = gears.map((g) => ({
      ...g,
      isDriver: g.id === gearId,
    }));
    onGearsUpdate(updatedGears);
  };

  const handleReset = () => {
    onGearsUpdate([]);
  };

  const toothOptions = [10, 20, 30, 40, 60, 80, 100];

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gear Controls</h2>

      {/* Playback Controls */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">Playback</h3>
        <div className="flex gap-2">
          <button
            onClick={onPlayPause}
            className={`px-4 py-2 rounded font-medium ${
              isPlaying
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded font-medium bg-red-500 hover:bg-red-600 text-white"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Add Gear */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">Add Gear</h3>
        <div className="mb-3">
          <label className="block text-sm mb-2 text-gray-600">Teeth Count</label>
          <select
            value={selectedTeeth}
            onChange={(e) => onSelectedTeethChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            {toothOptions.map((teeth) => (
              <option key={teeth} value={teeth}>
                {teeth} teeth
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 italic">Click canvas to place gear</p>
      </div>

      {/* Input Parameters */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">Input Parameters</h3>

        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-600">
            Input Speed: <span className="monospace font-bold">{inputRpm} RPM</span>
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={inputRpm}
            onChange={(e) => onInputRpmChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-600">
            Input Torque: <span className="monospace font-bold">{inputTorque} Nm</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={inputTorque}
            onChange={(e) => onInputTorqueChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Calculations */}
      {calculations && driverGear && outputGear && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3 text-gray-700">Calculations</h3>
          <div className="space-y-2 text-sm monospace">
            <div className="flex justify-between">
              <span className="text-gray-600">Gear Ratio:</span>
              <span className="font-bold">{calculations.gearRatio.toFixed(2)}:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Speed Ratio:</span>
              <span className="font-bold">{calculations.speedRatio.toFixed(2)}:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Output Speed:</span>
              <span className="font-bold">{calculations.outputRpm.toFixed(1)} RPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Output Torque:</span>
              <span className="font-bold">{calculations.outputTorque.toFixed(1)} Nm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-bold">{(calculations.efficiency * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Gear List */}
      {gears.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-700">Gears ({gears.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {gears.map((gear, index) => (
              <div
                key={gear.id}
                className={`p-2 rounded text-sm flex justify-between items-center ${
                  gear.isDriver ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <span>
                  Gear {index + 1}: {gear.teeth}T
                </span>
                {!gear.isDriver && (
                  <button
                    onClick={() => handleSetDriver(gear.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                  >
                    Set Driver
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">Presets</h3>
        <div className="space-y-2">
          {Object.entries(gearPresets).map(([key, preset]) => (
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
        <h3 className="font-semibold mb-3 text-gray-700">Options</h3>
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={showInfo}
            onChange={onShowInfoToggle}
            className="w-4 h-4"
          />
          <span className="text-sm">Show RPM & Torque</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={smartSnap}
            onChange={onSmartSnapToggle}
            className="w-4 h-4"
          />
          <span className="text-sm">Smart Snap (auto-mesh)</span>
        </label>
      </div>
    </div>
  );
}
