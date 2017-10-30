import React from 'react'
import { Session } from 'meteor/session'
import CalendarPage from '../pages/CalendarPage.jsx'
import DayHelp from '../components/DayHelp.jsx'


const Methods = {
    addDay({}) {},
    updateDay({}) {},
    removeDay({}) {},
}

export default Container = ({}) => {

    const activity = {
        _id: '0',
        activityName: 'Welcome!',
        info: `This calendar application, helps track activities success, log days info,
               set done, not done, WRITE WHY NOT DONE – find a solution. Be better ORGANISED FOR SUCCESS!`,
        owner: 1,
        lastCheckedOut: new Date(),
        listDaysBy: 'MONTH',
        getDays: (startDate) => {

            // getDay() returns: 0 for Sunday
            let day = (startDate.getDay() || 7)
            const dayDone = 7 - day + 3,
                dayNotDone = dayDone + 7,
                dayRemoved = dayNotDone + 7

            let dateDone = new Date(),
                dateNotDone = new Date(),
                dateRemoved = new Date()

            dateDone.setDate(dayDone)
            dateNotDone.setDate(dayNotDone)
            dateRemoved.setDate(dayRemoved)

            let days = [{
                _id: '1',
                activityId: '0',
                date: dateDone,
                place: 'Paris',
                duration: '2 days',
                done: true,
            },{
                _id: '11',
                activityId: '0',
                date: dateNotDone,
                place: 'Gym Florence',
                duration: '1h',
                done: false,
            }]

            return days
        }
    }

    Session.set('CalendarApp_Title', activity.activityName)

    const props = {
        activity,
        viewDate: new Date(),
        setViewDate: () => {},
        Day: DayHelp,
        ...Methods

    }

    return <CalendarPage {...props} />
}
