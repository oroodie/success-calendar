import React, {Component} from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import Menu from './Menu.jsx'


export default TitleBar = ({title}) => (
    <AppBar
        title={title}
        className='sticky-top title-bar'
        showMenuIconButton={false}
        iconElementRight={<Menu />}
    />
)


TitleBar.propTypes = {
    title: PropTypes.string,
}
