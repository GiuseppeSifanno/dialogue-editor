import { useState, useEffect } from 'react'
import Dialogo from '../models/Dialogo';
import Battuta from '../models/Battuta';
import Scelta from '../models/Scelta';

function NodeEditor({ dialogo, dialoghi, personaggi, onUpdate, openConfirm }) {
  const [local, setLocal] = useState(
    dialogo ? new Dialogo(dialogo): null
  );

  useEffect(() => {
    setLocal(
      dialogo ? new Dialogo(dialogo): null
    );
  }, [dialogo]);

  if (!local) return (
    <div className="bg-body-tertiary rounded p-3 text-muted">
      Seleziona o crea un dialogo per modificarlo
    </div>
  );

  function update(updated) {
    setLocal(updated)
    onUpdate(updated)
  }

  // ── Battute ──────────────────────────────────────

  function handleAddBattuta() {
    update(new Dialogo({
      ...local,
      battute: [
        ...local.battute, 
        new Battuta(personaggi[0]?.id || '','')
      ]
    }));
  }

  function handleEditBattutaPersonaggio(index, personaggioId) {
    const newBattute = local.battute.map((b, i) =>
      i === index ? { ...b, personaggioId } : b
    )
    update({ ...local, battute: newBattute })
  }

  function handleEditBattutaTesto(index, testo) {
    const newBattute = local.battute.map((b, i) =>
      i === index ? { ...b, testo } : b
    )
    update({ ...local, battute: newBattute })
  }

  function handleDeleteBattuta(index) {
    update({ ...local, battute: local.battute.filter((_, i) => i !== index) })
  }

  // ── Scelte ───────────────────────────────────────

  function handleAddScelta() {
    const newId = `s${local.scelte.length + 1}`
    update({
      ...local,
      scelte: [
        ...local.scelte,
        new Scelta(newId)
      ]
    });
  }

  function handleEditSceltaTesto(index, testo) {
    const newScelte = local.scelte.map((s, i) =>
      i === index ? { ...s, testo } : s
    )
    update({ ...local, scelte: newScelte })
  }

  function handleEditSceltaNext(index, next) {
    const newScelte = local.scelte.map((s, i) =>
      i === index ? { ...s, next } : s
    )
    update({ ...local, scelte: newScelte })
  }

  function handleDeleteScelta(index) {
    update({ ...local, scelte: local.scelte.filter((_, i) => i !== index) })
  }

  return (
    <div className="bg-body-tertiary rounded p-3 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Modifica dialogo</h5>
        <span className="badge bg-secondary">{local.id}</span>
      </div>

      {/* Battute */}
      <div>
        <label className="form-label fw-bold">Script</label>
        <div className="d-flex flex-column gap-2">
          {local.battute.map((battuta, index) => (
            <div key={index} className="card p-2">
              <div className="d-flex gap-2 align-items-start">

                {/* Personaggio */}
                <select
                  className="form-select form-select-sm"
                  style={{ maxWidth: '140px' }}
                  value={battuta.personaggioId}
                  onChange={(e) => handleEditBattutaPersonaggio(index, e.target.value)}
                >
                  <option value="">— nessuno —</option>
                  {personaggi.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>

                {/* Testo */}
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  placeholder="Testo battuta..."
                  value={battuta.testo}
                  onChange={(e) => handleEditBattutaTesto(index, e.target.value)}
                />

                {/* Elimina */}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => 
                    openConfirm( () => handleDeleteBattuta(index), "Vuoi eleminare questa battuta?")
                  }
                >✕</button>

              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={handleAddBattuta}>
          + Aggiungi battuta
        </button>
      </div>

      <hr className="my-1" />

      {/* Scelte */}
      <div>
        <label className="form-label fw-bold">Scelte</label>
        <div className="d-flex flex-column gap-2">
          {local.scelte.map((scelta, index) => (
            <div key={index} className="d-flex gap-2 align-items-center">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Testo scelta"
                value={scelta.testo}
                onChange={(e) => handleEditSceltaTesto(index, e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                value={scelta.next}
                onChange={(e) => handleEditSceltaNext(index, e.target.value)}
              >
                <option value="">→ dialogo</option>
                {dialoghi
                  .filter(d => d.id !== local.id)
                  .map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.battute[0]?.testo.slice(0, 20)}…
                    </option>
                  ))
                }
              </select>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => 
                  openConfirm( () => handleDeleteScelta(index), "Vuoi eliminare questa Scelta?")
                }
              >✕</button>
            </div>
          ))}
        </div>
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={handleAddScelta}>
          + Aggiungi scelta
        </button>
      </div>

      <hr className="my-1" />

      {/* Skip — solo se non ci sono scelte */}
      {local.scelte.length === 0 && (
        <div>
          <label className="form-label fw-bold">Continua verso</label>
          <select
            className="form-select form-select-sm"
            value={local.nextId || ''}
            onChange={(e) => update({ ...local, nextId: e.target.value })}
          >
            <option value="">Nessuno — fine dialogo</option>
            {dialoghi
              .filter(d => d.id !== local.id)
              .map(d => (
                <option key={d.id} value={d.id}>
                  {d.id} — {d.battute[0]?.testo.slice(0, 20)}…
                </option>
              ))
            }
          </select>
        </div>
      )}

    </div>
  )
}

export default NodeEditor