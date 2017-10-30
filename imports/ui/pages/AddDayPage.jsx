import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline'
import EditIcon from 'material-ui/svg-icons/image/edit'
import {fullWhite} from 'material-ui/styles/colors'
import {orange500} from 'material-ui/styles/colors'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'
import Toggle from 'material-ui/Toggle'
import PropTypes from 'prop-types'
import FeatureImg from '../components/FeatureImg.jsx'
import Loading from '../components/Loading.jsx'
import LoginBox from '../containers/LoginBox.jsx'


const styles = {
    errorStyle: {
        color: orange500,
    },
    customWidth: {
        width: '100%',
    },
}


const validate = values => {

    const errors = { noErrors: true }
    const requiredFields = ['activityId', 'date']

    requiredFields.forEach( (field) => {

        if (! (values[field]) ) {
            errors[field] = 'Required'
            errors['noErrors'] = false
        }
    })
    return errors
}


export default class AddDayPage extends React.PureComponent {

    constructor(props){
        super(props)

        this.buildActivitiesOptions()

        // Activities sorted by date
        // Get Id of last checked out
        // Prop from undefined is err
        const {activities} = this.props
        const activityId =
            (activities && activities[0])
                ? activities[0]._id || 0 : 0

        const date = new Date()
        date.setHours(0,0,0,0)

        const day = this.props.getActivityDay(activityId, date)

        this.emptyFields = {
            done: true,
            info: '',
            duration: '',
            place: '',
            edit: false,
        }

        this.defaultErrors = {
            errors: {
                activityId: '',
                date: '',
                done: '',
                info: '',
                duration: '',
                place: '',
                noErrors: true,
            }
        }

        this.state = {
            ...this.emptyFields,
            ...this.defaultErrors,
            ...day,
            date,
            activityId,
            edit: !! day,
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.resetForm = this.resetForm.bind(this)
    }


    componentDidUpdate(prevProps){
        // Activities are displayed/sorted by last checked out
        // If data loaded, retrieve day data for the 1st activity
        const activity = this.props.activities[0]
        if (activity !== prevProps.activities[0]) {

            this.buildActivitiesOptions()
            activity && activity._id
                // data loaded, update form
                ? this.checkDateExists({
                    activityId: activity._id,
                    date: this.state.date })
                // user logged out, empty fields
                : this.resetForm()
            this.forceUpdate()
        }
    }


    buildActivitiesOptions() {

        this.activityInfos = {}
        // #perf
        // Build select box for Activity options.
        // If do build on render, then it will
        // perform same action, on rerender
        this.selectActivityOptions =
            this.props.activities.map( (a) => {
                this.activityInfos[a._id] = a.info
                return (<MenuItem
                    key={a._id}
                    value={a._id}
                    primaryText={a.activityName}
                />)
            }
            )
    }


    handleSubmit(e) {
        e.preventDefault()

        let trimmed = {
            activityId: this.state.activityId,
            place: this.state.place.trim(),
            date: this.state.date,
            info: this.state.info.trim(),
            duration: this.state.duration.trim(),
            done: this.state.done ? true : false,
        }

        this.setState(trimmed)

        // validate
        const errors = validate(trimmed)
        this.setState({ errors })

        if (errors.noErrors) {
            // save
            const save = this.state.edit
                ? this.props.updateDay
                : this.props.addDay

            const saved = save(trimmed)

            // clear form, will do also form reset
            saved ? this.checkDateExists({
                activityId: this.state.activityId,
                date: this.state.date,
            })
                : null
        }
    }


    handleChange(e) {

        let target = e.target
        let name = target.name
        let value = target.type === 'checkbox'
            ? target.checked
            : target.value

        this.setState({
            [name]: value,
        })
    }


    handleDateChange(nullEv, d) {

        this.setState( () => ({
            date: d
        }) )
        // store, when days loaded from server, reload
        this.props.selectedDate[this.state.activityId] = d
        this.checkDateExists({
            activityId: this.state.activityId,
            date: d
        })
    }


    handleSelectChange(event, index, value) {

        value ? this.props.loadActivity(value) : null

        let date = this.props.selectedDate[value]
        date = (date instanceof Date) ? date : this.state.date

        this.setState( () => ({
            activityId: value,
            date,
        }) )
        this.checkDateExists({
            activityId: value,
            date: this.state.date
        })
    }


    checkDateExists({ activityId, date }) {

        if (activityId && date) {

            date.setHours(0,0,0,0)

            let day = this.props.getActivityDay(activityId, date)

            if (day && day.activityId) {

                // some fields might be missing,
                // so first reset all, then set
                this.resetForm()
                this.setState( () => ({...day, edit: true}) )
                this.props.setErrSuccessMsg({
                    'successMsg': this.props.successMsgDateFound
                })
            } else {
                this.resetForm()
            }
        }
    }


    resetForm() {
        this.setState( () => ({
            ...this.emptyFields,
            ...this.defaultErrors,
        }) )
    }


    render() {
        const { loading } = this.props,
            noUser = ! this.props.user
        let { edit,
            errors,
            date,
            done,
            info,
            place,
            duration,
            activityId} = this.state
        return (
            <div className='page'>
                <FeatureImg />
                <LoginBox/>

                <form
                    onSubmit={this.handleSubmit}
                    className={`add-day-form content loading-parent ${noUser && 'no-user'}`}
                    role='form'
                >
                    { loading && <Loading /> }

                    <SelectField
                        floatingLabelText='Select Activity'
                        hintText='Select Activity'
                        value={activityId}
                        onChange={this.handleSelectChange}
                        autoWidth={true}
                        style={styles.customWidth}
                        errorText={activityId ? '' : errors.activityId}
                        errorStyle={styles.errorStyle}
                        disabled={noUser}
                    >
                        <MenuItem
                            key={0}
                            value={0}
                            primaryText='Select Activity' />
                        {this.selectActivityOptions}
                    </SelectField>

                    <TextField
                        disabled={true}
                        fullWidth={true}
                        multiLine={true}
                        underlineShow={false}
                        value={this.activityInfos[activityId] || ''}
                        name='info'
                    />

                    <DatePicker
                        hintText='Select Date'
                        fullWidth={true}
                        value={date}
                        onChange={this.handleDateChange}
                        disabled={loading || noUser}
                        name='date'
                    />

                    <Toggle
                        label='Done'
                        toggled={done}
                        labelPosition='right'
                        onToggle={this.handleChange}
                        disabled={loading || noUser}
                        name='done'
                    />

                    <TextField
                        hintText={done
                            ? 'Day Extra Info'
                            : 'Think, why you didn\'t succeed?'}
                        floatingLabelText={done
                            ? 'Day Extra Info'
                            : 'Think, why you didn\'t succeed?'}
                        multiLine={true}
                        onChange={this.handleChange}
                        value={info}
                        fullWidth={true}
                        errorText={errors.info}
                        errorStyle={styles.errorStyle}
                        floatingLabelStyle={done ? {} : styles.errorStyle}
                        disabled={loading || noUser}
                        name='info'
                    />
                    <br />

                    <TextField
                        hintText='Paris, Milano, mountain-top...'
                        floatingLabelText='Place'
                        value={place}
                        onChange={this.handleChange}
                        fullWidth={true}
                        errorText={errors.place}
                        errorStyle={styles.errorStyle}
                        disabled={loading || noUser}
                        name='place'
                    />

                    <TextField
                        hintText='1h 30min 1day 1month ...'
                        floatingLabelText='Duration'
                        value={duration}
                        onChange={this.handleChange}
                        fullWidth={true}
                        errorText={errors.duration}
                        errorStyle={styles.errorStyle}
                        disabled={loading || noUser}
                        name='duration'
                    />

                    <RaisedButton
                        label={edit ? 'Save Day' : 'Add Day'}
                        type='submit'
                        backgroundColor='#a4c639'
                        icon={edit ? <EditIcon color={fullWhite} />
                            : <AddCircle color={fullWhite} /> }
                        labelPosition='before'
                        disabled={loading || noUser}
                        primary={true}
                        className='btn submit-btn'
                    />

                    <RaisedButton
                        label='Clear Values'
                        type='reset'
                        onTouchTap={this.resetForm}
                        disabled={loading || noUser}
                        className='btn reset-btn'
                    />
                </form>
            </div>
        )
    }
}


AddDayPage.propTypes = {
    loading: PropTypes.bool,
    updateDay: PropTypes.func,
    addDay: PropTypes.func,
    getActivityDay: PropTypes.func,
    setErrSuccessMsg: PropTypes.func,
    activities: PropTypes.arrayOf(PropTypes.object)
}
