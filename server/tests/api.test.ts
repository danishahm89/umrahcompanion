import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('public API', () => {
  it('lists live packages', async () => {
    const res = await request(app).get('/api/packages');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    for (const pkg of res.body) expect(pkg.live).toBe(true);
  });

  it('returns faq, duas and news', async () => {
    const faq = await request(app).get('/api/faq');
    expect(faq.status).toBe(200);
    expect(faq.body.length).toBe(6);

    const duas = await request(app).get('/api/duas');
    expect(duas.status).toBe(200);
    expect(duas.body.length).toBe(4);
    expect(duas.body[0].duas.length).toBe(2);

    const news = await request(app).get('/api/news');
    expect(news.status).toBe(200);
    for (const item of news.body) expect(item.approved).toBe(true);
  });

  it('rejects a malformed enquiry', async () => {
    const res = await request(app).post('/api/enquiries').send({ city: 'Delhi' });
    expect(res.status).toBe(400);
  });

  it('accepts a valid enquiry', async () => {
    const res = await request(app).post('/api/enquiries').send({
      city: 'Delhi', pax: 2, nights: 10, month: 'Nov 2026', hotel: '4★', notes: 'Elders in group',
    });
    expect(res.status).toBe(201);
    expect(res.body.city).toBe('Delhi');
  });
});

describe('admin API', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/admin/packages');
    expect(res.status).toBe(401);
  });

  it('logs in and performs an authenticated CRUD round-trip', async () => {
    const login = await request(app).post('/api/admin/login').send({
      email: 'admin@alzakwaantours.in', password: 'umrah-admin-2026',
    });
    expect(login.status).toBe(200);
    const token = login.body.token as string;

    const list = await request(app).get('/api/admin/faq').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    const count = list.body.length;

    const created = await request(app).post('/api/admin/faq').set('Authorization', `Bearer ${token}`).send({
      order: count, questionEn: 'Test?', questionHi: 'Test?', questionUr: 'Test?',
      answerEn: 'Yes.', answerHi: 'Yes.', answerUr: 'Yes.',
    });
    expect(created.status).toBe(201);

    const del = await request(app).delete(`/api/admin/faq/${created.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  it('preserves itinerary and inclusions across a package update', async () => {
    const login = await request(app).post('/api/admin/login').send({
      email: 'admin@alzakwaantours.in', password: 'umrah-admin-2026',
    });
    const token = login.body.token as string;

    const list = await request(app).get('/api/admin/packages').set('Authorization', `Bearer ${token}`);
    const pkg = list.body[0];
    expect(pkg.itinerary.length).toBeGreaterThan(0);
    expect(pkg.inclusions.length).toBeGreaterThan(0);

    const updated = await request(app)
      .put(`/api/admin/packages/${pkg.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...pkg, priceInr: pkg.priceInr + 1 });

    expect(updated.status).toBe(200);
    expect(updated.body.priceInr).toBe(pkg.priceInr + 1);
    expect(updated.body.itinerary.length).toBe(pkg.itinerary.length);
    expect(updated.body.inclusions.length).toBe(pkg.inclusions.length);
  });
});
