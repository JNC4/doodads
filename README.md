# ⚙️ Mechanical Systems Playground

An interactive web application for visualizing and simulating mechanical engineering systems. Explore gears, linkages, and pulley systems through hands-on experimentation.

## 🎯 Features

### Gear Train Designer
- **Interactive Gear Placement**: Click to add gears, drag to position, right-click to delete
- **Auto-Meshing**: Gears automatically connect when touching
- **Real-Time Calculations**:
  - Gear ratios
  - Speed ratios (RPM)
  - Torque multiplication
  - System efficiency
- **Multiple Presets**: Simple reduction, compound trains, clock mechanisms, bicycle drivetrains
- **Visual Feedback**: Color-coded rotation direction (green=driver, blue=CW, red=CCW)

### Linkage Mechanism Playground
- **Four-Bar Linkages**: Classic mechanical linkages with adjustable joints
- **Walking Mechanisms**: Jansen linkage (Strandbeest), Klann linkage
- **Special Linkages**: Slider-crank (engine piston), windshield wiper, pantograph
- **Motion Analysis**: Path tracing, velocity visualization
- **Adjustable Speed**: Control animation speed from 0.1x to 3x
- **Interactive Design**: Drag joints to modify linkage geometry

### Pulley System Optimizer
- **Mechanical Advantage Calculations**: Ideal and actual MA with friction
- **Force Analysis**: Real-time effort force vs. load weight comparison
- **Rope Visualization**: Tension-based coloring (blue=low, red=high)
- **Multiple Configurations**:
  - Single fixed/movable pulleys
  - Block and tackle systems (4:1, 6:1)
  - Crane systems (8:1)
  - Z-rig rescue systems (3:1)
- **Educational Feedback**: Visual indicators for sufficient/insufficient lifting force

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JNC4/doodads.git
cd doodads

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: HTML5 Canvas API
- **State Management**: Zustand (lightweight)
- **Physics**: Custom implementations for mechanical systems

## 📐 How It Works

### Gear Physics
- Gear meshing detection using distance calculations
- Ratio propagation through connected gear networks
- Angular velocity calculations: ω = (RPM × 2π) / 60
- Torque multiplication: T_out = T_in × (teeth_out / teeth_in) × efficiency

### Linkage Kinematics
- Circle-circle intersection solving for joint positions
- Four-bar linkage position solving using geometric constraints
- Velocity and acceleration vector calculations
- Coupler curve tracing for mechanism analysis

### Pulley Mechanics
- Mechanical advantage: MA = number of supporting rope segments
- Efficiency: η = 0.9^n where n = number of pulleys
- Required effort: F_effort = F_load / MA
- Catenary curve approximation for rope sagging

## 🎓 Educational Use

Perfect for:
- **Students**: Learning mechanical engineering principles
- **Educators**: Demonstrating complex concepts visually
- **Hobbyists**: Designing mechanisms for projects
- **Engineers**: Quick prototyping and ratio calculations

## 📱 Usage Guide

### Gears Mode
1. Select tooth count from dropdown
2. Click canvas to place gears
3. Drag gears to position them
4. Gears auto-connect when touching
5. Click "Set Driver" on any gear to start motion
6. Adjust input RPM and torque with sliders
7. Load presets for common configurations

### Linkages Mode
1. Load a preset mechanism
2. Click Play to animate
3. Drag joints to modify geometry
4. Enable "Show Motion Paths" to trace coupler curves
5. Adjust speed slider for slower/faster animation

### Pulleys Mode
1. Load a preset pulley system
2. Adjust load mass with slider
3. Adjust effort force to find equilibrium
4. Green indicator = sufficient force to lift
5. Red indicator = insufficient force
6. View calculations panel for detailed analysis

## 🌟 Features Highlights

- **60 FPS Animation**: Smooth, performant rendering
- **Responsive Design**: Works on desktop browsers
- **Real-Time Physics**: Instant calculation updates
- **Educational Content**: Descriptions and explanations for each system
- **Multiple Presets**: 5+ presets per mode
- **Interactive Controls**: Intuitive drag-and-drop interface

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🔗 Links

- **Live Demo**: [Deployed on Vercel](https://doodads.vercel.app) _(coming soon)_
- **GitHub**: [https://github.com/JNC4/doodads](https://github.com/JNC4/doodads)

## 🙏 Acknowledgments

- Inspired by Theo Jansen's Strandbeest mechanisms
- Gear rendering techniques from mechanical engineering textbooks
- Pulley system designs from classic physics demonstrations

---

Built with ❤️ using Next.js and TypeScript

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
