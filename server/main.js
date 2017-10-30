import { Meteor } from 'meteor/meteor'
// set <html lang='en'>
import { WebApp } from 'meteor/webapp'
import { BrowserPolicy } from 'meteor/browser-policy'
import '../imports/api/activities/activities'
import '../imports/api/activities/methods'
import '../imports/api/activities/server/publications'
import '../imports/api/days/days'
import '../imports/api/days/methods'
import '../imports/api/days/server/publications'
import '../imports/startup/server/security'


Meteor.startup( () => {
    // code to run on server at startup
    WebApp.addHtmlAttributeHook( () => ({ lang: 'en' }) )
    BrowserPolicy.content.allowStyleOrigin("https://fonts.googleapis.com/")
    BrowserPolicy.content.allowFontOrigin("https://fonts.gstatic.com/")
})
