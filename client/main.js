import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { RenderRoutes } from '../imports/startup/client/routes.jsx'
import registerServiceWorker from './registerServiceWorker.js'

injectTapEventPlugin()


Meteor.startup( () => {
    render(
        RenderRoutes(),
        document.getElementById('render-target')
    )
    registerServiceWorker()
})
