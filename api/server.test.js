const request = require('supertest')
const server = require('./server');
const db = require('../data/dbConfig');

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy()
})

test('sanity test', () => {
  expect(true).toBe(true)
})

describe('[POST] /api/auth/register', () => {
  test('responds with 201 CREATED with valid username and password', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'testU1', password: 'testP1'})
      expect(res.status).toBe(201)
  })
  test('responds with new user when successful', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'testU1', password: 'testP1'})
      expect(res.body.username).toBe('testU1')
      expect(res.body.password).not.toBe(undefined || null || 'testP1')
      expect(res.body.id).toBe(1)
  })
  test('fails and responds with correct message when `username` or `password` are missing', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ password: 'testP1'})
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('username and password required')

    res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'testU1'})
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('username and password required')

    res = await request(server)
      .post('/api/auth/register')
      .send({})
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('username and password required')
  })
  test('fails responds with correct message when `username` is taken', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'testU1', password: 'testP1'})
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'testU1', password: 'testP1'})
      expect(res.status).toBe(422)
      expect(res.body.message).toBe('username taken')
  })
})
