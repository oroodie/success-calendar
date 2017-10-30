import { Meteor } from 'meteor/meteor'
import React from 'react'
import { expect } from 'meteor/practicalmeteor:chai'
import { sinon } from 'meteor/practicalmeteor:sinon'
import Enzyme, { shallow, mount } from 'enzyme'
import CalendarPage from '../../../ui/pages/CalendarPage.jsx'
import Day from '../../../ui/components/Day.jsx'
//import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import { Factory } from 'meteor/dburles:factory'
import '../../../api/activities/factory'
import Adapter from 'enzyme-adapter-react-15'
Enzyme.configure({ adapter: new Adapter() })


if(Meteor.isClient) {

    describe('<CalendarPage />', () => {

        it('Mounts CalendarPage component and lists days of the month.', () => {

            const activity = Factory.create('activities', { getDays: (startDate) => {} })

            const props = {
                activity,
                Day,
                // Deterministic data
                viewDate: new Date(2017, 9 /* 0-11 month */, 1),
                setViewDate: () => {},
                addDay({}) {},
                updateDay({}) {},
                removeDay({}) {},
            }

            const wrapper = mount(
                (<MuiThemeProvider>
                    <Router>
                        <CalendarPage
                            {...props}
                        />
                    </Router>
                </MuiThemeProvider>)
                //, { context: {muiTheme: getMuiTheme()} }
            )

            expect( wrapper.find('ul.days') ).to.have.length(1)
            expect( wrapper.find('ul.days .day') ).to.have.length(31)
        })
    })
}
