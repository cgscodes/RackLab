import { Check, RotateCcw, Server, Trash2 } from 'lucide-react'
import RackScene from './components/RackScene'
import { EQUIPMENT, POWER_LIMIT, TOTAL_UNITS } from './data'
import { useRackStore } from './store'
import type { EquipmentType } from './types'

const equipmentOrder: EquipmentType[] = ['server', 'switch', 'storage', 'patch']

function App() {
  const selectedType = useRackStore((state) => state.selectedType)
  const installed = useRackStore((state) => state.installed)
  const notice = useRackStore((state) => state.notice)
  const selectType = useRackStore((state) => state.selectType)
  const reset = useRackStore((state) => state.reset)
  const dismissNotice = useRackStore((state) => state.dismissNotice)
  const usedUnits = installed.reduce((sum, item) => sum + EQUIPMENT[item.type].units, 0)
  const totalPower = installed.reduce((sum, item) => sum + EQUIPMENT[item.type].watts, 0)
  const isWarning = totalPower > POWER_LIMIT

  return (
    <main className="app-shell" id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="RackLab home"><span className="brand-symbol"><Server size={20} strokeWidth={1.8} /></span><span>RackLab</span></a>
        <p>18U server rack configurator</p>
        <div className="header-actions">
          <span className="saved-state"><Check size={14} /> Saved on this device</span>
          <button className="reset-button" onClick={reset} disabled={!installed.length}><RotateCcw size={15} /> Reset</button>
        </div>
      </header>

      <section className="intro-row">
        <div><p className="section-number">01 / CONFIGURE</p><h1>Configure an 18U rack</h1></div>
        <p>Choose equipment from the list, then click an available rack unit to install it.</p>
      </section>

      <section className="workspace">
        <aside className="catalog">
          <h2>Equipment</h2>
          <div className="equipment-list" role="radiogroup" aria-label="Equipment type">
            {equipmentOrder.map((type) => {
              const item = EQUIPMENT[type]
              const active = selectedType === type
              return (
                <button key={type} className={`equipment-row ${active ? 'active' : ''}`} onClick={() => selectType(type)} role="radio" aria-checked={active}>
                  <span className="equipment-swatch" style={{ background: item.accent }} />
                  <span className="equipment-copy"><strong>{item.name}</strong><small>{item.description}</small></span>
                  <span className="equipment-spec"><b>{item.units}U</b><small>{item.watts} W</small></span>
                </button>
              )
            })}
          </div>
          <p className="catalog-note">Selected equipment is highlighted in orange on the rack. Click an installed component to remove it.</p>
        </aside>

        <section className="scene-panel" aria-label="Interactive 3D server rack">
          <RackScene />
          <div className="scene-help">Drag to rotate · Scroll to zoom</div>
          <div className="rack-id">RACK 01 <span>18U</span></div>
          {notice && <button className="toast" onClick={dismissNotice}>{notice}<span>Dismiss</span></button>}
        </section>

        <aside className="configuration">
          <h2>Configuration</h2>
          <div className="summary">
            <div><span>Rack space</span><strong>{usedUnits} of {TOTAL_UNITS}U</strong><div className="progress"><i style={{ width: `${(usedUnits / TOTAL_UNITS) * 100}%` }} /></div></div>
            <div className={isWarning ? 'power-warning' : ''}><span>Estimated power</span><strong>{totalPower.toLocaleString()} W</strong><small>{isWarning ? `${(totalPower - POWER_LIMIT).toLocaleString()} W above recommended limit` : `${(POWER_LIMIT - totalPower).toLocaleString()} W remaining`}</small></div>
          </div>
          <div className="inventory-header"><h3>Installed equipment</h3><span>{installed.length}</span></div>
          <div className="inventory-list">
            {!installed.length && <div className="empty-state"><div className="empty-rack-icon"><span /><span /><span /></div><p>No equipment installed</p><small>Choose an item on the left to begin.</small></div>}
            {[...installed].sort((a, b) => b.startUnit - a.startUnit).map((item) => {
              const definition = EQUIPMENT[item.type]
              return <div className="inventory-item" key={item.id}><span className="inventory-unit">U{item.startUnit}</span><div><strong>{definition.name}</strong><small>{definition.units}U · {definition.watts} W</small></div><button aria-label={`Remove ${definition.name}`} onClick={() => useRackStore.getState().remove(item.id)}><Trash2 size={15} /></button></div>
            })}
          </div>
        </aside>
      </section>
      <footer><span>RackLab</span><span>Interactive infrastructure planning</span></footer>
    </main>
  )
}

export default App
