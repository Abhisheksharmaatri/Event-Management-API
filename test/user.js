const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../app');

describe('User Login API', () => {
    it('should return success a message and have a status code of 200', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password1'
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message', 'User logged in successfully');
                expect(res.body).to.have.property('token');
                done();
            })
    });
    it('should return a 422 status code and error message when invalid email is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'invalid email',
                password: 'password1'
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Please enter a valid email');
                done();
            })
    });
    it('should return a 422 status code and error message when no email is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: '',
                password: 'password1'
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Please enter an email');
                done();
            })
    });
    it('should return a 422 status code and error message when invalid password is provides', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password'
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Incorrect Password');
                done();
            })
    });
    it('should return a 422 status code and error message when invalid user is provides', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email@mail.com',
                password: 'password'
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User not found');
                done();
            })
    });
});

describe('User Signup API', () => {
    it('should return an return a 200 status code and a success message valid user creation data is provided', (done) => {
        supertest(app)
            .post('/user/signup')
            .send({
                email: 'email@mail.com',
                password: 'password',
                name: 'name',
                admissionNumber: '1234567890',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User created successfully');
                //Delete the user created
                supertest(app)
                    .post('/user/login')
                    .send({
                        email: 'email@mail.com',
                        password: 'password'
                    })
                    .end((err, res) => {
                        if (err) return done(err);
                        supertest(app)
                            .delete('/user/delete-user')
                            .set('Authorization', 'Bearer ' + res.body.token)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);
                                done();
                            });
                    });
            });
    });
    it('should return a 422 status code and error message when invalid email is provided', (done) => {
        supertest(app)
            .post('/user/signup')
            .send({
                email: 'invalid email',
                password: 'password',
                name: 'name',
                admissionNumber: '1234567890',
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Please enter a valid email');
                done();
            });
    });
    it('should return a 422 status code and error message when no email is provided', (done) => {
        supertest(app)
            .post('/user/signup')
            .send({
                email: '',
                password: 'password',
                name: 'name',
                admissionNumber: '1234567890',
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Please enter an email');
                done();
            });
    });
    it('should return a 422 status code and error message when duplicate user is provided', (done) => {
        supertest(app)
            .post('/user/signup')
            .send({
                email: 'email7@mail.com',
                password: 'password',
                name: 'name',
                admissionNumber: '1234567890',
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User already exists');
                done();
            });
    });
})

// describe('User Verification API', () => {});

// describe('User Resend Verification API', () => {});

// describe('User Reset Password API', () => {});

// describe('User Change Password API', () => {});

describe('User Get Profile API', () => {
    it('should return a 200 status code and a success message when valid token is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password1'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                supertest(app)
                    .get('/user/get-user')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('message', 'User fetched successfully');
                        done();
                    });
            });
    });
    it('should return a 401 status code and error message when no token is provided', (done) => {
        supertest(app)
            .get('/user/get-user')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
    it('should return a 401 status code and error message when invalid token is provided', (done) => {
        supertest(app)
            .get('/user/get-user')
            .set('Authorization', 'Bearer ' + 'invalid token')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
});

describe('User Update Profile API', () => {
    it('should return a 200 status code and a success message when valid token is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password1'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                supertest(app)
                    .put('/user/update-user')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .send({
                        name: 'name',
                        admissionNumber: '1234567890'
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('message', 'User updated successfully');
                        done();
                    });
            });
    });
    it('should return a 401 status code and error message when no token is provided', (done) => {
        supertest(app)
            .put('/user/update-user')
            .send({
                name: 'name',
                admissionNumber: '1234567890'
            })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
    it('should return a 401 status code and error message when invalid token is provided', (done) => {
        supertest(app)
            .put('/user/update-user')
            .set('Authorization', 'Bearer ' + 'invalid token')
            .send({
                name: 'name',
                admissionNumber: '1234567890'
            })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
    it('should return a 422 status code and error message when invalid name is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password1'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                supertest(app)
                    .put('/user/update-user')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .send({
                        name: '',
                        admissionNumber: '1234567890'
                    })
                    .expect(422)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('message', 'Please enter a valid name');
                        done();
                    });
            });
    });
    it('should return a 422 status code and error message when invalid admission number is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password1'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                supertest(app)
                    .put('/user/update-user')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .send({
                        name: 'name',
                        admissionNumber: '123456789'
                    })
                    .expect(422)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('message', 'Please enter a valid admission number');
                        done();
                    });
            });
    });
});

describe('User Get User API', () => {
    it('should return a 200 status code and a success message when valid token is provided', (done) => {
        supertest(app)
            .post('/user/login')
            .send({
                email: 'email7@mail.com',
                password: 'password1'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                supertest(app)
                    .get('/user/get-user')
                    .set('Authorization', 'Bearer ' + res.body.token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('message', 'User fetched successfully');
                        done();
                    });
            });
    });
    it('should return a 401 status code and error message when no token is provided', (done) => {
        supertest(app)
            .get('/user/get-user')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
    it('should return a 401 status code and error message when invalid token is provided', (done) => {
        supertest(app)
            .get('/user/get-user')
            .set('Authorization', 'Bearer ' + 'invalid token')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
});

describe('User Delete User API', () => {
    it('should return a 200 status code and a success message when valid token is provided', (done) => {
        supertest(app)
            .post('/user/signup')
            .send({
                email: 'email@mail.com',
                password: 'password',
                name: 'name',
                admissionNumber: '1234567890',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                supertest(app)
                    .post('/user/login')
                    .send({
                        email: 'email@mail.com',
                        password: 'password'
                    })
                    .end((err, res) => {
                        if (err) return done(err);
                        supertest(app)
                            .delete('/user/delete-user')
                            .set('Authorization', 'Bearer ' + res.body.token)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);
                                expect(res.body).to.have.property('message', 'User deleted successfully');
                                done();
                            });
                    });
            });
    });
    it('should return a 401 status code and error message when no token is provided', (done) => {
        supertest(app)
            .delete('/user/delete-user')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
    it('should return a 401 status code and error message when invalid token is provided', (done) => {
        supertest(app)
            .delete('/user/delete-user')
            .set('Authorization', 'Bearer ' + 'invalid token')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Not authenticated');
                done();
            });
    });
});