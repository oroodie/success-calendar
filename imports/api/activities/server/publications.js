import { Meteor } from 'meteor/meteor'
import { Activities } from '../activities.js'


// https://guide.meteor.com/security.html#publications-user-id
// put the security check in the returned query itself
export default Meteor.publish(
    'activities.private',
    function activitiesPublication() {

        if (! this.userId) {
            return this.ready()
        }

        return Activities.find(
            { owner: this.userId},
            { fields: Activities.publicFields, limit: 100, }
        )
    }
)
