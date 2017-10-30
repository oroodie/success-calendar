import React from 'react'
import RemoveActivity from '../components/RemoveActivity.jsx'
import { removeActivityMethod } from '../../api/activities/methods'
import { displayError } from '../helpers/errors'


const Methods = {
    remove({activityId}) {
        removeActivityMethod.call(
            {activityId},
            (err, crudRes) => {
                displayError(err, crudRes, 'Activity removed!')
            })
    },
}


export default Container = ({id, name, reset}) => {

    return <RemoveActivity id={id} {...Methods} name={name} reset={reset} />
}
