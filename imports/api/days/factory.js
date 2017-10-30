import { Factory } from 'meteor/dburles:factory'
import { Days } from './days'

// generate test data
// https://atmospherejs.com/dburles/factory
// define( 'factory_name', Collection, default_doc )
Factory.define('days', Days, {
    activityId: Factory.get('activities'),
    date: () => new Date(),
    done: true,
})
