import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { check } from 'meteor/check'

import { Days } from '../days/days.js'

export const Activities = new Mongo.Collection('activities')


// Deny all client-side updates
Activities.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
})


Activities.schema = new SimpleSchema({
    activityName: {
        type: String,
        max: 100,
    },
    info: {
        type: String,
        max: 1000,
        optional: true,
    },
    lastCheckedOut: {
        type: Date,
        defaultValue: new Date,
        optional: true,
    },
    owner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    listDaysBy: {
        type: String,
        regEx: /^MONTH|YEAR|ALL$/,
        defaultValue: 'MONTH',
    },
})


Activities.publicFields = {
    activityName: 1,
    info: 1,
    owner: 1,
    lastCheckedOut: 1,
    listDaysBy: 1,
}


// Attach Schema
Activities.attachSchema(Activities.schema)

// DB constraints for data integrity
if (Meteor.isServer) {
    Activities
        .rawCollection()
        .createIndex({ activityName: 1, owner: 1 }, { unique: true })
}


// Helpers
Activities.helpers({

    getDays(startDate, endDate, activityId) {
        // check ownerId - from server got only
        // activities/days for the current user
        check(startDate, Date)
        check(endDate, Date)
        check(activityId, String)

        return Days.find(
            {
                activityId,
                date: { $gte: startDate, $lte: endDate },
            }, {
                sort: { date: -1 },
            }
        ).fetch()
    },

    getAllDays(activityId) {
        check(activityId, String)
        return Days.find({ activityId }, { sort: { date: -1 } }).fetch()
    },
})
