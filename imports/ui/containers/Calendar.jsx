import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import { Days } from '../../api/days/days.js'
import { Activities } from '../../api/activities/activities.js'
import { insertDay, updateDay, removeDay } from '../../api/days/methods.js'
import { displayError } from '../helpers/errors'
import { getViewDate,
    setViewDate } from '../helpers/activityViewDate'
import CalendarPage from '../pages/CalendarPage.jsx'
import Day from '../components/Day.jsx'


const Methods = {

    addDay({activityId, date, done}) {
        insertDay.call(
            {activityId, date, done},
            (err, crudRes) => {
                displayError(err, crudRes, 'Date added!')
            })
    },
    updateDay({activityId, date, done}) {
        updateDay.call(
            {activityId, date, done},
            (err, crudRes) => {
                displayError(err, crudRes, 'Set activity – not done!')
            })
    },
    removeDay({activityId, date}) {
        removeDay.call(
            {activityId, date},
            (err, crudRes) => {
                displayError(err, crudRes, 'Date removed!')
            })
    },
}


export default withTracker( () => {

    // There are fetched from Server only Activities for the current user
    const
        activity = Activities.findOne({}, {sort: {lastCheckedOut: -1}}) || {},
        loading = Session.get('CalendarApp_loading') ? true : false

    Session.set(
        'CalendarApp_Title',
        (activity && activity.activityName)
            ? activity.activityName
            : 'Success Calendar'
    )


    return {
        viewDate: getViewDate(activity._id),
        setViewDate: setViewDate,
        HelpInfo: false,
        activity,
        loading,
        Day,
        ...Methods
    }

})(CalendarPage)
