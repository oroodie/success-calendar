import { Meteor } from 'meteor/meteor'
import React from 'react'
import { expect } from 'meteor/practicalmeteor:chai'
import { sinon } from 'meteor/practicalmeteor:sinon'
import Enzyme, { shallow, mount } from 'enzyme'
import AddDayPage from '../../../ui/pages/AddDayPage.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import { Factory } from 'meteor/dburles:factory'
import '../../../api/activities/factory'
import '../../../api/days/factory'

import Adapter from 'enzyme-adapter-react-15'
Enzyme.configure({ adapter: new Adapter() })


if (Meteor.isClient) {

    describe('<AddDayPage />', () => {

        it('Mounts AddDayPage and finds the form.', () => {

            const props = {
                activities: [],
                updateDay: () => {},
                addDay: () => {},
                getActivityDay: () => {},
                setErrSuccessMsg: () => {},
            }

            const wrapper = mount(
                (<MuiThemeProvider>
                    <Router>
                        <AddDayPage
                            {...props}
                        />
                    </Router>
                </MuiThemeProvider>)
            )

            expect( wrapper.find('.add-day-form') ).to.have.length(1)
        })


        it('Mounts AddDayPage, calls update on form submit if activity object provided.', (done) => {

            const props = {
                updateDay: sinon.spy(),
                addDay: sinon.spy(),
                getActivityDay: (activityId, date) => {
                    return { _id: '11', activityId, date}
                },
                setErrSuccessMsg: () => {},
                activities: [
                    Factory.create('activities', { _id:'1', getDays: () => {
                        return [
                            Factory.create('days', { activityId: '1', date: new Date() })
                        ]
                    } }),
                    Factory.create('activities', { _id:'2', getDays: () => {} })
                ]
            }

            const wrapper = mount(
                (<MuiThemeProvider>
                    <Router>
                        <AddDayPage
                            {...props}
                        />
                    </Router>
                </MuiThemeProvider>)
            )

            // Can't simulate click/submit on submit btn,
            // as btn node is a material-ui comp., no event propagation
            wrapper.find('form.add-day-form').simulate('submit')

            expect( props.updateDay.calledOnce ).to.equal(true)
            done()
        })
    })
}
