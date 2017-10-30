import React from 'react'
import { Meteor } from 'meteor/meteor'
import ActivityMenu from '../components/ActivityMenu.jsx'


export default Container = ({id, name}) => {

    return <ActivityMenu id={id} name={name} user={!! Meteor.user()} />
}
