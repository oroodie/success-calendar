import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'
import { check } from 'meteor/check'
import { Activities } from './activities.js'
import { Days } from '../days/days'


export const insert = new ValidatedMethod({
    // name
    name: 'activities.insert',
    // validate
    validate: new SimpleSchema({
        activityName: { type: String },
        info: { type: String },
    }).validator(),
    // run
    run({ activityName, info }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.activities.insert.accessDenied',
                'Must be logged in to add activity!'
            )
        }

        check(activityName, String)
        check(info, String)

        const activity = !! Activities.findOne({
            activityName,
            owner: this.userId,
        })

        if (activity) {
            throw new Meteor.Error(
                'api.activities.insert.activityNameExists',
                'Activity exists, please use, remove, pick different name!'
            )
        }

        return Activities.insert({
            activityName,
            info,
            lastCheckedOut: new Date(),
            owner: this.userId,
        })
    },
})


export const updateActivity = new ValidatedMethod({
    // name
    name: 'activities.update',
    // validate
    validate: new SimpleSchema({
        id: { type: String, regEx: SimpleSchema.RegEx.Id },
        activityName: { type: String },
        info: { type: String },
    }).validator(),
    // run
    run({ id, activityName, info }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.activities.update.accessDenied',
                'Must be logged in to add activity!'
            )
        }

        check(id, String)
        check(activityName, String)
        check(info, String)

        // check owner
        const notOwnActivity = ! Activities.findOne({
            owner: this.userId,
            _id: id,
        })

        if (notOwnActivity) {
            throw new Meteor.Error(
                'api.activities.update.accessDenied2',
                'Do not have permission to change this activity!'
            )
        }

        // check activity name exists
        const activity = !! Activities.findOne({
            activityName,
            owner: this.userId,
            _id: { $ne: id },
        })

        if (activity) {
            throw new Meteor.Error(
                'api.activities.update.activityNameExists',
                'Activity exists, please use, remove, pick other name!'
            )
        }

        return Activities.update(
            { _id: id },
            { $set: { activityName, info } }
        )
    },
})


export const setLastCheckedOut = new ValidatedMethod({
    // name
    name: 'activities.setLastCheckedOut',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String, regEx: SimpleSchema.RegEx.Id },
    }).validator(),
    // run
    run({ activityId }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.activities.setLastCheckedOut.accessDenied',
                'Must be logged in to update activity!'
            )
        }

        check(activityId, String)

        const noActivity = ! Activities.findOne({
            _id: activityId,
            owner: this.userId,
        })

        if (noActivity) {
            throw new Meteor.Error(
                'api.activities.setLastCheckedOut.activity-not-found',
                'Activity not found!'
            )
        }

        return Activities.update({
            _id: activityId,
            owner: this.userId,
        }, {
            $set: { lastCheckedOut: new Date() },
        })
    },
})


export const setListDaysBy = new ValidatedMethod({
    // name
    name: 'activities.setListDaysBy',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String },
        listDaysBy: { type: String, regEx: /^MONTH|YEAR|ALL$/ },
    }).validator(),
    // run
    run({ activityId, listDaysBy }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.activities.setListDaysBy.accessDenied',
                'Must be logged in to update activity!'
            )
        }

        check(activityId, String)
        check(listDaysBy, String)

        const NOactivity = ! Activities.findOne({
            _id: activityId,
            owner: this.userId,
        })

        if (NOactivity) {
            throw new Meteor.Error(
                'api.activities.setListDaysBy.activityNotFound',
                'Activity not found!'
            )
        }

        return Activities.update({
            _id: activityId,
            owner: this.userId,
        }, {
            $set: { listDaysBy },
        })
    },
})


export const removeActivityMethod = new ValidatedMethod({
    // name
    name: 'activities.remove',
    // validate
    validate: new SimpleSchema({
        activityId: { type: String },
    }).validator(),
    // run
    run({ activityId }) {

        if (! this.userId) {
            throw new Meteor.Error(
                'api.activities.remove.accessDenied',
                'Must be logged in to manage activities!'
            )
        }

        check(activityId, String)

        const NOactivity = ! Activities.findOne({
            _id: activityId,
            owner: this.userId,
        })

        if (NOactivity) {
            throw new Meteor.Error(
                'api.activities.remove.accessDenied2',
                'Do not have right to remove this activity!'
            )
        }

        const removed = Activities.remove({ _id: activityId, owner: this.userId })

        if (removed) {
            Days.remove({ activityId })
        }

        return removed
    },
})


if (Meteor.isServer) {

    const METHODS_LIST = _.pluck([
        insert,
        updateActivity,
        setLastCheckedOut,
        setListDaysBy,
        removeActivityMethod,
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
