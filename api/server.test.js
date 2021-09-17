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
  test('fails and responds with correct message when `username` is taken', async () => {
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

describe('[POST] /api/auth/login', () => {
  test('responds with 200 with valid username and password', async () => {
    /* Since we cannot change the knex file I cannot seed data for a preregistered user - thus I must first register a user here before testing successful login*/
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'testU1', password: 'testP1'})

      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'testU1', password: 'testP1'})
      expect(res.status).toBe(200)
  })
  test('responds with correct object when login successful', async () => {
    /* Since we cannot change the knex file I cannot seed data for a preregistered user - thus I must first register a user here before testing successful login*/
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'testU1', password: 'testP1'})

      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'testU1', password: 'testP1'})
      expect(res.body.message).toBe('welcome, testU1')
      expect(res.body.token).not.toBe(undefined || null || 'testP1')
  })
  test('fails and responds with correct message when `username` or `password` are missing', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ password: 'testP1'})
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('username and password required')

    res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testU1'})
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('username and password required')

    res = await request(server)
      .post('/api/auth/login')
      .send({})
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('username and password required')
  })
  test('fails and responds with correct message when `username` does not exist in the db or `password` is incorrect', async () => {
    /* Since we cannot change the knex file I cannot seed data for a preregistered user - thus I must first register a user here before testing successful login*/
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'testU1', password: 'testP1'})

    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testU1', password: 'wrongPassword'})
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('invalid credentials')
    
    res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'invalidUsername', password: 'testP1'})
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('invalid credentials')
  })
})