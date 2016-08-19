// 'use strict';
//
// const models = require('../../models/');
// const should = require('should');
// const dotenv = require('dotenv').config({ silent: true });
//
// describe('Location Model', () => {
//   let mockLocation, createLocation;
//   beforeEach((done) => {
//     mockLocation = {
//       id: 1,
//       name: 'Brazil',
//     };
//
//     models.locations.destroy({ where: {} }).then(() => {
//       createLocation = models.locations.create(mockLocation);
//       done();
//     });
//   });
//
//   afterEach((done) => {
//     models.locations.destroy({ where: {} }).then(() => {
//       done();
//     });
//   });
//
//   it('should create a location', (done) => {
//     createLocation.then(function (location) {
//       should.exist(location);
//
//       location.name.should.equal(mockLocation.name);
//
//       done();
//     });
//   });
//
//   it('should be able to find a location', (done) => {
//     createLocation.then(function (createdLocation) {
//       models.locations.findOne({
//         where: {
//           id: createdLocation.id,
//         },
//       }).then(function (location) {
//         should.exist(location);
//
//         location.id.should.equal(createdLocation.id);
//
//         done();
//       });
//     });
//   });
//
//   it('should be able to update a location', (done) => {
//     createLocation.then(function (location) {
//       const new_name = 'New Test Location';
//
//       location.name = new_name;
//       location.save().then(function (location) {
//         should.exist(location);
//         location.name.should.not.equal(mockLocation.name);
//         location.name.should.equal(new_name);
//
//         done();
//       });
//     });
//   });
//
//   it('should be able to delete a location', (done) => {
//     createLocation.then(function (location) {
//       location.destroy().then(() => {
//         models.locations.findOne({
//           where: {
//             id: location.id,
//           },
//         }).then(function (location) {
//           should.not.exist(location);
//
//           done();
//         });
//       });
//     });
//   });
// });
