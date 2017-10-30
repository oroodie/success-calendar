import { Session } from 'meteor/session'


export const getViewDate = (activityId) => {

    const viewDate = Session.get('CalendarApp_viewDate_' + activityId)

    return (viewDate instanceof Date
        ? viewDate
        : new Date() )
}

export const setViewDate = (activityId, date) => {

    if (activityId && date) {
        Session.set('CalendarApp_viewDate_' + activityId, date)
    }
}
