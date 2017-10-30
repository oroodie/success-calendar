import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Days = new Mongo.Collection('days')


// Deny all client-side updates
Days.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});


Days.publicFields = {
    activityId: 1,
    date: 1,
    place: 1,
    info: 1,
    duration: 1,
    done: 1
}


Days.schema = new SimpleSchema({
    activityId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: false,
    },
    date: {
        type: Date,
        defaultValue: new Date,
        optional: false,
    },
    done: {
        type: Boolean,
        defaultValue: true,
        optional: false,
    },
    place: {
        type: String,
        max: 200,
        optional: true,
    },
    info: {
        type: String,
        max: 500,
        optional: true,
    },
    duration: {
        type: String,
        max: 50,
        optional: true,
    },
})


Days.attachSchema(Days.schema)

if (Meteor.isServer) {
    Days.rawCollection().createIndex({ activityId: 1, date: 1 }, { unique: true })
}
