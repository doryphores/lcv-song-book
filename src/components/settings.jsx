import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { TOGGLE_SETTINGS, SAVE_SETTINGS } from '../actions'
import Icon from './icon'
import FirstChild from './first_child'

class Settings extends React.Component {
  constructor (props) {
    super()
    this.state = {
      password: props.password
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSubmit({
      password: this.state.password
    })
  }

  classNames () {
    return classnames(
      this.props.className,
      'settings'
    )
  }

  renderPanel () {
    return (
      <div className='settings__overlay u-flex u-flex--vertical u-flex--center'>
        <form className='settings__panel' onSubmit={this.handleSubmit.bind(this)}>
          <h2 className='settings__heading'>Preferences</h2>

          <label className='field'>
            <input ref='password'
              type='password'
              className='field__input'
              value={this.state.password}
              required
              autoFocus
              onChange={(e) => this.setState({ password: e.target.value })} />
            <span className='field__label'>LCV website password</span>
          </label>
          <div className='form-actions'>
            <button className='button'>Apply</button>
          </div>
        </form>
      </div>
    )
  }

  render () {
    return (
      <div className={this.classNames()}>
        <Icon icon={this.props.open ? 'close' : 'settings'}
          className='settings__toggle'
          onClick={this.props.onToggle} />

        <ReactCSSTransitionGroup component={FirstChild}
          transitionName='slide-down'
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}>
          {this.props.open ? this.renderPanel() : null}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    open: state.ui.settingsVisible,
    password: state.settings.password
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onToggle: settings => dispatch({ type: TOGGLE_SETTINGS }),
    onSubmit: settings => dispatch({
      type: SAVE_SETTINGS,
      payload: settings
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
