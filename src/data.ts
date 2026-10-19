import type { EquipmentDefinition, EquipmentType } from './types'

export const TOTAL_UNITS = 18
export const POWER_LIMIT = 2500

export const EQUIPMENT: Record<EquipmentType, EquipmentDefinition> = {
  switch: {
    type: 'switch',
    name: 'Core Switch',
    shortName: 'SW-24',
    units: 1,
    watts: 120,
    color: '#19252d',
    accent: '#50e3c2',
    description: '24-port managed network switch',
  },
  server: {
    type: 'server',
    name: 'Compute Server',
    shortName: 'CX-1U',
    units: 1,
    watts: 400,
    color: '#242931',
    accent: '#78a9ff',
    description: 'General-purpose 1U compute node',
  },
  storage: {
    type: 'storage',
    name: 'Storage Array',
    shortName: 'ST-2U',
    units: 2,
    watts: 650,
    color: '#292631',
    accent: '#b892ff',
    description: 'High-capacity 2U storage array',
  },
  patch: {
    type: 'patch',
    name: 'Patch Panel',
    shortName: 'PP-24',
    units: 1,
    watts: 0,
    color: '#22272a',
    accent: '#ffb86b',
    description: '24-port passive patch panel',
  },
}
