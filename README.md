# Tesseract 4D

An interactive 4D hypercube (tesseract) visualization built with React and Three.js.

## What is a Tesseract?

A tesseract is the 4-dimensional version of a cube. Just like a cube is made of 6 square faces, a tesseract is made of 8 cubic "cells". Since we can't see in 4D, this app shows a 3D projection of the tesseract as it rotates through 4-dimensional space.

## Features

- Real-time 4D rotation with 3D projection
- Adjustable rotation speed
- Multiple color themes
- Interactive orbit controls (drag to rotate, scroll to zoom)

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- React
- Three.js / React Three Fiber
- Vite

## How It Works

1. Define 16 vertices of a 4D cube (each coordinate is -1 or 1)
2. Connect vertices that differ in exactly one coordinate (32 edges)
3. Apply 4D rotation matrices (XW, YW, ZW planes)
4. Project from 4D to 3D using perspective projection
5. Render the 3D result with Three.js
