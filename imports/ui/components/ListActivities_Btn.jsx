import React from 'react'
import IconButton from 'material-ui/IconButton'
// import ActionList from 'material-ui/svg-icons/navigation/menu'
import ListIcon from 'material-ui/svg-icons/navigation/more-vert'
import NavigationClose from 'material-ui/svg-icons/navigation/close'


export default ListActivities_Btn = ({
    handleToggle,
    open,
    className,
    classNameOpen,
    title,
    children
}) => {

    return (
        <IconButton
            onTouchTap={handleToggle}
            title={title}
            className={`nav-btn ${className || ''} ${open ? (classNameOpen || '') : ''}`}
        >

            {open ? <NavigationClose /> : <ListIcon /> }

        </IconButton>
    )
}
