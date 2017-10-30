import React from 'react'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/image/edit'
import DeleteIcon from 'material-ui/svg-icons/content/clear'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import RemoveActivity from '../containers/RemoveActivity.jsx'


export default class ActivityMenu extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            removeActivity: false,
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.reset = this.reset.bind(this)
    }

    reset() {
        this.setState( () => ({ removeActivity: false }) )
    }

    handleRemove() {
        this.setState( () => ({ removeActivity: true }) )
        this.forceUpdate()
    }

    render() {
        const { id, name, user } = this.props,
            // handle help case where id = '0'
            _id = (id === '0' ? '' : id),
            addLink = (! _id && user)
                ? '/add-activity' : `/edit-activity/${_id}`


        return (
            <aside className='activity-menu'>
                <h3 className='sr-only'>Manage Activity Links</h3>

                { (_id || user) &&
                    // if no activity & user logged in,
                    // then make an Add Activity Link
                    <IconButton
                        containerElement={<Link to={addLink} />}
                        className='activity-menu-link'
                        title={`${_id ? 'Edit' : 'Add'} Activity`}
                    >
                        <EditIcon />
                    </IconButton>
                }

                { _id &&
                    <IconButton
                        onTouchTap={this.handleRemove}
                        className='activity-menu-link'
                        title='Remove Activity'
                    >
                        <DeleteIcon />
                    </IconButton>
                }

                <IconButton
                    containerElement={<Link to={`/help`} />}
                    className='activity-menu-link help-link'
                    title='Help Page'>
                        ?
                </IconButton>

                { this.state.removeActivity &&
                    <RemoveActivity
                        id={_id}
                        name={name}
                        reset={this.reset}
                    />
                }

            </aside>
        )
    }
}


ActivityMenu.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
}
