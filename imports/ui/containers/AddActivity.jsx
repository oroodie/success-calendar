import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import { setError } from '../helpers/errors'
import { Activities } from '../../api/activities/activities.js'
import { insert, updateActivity } from '../../api/activities/methods.js'
import { displayError } from '../helpers/errors'
import AddActivityPage from '../pages/AddActivityPage.jsx'


const Methods = {

    addActivity({ activityName, info }) {
        return insert.call(
            { activityName, info },
            (err, crudRes) => {
                displayError(err, crudRes, 'New activity added!')
            })
    },
    update({ id, activityName, info }) {
        return updateActivity.call(
            { id, activityName, info },
            (err, crudRes) => {
                displayError(err, crudRes, 'Activity updated!')
            })
    },
    addSuccessMsg() {},
}


export default withTracker( ({ match }) => {

    let activityId = match.params.activityId // sanityze

    const activity = activityId ?
        Activities.findOne({_id: activityId}) : undefined

    activityId = activity ? activityId : null
    const activityName = activity ? activity.activityName : null

    Session.set('CalendarApp_Title', activityName || 'Add Activity')

    return {
        activity,
        activityId,
        ...Methods,
        user: !! Meteor.user(),
    }

})(AddActivityPage)
