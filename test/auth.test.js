const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const {
  connectToDb,
  disconnectFromDb
} = require('./config');

const User = require('../models/user');
const {
        registerCreate,
       } = require('../controllers/auth_controller');

const app = require('../app.js'); 


before((done) => {
  // Connect to the database (same as we do in app.js)
  connectToDb(done);
});

// Disconnect from the test database after all tests run. Call done to indicate complete.
after((done) => {
  disconnectFromDb(done);
})

beforeEach(async function () {
    //await tearDownData().exec();
    let user = await setupData();
    UserId = user._id;
    //console.log(user)
});

//REGISTER USER TEST
describe('POST /user/register', function () {
  let data = {
     	name: 'Test Name',
     	email: 'hello@test.com',
      password: '123456',
      profile: 'test profile'
     	}
  it('respond with 200 and matching email', function (done) {
      request(app)
          .post('/user/register')
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(function(res) {
            res.body.email = "hello@test.com";
          })
          .end(function(err, res) {
            //console.log(res);
            if (err) return done(err);
            //console.log(res.body);
            done();
          }) 
  });
});


// describe('GET /user/logout', function() {
//   it('responds with json', function(done) {
//     request(app)
//       .get('/user/logout')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end(function(err, res) {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

//LOGIN USER TEST
describe('POST /user/login', function() {
  it('Test Login Route, get 200 and match email', function(done) {
    request(app)
      .post('/user/login')
      .send({
            email: "tester@test.com", 
            password: "123456"
          })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      // .expect(function(res) {
      //   console.log(res);
      //   res.body.email = "tester@test.com";
      // })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

//FIND USER TEST
describe('Finding a user', function() {
  it('find a user by username', function(done) {
    User.findOne({ email: 'tester@test.com' }, function(err, user) {
      expect(user.email).toBe('tester@test.com');
      console.log("   email: ", user.email)
      done();
    });
  });
 });

 //EDIT ACCOUNT SETTINGS TEST
describe('PATCH /user/:name/account-settings', function() {
it('Test update account settings route', async () => {
  //console.log(UserId)
    let user = await User.findOne({ email: 'tester@test.com' }, function (err, user) {
      //
    });
    const data = {
      email: "updatetest@test.com", 
      password: "abcdef"
    }
   
	request(app)
		.patch("/user/"+ user.name +"/account-settings")
      .send(data)
      .expect(200)
      .then(response => {
        // Check the response
        expect(response.body._id).toBe(post.id)
        expect(response.body.email).toBe(data.email)
        expect(response.body.password).toBe(data.password)

        // Check the data in the database
        const newUpdateUser =  User.findOne({ _id: response.body._id })
        expect(newUpdateUser).toBeTruthy()
        expect(newnewUpdateUserPost.email).toBe(data.email)
        expect(newUpdateUser.password).toBe(data.password)
      })
})
});

 function setupData() {
  let date = Date.now();
  let testUser = {};
  testUser.name = 'Test User 1';
  testUser.email = 'tester@test.com';
  testUser.password = '123456';
  testUser.create_date = date;
  testUser.modified_date = date;
  return User.create(testUser);
}


afterEach(async function () {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.remove()
  }
})


// function tearDownData() {
//   return User.deleteMany()
// }

// afterEach((done) => {
//   tearDownData().exec(() => done());
// });


