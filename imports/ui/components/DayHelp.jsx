import React, { Component } from 'react'
import PropTypes from 'prop-types'


const Help = ({active}) => {

    let helpText = ''

    switch(active) {
    case 'active':
        helpText = '◂ Click 1 + Add Activity Day'
        break
    case 'inactive':
        helpText = '◂ Click 2 – Set NOT DONE'
        break
    }

    return (
        <span className='help'>
            { ' ' + helpText}
        </span>
    )
}


export default DayHelp = ({ text, today, active }) => {
    return (
        <li className='dayItem'>
            { text
                ? <span
                    className={`${today} ${active} day help-parent`}
                >
                    {text}
                    {active && <Help active={active} />}
                </span>
                : null
            }
        </li>
    )
}
