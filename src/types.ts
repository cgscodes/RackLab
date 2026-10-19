export type EquipmentType = 'switch' | 'server' | 'storage' | 'patch'

export type EquipmentDefinition = {
  type: EquipmentType
  name: string
  shortName: string
  units: number
  watts: number
  color: string
  accent: string
  description: string
}

export type InstalledEquipment = {
  id: string
  type: EquipmentType
  startUnit: number
}
