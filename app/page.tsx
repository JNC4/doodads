import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
          ⚙️ Mechanical Systems Playground
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600">
          Interactive visualizations and simulations of mechanical engineering principles
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/gears" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="text-5xl mb-4 text-center">⚙️</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800 text-center">
                Gear Trains
              </h2>
              <p className="text-gray-600 mb-4">
                Design gear systems and visualize mechanical advantage, speed ratios, and torque multiplication.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Spur gears & planetary sets</li>
                <li>• Real-time ratio calculations</li>
                <li>• Compound gear trains</li>
                <li>• Interactive meshing</li>
              </ul>
            </div>
          </Link>

          <Link href="/linkages" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-5xl mb-4 text-center">🔗</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800 text-center">
                Linkages
              </h2>
              <p className="text-gray-600 mb-4">
                Build four-bar mechanisms, walking machines, and explore motion conversion systems.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Jansen walking mechanism</li>
                <li>• Straight-line linkages</li>
                <li>• Engine piston systems</li>
                <li>• Path tracing & analysis</li>
              </ul>
            </div>
          </Link>

          <Link href="/pulleys" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="text-5xl mb-4 text-center">🔄</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800 text-center">
                Pulleys
              </h2>
              <p className="text-gray-600 mb-4">
                Design pulley configurations and calculate mechanical advantage for lifting systems.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Block and tackle systems</li>
                <li>• Force calculations</li>
                <li>• Rope tension visualization</li>
                <li>• Efficiency analysis</li>
              </ul>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">
            About This Playground
          </h3>
          <p className="text-gray-600">
            This interactive tool helps you understand fundamental mechanical engineering concepts
            through hands-on experimentation. Build systems, adjust parameters, and see real-time
            calculations of forces, speeds, and mechanical advantages. Perfect for students,
            educators, and anyone curious about how machines work.
          </p>
        </div>
      </div>
    </div>
  );
}
