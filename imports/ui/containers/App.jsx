import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import { Activities } from '../../api/activities/activities.js'
import AppLayout from '../layouts/AppLayout.jsx'


export default withTracker( () => {

    const activitiesHandle = Meteor.subscribe('activities.private')

    const loadingActivities = ! (activitiesHandle.ready() )

    const activity = Activities.findOne({}, {sort: {lastCheckedOut: -1}})

    // if do have activity, will go load days
    let loadingDays = !! activity

    if (activity) {

        let daysHandle = Meteor.subscribe('days.private', activity._id)
        loadingDays = ! (daysHandle.ready() )
    }

    Session.set('CalendarApp_loading', loadingActivities || loadingDays)


    return {
        // reactive data, reload when User logs out
        user: Meteor.user(),
    }

})(AppLayout)
