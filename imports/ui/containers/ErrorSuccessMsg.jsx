import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import ErrorSuccessMsg from '../components/ErrorSuccessMsg.jsx'


const Methods = {
    clearError() {},
    clearSuccessMsg() {},
    clear() {
        Session.set('errorMsg', '')
        Session.set('successMsg', '')
    }
}


export default withTracker( () => {

    return {
        errorMsg: Session.get('errorMsg'),
        successMsg: Session.get('successMsg'),
        ...Methods
    }
})(ErrorSuccessMsg)
