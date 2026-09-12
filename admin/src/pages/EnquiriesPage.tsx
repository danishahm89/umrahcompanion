import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { CustomizeEnquiry } from '../api/types';

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomizeEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.get<CustomizeEnquiry[]>('/enquiries').then((data) => { setEnquiries(data); setLoading(false); });
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    await adminApi.delete(`/enquiries/${id}`);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Customize-package enquiries</h2>
      <p style={{ color: 'var(--t70)', marginBottom: 16 }}>
        Leads submitted from the app's Customize screen, logged when the pilgrim taps &ldquo;Send on WhatsApp&rdquo;.
      </p>
      <table>
        <thead><tr><th>Submitted</th><th>City</th><th>Travellers</th><th>Nights</th><th>Month</th><th>Hotel</th><th>Notes</th><th /></tr></thead>
        <tbody>
          {enquiries.map((e) => (
            <tr key={e.id}>
              <td>{new Date(e.createdAt).toLocaleString()}</td>
              <td>{e.city}</td>
              <td>{e.pax}</td>
              <td>{e.nights}</td>
              <td>{e.month}</td>
              <td>{e.hotel}</td>
              <td>{e.notes ?? '—'}</td>
              <td><button className="danger" onClick={() => remove(e.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {enquiries.length === 0 && <p style={{ color: 'var(--t50)', marginTop: 12 }}>No enquiries yet.</p>}
    </div>
  );
}
