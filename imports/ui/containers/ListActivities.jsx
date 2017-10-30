import React from 'react'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import { Activities } from '../../api/activities/activities.js'
import { setLastCheckedOut } from '../../api/activities/methods.js'
import { displayError } from '../helpers/errors'
import { showActivities_close,
    showActivities_toggle,
    showActivities_getState
} from '../helpers/showActivities'
import ListActivities from '../components/ListActivities.jsx'


const Methods = {
    viewActivity(activityId) {
        setLastCheckedOut.call(
            {activityId},
            (err, crudRes) => {
                displayError(err, crudRes, '')
            })
    },
}


export default withTracker( (props) => {

    const activities = Activities.find(
        {},
        {sort: {lastCheckedOut: -1}}
    ).fetch()

    return {
        handleToggle: showActivities_toggle,
        handleClose: showActivities_close,
        open: showActivities_getState(),
        activities,
        ...Methods,
        ...props
    }

})(ListActivities)
