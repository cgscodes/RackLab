import { ContactShadows, Environment, Float, OrbitControls, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo, useState } from 'react'
import { EQUIPMENT, TOTAL_UNITS } from '../data'
import { useRackStore } from '../store'
import type { InstalledEquipment } from '../types'

const UNIT_HEIGHT = 0.245
const RACK_BOTTOM = -(TOTAL_UNITS * UNIT_HEIGHT) / 2

function Equipment({ item }: { item: InstalledEquipment }) {
  const [hovered, setHovered] = useState(false)
  const remove = useRackStore((state) => state.remove)
  const definition = EQUIPMENT[item.type]
  const height = definition.units * UNIT_HEIGHT - 0.025
  const y = RACK_BOTTOM + (item.startUnit - 1) * UNIT_HEIGHT + height / 2 + 0.012

  const ports = item.type === 'switch' || item.type === 'patch' ? 12 : item.type === 'storage' ? 8 : 4

  return (
    <group position={[0, y, 0.05]}>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          remove(item.id)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        castShadow
      >
        <boxGeometry args={[2.48, height, 0.76]} />
        <meshStandardMaterial
          color={hovered ? definition.accent : definition.color}
          roughness={0.32}
          metalness={0.72}
          emissive={definition.accent}
          emissiveIntensity={hovered ? 0.16 : 0.015}
        />
      </mesh>

      {Array.from({ length: ports }).map((_, index) => {
        const columns = Math.min(ports, 12)
        const x = -0.85 + (index % columns) * (1.7 / Math.max(columns - 1, 1))
        const row = Math.floor(index / columns)
        const portY = row === 0 ? 0.025 : -0.055
        return (
          <mesh key={index} position={[x, portY, 0.438]}>
            <boxGeometry args={[0.075, 0.055, 0.015]} />
            <meshStandardMaterial color={item.type === 'patch' ? '#0b0d10' : definition.accent} emissive={definition.accent} emissiveIntensity={item.type === 'patch' ? 0 : 1.8} />
          </mesh>
        )
      })}

      <Text
        position={[0.68, 0, 0.45]}
        fontSize={0.08}
        color="#eaf1f6"
        anchorX="center"
        anchorY="middle"
      >
        {definition.shortName}
      </Text>
    </group>
  )
}

function EmptySlot({ unit, available }: { unit: number; available: boolean }) {
  const [hovered, setHovered] = useState(false)
  const install = useRackStore((state) => state.install)
  const selectedType = useRackStore((state) => state.selectedType)
  const y = RACK_BOTTOM + (unit - 1) * UNIT_HEIGHT + UNIT_HEIGHT / 2
  const accent = EQUIPMENT[selectedType].accent

  return (
    <group position={[0, y, 0.035]}>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          if (available) install(unit)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          if (available) {
            setHovered(true)
            document.body.style.cursor = 'copy'
          }
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[2.45, UNIT_HEIGHT - 0.028, 0.72]} />
        <meshStandardMaterial
          color={hovered ? accent : '#11171d'}
          transparent
          opacity={hovered ? 0.64 : 0.3}
          roughness={0.65}
          metalness={0.35}
        />
      </mesh>
      <Text position={[-1.38, 0, 0.41]} fontSize={0.075} color={hovered ? accent : '#53606c'} anchorX="right">
        {unit}U
      </Text>
    </group>
  )
}

function Rack() {
  const installed = useRackStore((state) => state.installed)
  const selectedType = useRackStore((state) => state.selectedType)
  const occupied = useMemo(() => {
    const units = new Set<number>()
    installed.forEach((item) => {
      for (let offset = 0; offset < EQUIPMENT[item.type].units; offset += 1) {
        units.add(item.startUnit + offset)
      }
    })
    return units
  }, [installed])

  const selectedSize = EQUIPMENT[selectedType].units
  const rackHeight = TOTAL_UNITS * UNIT_HEIGHT

  return (
    <Float speed={0.7} rotationIntensity={0.025} floatIntensity={0.08}>
      <group rotation={[0, -0.12, 0]}>
        <mesh position={[0, 0, -0.42]} receiveShadow>
          <boxGeometry args={[2.78, rackHeight + 0.32, 0.1]} />
          <meshStandardMaterial color="#080b0f" metalness={0.8} roughness={0.3} />
        </mesh>

        {[-1.38, 1.38].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.13, rackHeight + 0.42, 0.96]} />
            <meshStandardMaterial color="#242b31" metalness={0.88} roughness={0.26} />
          </mesh>
        ))}

        {[-1, 1].map((direction) => (
          <mesh key={direction} position={[0, direction * (rackHeight / 2 + 0.15), 0]} castShadow>
            <boxGeometry args={[2.9, 0.16, 1]} />
            <meshStandardMaterial color="#242b31" metalness={0.88} roughness={0.26} />
          </mesh>
        ))}

        {Array.from({ length: TOTAL_UNITS }, (_, index) => index + 1).map((unit) => {
          const desired = Array.from({ length: selectedSize }, (_, offset) => unit + offset)
          const available = desired.every((target) => target <= TOTAL_UNITS && !occupied.has(target))
          return !occupied.has(unit) ? <EmptySlot key={unit} unit={unit} available={available} /> : null
        })}

        {installed.map((item) => <Equipment key={item.id} item={item} />)}
      </group>
    </Float>
  )
}

export default function RackScene() {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [5.8, 2.2, 7.2], fov: 36 }}>
      <color attach="background" args={['#080b10']} />
      <fog attach="fog" args={['#080b10', 10, 19]} />
      <ambientLight intensity={0.65} />
      <spotLight position={[4, 7, 6]} angle={0.38} penumbra={0.65} intensity={40} color="#b7d8ff" castShadow />
      <pointLight position={[-4, 0, 3]} intensity={14} color="#2ed6c2" />
      <pointLight position={[3, -2, -2]} intensity={10} color="#795cff" />
      <Suspense fallback={null}>
        <Rack />
        <Environment preset="city" environmentIntensity={0.18} />
      </Suspense>
      <ContactShadows position={[0, -2.52, 0]} opacity={0.6} scale={10} blur={2.4} far={5} color="#000000" />
      <gridHelper args={[18, 18, '#18242e', '#10171d']} position={[0, -2.48, 0]} />
      <OrbitControls makeDefault enablePan={false} minDistance={6} maxDistance={11} minPolarAngle={0.85} maxPolarAngle={1.9} target={[0, 0, 0]} />
    </Canvas>
  )
}
