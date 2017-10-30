import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import TitleBar from '../components/TitleBar.jsx'


export default withTracker( () => {

    const title = Session.get('CalendarApp_Title') || 'Success Calendar'

    return {
        title
    }
})(TitleBar)
