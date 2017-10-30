import React from 'react'
import PropTypes from 'prop-types'
import Dialog from './Dialog.jsx'


export default RemoveActivity = ({id, name, remove, reset}) => {

    return (<div>{ id &&
            <Dialog
                title='Remove Activity?'
                text={<div>Do you want to remove <b><big>&laquo;{name}&raquo;</big></b> activity?</div>}
                submit={() => { remove({activityId: id}); reset() }}
                cancel={reset}
                open
            />
    }</div>)
}


RemoveActivity.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    remove: PropTypes.func,
    reset: PropTypes.func,
}
