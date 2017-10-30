import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { setListDaysBy } from '../../api/activities/methods'
import { displayError } from '../helpers/errors'
import ListDaysFilter from '../components/ListDaysFilter.jsx'


export default withTracker( ({activityId, listDaysBy}) => {

    const Methods = {
        setListDaysBy(activityId, listDaysBy) {
            setListDaysBy.call(
                {activityId, listDaysBy},
                (err, crudRes) => displayError(
                    err, crudRes, `List days by – ${listDaysBy} – was set!`)
            )
        },
    }

    const LIST_DAYS_BY = {
        MONTH: 'MONTH',
        YEAR: 'YEAR',
        ALL: 'ALL'
    }

    return {
        LIST_DAYS_BY: LIST_DAYS_BY,
        activityId,
        listDaysBy,
        ...Methods
    }

})(ListDaysFilter)
