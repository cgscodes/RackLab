import { Box, Gauge, Info, RotateCcw, Server, Trash2, Zap } from 'lucide-react'
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
  const powerPercent = Math.min((totalPower / POWER_LIMIT) * 100, 100)
  const isWarning = totalPower > POWER_LIMIT

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="RackLab home">
          <span className="brand-mark"><Server size={18} strokeWidth={1.8} /></span>
          <span>RACKLAB</span>
        </a>
        <div className="topbar-status"><span className="status-dot" /> Configuration saved locally</div>
        <button className="reset-button" onClick={reset} disabled={!installed.length}>
          <RotateCcw size={15} /> Reset rack
        </button>
      </header>

      <section className="workspace" id="top">
        <aside className="catalog panel">
          <div className="eyebrow">EQUIPMENT CATALOG</div>
          <h1>Build your rack.</h1>
          <p className="intro">Select a component, then choose an open rack unit to install it.</p>

          <div className="equipment-list" role="radiogroup" aria-label="Equipment type">
            {equipmentOrder.map((type) => {
              const item = EQUIPMENT[type]
              const active = selectedType === type
              return (
                <button
                  key={type}
                  className={`equipment-card ${active ? 'active' : ''}`}
                  style={{ '--equipment-accent': item.accent } as React.CSSProperties}
                  onClick={() => selectType(type)}
                  role="radio"
                  aria-checked={active}
                >
                  <span className="equipment-icon"><Box size={18} /></span>
                  <span className="equipment-copy">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="equipment-spec"><b>{item.units}U</b><small>{item.watts}W</small></span>
                </button>
              )
            })}
          </div>

          <div className="hint"><Info size={14} /><span>Click installed equipment to remove it.</span></div>
        </aside>

        <section className="scene-panel" aria-label="Interactive 3D server rack">
          <RackScene />
          <div className="scene-label"><span>DRAG</span> to orbit <i /> <span>SCROLL</span> to zoom</div>
          <div className="rack-label">18U EDGE RACK <span>RL-01</span></div>
          {notice && <button className="toast" onClick={dismissNotice}>{notice}<span>×</span></button>}
        </section>

        <aside className="telemetry panel">
          <div className="eyebrow">LIVE TELEMETRY</div>
          <h2>Rack overview</h2>

          <div className="metric-grid">
            <article className="metric-card">
              <span><Gauge size={16} /> Capacity</span>
              <strong>{usedUnits}<small> / {TOTAL_UNITS}U</small></strong>
              <div className="meter"><i style={{ width: `${(usedUnits / TOTAL_UNITS) * 100}%` }} /></div>
            </article>
            <article className={`metric-card ${isWarning ? 'warning' : ''}`}>
              <span><Zap size={16} /> Power draw</span>
              <strong>{totalPower.toLocaleString()}<small> W</small></strong>
              <div className="meter"><i style={{ width: `${powerPercent}%` }} /></div>
              <em>{isWarning ? 'Power budget exceeded' : `${(POWER_LIMIT - totalPower).toLocaleString()}W available`}</em>
            </article>
          </div>

          <div className="inventory-heading"><span>Installed equipment</span><b>{installed.length}</b></div>
          <div className="inventory-list">
            {!installed.length && (
              <div className="empty-state">
                <Server size={28} strokeWidth={1.3} />
                <p>Your rack is empty.</p>
                <small>Select equipment and click a slot to begin.</small>
              </div>
            )}
            {[...installed].sort((a, b) => b.startUnit - a.startUnit).map((item) => {
              const definition = EQUIPMENT[item.type]
              return (
                <div className="inventory-item" key={item.id}>
                  <span className="inventory-light" style={{ background: definition.accent }} />
                  <div><strong>{definition.name}</strong><small>U{item.startUnit}{definition.units > 1 ? `–${item.startUnit + definition.units - 1}` : ''} · {definition.watts}W</small></div>
                  <button aria-label={`Remove ${definition.name}`} onClick={() => useRackStore.getState().remove(item.id)}><Trash2 size={14} /></button>
                </div>
              )
            })}
          </div>

          <div className="health-row"><span>System health</span><strong className={isWarning ? 'health-warning' : ''}><i /> {isWarning ? 'Review power' : 'Nominal'}</strong></div>
        </aside>
      </section>

      <footer>
        <span>RackLab / Interactive infrastructure planning</span>
        <span>CONFIGURATION <b>LOCAL</b></span>
      </footer>
    </main>
  )
}

export default App
