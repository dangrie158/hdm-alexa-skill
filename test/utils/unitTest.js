var Client = require('hdm-client');
var client = new Client();

var expect = require('chai').expect;
var sinon = require('sinon');

exports.testLectureResponse = function
    (query, expected, dataMock, sandbox, lecture, lectureFn, done) {
    'use strict';

    sandbox.stub(client, 'searchDetails')
        .callsArgWith(2, null, dataMock);

    lectureFn(client, query, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
};

exports.testOfficeResponse = function
    (lecturer, expected, dataMock, sandbox, office, done) {
    'use strict';

    sandbox.stub(client, 'searchDetails')
        .callsArgWith(2, null, dataMock);

    office(client, lecturer, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
};

exports.testMenuResponse = function
    (place, date, expected, dataMock, sandbox, menu, done) {
    'use strict';

    sandbox.stub(client, 'menu')
        .callsArgWith(0, null, dataMock);

    menu(client, place, date, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
};

exports.shouldCallOfficeClient = function(sandbox, office) {
    'use strict';
    var searchDetailsSpy, fnMatcher, expectation;
    fnMatcher = sinon.match.typeOf('function');
    searchDetailsSpy = sandbox.spy(client, 'searchDetails');
    office(client, 'Walter Kriha', function() {});
    expectation = searchDetailsSpy.calledWithExactly('person',
        'Walter Kriha', fnMatcher);
    expect(expectation).to.equal(true);
};

exports.shouldCallLectureClient = function(sandbox, lecture) {
    'use strict';
    var searchDetailsSpy, fnMatcher, expectation;
    fnMatcher = sinon.match.typeOf('function');
    searchDetailsSpy = sandbox.spy(client, 'searchDetails');
    lecture.ects(client, 'Machine-Learning', function() {});
    expectation = searchDetailsSpy
        .calledWithExactly('lecture', 'Machine-Learning', fnMatcher);
    expect(expectation).to.equal(true);
};

exports.shouldCallMenuClient = function(sandbox, menu) {
    'use strict';
    var menuSpy, fnMatcher, expectation;
    fnMatcher = sinon.match.typeOf('function');
    menuSpy = sandbox.spy(client, 'menu');
    menu(client, 'S-Bar', new Date('2016-11-08'), function() {});
    expectation = menuSpy.calledWithExactly(fnMatcher);
    expect(expectation).to.equal(true);
};

exports.shouldProvideOfficeError = function(sandbox, office, done) {
    'use strict';
    sandbox.stub(client, 'searchDetails')
        .callsArgWith(2, new Error('Test Message'), null);
    office(client, 'Walter Kriha', function(err) {
        expect(err.message).to.equal('Test Message');
        done();
    });
};

exports.shouldProvideMenuError = function(sandbox, menu, done) {
    'use strict';
    sandbox.stub(client, 'menu')
        .callsArgWith(0, new Error('Test Message'), null);
    menu(client, 'S-Bar', new Date('2016-11-08'), function(err) {
        expect(err.message).to.equal('Test Message');
        done();
    });
};

exports.shouldProvideLectureError = function(sandbox, lectureFn, done) {
    'use strict';
    sandbox.stub(client, 'searchDetails')
        .callsArgWith(2, new Error('Test Message'), null);
    lectureFn(client, 'Machine-Learning', function(err) {
        expect(err.message).to.equal('Test Message');
        done();
    });
};