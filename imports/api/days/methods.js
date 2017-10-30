import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'
import { check } from 'meteor/check'
import { Days } from './days'
import { Activities } from '../activities/activities'


export const insertDay = new ValidatedMethod({
    // name
    name: 'days.insert',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String, optional: true },
        date: { type: Date },
        done: { type: Boolean },
    }).validator(),
    // run
    run({ activityId, date, done }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.days.insert.accessDenied',
                'Must be logged in to manage activity days!'
            )
        }

        if (! activityId) {
            throw new Meteor.Error(
                'api.days.insert.activityIdRequired',
                'Activity Id is required!'
            )
        }

        check(activityId, String)
        check(done, Boolean)
        check(date, Date)

        // test activity belongs to the current user
        const noActivity = ! Activities.findOne({
            _id: activityId,
            owner: this.userId,
        })

        if (noActivity) {
            throw new Meteor.Error(
                'api.days.insert.accessDenied2',
                'Could not be found the provided activity for current user!'
            )
        }

        const day = Days.findOne({ activityId, date })

        if (day) {
            throw new Meteor.Error(
                'api.days.insert.dateExists',
                'Activity date exists!'
            )
        }

        return Days.insert({ activityId, date, done })
    },
})


export const insertDayData = new ValidatedMethod({
    // name
    name: 'daysData.insert',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String },
        date: { type: Date },
        done: { type: Boolean },
        place: { type: String },
        info: { type: String },
        duration: { type: String },
    }).validator(),
    // run
    run({ activityId, date, done, place, info, duration }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.days.insert.accessDenied',
                'Must be logged in to add activity days!'
            )
        }

        if (! activityId) {
            throw new Meteor.Error(
                'api.days.insert.activityIdRequired',
                'Activity Id is required!'
            )
        }

        check(activityId, String)
        check(done, Boolean)
        check(place, String)
        check(info, String)
        check(duration, String)
        check(date, Date)

        // test activity belongs to the current user
        const noActivity = ! Activities.findOne({
            _id: activityId,
            owner: this.userId,
        })

        if (noActivity) {
            throw new Meteor.Error(
                'api.days.insert.activityNotFound',
                'Could not be found the provided activity id for current user!'
            )
        }

        const day = !! Days.findOne({ activityId, date })

        if (day) {
            throw new Meteor.Error(
                'api.days.insert.dateExists',
                'Activity date exists!'
            )
        }

        return Days.insert({
            activityId, date, done, place, info, duration,
        })
    },
})


export const updateDay = new ValidatedMethod({
    // name
    name: 'days.update',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String, optional: true },
        date: { type: Date },
        done: { type: Boolean },
    }).validator(),
    // run
    run({ activityId, date, done }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.days.update.accessDenied',
                'Must be logged in to manage activity days!'
            )
        }

        if (! activityId) {
            throw new Meteor.Error(
                'api.days.update.activityIdRequired',
                'Activity Id is required!'
            )
        }

        check(activityId, String)
        check(done, Boolean)
        check(date, Date)

        return Days.update(
            { activityId, date },
            { $set: { done } }
        )
    },
})


export const updateDayData = new ValidatedMethod({
    // name
    name: 'daysData.update',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String },
        date: { type: Date },
        done: { type: Boolean },
        place: { type: String },
        info: { type: String },
        duration: { type: String },
    }).validator(),
    // run
    run({ activityId, date, done, place, info, duration }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.days.updateData.accessDenied',
                'Must be logged in to add activity days!'
            )
        }

        check(activityId, String)
        check(done, Boolean)
        check(place, String)
        check(info, String)
        check(duration, String)
        check(date, Date)


        const noDay = ! Days.findOne({ activityId, date })
        if (noDay) {
            throw new Meteor.Error(
                'api.days.updateData.noDateFound',
                'No date found for update!'
            )
        }

        return Days.update(
            { activityId, date },
            { $set: { done, place, info, duration } }
        )
    },
})


export const removeDay = new ValidatedMethod({
    // name
    name: 'days.remove',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String, optional: true },
        date: { type: Date },
    }).validator(),
    // run
    run({ activityId, date }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.days.remove.accessDenied',
                'Must be logged in to manage activity days!'
            )
        }

        if (! activityId) {
            throw new Meteor.Error(
                'api.days.remove.activityIdRequired',
                'Activity Id is required!'
            )
        }

        check(activityId, String)
        check(date, Date)

        const noActivity = ! Activities.findOne({
            _id: activityId,
            owner: this.userId,
        })

        if (noActivity) {
            throw new Meteor.Error(
                'api.days.remove.accessDenied2',
                'Do not have right to remove this activity date!'
            )
        }

        return Days.remove({ activityId, date })
    },
})


if (Meteor.isServer) {

    const METHODS_LIST = _.pluck([
        insertDay,
        insertDayData,
        updateDay,
        updateDayData,
        removeDay,
    ], 'name')

    // Limit operations to 5 per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(METHODS_LIST, name)
        },
        // Rate limit per connection ID
        connectionId() { return true },
    }, 5, 1000)
}
