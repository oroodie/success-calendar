import React from 'react'
import { Route, NavLink, withRouter } from 'react-router-dom'
import TitleBar from '../containers/TitleBar'
import ListActivities_Btn from '../containers/ListActivities_Btn.jsx'
import Menu from '../components/Menu.jsx'
// icons
import IconButton from 'material-ui/IconButton'
import ActionHome from 'material-ui/svg-icons/action/date-range'
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import AddActivityIcon from 'material-ui/svg-icons/av/queue'


const AppHeader = (props) => {

    return (
        <header role='banner'>

            <TitleBar />

            <nav className='nav sticky-box' role='navigation'>

                <h2 className='sr-only'>Navigation</h2>

                <IconButton
                    containerElement={<NavLink to='/' exact activeClassName='nav-link-active' className='nav-link'/>}
                    title='Calendar Page'
                >
                    <ActionHome />
                </IconButton>

                <IconButton
                    containerElement={<NavLink to='/add-activity' activeClassName='nav-link-active' className='nav-link'/>}
                    title='Add Activity'
                >
                    <AddActivityIcon />
                </IconButton>

                <IconButton
                    containerElement={<NavLink to='/add-day' activeClassName='nav-link-active' className='nav-link'/>}
                    title='Add Day'
                >
                    <AddCircle />
                </IconButton>

                <ListActivities_Btn
                    className='nav-link'
                    classNameOpen='nav-link-active'
                    title='Show / Hide Activities'
                />
                        
            </nav>
        </header>
    )
}


// withRouter - set nav active link,
// Router props.match accessible
export default withRouter(AppHeader)
