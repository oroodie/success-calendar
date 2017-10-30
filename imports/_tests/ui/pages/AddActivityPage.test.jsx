import { Meteor } from 'meteor/meteor'
import React from 'react'
import { expect } from 'meteor/practicalmeteor:chai'
import { sinon } from 'meteor/practicalmeteor:sinon'
import Enzyme, { shallow, mount } from 'enzyme'
import AddActivityPage from '../../../ui/pages/AddActivityPage.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import { Factory } from 'meteor/dburles:factory'
import '../../../api/activities/factory'

import Adapter from 'enzyme-adapter-react-15'
Enzyme.configure({ adapter: new Adapter() })


if(Meteor.isClient) {

    describe('<AddActivityPage />', () => {

        it('Mounts AddActivityPage, finds the form.', () => {

            const props = {}

            const wrapper = mount(
                (<MuiThemeProvider>
                    <Router>
                        <AddActivityPage
                            {...props}
                        />
                    </Router>
                </MuiThemeProvider>)
            )

            expect( wrapper.find('.add-activity-form') ).to.have.length(1)
        })

        it('Mounts AddActivityPage, calls update on form submit if activity object provided.', (done) => {

            const props = {
                activity: Factory.create('activities', {_id:'1'}),
                activityId: '1',
                addActivity: () => {},
                update: sinon.spy()
            }

            const wrapper = mount(
                (<MuiThemeProvider>
                    <Router>
                        <AddActivityPage
                            {...props}
                        />
                    </Router>
                </MuiThemeProvider>)
            )

            // Can't simulate click/submit on submit btn,
            // as btn node is a material-ui comp., no event propagation
            wrapper.find('form.add-activity-form').simulate('submit')

            expect( props.update.calledOnce ).to.equal(true)
            done()
        })


    })
}
