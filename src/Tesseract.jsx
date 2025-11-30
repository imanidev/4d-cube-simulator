import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// The 16 vertices of a 4D hypercube (tesseract)
// Each vertex has coordinates (x, y, z, w) where each is either -1 or 1
const vertices4D = []
for (let i = 0; i < 16; i++) {
  vertices4D.push([
    (i & 1) ? 1 : -1,
    (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1,
    (i & 8) ? 1 : -1,
  ])
}

// Edges connect vertices that differ in exactly one coordinate
const edges = []
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    // Count how many coordinates differ
    let diff = 0
    for (let k = 0; k < 4; k++) {
      if (vertices4D[i][k] !== vertices4D[j][k]) diff++
    }
    // If exactly one coordinate differs, they're connected
    if (diff === 1) {
      edges.push([i, j])
    }
  }
}

// Project a 4D point to 3D using perspective projection
function project4Dto3D(point4D, distance = 2) {
  const w = point4D[3]
  const scale = distance / (distance - w)
  return [
    point4D[0] * scale,
    point4D[1] * scale,
    point4D[2] * scale,
  ]
}

// Rotate in 4D (rotation in the XW plane)
function rotateXW(point, angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [
    point[0] * cos - point[3] * sin,
    point[1],
    point[2],
    point[0] * sin + point[3] * cos,
  ]
}

// Rotate in 4D (rotation in the YW plane)
function rotateYW(point, angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [
    point[0],
    point[1] * cos - point[3] * sin,
    point[2],
    point[1] * sin + point[3] * cos,
  ]
}

// Rotate in 4D (rotation in the ZW plane)
function rotateZW(point, angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [
    point[0],
    point[1],
    point[2] * cos - point[3] * sin,
    point[2] * sin + point[3] * cos,
  ]
}

export default function Tesseract({ rotationSpeed = 1, color = '#00ffff' }) {
  const lineRef = useRef()
  const pointsRef = useRef()
  const angles = useRef({ xw: 0, yw: 0, zw: 0 })

  // Create geometry for lines
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    // 32 edges, 2 points each, 3 coordinates per point
    const positions = new Float32Array(edges.length * 2 * 3)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  // Create geometry for vertex points
  const pointGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(16 * 3)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  useFrame((state, delta) => {
    // Update rotation angles
    angles.current.xw += delta * 0.5 * rotationSpeed
    angles.current.yw += delta * 0.3 * rotationSpeed
    angles.current.zw += delta * 0.2 * rotationSpeed

    // Transform all vertices
    const projected = vertices4D.map(v => {
      let rotated = rotateXW(v, angles.current.xw)
      rotated = rotateYW(rotated, angles.current.yw)
      rotated = rotateZW(rotated, angles.current.zw)
      return project4Dto3D(rotated, 3)
    })

    // Update line positions
    const linePositions = lineRef.current.geometry.attributes.position.array
    edges.forEach((edge, i) => {
      const [a, b] = edge
      const baseIndex = i * 6
      linePositions[baseIndex] = projected[a][0]
      linePositions[baseIndex + 1] = projected[a][1]
      linePositions[baseIndex + 2] = projected[a][2]
      linePositions[baseIndex + 3] = projected[b][0]
      linePositions[baseIndex + 4] = projected[b][1]
      linePositions[baseIndex + 5] = projected[b][2]
    })
    lineRef.current.geometry.attributes.position.needsUpdate = true

    // Update point positions
    const pointPositions = pointsRef.current.geometry.attributes.position.array
    projected.forEach((p, i) => {
      pointPositions[i * 3] = p[0]
      pointPositions[i * 3 + 1] = p[1]
      pointPositions[i * 3 + 2] = p[2]
    })
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group>
      {/* Edges */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.8} />
      </lineSegments>
      
      {/* Vertices */}
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial color={color} size={0.08} sizeAttenuation />
      </points>
    </group>
  )
}
