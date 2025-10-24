'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LinkageCanvas from '@/components/linkages/LinkageCanvas';
import { Joint, Link as LinkType } from '@/lib/types/types';
import { linkagePresets } from '@/lib/utils/presets';
import { generateId } from '@/lib/utils/calculations';

export default function LinkagesPage() {
  const [joints, setJoints] = useState<Joint[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showPaths, setShowPaths] = useState(false);
  const [tracePoints, setTracePoints] = useState<Array<{ jointId: string; path: { x: number; y: number }[] }>>([]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTime((t) => t + 0.02 * speed);

        // Animate driver link
        const driverLink = links.find((l) => l.isDriver);
        if (driverLink) {
          const driverJoint = joints.find((j) => j.id === driverLink.joint1Id);
          const endJoint = joints.find((j) => j.id === driverLink.joint2Id);

          if (driverJoint && endJoint) {
            const newX = driverJoint.position.x + driverLink.length * Math.cos(time);
            const newY = driverJoint.position.y + driverLink.length * Math.sin(time);

            const updatedJoints = joints.map((j) =>
              j.id === endJoint.id ? { ...j, position: { x: newX, y: newY } } : j
            );
            setJoints(updatedJoints);

            // Track path
            if (showPaths) {
              setTracePoints((prev) => {
                const existing = prev.find((p) => p.jointId === endJoint.id);
                if (existing) {
                  const newPath = [...existing.path, { x: newX, y: newY }];
                  if (newPath.length > 200) newPath.shift();
                  return prev.map((p) =>
                    p.jointId === endJoint.id ? { ...p, path: newPath } : p
                  );
                } else {
                  return [...prev, { jointId: endJoint.id, path: [{ x: newX, y: newY }] }];
                }
              });
            }
          }
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isPlaying, time, speed, joints, links, showPaths]);

  const handlePresetLoad = (presetKey: string) => {
    const preset = linkagePresets[presetKey];
    if (!preset) return;

    const newJoints: Joint[] = preset.joints.map((jointData, index) => ({
      id: String(index),
      ...jointData,
    }));

    const newLinks: LinkType[] = preset.links.map((linkData) => ({
      id: generateId(),
      ...linkData,
    }));

    setJoints(newJoints);
    setLinks(newLinks);
    setTime(0);
    setTracePoints([]);
  };

  const handleReset = () => {
    setJoints([]);
    setLinks([]);
    setTime(0);
    setTracePoints([]);
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
                className="px-3 py-2 bg-green-600 rounded font-medium"
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
        <div className="flex-1 p-4">
          <div className="h-full">
            <LinkageCanvas
              joints={joints}
              links={links}
              onJointsUpdate={setJoints}
              isPlaying={isPlaying}
              time={time}
              showPaths={showPaths}
              tracePoints={tracePoints}
            />
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Linkage Controls</h2>

          {/* Playback Controls */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Playback</h3>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
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

            <div className="mb-3">
              <label className="block text-sm mb-2 text-gray-600">
                Speed: <span className="monospace font-bold">{speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Presets</h3>
            <div className="space-y-2">
              {Object.entries(linkagePresets).map(([key, preset]) => (
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
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Display</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPaths}
                onChange={() => setShowPaths(!showPaths)}
                className="w-4 h-4"
              />
              <span className="text-sm">Show Motion Paths</span>
            </label>
          </div>

          {/* Info */}
          {joints.length > 0 && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2 text-gray-700">System Info</h3>
              <div className="text-sm space-y-1">
                <div>Joints: {joints.length}</div>
                <div>Links: {links.length}</div>
                <div>Fixed Joints: {joints.filter((j) => j.isFixed).length}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-gray-100 border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          <strong>How to use:</strong> Load a preset to see linkage mechanisms • Drag joints to adjust •
          Play to animate motion • Enable path tracing to visualize coupler curves •
          <span className="text-green-600 ml-2">Green = Driver Link</span>
        </div>
      </div>
    </div>
  );
}
