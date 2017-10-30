import React from 'react'
import PropTypes from 'prop-types'


export default Day = ({ text, today, active, addRemoveDay }) => {
    return (
        <li className='dayItem'>
            { text
                ? <span
                    className={`${today} ${active} day`}
                    onTouchTap={()=>addRemoveDay(text, active)}
                >
                    {text}
                </span>
                : null
            }
        </li>
    )
}
