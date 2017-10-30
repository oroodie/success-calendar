/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { DDP } from 'meteor/ddp-client'
import { Random } from 'meteor/random'
import { assert } from 'meteor/practicalmeteor:chai'
import { Fake } from 'meteor/anti:fake'
import { PublicationCollector } from 'meteor/johanbrook:publication-collector'
import { _ } from 'meteor/underscore'
import { Factory } from 'meteor/dburles:factory'
import { Activities } from '../../../api/activities/activities'
import { Days } from '../../../api/days/days'
import {
    insert,
    removeActivityMethod,
    updateActivity,
} from '../../../api/activities/methods'
import '../../../api/activities/factory'
import '../../../api/days/factory'



if (Meteor.isServer) {

    // get publications
    require('../../../api/activities/server/publications.js')

    describe('Activities', () => {

        describe('Factory', () => {
            it('Builds corectly from factory', () => {
                const activity = Factory.create('activities', { activityName: 'Test Name' })
                assert.typeOf(activity, 'Object')
                assert.typeOf(activity.lastCheckedOut, 'Date')
                assert.match(activity.activityName, /Test Name/)
            })
        })

        // Test Publications

        describe('Publications', () => {

            const userId = Random.id()

            const createActivity = (props = {}) => {
                Factory.create('activities', props)
            }

            // before the test, generate data
            before( () => {
                Activities.remove({})
                _.times(3, () => createActivity({ owner: userId }) )
                _.times(2, () => createActivity({ }) )
            })

            describe('activities.private', () => {
                it('Sends all owned activities.', function(done) {
                    const collector = new PublicationCollector({ userId })
                    collector.collect('activities.private', (collections) => {
                        assert.equal(collections.activities.length, 3)
                        done()
                    })
                })
            })
        })

        // Test Helpers
        // Test Methods (+ error cases)

        describe('Methods', () => {
            let userId,
                activityId,
                activityName_2 = 'Test activity name exists.'

            userId = Random.id()

            // Before each test
            beforeEach( () => {
                // clear
                Activities.remove({})
                Days.remove({})

                activityId = Factory.create('activities', { owner: userId })._id
                Factory.create('days', { activityId })

                Factory.create('activities', {
                    owner: userId,
                    activityName: activityName_2,
                })
            })

            describe('Remove Method', () => {
                // Test Remove
                it('Can delete own activity.', () => {
                    // Set up fake this
                    const invocation = { userId }
                    // Run method with 'this' set to fake invocation
                    removeActivityMethod._execute(invocation, { activityId })
                    // Verify
                    assert.equal(
                        Activities.find({ _id: activityId }).count(),
                        0
                    )
                })


                // Test Remove
                it('Does not delete a private activity if not authenticated.', () => {
                    // Try to remove
                    assert.throws( () => {
                        removeActivityMethod._execute(
                            {}/* this, no user */,
                            { activityId }
                        )
                    }, Meteor.Error, /api.activities.remove.accessDenied/)

                    // Confirm not removed
                    assert.equal(Activities.find({ owner: userId, _id: activityId }).count(), 1)
                })


                // Test Remove
                it('Does not delete a private activity you don\'t own.', () => {
                    // Try to remove
                    assert.throws( () => {
                        removeActivityMethod._execute(
                            { userId: Random.id() }/* this, random user */,
                            { activityId }
                        )
                    }, Meteor.Error, /api.activities.remove.accessDenied2/)

                    // Confirm not removed
                    assert.equal(Activities.find({ owner: userId, _id: activityId }).count(), 1)
                })
            })


            describe('Update Method', () => {
                // Test Update
                it(`Can update activity name and info,
                    but can not if another user tries to change,
                    not authenticated user, or activity name exists.`, () => {

                        const invocation = { userId }

                        updateActivity._execute(invocation, {
                            id: activityId,
                            activityName: 'New Name 1',
                            info: 'New Info 1',
                        })

                        assert.equal(Activities.findOne({ _id: activityId }).activityName, 'New Name 1')
                        assert.equal(Activities.findOne({ _id: activityId }).info, 'New Info 1')

                        // Throws if logged out user tries to change
                        assert.throws( () => {
                            updateActivity._execute({}/* this, no use */, {
                                id: activityId,
                                activityName: 'New Name 3',
                                info: 'New Info 3',
                            })
                        }, Meteor.Error, /api.activities.update.accessDenied/)

                        // Throws if another user tries to change
                        assert.throws( () => {
                            updateActivity._execute(
                                { userId: Random.id() }/* this, random use */,
                                {
                                    id: activityId,
                                    activityName: 'New Name 2',
                                    info: 'New Info 2',
                                }
                            )
                        }, Meteor.Error, /api.activities.update.accessDenied2/)

                        // Throws if activity name exists
                        assert.throws( () => {
                            updateActivity._execute(invocation, {
                                id: activityId,
                                activityName: activityName_2,
                                info: '',
                            })
                        }, Meteor.Error, /api.activities.update.activityNameExists/)

                        // Confirm not updated
                        assert.equal(Activities.findOne({ _id: activityId }).activityName, 'New Name 1')
                        assert.equal(Activities.findOne({ _id: activityId }).info, 'New Info 1')
                    })
            })


            describe('Rate Limit', () => {
                it('Does not allow more than 5 operations rapidly.', (done) => {

                    const connection = DDP.connect(Meteor.absoluteUrl() )

                    _.times(5, () => {
                        connection.call(
                            insert.name,
                            { activityName: Fake.word(), info: '' },
                            (/* errNotLoggedIn */) => {}
                        )
                    })

                    assert.throws( () => {
                        connection.call(
                            insert.name,
                            { activityName: Fake.word(), info: '' }
                        )
                    }, Meteor.Error, /too-many-requests/)

                    connection.disconnect()
                    done()
                })
            }) // End Test Rate Limit
        }) // End Methods
    }) // End Activities
}
