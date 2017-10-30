import React from 'react'
import AccountsUIWrapper from './AccountsUIWrapper.jsx'


export default LoginBox = ({ user }) => {

    return (<div>
        { ! user &&
            <div className='login-box'>
                <AccountsUIWrapper />
            </div>
        }
    </div>
    )
}
