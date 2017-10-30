import { Session } from 'meteor/session'


export const showActivities_getState = () => {
    return Session.get('CalendarApp_showActivities') ? true : false
}

export const showActivities_setState = (open) => {
    return Session.set('CalendarApp_showActivities', open ? true : false)
}

export const showActivities_toggle = () => {
    Session.set(
        'CalendarApp_showActivities',
        Session.get('CalendarApp_showActivities') ? false : true
    )
}

export const showActivities_close = () => {
    Session.set('CalendarApp_showActivities', false)
}
