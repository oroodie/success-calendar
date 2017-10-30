/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { assert } from 'meteor/practicalmeteor:chai'
import { _ } from 'meteor/underscore'
import { Factory } from 'meteor/dburles:factory'
import { PublicationCollector } from 'meteor/johanbrook:publication-collector'
import { Days } from '../../../api/days/days'
import { Activities } from '../../../api/activities/activities'
import { insertDay } from '../../../api/days/methods'
import '../../../api/activities/factory'
import '../../../api/days/factory'


if (Meteor.isServer) {

    // get publications
    require('../../../api/days/server/publications.js');

    describe('Days', () => {

        describe('Factory', () => {
            it('Builds correctly from factory', () => {
                const day = Factory.create('days')
                assert.typeOf(day, 'object')
                assert.typeOf(day.date, 'Date')
                assert.equal(day.done, true)
            })
        })

        // Test Publications

        describe('Days publications', () => {

            let userId,
                activity,
                activityId

            const createDays = (props = {}) => {
                Factory.create('days', props)
            }

            before( () => {
                Days.remove({})
                userId = Random.id()
                activity = Factory.create('activities', { owner: userId })
                activityId = activity._id

                _.times(3, () => createDays({ activityId }) )
                _.times(2, () => createDays({ }) )
            })


            describe('days.private', () => {

                it('Sends all owned activity days.', function(done) {

                    const collector = new PublicationCollector({ userId })
                    collector.collect('days.private', activityId, (collections) => {
                        assert.equal(collections.days.length, 3)
                        done()
                    })
                })

                it('Does not send activities you don\'t own.', (done) => {

                    const collector = new PublicationCollector({ userId: Random.id() })
                    collector.collect('days.private', activityId, (collections) => {
                        assert.typeOf(collections.days, 'undefined')
                        done()
                    })
                })

                it('Does not send activities if you\'re not authenticated.', (done) => {

                    const collector = new PublicationCollector({})
                    collector.collect('days.private', activityId, (collections) => {
                        assert.typeOf(collections.days, 'undefined')
                        done()
                    })
                })
            })
        }) // End Test Pubplications

        // Test Methods
        describe('Methods', () => {

            let userId,
                activityId

            const date_1 = new Date(2017, 0, 1), // Date in the past
                date_2 = new Date(2017, 0, 2),
                done = true

            beforeEach( () => {
                // Clear
                Activities.remove({})
                Days.remove({})

                // Generate an user id
                userId = Random.id()

                // Create activities and days
                activityId = Factory.create('activities', { owner: userId })._id
                Factory.create('days', { activityId, date: date_1 })
                Factory.create('days', { activityId, date: date_2 })

            })

            describe('insertDay', () => {

                it('Inserts activity day, but does not if you don\'t have permission.', () => {

                    const date = new Date(2017, 0, 3)

                    insertDay._execute({ userId }, { activityId, date, done })
                    assert.equal(Days.find({ activityId }).count(), 3)

                    // try to insert for other user activity

                    assert.throws( () => {
                        insertDay._execute(
                            { userId: Random.id() }, /* Random user */
                            { activityId, date, done }
                        )
                    }, Meteor.Error, /api.days.insert.accessDenied2/)

                    // try to insert not being authenticated

                    assert.throws( () => {
                        insertDay._execute(
                            { }, /* No user */
                            { activityId, date, done }
                        )
                    }, Meteor.Error, /api.days.insert.accessDenied/)
                })

                it('Does not insert equal date records for the same activity.', () => {

                    const date = new Date(2017, 0, 3)

                    insertDay._execute({ userId }, { activityId, date, done })
                    assert.equal(Days.find({ activityId }).count(), 3)

                    // try to insert again
                    assert.throws( () => {
                        insertDay._execute(
                            { userId },
                            { activityId, date, done }
                        )
                    }, Meteor.Error, /api.days.insert.dateExists/)
                })

            }) // End insert Day
        }) // End Test Methods
    }) // End Test Days
}
