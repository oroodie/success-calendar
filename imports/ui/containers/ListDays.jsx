import React from 'react'
import ListDays from '../components/ListDays.jsx'
import dateHelper from '../helpers/dateHelper'


export default Container = ({year, month, activity}) => {

    const getDates = () => {

        switch(activity.listDaysBy) {

        case 'ALL':
            return activity.getAllDays(activity._id)

        case 'YEAR':
            return activity.getDays(
                dateHelper._getStartDate(year),
                dateHelper._getEndDate(year),
                activity._id
            )
            
        case 'MONTH':
            return activity.getDays(
                dateHelper._getStartDate(year, month),
                dateHelper._getEndDate(year, month),
                activity._id
            )
        }
    }

    return <ListDays
        activity={ activity }
        dates={ getDates() }
    />
}
