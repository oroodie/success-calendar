import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'


export default class ErrorSuccessMsg extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }

        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.handleTouchTap = this.handleTouchTap.bind(this)
    }

    handleTouchTap() {
        this.setState({
            open: true,
        })
    }

    handleRequestClose() {
        this.setState({
            open: false,
        })
        this.props.clear()
    }


    render() {
        return (
            <div>
                <Snackbar
                    open={!! (this.props.successMsg)}
                    message={this.props.successMsg || ''}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                    className='successMsg'
                />
                <Snackbar
                    open={!! (this.props.errorMsg)}
                    message={this.props.errorMsg || ''}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                    className='errorMsg'
                />
            </div>
        )
    }
}


ErrorSuccessMsg.propTypes = {
    errorMsg: PropTypes.string,
    successMsg: PropTypes.string,
    clear: PropTypes.func,
}
