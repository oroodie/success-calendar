import { Session } from 'meteor/session'

export const displayError = (error, crudResult, successMsg) => {

    if (error) {
        const msg = error.reason ? error.reason : error.error
        Session.set('errorMsg', msg)
    }
    else if (! crudResult) {
        const msg = 'Action failed.'
        Session.set('errorMsg', msg)
    }
    else {
        // SUCCESS
        Session.set('successMsg',
            successMsg !== undefined
                ? successMsg
                : 'Action succeeded!')
    }
}

export const setError = (errMsg) => {

    Session.set('errorMsg', errMsg)
}
