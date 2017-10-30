import React from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import { NavLink } from 'react-router-dom'
import ListActivities_Btn from '../containers/ListActivities_Btn.jsx'
import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx'
import ListActivitiesHandler from '../containers/ListActivitiesHandler.jsx'
// icons
import IconButton from 'material-ui/IconButton'
import ActionHome from 'material-ui/svg-icons/action/date-range'
import HelpIcon from 'material-ui/svg-icons/action/help'
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import AddActivityIcon from 'material-ui/svg-icons/av/queue'
import ActionList from 'material-ui/svg-icons/navigation/menu'


export default class Menu extends React.PureComponent {

    constructor(props){
        super(props)
        this.state={
            openMenu: false
        }
    }

    handleOnRequestChange(value) {
        this.setState({
            openMenu: value,
        })
    }

    handleClose() {
        this.setState( () => ({
            openMenu: false,
        }) )
    }


    render() {
        return (
            <IconMenu
                open={this.state.openMenu}
                onItemTouchTap={this.handleClose.bind(this)}
                onRequestChange={this.handleOnRequestChange.bind(this)}
                iconButtonElement={<IconButton className='nav-link' >
                    <MenuIcon className='vertical-menu-icon' /></IconButton>}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <nav>
                    <h2 className='sr-only'>Main Navigation</h2>
                    <MenuItem className='menuitem-link'>
                        <AccountsUIWrapper />
                    </MenuItem>

                    <MenuItem containerElement={ <NavLink to='/' exact className='menuitem-link' activeClassName='menuitem-link-active' />} >
                        <ActionHome className='menuitem-icon' />
                        Calendar – Set Activity Days
                    </MenuItem>

                    <MenuItem containerElement={ <NavLink to='/add-activity' className='menuitem-link' activeClassName='menuitem-link-active' />} >
                        <AddActivityIcon className='menuitem-icon' />
                        Add Activity
                    </MenuItem>

                    <MenuItem containerElement={<NavLink to='/add-day' className='menuitem-link' activeClassName='menuitem-link-active' />} >
                        <AddCircle className='menuitem-icon' />
                        Set/Edit Days Info
                    </MenuItem>

                    <MenuItem className='menuitem-link' >
                        <ListActivities_Btn className='menuitem-icon' />
                        <ListActivitiesHandler viewText={true} />
                    </MenuItem>

                    <MenuItem containerElement={<NavLink to='/help' className='menuitem-link' activeClassName='menuitem-link-active' />} >
                        <HelpIcon className='menuitem-icon' />
                        How it works?
                    </MenuItem>
                </nav>
            </IconMenu>
        )
    }
}
