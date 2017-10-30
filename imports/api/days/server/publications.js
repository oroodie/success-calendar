import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Days } from '../days.js'
import { Activities } from '../../activities/activities.js'


export default Meteor.publish(
    'days.private',
    function daysPublication(activityId) {

        if (! this.userId || ! activityId) {
            return this.ready()
        }

        check(activityId, String)

        const activity = Activities.findOne({ _id: activityId })

        if (activity && activity.owner === this.userId) {
            return Days.find(
                { activityId },
                { fields: Days.publicFields, limit: 4000 } // to do: data loading on scroll
            )
        }

        return this.ready()
    }
)
