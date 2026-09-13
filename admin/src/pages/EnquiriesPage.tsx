import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { CustomizeEnquiry, TicketEnquiry } from '../api/types';

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomizeEnquiry[]>([]);
  const [tickets, setTickets] = useState<TicketEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminApi.get<CustomizeEnquiry[]>('/enquiries'),
      adminApi.get<TicketEnquiry[]>('/ticket-enquiries'),
    ]).then(([e, t]) => { setEnquiries(e); setTickets(t); setLoading(false); });
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    await adminApi.delete(`/enquiries/${id}`);
    load();
  };

  const removeTicket = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    await adminApi.delete(`/ticket-enquiries/${id}`);
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

      <hr className="hr" />

      <h2 style={{ marginBottom: 16 }}>Air &amp; train ticket enquiries</h2>
      <p style={{ color: 'var(--t70)', marginBottom: 16 }}>
        Leads submitted from the Air tickets / Train tickets forms under Services.
      </p>
      <table>
        <thead><tr><th>Submitted</th><th>Kind</th><th>Name</th><th>Phone</th><th>From</th><th>To</th><th>Travel date</th><th>Pax</th><th>Class</th><th>Notes</th><th /></tr></thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>{t.kind === 'air' ? 'Air' : 'Train'}</td>
              <td>{t.name}</td>
              <td>{t.phone}</td>
              <td>{t.fromPlace}</td>
              <td>{t.toPlace}</td>
              <td>{new Date(t.travelDate).toLocaleDateString('en-GB')}</td>
              <td>{t.passengers}</td>
              <td>{t.classPref}{t.tatkal ? ' (Tatkal)' : ''}</td>
              <td>{t.notes ?? '—'}</td>
              <td><button className="danger" onClick={() => removeTicket(t.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {tickets.length === 0 && <p style={{ color: 'var(--t50)', marginTop: 12 }}>No ticket enquiries yet.</p>}
    </div>
  );
}
