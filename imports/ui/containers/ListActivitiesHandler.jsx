import React from 'react'
import {
    showActivities_getState,
    showActivities_toggle,
} from '../helpers/showActivities'


export default Container = (props) => {

    const open = showActivities_getState()

    return (
        <div
            onClick={showActivities_toggle}
            className={props.className || null}
        >
            {props.viewText &&
                (open ? 'Hide Activities' : 'Select Activities')}
            {props.children}
        </div>
    )
}
