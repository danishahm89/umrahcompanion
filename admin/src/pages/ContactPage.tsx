import { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import type { AppSettings, ContactInfo } from '../api/types';

export function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [officesText, setOfficesText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.get<ContactInfo>('/contact').then((c) => { setContact(c); setOfficesText(c.offices.join(', ')); });
    adminApi.get<AppSettings>('/settings').then(setSettings);
  }, []);

  const saveContact = async () => {
    if (!contact) return;
    await adminApi.put('/contact', { ...contact, offices: officesText.split(',').map((o) => o.trim()).filter(Boolean) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveSettings = async () => {
    if (!settings) return;
    await adminApi.put('/settings', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!contact || !settings) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ marginBottom: 16 }}>Contact &amp; links used by every enquiry button</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label>WhatsApp number</label><input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} /></div>
        <div><label>Call number</label><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
        <div><label>Website</label><input value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })} /></div>
        <div><label>Primary email</label><input value={contact.primaryEmail} onChange={(e) => setContact({ ...contact, primaryEmail: e.target.value })} /></div>
        <div><label>Secondary email</label><input value={contact.secondaryEmail} onChange={(e) => setContact({ ...contact, secondaryEmail: e.target.value })} /></div>
        <div><label>Offices (comma-separated)</label><input value={officesText} onChange={(e) => setOfficesText(e.target.value)} /></div>
      </div>
      <button className="primary" onClick={saveContact}>Save contact info</button>

      <hr className="hr" />

      <h2 style={{ marginBottom: 16 }}>App settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label>Company name</label><input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} /></div>
        <div><label>App name</label><input value={settings.appName} onChange={(e) => setSettings({ ...settings, appName: e.target.value })} /></div>
      </div>
      <button className="primary" onClick={saveSettings}>Save settings</button>

      {saved && <p style={{ color: 'var(--color-accent)', marginTop: 12 }}>Saved.</p>}
    </div>
  );
}
