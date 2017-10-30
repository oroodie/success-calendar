import React from 'react'
import { Redirect } from 'react-router-dom'
import FeatureImg from '../components/FeatureImg.jsx'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import AddCircle from 'material-ui/svg-icons/av/queue'
import EditIcon from 'material-ui/svg-icons/image/edit'
import {fullWhite} from 'material-ui/styles/colors'
import {orange500} from 'material-ui/styles/colors'
import PropTypes from 'prop-types'
import LoginBox from '../containers/LoginBox.jsx'


const styles = {
    errorStyle: {
        color: orange500,
    },
}


const validate = values => {

    const errors = { noErrors: true }
    const requiredFields = ['activityName']

    requiredFields.forEach( (field) => {
        if (! values[field]) {
            errors[field] = 'Required'
            errors['noErrors'] = false
        }
    })
    return errors
}


export default class AddActivityPage extends React.PureComponent {

    constructor(props){
        super(props)

        this.emptyFields =
            this.getDefaultValues(this.props.activity)

        this.defaultErrors = {
            errors: {
                activityName:'',
                info:'',
                noErrors: true,
            }
        }

        this.state = {
            ...this.emptyFields,
            ...this.defaultErrors,
            redirect: false,
        }

        this.getDefaultValues = this.getDefaultValues.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.resetForm = this.resetForm.bind(this)
    }

    getDefaultValues(activity={}) {
        return {
            activityName:
                activity.activityName || '',
            info:
                activity.info || '',
        }
    }

    componentWillUpdate(nextProps) {

        if (nextProps.activity !== this.props.activity) {
            this.setState(
                () => this.getDefaultValues(nextProps.activity)
            )
        }
    }

    handleSubmit(e) {

        e.preventDefault()

        const activityName = this.state.activityName.trim(),
            info = this.state.info.trim()

        this.setState({ activityName, info })

        const errors = validate({ activityName, info })
        this.setState({ errors })

        if (errors.noErrors) {

            const id = this.props.activityId || null
            const saved =
                    id
                        ? this.props.update({ id, activityName, info })
                        : this.props.addActivity({ activityName, info });

            // saved – api query returns doc _id
            // saved ? this.resetForm() : null

            (id || saved) ? this.setState({redirect: true}) : null
        }
    }

    handleChange(e) {
        this.setState({
         	 [e.target.name]: e.target.value
        })
    }

    resetForm() {
        this.setState({
            ...this.emptyFields,
            ...this.defaultErrors,
        })
    }


    render() {

        if (this.state.redirect) {
            return <Redirect push to='/' />
        }

        const noUser = ! this.props.user

        return (
            <div className='page'>
                <FeatureImg />
                <LoginBox />

                <form
                    onSubmit={this.handleSubmit}
                    className={`add-activity-form content ${noUser && 'no-user'}`}
                    role='form'
                >

                    <TextField
                        floatingLabelText='Add Activity – Sport, Study, Travel, ...'
                        hintText='Activity Title'
                        name='activityName'
                        value={this.state.activityName}
                        onChange={this.handleChange}
                        fullWidth={true}
                        errorText={this.state.errors.activityName}
                        errorStyle={styles.errorStyle}
                        disabled={noUser}
                    /><br />

                    <TextField
                        floatingLabelText='Info'
                        name='info'
                        value={this.state.info}
                        onChange={this.handleChange}
                        multiLine={true}
                        fullWidth={true}
                        // rows={2}
                        errorText={this.state.errors.info}
                        errorStyle={styles.errorStyle}
                        disabled={noUser}
                    /><br />

                    {/* Btns */}
                    { ! noUser &&
                        <RaisedButton
                            backgroundColor='#a4c639'
                            icon={this.props.activityId
                                ? <EditIcon color={fullWhite} />
                                : <AddCircle color={fullWhite} />}
                            label={this.props.activityId
                                ? 'Save Activity' : 'Add Activity'}
                            labelPosition='before'
                            primary={true}
                            type='submit'
                            className='btn submit-activity-btn submit-btn'
                        />
                    }

                    { ! noUser &&
                        <RaisedButton
                            label={this.props.activityId
                                ? 'Clear Changes' : 'Clear Values'}
                            type='reset'
                            onTouchTap={this.resetForm}
                            className='btn reset-btn'
                        />
                    }

                </form>
            </div>
        )
    }
}


AddActivityPage.propTypes = {
    activity: PropTypes.shape({
        activityName: PropTypes.string,
        info: PropTypes.string,
    }),
    activityId: PropTypes.string,
    addActivity: PropTypes.func,
    update: PropTypes.func,
}
