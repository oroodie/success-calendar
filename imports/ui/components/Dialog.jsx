import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'


export default class DialogExampleSimple extends React.Component {

    state = {
        open: true,
    }

    handleOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open: false})
    }

    handleCancel = () => {
        this.props.cancel ? this.props.cancel() : null
        this.handleClose()
    }

    handleSubmit = () => {
        this.props.submit ? this.props.submit() : null
        this.handleClose()
    }


  render() {
        // Could also display as props.children, then must also display
        // parents – do not need for, if not clicked, mostly not clicked.
        // Display Dialog – on btn click: { this.state.open && <Dialog /> }
        const actions = [
          <FlatButton
            label='Cancel'
            primary={true}
            onTouchTap={this.handleCancel}
          />,
          <FlatButton
            label='Submit'
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmit}
          />,
        ]

        return (
            <Dialog
              title={this.props.title}
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              {this.props.text}
            </Dialog>
        )
  }
}
