import React from 'react'
import PropTypes from 'prop-types'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import { Session } from 'meteor/session'


export default class ListDaysFilter extends React.PureComponent {

    constructor(props) {
        super(props)

        this.mapIndex = {
            0: this.props.LIST_DAYS_BY.YEAR,
            1: this.props.LIST_DAYS_BY.MONTH,
            2: this.props.LIST_DAYS_BY.ALL,
        }

        this.state = {
            selectedIndex:
                this.getSelectedIndex(this.props.listDaysBy),
        }
        this.select = this.select.bind(this)
    }

    componentWillUpdate(nextProps) {

        if(nextProps.listDaysBy !== this.props.listDaysBy) {
            this.setState({
                selectedIndex:
                    this.getSelectedIndex(nextProps.listDaysBy)
            })
        }
    }

    getSelectedIndex(listBy) {

        for(let i in this.mapIndex){
            if (this.mapIndex[i] === listBy) {
                return parseInt(i, 10)
            }
        }
        return 1 /* 1 = MONTH index */
    }

    select(i) {
        this.setState( () => ({selectedIndex: i}) )
        this.props.setListDaysBy(
            this.props.activityId,
            this.mapIndex[i]
        )
        Session.set('notRerenderCalendar', true)
    }


    render() {
        return (
            <BottomNavigation
                selectedIndex={this.state.selectedIndex}
                className='content list-days-filter'
            >
                <BottomNavigationItem
                    label='YEAR'
                    icon={<ActionGrade />}
                    onTouchTap={() => this.select(0)}
                />
                <BottomNavigationItem
                    label='MONTH'
                    icon={<ActionGrade />}
                    onTouchTap={() => this.select(1)}
                />
                <BottomNavigationItem
                    label='ALL'
                    icon={<ActionGrade />}
                    onTouchTap={() => this.select(2)}
                />
            </BottomNavigation>
        )
    }
}


ListDaysFilter.propTypes = {
    activityId: PropTypes.string,
    setListDaysBy: PropTypes.func,
    listDaysBy: PropTypes.oneOf(['MONTH', 'YEAR', 'ALL']),
    LIST_DAYS_BY: PropTypes.object,
}
