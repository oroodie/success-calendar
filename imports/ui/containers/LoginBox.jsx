import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import LoginBox from '../components/LoginBox.jsx'

export default withTracker( () => {

    return {
        user: !! Meteor.user(),
    }
})(LoginBox)
