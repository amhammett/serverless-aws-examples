const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should;

chai.use(chaiHttp);

const server = process.env.API_URL || 'localhost:3000';

describe('Requirements', function() {
    it('should define env', function(done) {
        should(server)
        server.should.to.not.be.a('null');
        done();
    });
})

var test_email = "mocha@example.test"
var test_record;

describe('Records API', function() {
    it('Should list all records on /record GET', function(done) {
        this.timeout(15000);
        chai.request(server)
            .get('/record')
            .end(function(error, response, body) {
                should(response);
                response.should.have.status(200);
                response.body.should.be.a('array');
                done(error);
            })
    });
    it('Should not create a single record with incomplete data on /record POST', function(done) {
        chai.request(server)
            .post('/record')
            .send({})
            .end(function(error, response, body) {
                should(response);
                response.should.have.status(400);
                error.should.to.not.be.a('null')
                done();
            })
    });
    it('Should create a single record on /record POST', function(done) {
        chai.request(server)
            .post('/record')
            .send({"id": test_email, "data": "example data"})
            .end(function(error, response, body) {
                should(response);
                response.should.have.status(200);
                test_record = response.body.uuid
                done(error);
            })
    });
    it('Should list a single records on /record/<id> GET', function(done) {
        this.timeout(15000);
        chai.request(server)
            .get('/record/'+test_record)
            .end(function(error, response, body) {
                should(response);
                response.should.have.status(200);
                done(error);
            })
    });
    it('Should update a single record on /record/<id> PUT', function(done) {
        this.timeout(15000);
        chai.request(server)
            .put('/record/'+test_record)
            .send({"id": test_email, "data": "example data"})
            .end(function(error, response, body) {
                should(response);
                response.should.have.status(200);
                done(error);
            })
    });
    it('Should delete a single record on /record/<id> DELETE', function(done) {
        this.timeout(15000);
        chai.request(server)
            .del('/record/'+test_record)
            .end(function(error, response, body) {
                should(response);
                response.should.have.status(200);
                done(error);
            })
    });
    it('Should not find deleted record on /record/<id> GET', function(done) {
        this.timeout(15000);
        chai.request(server)
            .get('/record/'+test_record)
            .end(function(error, response, body) {
                should(response);
                response.body.should.be.equal('')
                response.should.have.status(200);
                done(error);
            })
    });
})
