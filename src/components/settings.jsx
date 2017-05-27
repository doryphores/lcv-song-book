import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { TOGGLE_SETTINGS, SAVE_SETTINGS } from '../actions'
import Icon from './icon'
import Modal from './modal'

class Settings extends React.Component {
  constructor (props) {
    super()
    this.state = {
      password: props.password,
      hideScrollbars: props.hideScrollbars
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open && !this.props.open) {
      this.state = {
        password: nextProps.password,
        hideScrollbars: nextProps.hideScrollbars
      }
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSubmit({
      password: this.state.password,
      hideScrollbars: this.state.hideScrollbars
    })
  }

  classNames () {
    return classnames(
      this.props.className,
      'settings'
    )
  }

  renderHideScrollbarsSetting () {
    if (process.platform === 'darwin') return null

    return (
      <label className='field checkbox'>
        <input className='checkbox__input'
          type='checkbox'
          checked={this.state.hideScrollbars}
          onChange={(e) => this.setState({ hideScrollbars: e.target.checked })} />
        <span className='checkbox__check'>
          <Icon icon='check' className='checkbox__check-icon' />
        </span>
        <span className='field__label checkbox__label'>
          Hide scrollbars (restart to apply)
        </span>
      </label>
    )
  }

  render () {
    return (
      <div className={this.classNames()}>
        <Icon icon={this.props.open ? 'close' : 'settings'}
          className='settings__toggle'
          onClick={this.props.onToggle} />

        <Modal open={this.props.open}
          title='Preferences'
          buttonLabel='Apply'
          onSubmit={this.handleSubmit.bind(this)}>
          <label className='field'>
            <input type='password'
              className='field__input'
              value={this.state.password}
              required
              autoFocus
              onChange={(e) => this.setState({ password: e.target.value })} />
            <span className='field__label'>LCV website password</span>
          </label>

          {this.renderHideScrollbarsSetting()}
        </Modal>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    open: state.ui.settingsVisible,
    password: state.settings.password,
    hideScrollbars: state.ui.hideScrollbars
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
