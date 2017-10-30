import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Session } from 'meteor/session'
import ListDays from '../containers/ListDays'
import ActivityMenu from '../containers/ActivityMenu.jsx'
import dateHelper from '../helpers/dateHelper'
import Loading from '../components/Loading.jsx'
import LoginBox from '../containers/LoginBox.jsx'


export default class CalendarPage extends React.PureComponent {

    constructor(props) {
        super(props)

        const { viewDate, activity } = this.props
        let month = viewDate.getMonth(), // 0-11
            year = viewDate.getFullYear() // YYYY

        this.state = {
            month,
            year,
            // CACHE values: { aID-yyyy-mm: {}, }
            activeDays: {},
        }

        if (activity && activity._id) {

            this.state.activeDays[`${activity._id}-${year}-${month}`]
                = this.getActivityDays(year, month)
        }

        this.goNextMonth = this.goNextMonth.bind(this)
        this.goPrevMonth = this.goPrevMonth.bind(this)
        this.goNowMonth = this.goNowMonth.bind(this)
        this.addRemoveDay = this.addRemoveDay.bind(this)
    }


    getActivityDays(year /* YYYY */, month /* 0-11 */) {

        const startDate = dateHelper._getStartDate(year, month),
            endDate = dateHelper._getEndDate(year, month),
            { activity } = this.props
        let days= {
            done: [],
            NOTdone: [],
        }

        if (! activity || ! activity.getDays) return days;

        const dates = activity.getDays(startDate, endDate, activity._id)

        if (dates)
            dates.forEach( (day) => {
                // find day
                let dayNr = day.date.getDate()
                if(day.done)
                    days.done.push(dayNr)
                else
                    days.NOTdone.push(dayNr)
            })

        return days
    }


    componentWillReceiveProps(nextProps) {

        const { activity } = nextProps

        if(activity._id) {
            this.setDays(activity._id)
        }
    }


    setDays(id) {

        if(! id) return

        const { year, month } = this.state

        let activeDays = this.getActivityDays(year, month)

        this.setState( ({activeDaysPrev}) => (
            { activeDays: {
                ...activeDaysPrev,
                [`${id}-${year}-${month}`]: activeDays

            }
            }) )
    }


    // on calendar day click - add / remove activity day
    addRemoveDay(day, active) {

        const {year, month} = this.state
        let date = new Date(year, month, day)
        let id = this.props.activity._id

        if(! id) return;

        let activeDays = Object.assign({}, this.state.activeDays[`${id}-${year}-${month}`])

        switch (active) {
        case 'active':
            // if active >> next – make inactive day
            // done >> NOT done
            this.props.updateDay({ activityId: id, date, done: false })
            activeDays.NOTdone.push(day)
            activeDays.done
                = activeDays.done.filter( (dayNr) => dayNr !== day)
            break

        case 'inactive':
            // if inactive >> next – remove day
            this.props.removeDay({ activityId: id, date})
            activeDays.done
                = activeDays.done.filter( (dayNr) => dayNr !== day)
            activeDays.NOTdone
                = activeDays.NOTdone.filter( (dayNr) => dayNr !== day)
            break

        default:
            // if no day info >> add day
            this.props.addDay({ activityId: id, date, done: true })
            activeDays.done.push(day)
        }

        this.setState( ({activeDaysPrev}) => (
            { activeDays:
                {
                    ...activeDaysPrev,
                    [`${id}-${year}-${month}`]: activeDays
                }
            }) )
    }


    getTodayDate(month, year) {

        let today = new Date()
        return (
            // return positiv day nr if do view current month & year
            (today.getMonth() === month  &&  today.getFullYear() === year)
                ? today.getDate() : -1
        )
    }


    displayDays(activityId, month, year) {
        let day = 1, i,
            // 0 (Sun), 1 (Mon), 2 (Tue), ..., 6 (Sat)
            startDay = new Date(year, month, day).getDay(),
            calendar=[],
            todayDay = this.getTodayDate(month, year)

        // if do switch month, year
        let activeDays =
            this.state.activeDays[`${activityId}-${year}-${month}`]

        const {Day} = this.props

        // This calendar starts on Monday,
        // if first day is on Sunday (0),
        // then display the start day at
        // the END of the week – (7)
        startDay = startDay === 0 ? 7 : startDay;
        // display from start of the week till,
        // start day of the month, could be Mo, Tu, ...
        for(i=1; i < startDay; i++){
            calendar.push(<Day key={`${month-1}${i}`} text={''} />)
        }

        // display days of the month
        for(i=1; i <= dateHelper._getDaysInMonth(month); i++){

            calendar.push(<Day
                key={`${month}${i}`}
                text={i}
                today={todayDay === i ? 'today' : ''}
                active={
                    activeDays === undefined
                        ? ''
                        : activeDays.done.indexOf(i) > -1
                            ? 'active'
                            : (activeDays.NOTdone.indexOf(i) > -1
                                ? 'inactive'
                                : ''
                            )
                }
                addRemoveDay={this.addRemoveDay}
            />)
        }
        return calendar
    }


    switchMonth(next, month, year) {

        // if month is not a valid value, set it to now
        month = (month>=0 && month<12)
            ? month : (new Date().getMonth() )

        year  = year || new Date().getFullYear()


        const id = (this.props.activity._id || 0),
            // Switch month, year
            newMonth = dateHelper._switchMonth(next, month),
            newYear = dateHelper._switchYear(next, month, year)

        // if no data found in cache, retrieve & set days
        if (id && ! this.state.activeDays[`${id}-${newYear}-${newMonth}`]) {

            this.setState( ({activeDaysPrev}) => {
                return ({
                    month: newMonth,
                    year: newYear,
                    activeDays: {
                        ...activeDaysPrev,
                        [`${id}-${newYear}-${newMonth}`]:
                            this.getActivityDays(newYear, newMonth),
                    },
                })
            })
        } else {
            this.setState({
                month: newMonth,
                year: newYear,
            })
        }

        // store viewing date in app Session
        id  ? this.props.setViewDate(id, new Date(newYear, newMonth, 1) )
            : null
    }

    goNextMonth() {
        this.switchMonth(true, this.state.month, this.state.year)
    }

    goPrevMonth() {
        this.switchMonth(false, this.state.month, this.state.year)
    }

    goNowMonth() {
        this.switchMonth(null)
    }


    render() {
        const {
            activity,
            loading,
        } = this.props
        const {
            month,
            year
        } = this.state

        if (! activity._id) {
            // Let new users know how app works, by default
            // last checked out activity is selected
            return <Redirect push to='/help' />
        }

        return (
            <div>
                <section className='calendar content'>

                    <h2 className='sr-only'>Calendar</h2>

                    <LoginBox />

                    { activity._id == '0' &&
                    /* display help text on top, else have calendar on top */
                    <p className='activity-info'>
                        <span className='calendar-info-icons'> </span><br/>
                        {activity.info}
                    </p>
                    }

                    <ActivityMenu
                        id={activity._id || ''}
                        name={activity.activityName || ''}
                    />

                    <div className='calendar-main'>

                        <header className='month'>

                            <h3 className='sr-only'>
                                Calendar View Month: {dateHelper._months[month]}, {year}</h3>
                            <ul aria-label='Calendar Navigation'>
                                <li className='prev' onClick={this.goPrevMonth} title='Go to Previous Month'>&#10094;</li>
                                <li className='next' onClick={this.goNextMonth} title='Go to Next Month'>&#10095;</li>
                                <li onClick={this.goNowMonth} title='Go to Present Month' >
                                    {dateHelper._months[month]}
                                    <br/>
                                    <span className='calendar-year'>
                                        {year}
                                    </span>
                                </li>
                            </ul>
                        </header>
                        <img src='../img/activity.jpg' className='calendar-img' alt='Activity' />

                        <ul className='weekdays' aria-label='Weekdays'>
                            <li>Mo</li>
                            <li>Tu</li>
                            <li>We</li>
                            <li>Th</li>
                            <li>Fr</li>
                            <li>Sa</li>
                            <li>Su</li>
                        </ul>

                        <ul className='days loading-parent' aria-label='Days Numbers'>
                            { loading && <Loading /> }
                            { this.displayDays( (activity._id || 0), month, year) }
                        </ul>
                    </div>

                    { activity._id != '0' &&
                    <p className='activity-info'>
                        <span className='calendar-info-icons'> </span><br/>
                        {activity.info}
                    </p>
                    }

                </section>

                <ListDays
                    year={year}
                    month={month}
                    activity={activity}
                />
            </div>
        )
    }
}


CalendarPage.propTypes = {
    activity: PropTypes.shape({
        _id: PropTypes.string,
        activityName: PropTypes.string,
        info: PropTypes.string,
        getDays: PropTypes.func,
    }),
    loading: PropTypes.bool,
    updateDay: PropTypes.func,
    removeDay: PropTypes.func,
    addDay: PropTypes.func,
}
