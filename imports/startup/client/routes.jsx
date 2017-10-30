import React from 'react'
// material-ui theme
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {grey500} from 'material-ui/styles/colors'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    NavLink,
    Redirect,
    withRouter,
    HashRouter
} from 'react-router-dom'

import App from '../../ui/containers/App'
import Calendar from '../../ui/containers/Calendar'
import CalendarHelp from '../../ui/containers/CalendarHelp'
import AddDay from '../../ui/containers/AddDay'
import AddActivity from '../../ui/containers/AddActivity'

const muiTheme = getMuiTheme({
    palette: {
        textColor: grey500,
    },
    appBar: {
        height: 50,
    },
    menu: {
        backgroundColor: 'none !important',
        containerBackgroundColor: 'none !important',
    },
    fontFamily: 'Open Sans'
})

const AppWithRouter = withRouter(App)


export const RenderRoutes = () => (

    <MuiThemeProvider muiTheme={muiTheme}>
        <Router>
            <AppWithRouter>
                <Switch>
                    <Route exact path='/' component={Calendar} />

                    <Route exact path='/help' component={CalendarHelp} />

                    <Route exact path='/add-day' component={AddDay} />

                    <Route exact path='/add-activity' component={AddActivity} />

                    <Route path='/edit-activity/:activityId' component={AddActivity} />

                    {/* GO / if no Route matched; no browser redirect in switch */}
                    <Redirect to="/help" />
                </Switch>
            </AppWithRouter>
        </Router>
    </MuiThemeProvider>
)
