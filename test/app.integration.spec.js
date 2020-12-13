const request = require('supertest');
const app = require('../app');
const connection = require('../connection')

describe('GET a bookmark', () => {
  const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
  beforeEach((done) => connection.query(
    'TRUNCATE bookmark', () => connection.query(
      'INSERT INTO bookmark SET ?', testBookmark, done
    )
  ));
  it("GET /bookmarks/:id where id doesn't exist in the database", (done) => {
    request(app)
    .get('/bookmarks/455644')
    .expect(404)
    .expect('Content-Type', /json/)
    .then(response => {
      expect(response.body).toEqual({error:'Bookmark not found'});
      done();
    })
  })
  it("GET /bookmarks/:id where id exist in the database", (done) => {
    request(app)
    .get('/bookmarks/1')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      expect(response.body).toEqual({
        id: expect.any(Number),
        ...testBookmark
      });
      done();
    })
  })
});

// describe('Test routes', () => {
//   beforeEach(done => connection.query('TRUNCATE bookmark', done));
//   it('GET / sends "Hello World" as json', (done) => {
//     request(app)
//       .get('/')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(response => {
//         const expected = { message: 'Hello World!'};
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });
//   it('POST /bookmarks - error (fields missing) ', (done) => {
//     request(app)
//       .post('/bookmarks')
//       .send({})
//       .expect(422)
//       .expect('Content-Type', /json/)
//       .then(response => {
//         const expected = {error: 'required field(s) missing'};
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });
//   it('POST /bookmarks - ok) ', (done) => {
//     request(app)
//       .post('/bookmarks')
//       .send({
//         url: "www.google.fr",
//         title: "google"
//       })
//       .expect(201)
//       .expect('Content-Type', /json/)
//       .then(response => {
//         const expected = {
//           id: 1,
//           url: "www.google.fr",
//           title: "google"
//         };
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });
// });
