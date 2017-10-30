import React from 'react'
import PropTypes from 'prop-types'
import Filter from '../containers/ListDaysFilter.jsx'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'


const Day = (day) => {

    let infoMsg = day.info ? day.info
        : (day.done
            ? ''
            : 'Write why didn\'t succeed? Analyse, how to succeed?')

    return (
        <TableRow
            className={
                'day-row ' +
                (day.done ? '' : 'day-NOTdone ') +
                (day.date.getDay() === 1 ? 'Monday' : '')
            }>
            <TableRowColumn data-th='Date' className='day-date'>
                <span className='td-text'> {day.date.toDateString()} </span>
            </TableRowColumn>
            <TableRowColumn data-th='Done' className={'day-done ' + (day.done ? 'star' : '')}>
                <span className='td-text'> {day.done ? '★' : 'NO'} </span>
            </TableRowColumn>
            <TableRowColumn data-th='Info' className='day-info' title={infoMsg}>
                <span className='td-text'> {infoMsg} </span>
            </TableRowColumn>
            <TableRowColumn data-th='Time' className='day-duration' title={day.duration}>
                <span className='td-text'> {day.duration} </span>
            </TableRowColumn>
            <TableRowColumn data-th='Place' className='day-place' title={day.place}>
                <span className='td-text'> {day.place} </span>
            </TableRowColumn>
        </TableRow>
    )
}


export default ListDays = ({ activity, dates=[] }) => {

    return (
        <section className='list-days'>
            <br/>
            <h3 className='title list-days-title'>List Days</h3>
            <Filter
                activityId={activity._id}
                listDaysBy={activity.listDaysBy}
            />
            {/* <Paper zDepth={4} > */}
            <Table className='no-more-table'>

                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn className='day-date'>Date</TableHeaderColumn>
                        <TableHeaderColumn className='day-done'>Done</TableHeaderColumn>
                        <TableHeaderColumn className='day-info'>Extra Info</TableHeaderColumn>
                        <TableHeaderColumn className='day-duration'>Time</TableHeaderColumn>
                        <TableHeaderColumn className='day-place'>Place</TableHeaderColumn>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {dates.map( (day) => {
                        return <Day
                            key={day._id}
                            {...day}
                        />
                    })
                    }
                </TableBody>
            </Table>
            {/* </Paper> */}
            <br/>
        </section>
    )
}


ListDays.propTypes = {
    activity: PropTypes.object,
    dates: PropTypes.array,
}
