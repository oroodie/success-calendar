import React from 'react'
import PropTypes from 'prop-types'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import AddActivityIcon from 'material-ui/svg-icons/av/queue'
import StarIcon from 'material-ui/svg-icons/action/grade'
import { Link } from 'react-router-dom'


export default class ListActivities extends React.PureComponent {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(activityId) {
        this.props.viewActivity(activityId)
        this.props.handleClose()
    }


    render() {
        return (
            <Drawer
                docked={false}
                width={260}
                open={this.props.open}
                onRequestChange={(open) => this.props.handleToggle(open)}
                className='list-activities'
            >
                <Link to='/add-activity'>
                    <RaisedButton
                        icon={<AddActivityIcon color={'#fff'} />}
                        label='Add Activity'
                        labelPosition='before'
                        className='list-activities-add-btn'
                        primary={true}
                    />
                </Link>

                <h3 className='title list-activities-title'>Select Activity</h3>

                { this.props.activities.map( (a) => {
                    return (
                        <MenuItem
                            key={a._id}
                            className='activity-item'
                            leftIcon={<StarIcon />}
                        >
                            <Link to='/' onTouchTap={() => this.handleClick(a._id)}>
                                {a.activityName}
                            </Link>
                        </MenuItem>
                    )
                }) }

                { ! this.props.activities.length && <small className='list-activities-none'> – None Found – </small> }
            </Drawer>
        )
    }
}


ListActivities.propTypes = {
    viewActivity: PropTypes.func,
    activities: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        activityName: PropTypes.string
    }) ),
}
