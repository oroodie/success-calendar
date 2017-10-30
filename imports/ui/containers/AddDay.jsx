import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import { setLastCheckedOut } from '../../api/activities/methods.js'
import { displayError } from '../helpers/errors'
import { Activities } from '../../api/activities/activities.js'
import { Days } from '../../api/days/days.js'
import { insertDayData,
    updateDayData
} from '../../api/days/methods.js'
import AddDayPage from '../pages/AddDayPage.jsx'


export default withTracker( () => {

    Session.set('CalendarApp_Title', 'Set/Edit Days Info')

    let selectedDate = {}

    const
        loading = Session.get('CalendarApp_loading') ? true : false,
        activities = Activities.find(
            {},
            {sort: {lastCheckedOut: -1}}
        ).fetch()


    // Methods
    const Methods = {

        addDay({activityId, date, done, place, info, duration}) {
            return insertDayData.call(
                { activityId, date, done, place, info, duration },
                (err, crudRes) => {
                    displayError(err, crudRes, 'Date added!')
                })
        },

        updateDay({activityId, date, done, place, info, duration}) {
            return updateDayData.call(
                { activityId, date, done, place, info, duration },
                (err, crudRes) => {
                    displayError(err, crudRes, 'Date updated!')
                })
        },

        getActivityDay(activityId, date) {

            return Days.findOne({ activityId, date })
        },

        loadActivity(activityId) {
            setLastCheckedOut.call({activityId},
                (err, crudRes) => {
                    displayError(err, crudRes, 'You may ADD / EDIT days!')
                }
            )
            Meteor.subscribe('days.private', activityId)
        },

        setErrSuccessMsg({ errMsg, successMsg }) {
            if (errMsg) {
                Session.set('errorMsg', errMsg)
            }
            if (successMsg) {
                Session.set('successMsg', successMsg)
            }
        },
    }


    return {
        ...Methods,
        activities,
        selectedDate,
        loading,
        user: !! Meteor.user(),
        successMsgDateFound: 'Found date in calendar. You may EDIT.',
    }

})(AddDayPage)
