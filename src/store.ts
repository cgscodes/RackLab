import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { EQUIPMENT, TOTAL_UNITS } from './data'
import type { EquipmentType, InstalledEquipment } from './types'

type RackState = {
  selectedType: EquipmentType
  installed: InstalledEquipment[]
  notice: string
  selectType: (type: EquipmentType) => void
  install: (startUnit: number) => void
  remove: (id: string) => void
  reset: () => void
  dismissNotice: () => void
}

const range = (start: number, size: number) =>
  Array.from({ length: size }, (_, index) => start + index)

export const useRackStore = create<RackState>()(
  persist(
    (set, get) => ({
      selectedType: 'server',
      installed: [],
      notice: '',
      selectType: (selectedType) => set({ selectedType, notice: '' }),
      install: (startUnit) => {
        const { selectedType, installed } = get()
        const definition = EQUIPMENT[selectedType]
        const desiredUnits = range(startUnit, definition.units)
        const occupied = new Set(
          installed.flatMap((item) =>
            range(item.startUnit, EQUIPMENT[item.type].units),
          ),
        )

        if (
          startUnit < 1 ||
          startUnit + definition.units - 1 > TOTAL_UNITS ||
          desiredUnits.some((unit) => occupied.has(unit))
        ) {
          set({ notice: `${definition.name} does not fit in that position.` })
          return
        }

        set({
          installed: [
            ...installed,
            {
              id: `${selectedType}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              type: selectedType,
              startUnit,
            },
          ],
          notice: `${definition.name} installed at U${startUnit}.`,
        })
      },
      remove: (id) =>
        set((state) => ({
          installed: state.installed.filter((item) => item.id !== id),
          notice: 'Equipment removed.',
        })),
      reset: () => set({ installed: [], notice: 'Rack cleared.' }),
      dismissNotice: () => set({ notice: '' }),
    }),
    {
      name: 'racklab-configuration',
      partialize: (state) => ({ installed: state.installed }),
    },
  ),
)
