import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// Dev
import Perf from 'react-addons-perf'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
// layout
import AppHeader from './AppHeader.jsx'
import AppFooter from './AppFooter.jsx'
// components
import ErrorSuccessMsg from '../containers/ErrorSuccessMsg'
import ListActivities from '../containers/ListActivities.jsx'


export default class AppLayout extends React.PureComponent {

    // componentDidUpdate() {
    //     Perf.stop()
    //     Perf.printInclusive()
    //     Perf.printWasted()
    // }
    //
    // componentWillReceiveProps() {
    //     Perf.start()
    // }
    //
    // componentWillMount() {
    //   window.performance.mark('App')
    // }
    //
    // componentDidMount() {
    //   console.log(window.performance.now('App'))
    // }

    render() {
        const {
                children,
                location
            } = this.props,

            clonedChildren = children && React.cloneElement(children, {
                key: location.pathname,
            })

        return (
            <div className='App'>

                <a href='#main' className='sr-only'>Skip to main content</a>

                <AppHeader />

                <main role='main' id='main'>
                    <ReactCSSTransitionGroup
                        transitionName='page'
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                        {clonedChildren}
                        {/* Page will flicker
                         (run animation again)
                         when data loaded from server
                         {loading && <Loading />}
                         {clonedChildren}  */}
                    </ReactCSSTransitionGroup>
                </main>

                <ErrorSuccessMsg />

                <aside role='complementary'>
                    <ListActivities />
                </aside>

                <AppFooter />
            </div>
        )
    }
}

AppLayout.propTypes = {
}
