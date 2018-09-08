import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { TOGGLE_SETTINGS, SAVE_SETTINGS } from '../actions'
import ToolbarPanel from './toolbar_panel'
import Icon from './icon'
import Modal from './modal'

interface SettingsState {
  readonly password: string
  readonly hideScrollbars: boolean
}

interface SettingsProps extends SettingsState {
  readonly className: string
  readonly open: boolean
  readonly onSubmit: (settings: SettingsState) => void
  readonly onToggle: () => void
}

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor (props: SettingsProps) {
    super(props)
    this.state = {
      password: props.password,
      hideScrollbars: props.hideScrollbars
    }
  }

  componentWillReceiveProps (nextProps: SettingsProps) {
    if (nextProps.open && !this.props.open) {
      this.setState({
        password: nextProps.password,
        hideScrollbars: nextProps.hideScrollbars
      })
    }
  }

  handleSubmit () {
    this.props.onSubmit({
      password: this.state.password,
      hideScrollbars: this.state.hideScrollbars
    })
  }

  render () {
    return (
      <ToolbarPanel className={this.props.className}
        toggleIcon={this.props.open ? 'close' : 'settings'}
        onToggle={this.props.onToggle}>
        <Modal open={this.props.open}
          className='toolbar__panel'
          title='Preferences'
          buttonLabel='Apply'
          onSubmit={this.handleSubmit.bind(this)}
          onCancel={this.props.onToggle}>
          <label className='field'>
            <input type='password'
              className='field__input'
              value={this.state.password}
              required
              autoFocus
              onChange={(e) => this.setState({ password: e.target.value })} />
            <span className='field__label'>LCV website password</span>
          </label>

          {process.platform !== 'darwin' && (
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
          )}
        </Modal>
      </ToolbarPanel>
    )
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    open: state.ui.settingsVisible,
    password: state.settings.password,
    hideScrollbars: state.ui.hideScrollbars
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onToggle: () => dispatch({ type: TOGGLE_SETTINGS }),
    onSubmit: (settings: SettingsState) => {
      dispatch({
        type: SAVE_SETTINGS,
        payload: settings
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
