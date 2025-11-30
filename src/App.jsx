import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Tesseract from './Tesseract'
import './App.css'

function App() {
  const [speed, setSpeed] = useState(1)
  const [color, setColor] = useState('#00ffff')

  const colors = [
    { name: 'Cyan', value: '#00ffff' },
    { name: 'Magenta', value: '#ff00ff' },
    { name: 'Lime', value: '#00ff88' },
    { name: 'Gold', value: '#ffcc00' },
    { name: 'Coral', value: '#ff6b6b' },
  ]

  return (
    <div className="app">
      {/* Background grid effect */}
      <div className="grid-bg" />
      
      {/* Header */}
      <header className="header">
        <h1>
          <span className="dim">&#123;</span>
          Tesseract
          <span className="dim">&#125;</span>
        </h1>
        <p className="subtitle">4D Hypercube Visualization</p>
      </header>

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <color attach="background" args={['#0a0a0f']} />
          <ambientLight intensity={0.5} />
          <Tesseract rotationSpeed={speed} color={color} />
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="controls">
        <div className="control-group">
          <label>Rotation Speed</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span className="value">{speed.toFixed(1)}x</span>
        </div>

        <div className="control-group">
          <label>Color</label>
          <div className="color-buttons">
            {colors.map((c) => (
              <button
                key={c.value}
                className={`color-btn ${color === c.value ? 'active' : ''}`}
                style={{ '--btn-color': c.value }}
                onClick={() => setColor(c.value)}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="info">
        <h3>What am I looking at?</h3>
        <p>
          A <strong>tesseract</strong> is a 4-dimensional cube. Just like a 3D cube 
          is made of 6 square faces, a tesseract is made of 8 cubic "cells".
        </p>
        <p>
          Since we can't see in 4D, this is a <strong>3D projection</strong> — like 
          a shadow of the 4D object cast into our 3D world.
        </p>
        <p className="hint">Drag to rotate • Scroll to zoom</p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span>Built with React + Three.js</span>
      </footer>
    </div>
  )
}

export default App
