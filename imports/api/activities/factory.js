import { Random } from 'meteor/random'
import { Factory } from 'meteor/dburles:factory'
import { Fake } from 'meteor/anti:fake'
import { Activities } from './activities'

// generate test data
// https://atmospherejs.com/dburles/factory
// define( 'factory_name', Collection, default_doc )
Factory.define('activities', Activities, {
    activityName: () => Fake.word(),
    owner: () => Random.id(),
    lastCheckedOut: () => new Date(),
})
