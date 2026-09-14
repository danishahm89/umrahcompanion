import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../api/client';
import type { ItineraryItem, Package, PackageInclusion, PackageExclusion } from '../api/types';

const BLANK_ITIN = (order: number): ItineraryItem => ({ order, keyEn: '', keyHi: '', keyUr: '', textEn: '', textHi: '', textUr: '' });
const BLANK_INCL = (order: number): PackageInclusion => ({ order, textEn: '', textHi: '', textUr: '' });
const BLANK_EXCL = (order: number): PackageExclusion => ({ order, textEn: '', textHi: '', textUr: '' });

const BLANK_PACKAGE: Omit<Package, 'id'> = {
  type: 'group',
  nameEn: '', nameHi: '', nameUr: '',
  priceInr: 0,
  price2Share: null,
  price3Share: null,
  price4Share: null,
  price5Share: null,
  departDate: new Date().toISOString().slice(0, 10),
  nights: 1,
  makkahHotelStars: 3,
  makkahHotelDistM: 0,
  makkahHotelRemark: 'walking',
  makkahHotelName: '',
  madinahHotelStars: 3,
  madinahHotelDistM: 0,
  madinahHotelRemark: 'walking',
  madinahHotelName: '',
  cityEn: '', cityHi: '', cityUr: '',
  mealsEn: '', mealsHi: '', mealsUr: '',
  visaIncluded: true,
  flightIncluded: true,
  flightConfirmLater: false,
  flightAirline: '',
  flightRouting: 'direct',
  flightViaCity: '',
  flightDepartureAt: null,
  flightReturnAt: null,
  hajjShifting: null,
  live: true,
  order: 0,
  itinerary: [],
  inclusions: [],
  exclusions: [],
};

// Lowest set share price = the "from" price shown to the admin as a live preview; the server
// recomputes the same thing on save.
function fromPrice(p: Pick<Package, 'price2Share' | 'price3Share' | 'price4Share' | 'price5Share'>): number | null {
  const vals = [p.price2Share, p.price3Share, p.price4Share, p.price5Share].filter((v): v is number => typeof v === 'number');
  return vals.length ? Math.min(...vals) : null;
}

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" with no timezone/seconds.
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Moves array[from] to index `to` and renumbers every row's `order` to match its new position,
// so drag-reordering itinerary/inclusion/exclusion rows (or packages) is just "move then save".
function moveItem<T extends { order: number }>(arr: T[], from: number, to: number): T[] {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy.map((x, i) => ({ ...x, order: i }));
}

// Immutable single-field update for one row in an itinerary/inclusion/exclusion array.
function updateRow<T>(arr: T[], idx: number, patch: Partial<T>): T[] {
  return arr.map((x, j) => (j === idx ? { ...x, ...patch } : x));
}

type RecentField =
  | 'nameEn' | 'nameHi' | 'nameUr' | 'cityEn' | 'cityHi' | 'cityUr'
  | 'mealsEn' | 'mealsHi' | 'mealsUr' | 'makkahHotelName' | 'madinahHotelName'
  | 'flightAirline' | 'flightViaCity'
  | 'itKeyEn' | 'itKeyHi' | 'itKeyUr' | 'itTextEn' | 'itTextHi' | 'itTextUr'
  | 'inclTextEn' | 'inclTextHi' | 'inclTextUr'
  | 'exclTextEn' | 'exclTextHi' | 'exclTextUr';

// A self-maintaining "recently used" list per field, built from every value already saved on
// any package (newest package first) -- no separate list to manage, it just reflects reality.
function buildRecent(packages: Package[]): Record<RecentField, string[]> {
  const acc = {} as Record<RecentField, string[]>;
  const push = (field: RecentField, value: string | null | undefined) => {
    if (!value) return;
    const list = acc[field] ?? (acc[field] = []);
    if (!list.includes(value)) list.push(value);
  };
  for (const p of [...packages].reverse()) {
    push('nameEn', p.nameEn); push('nameHi', p.nameHi); push('nameUr', p.nameUr);
    push('cityEn', p.cityEn); push('cityHi', p.cityHi); push('cityUr', p.cityUr);
    push('mealsEn', p.mealsEn); push('mealsHi', p.mealsHi); push('mealsUr', p.mealsUr);
    push('makkahHotelName', p.makkahHotelName); push('madinahHotelName', p.madinahHotelName);
    push('flightAirline', p.flightAirline); push('flightViaCity', p.flightViaCity);
    for (const it of p.itinerary) {
      push('itKeyEn', it.keyEn); push('itKeyHi', it.keyHi); push('itKeyUr', it.keyUr);
      push('itTextEn', it.textEn); push('itTextHi', it.textHi); push('itTextUr', it.textUr);
    }
    for (const inc of p.inclusions) { push('inclTextEn', inc.textEn); push('inclTextHi', inc.textHi); push('inclTextUr', inc.textUr); }
    for (const exc of p.exclusions) { push('exclTextEn', exc.textEn); push('exclTextHi', exc.textHi); push('exclTextUr', exc.textUr); }
  }
  return acc;
}

export function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragPkg, setDragPkg] = useState<number | null>(null);
  const [dragItin, setDragItin] = useState<number | null>(null);
  const [dragIncl, setDragIncl] = useState<number | null>(null);
  const [dragExcl, setDragExcl] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<Package[]>('/packages').then((data) => { setPackages(data); setLoading(false); });
  };

  useEffect(load, []);

  const recent = useMemo(() => buildRecent(packages), [packages]);
  const dl = (field: RecentField) => (
    <datalist id={`dl-${field}`}>{(recent[field] ?? []).map((v) => <option key={v} value={v} />)}</datalist>
  );

  const save = async () => {
    if (!editing) return;
    setError(null);
    try {
      const isNew = !packages.some((p) => p.id === editing.id);
      if (isNew) await adminApi.post('/packages', editing);
      else await adminApi.put(`/packages/${editing.id}`, editing);
      setEditing(null);
      load();
    } catch (e) {
      setError(String(e));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    await adminApi.delete(`/packages/${id}`);
    load();
  };

  const duplicate = (p: Package) => {
    setError(null);
    setEditing({
      ...p,
      id: '',
      nameEn: `${p.nameEn} (copy)`,
      live: false,
      order: packages.length,
      itinerary: p.itinerary.map((it, i) => ({ ...it, id: undefined, order: i })),
      inclusions: p.inclusions.map((inc, i) => ({ ...inc, id: undefined, order: i })),
      exclusions: p.exclusions.map((exc, i) => ({ ...exc, id: undefined, order: i })),
    });
  };

  const reorderPackages = async (from: number, to: number) => {
    if (from === to) return;
    const reordered = moveItem(packages, from, to);
    setPackages(reordered);
    await adminApi.put('/packages/reorder', reordered.map((p, i) => ({ id: p.id, order: i })));
  };

  const set = <K extends keyof Package>(key: K, value: Package[K]) => setEditing((e) => (e ? { ...e, [key]: value } : e));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Packages</h2>
        <button className="primary" onClick={() => setEditing({ id: '', ...BLANK_PACKAGE, order: packages.length })}>New package</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr><th /><th>Package</th><th>Price</th><th>Nights</th><th>Departs</th><th>Type</th><th>Live</th><th /></tr>
          </thead>
          <tbody>
            {packages.map((p, i) => (
              <tr
                key={p.id}
                draggable
                onDragStart={() => setDragPkg(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragPkg !== null) reorderPackages(dragPkg, i); setDragPkg(null); }}
                style={{ opacity: dragPkg === i ? 0.5 : 1 }}
              >
                <td style={{ cursor: 'grab', color: 'var(--t50)' }} title="Drag to reorder">⠿</td>
                <td>{p.nameEn}</td>
                <td>₹{p.priceInr.toLocaleString('en-IN')}</td>
                <td>{p.nights}</td>
                <td>{new Date(p.departDate).toLocaleDateString('en-GB')}</td>
                <td>{p.type}</td>
                <td><span className={`tag ${p.live ? '' : 'outline'}`}>{p.live ? 'On' : 'Off'}</span></td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="secondary" onClick={() => setEditing(p)}>Edit</button>
                  <button className="secondary" onClick={() => duplicate(p)}>Duplicate</button>
                  <button className="danger" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div style={{ marginTop: 24, padding: 16, border: '2px solid var(--color-divider-strong)', background: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: 12 }}>{editing.id ? 'Edit' : 'New'} package</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Name (EN)</label><input list="dl-nameEn" value={editing.nameEn} onChange={(e) => set('nameEn', e.target.value)} />{dl('nameEn')}</div>
            <div><label>Name (HI)</label><input list="dl-nameHi" value={editing.nameHi} onChange={(e) => set('nameHi', e.target.value)} />{dl('nameHi')}</div>
            <div><label>Name (UR)</label><input list="dl-nameUr" value={editing.nameUr} onChange={(e) => set('nameUr', e.target.value)} />{dl('nameUr')}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Type</label>
              <select value={editing.type} onChange={(e) => set('type', e.target.value)}>
                <option value="group">Group</option>
                <option value="private">Private</option>
                <option value="hajj">Hajj</option>
              </select>
            </div>
            <div><label>Nights</label><input type="number" value={editing.nights} onChange={(e) => set('nights', Number(e.target.value))} /></div>
            <div><label>Departs</label><input type="date" value={editing.departDate.slice(0, 10)} onChange={(e) => set('departDate', e.target.value)} /></div>
          </div>

          <h4 style={{ marginBottom: 8 }}>Room-sharing prices (₹ per person)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div><label>2 sharing</label><input type="number" value={editing.price2Share ?? ''} onChange={(e) => set('price2Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
            <div><label>3 sharing</label><input type="number" value={editing.price3Share ?? ''} onChange={(e) => set('price3Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
            <div><label>4 sharing</label><input type="number" value={editing.price4Share ?? ''} onChange={(e) => set('price4Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
            <div><label>5 sharing</label><input type="number" value={editing.price5Share ?? ''} onChange={(e) => set('price5Share', e.target.value === '' ? null : Number(e.target.value))} /></div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted, #888)', marginBottom: 16 }}>
            Leave a tier blank if it isn't offered. "From" price shown in the app and list below is auto-set to the lowest tier filled in
            {fromPrice(editing) != null ? ` — currently ₹${fromPrice(editing)!.toLocaleString('en-IN')}.` : ' — fill in at least one tier.'}
          </p>

          {editing.type === 'hajj' && (
            <div style={{ marginBottom: 12 }}>
              <label>Hajj movement (nights above sets the 20-day / 30+ day bucket shown in the app)</label>
              <select
                value={editing.hajjShifting === null ? '' : String(editing.hajjShifting)}
                onChange={(e) => set('hajjShifting', e.target.value === '' ? null : e.target.value === 'true')}
              >
                <option value="">Not applicable</option>
                <option value="true">Shifting (separate Mina/Arafat/Muzdalifah hotels)</option>
                <option value="false">Non-shifting (one Makkah hotel throughout)</option>
              </select>
            </div>
          )}

          <h4 style={{ marginBottom: 8 }}>Makkah hotel</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Stars</label>
              <select value={editing.makkahHotelStars} onChange={(e) => set('makkahHotelStars', Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star</option>)}
              </select>
            </div>
            <div><label>Distance from Haram (m)</label><input type="number" value={editing.makkahHotelDistM} onChange={(e) => set('makkahHotelDistM', Number(e.target.value))} /></div>
            <div><label>Access</label>
              <select value={editing.makkahHotelRemark} onChange={(e) => set('makkahHotelRemark', e.target.value)}>
                <option value="walking">Walking distance</option>
                <option value="shuttle">Shuttle service</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label>Hotel name</label><input list="dl-makkahHotelName" value={editing.makkahHotelName} onChange={(e) => set('makkahHotelName', e.target.value)} />{dl('makkahHotelName')}</div>
          </div>

          <h4 style={{ marginBottom: 8 }}>Madinah hotel</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Stars</label>
              <select value={editing.madinahHotelStars} onChange={(e) => set('madinahHotelStars', Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star</option>)}
              </select>
            </div>
            <div><label>Distance from Haram (m)</label><input type="number" value={editing.madinahHotelDistM} onChange={(e) => set('madinahHotelDistM', Number(e.target.value))} /></div>
            <div><label>Access</label>
              <select value={editing.madinahHotelRemark} onChange={(e) => set('madinahHotelRemark', e.target.value)}>
                <option value="walking">Walking distance</option>
                <option value="shuttle">Shuttle service</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label>Hotel name</label><input list="dl-madinahHotelName" value={editing.madinahHotelName} onChange={(e) => set('madinahHotelName', e.target.value)} />{dl('madinahHotelName')}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Departure city (EN)</label><input list="dl-cityEn" value={editing.cityEn} onChange={(e) => set('cityEn', e.target.value)} />{dl('cityEn')}</div>
            <div><label>City (HI)</label><input list="dl-cityHi" value={editing.cityHi} onChange={(e) => set('cityHi', e.target.value)} />{dl('cityHi')}</div>
            <div><label>City (UR)</label><input list="dl-cityUr" value={editing.cityUr} onChange={(e) => set('cityUr', e.target.value)} />{dl('cityUr')}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label>Meals (EN)</label><input list="dl-mealsEn" value={editing.mealsEn} onChange={(e) => set('mealsEn', e.target.value)} />{dl('mealsEn')}</div>
            <div><label>Meals (HI)</label><input list="dl-mealsHi" value={editing.mealsHi} onChange={(e) => set('mealsHi', e.target.value)} />{dl('mealsHi')}</div>
            <div><label>Meals (UR)</label><input list="dl-mealsUr" value={editing.mealsUr} onChange={(e) => set('mealsUr', e.target.value)} />{dl('mealsUr')}</div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <label><input type="checkbox" checked={editing.visaIncluded} onChange={(e) => set('visaIncluded', e.target.checked)} /> Visa included</label>
            <label><input type="checkbox" checked={editing.flightIncluded} onChange={(e) => set('flightIncluded', e.target.checked)} /> Flight included</label>
            <label><input type="checkbox" checked={editing.live} onChange={(e) => set('live', e.target.checked)} /> Live (visible in app)</label>
          </div>

          {editing.flightIncluded && (
            <div style={{ border: '1px solid var(--color-divider-strong)', padding: 12, marginBottom: 12 }}>
              <h4 style={{ marginBottom: 8 }}>Flight details</h4>
              <div style={{ marginBottom: 12 }}>
                <label><input type="checkbox" checked={editing.flightConfirmLater} onChange={(e) => set('flightConfirmLater', e.target.checked)} /> Confirm flight details later</label>
              </div>
              {!editing.flightConfirmLater && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div><label>Airline</label><input list="dl-flightAirline" value={editing.flightAirline ?? ''} onChange={(e) => set('flightAirline', e.target.value)} />{dl('flightAirline')}</div>
                    <div>
                      <label>Routing</label>
                      <select value={editing.flightRouting ?? 'direct'} onChange={(e) => set('flightRouting', e.target.value)}>
                        <option value="direct">Direct</option>
                        <option value="via">Via city</option>
                      </select>
                    </div>
                    {editing.flightRouting === 'via' && (
                      <div><label>Via city</label><input list="dl-flightViaCity" value={editing.flightViaCity ?? ''} onChange={(e) => set('flightViaCity', e.target.value)} />{dl('flightViaCity')}</div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div><label>Departure at</label><input type="datetime-local" value={toDatetimeLocal(editing.flightDepartureAt)} onChange={(e) => set('flightDepartureAt', e.target.value ? new Date(e.target.value).toISOString() : null)} /></div>
                    <div><label>Return at</label><input type="datetime-local" value={toDatetimeLocal(editing.flightReturnAt)} onChange={(e) => set('flightReturnAt', e.target.value ? new Date(e.target.value).toISOString() : null)} /></div>
                  </div>
                </>
              )}
            </div>
          )}

          <h4 style={{ marginTop: 16, marginBottom: 8 }}>Itinerary</h4>
          {editing.itinerary.map((it, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDragItin(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragItin !== null) set('itinerary', moveItem(editing.itinerary, dragItin, i)); setDragItin(null); }}
              style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr 1fr 30px', gap: 6, alignItems: 'start', marginBottom: 6, opacity: dragItin === i ? 0.5 : 1 }}
            >
              <span style={{ cursor: 'grab', color: 'var(--t50)' }} title="Drag to reorder">⠿</span>
              <div>
                <input list="dl-itKeyEn" placeholder="Key (EN)" value={it.keyEn} onChange={(e) => set('itinerary', updateRow(editing.itinerary, i, { keyEn: e.target.value }))} />{dl('itKeyEn')}
                <input list="dl-itKeyHi" placeholder="Key (HI)" value={it.keyHi} onChange={(e) => set('itinerary', updateRow(editing.itinerary, i, { keyHi: e.target.value }))} />{dl('itKeyHi')}
                <input list="dl-itKeyUr" placeholder="Key (UR)" value={it.keyUr} onChange={(e) => set('itinerary', updateRow(editing.itinerary, i, { keyUr: e.target.value }))} />{dl('itKeyUr')}
              </div>
              <div>
                <input list="dl-itTextEn" placeholder="Text (EN)" value={it.textEn} onChange={(e) => set('itinerary', updateRow(editing.itinerary, i, { textEn: e.target.value }))} />{dl('itTextEn')}
                <input list="dl-itTextHi" placeholder="Text (HI)" value={it.textHi} onChange={(e) => set('itinerary', updateRow(editing.itinerary, i, { textHi: e.target.value }))} />{dl('itTextHi')}
                <input list="dl-itTextUr" placeholder="Text (UR)" value={it.textUr} onChange={(e) => set('itinerary', updateRow(editing.itinerary, i, { textUr: e.target.value }))} />{dl('itTextUr')}
              </div>
              <button className="danger" onClick={() => set('itinerary', editing.itinerary.filter((_, j) => j !== i).map((x, j) => ({ ...x, order: j })))}>✕</button>
            </div>
          ))}
          <button className="secondary" onClick={() => set('itinerary', [...editing.itinerary, BLANK_ITIN(editing.itinerary.length)])}>Add itinerary row</button>

          <h4 style={{ marginTop: 16, marginBottom: 8 }}>Inclusions</h4>
          {editing.inclusions.map((inc, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDragIncl(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIncl !== null) set('inclusions', moveItem(editing.inclusions, dragIncl, i)); setDragIncl(null); }}
              style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr 1fr 30px', gap: 6, alignItems: 'start', marginBottom: 6, opacity: dragIncl === i ? 0.5 : 1 }}
            >
              <span style={{ cursor: 'grab', color: 'var(--t50)' }} title="Drag to reorder">⠿</span>
              <div><input list="dl-inclTextEn" placeholder="Text (EN)" value={inc.textEn} onChange={(e) => set('inclusions', updateRow(editing.inclusions, i, { textEn: e.target.value }))} />{dl('inclTextEn')}</div>
              <div><input list="dl-inclTextHi" placeholder="Text (HI)" value={inc.textHi} onChange={(e) => set('inclusions', updateRow(editing.inclusions, i, { textHi: e.target.value }))} />{dl('inclTextHi')}</div>
              <div><input list="dl-inclTextUr" placeholder="Text (UR)" value={inc.textUr} onChange={(e) => set('inclusions', updateRow(editing.inclusions, i, { textUr: e.target.value }))} />{dl('inclTextUr')}</div>
              <button className="danger" onClick={() => set('inclusions', editing.inclusions.filter((_, j) => j !== i).map((x, j) => ({ ...x, order: j })))}>✕</button>
            </div>
          ))}
          <button className="secondary" onClick={() => set('inclusions', [...editing.inclusions, BLANK_INCL(editing.inclusions.length)])}>Add inclusion</button>

          <h4 style={{ marginTop: 16, marginBottom: 8 }}>Exclusions</h4>
          {editing.exclusions.map((exc, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDragExcl(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragExcl !== null) set('exclusions', moveItem(editing.exclusions, dragExcl, i)); setDragExcl(null); }}
              style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr 1fr 30px', gap: 6, alignItems: 'start', marginBottom: 6, opacity: dragExcl === i ? 0.5 : 1 }}
            >
              <span style={{ cursor: 'grab', color: 'var(--t50)' }} title="Drag to reorder">⠿</span>
              <div><input list="dl-exclTextEn" placeholder="Text (EN)" value={exc.textEn} onChange={(e) => set('exclusions', updateRow(editing.exclusions, i, { textEn: e.target.value }))} />{dl('exclTextEn')}</div>
              <div><input list="dl-exclTextHi" placeholder="Text (HI)" value={exc.textHi} onChange={(e) => set('exclusions', updateRow(editing.exclusions, i, { textHi: e.target.value }))} />{dl('exclTextHi')}</div>
              <div><input list="dl-exclTextUr" placeholder="Text (UR)" value={exc.textUr} onChange={(e) => set('exclusions', updateRow(editing.exclusions, i, { textUr: e.target.value }))} />{dl('exclTextUr')}</div>
              <button className="danger" onClick={() => set('exclusions', editing.exclusions.filter((_, j) => j !== i).map((x, j) => ({ ...x, order: j })))}>✕</button>
            </div>
          ))}
          <button className="secondary" onClick={() => set('exclusions', [...editing.exclusions, BLANK_EXCL(editing.exclusions.length)])}>Add exclusion</button>

          {error && <p style={{ color: 'var(--color-danger, #c00)', marginTop: 12 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="primary" onClick={save}>Save</button>
            <button className="secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
