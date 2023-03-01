import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { TOGGLE_SETTINGS, SAVE_SETTINGS } from '../store/actions'
import ToolbarPanel from './toolbar_panel'
import Icon from './icon'
import Modal from './modal'

type SettingsState = {
  username: string
  password: string
  hideScrollbars: boolean
}

type SettingsProps = {
  className: string
  open: boolean
  onSubmit: (settings: SettingsState) => void
  onToggle: () => void
} & SettingsState

const Settings: React.FC<SettingsProps> = ({
  username,
  password,
  hideScrollbars,
  className,
  open,
  onSubmit,
  onToggle,
}) => {
  const [state, setState] = useState<SettingsState>({ username, password, hideScrollbars })

  useEffect(() => {
    if (open) {
      setState({
        username: username,
        password: password,
        hideScrollbars: hideScrollbars,
      })
    }
  }, [open])

  const handleSubmit = useCallback(() => {
    onSubmit({
      username: state.username,
      password: state.password,
      hideScrollbars: state.hideScrollbars,
    })
  }, [state])

  return (
    <ToolbarPanel className={className}
      toggleIcon={open ? 'close' : 'settings'}
      onToggle={onToggle}>
      <Modal open={open}
        className='toolbar__panel'
        title='Preferences'
        buttonLabel='Apply'
        onSubmit={handleSubmit}
        onCancel={onToggle}>
        <label className='field'>
          <input type='text'
            className='field__input'
            value={state.username}
            required
            autoFocus
            onChange={(e) => setState({ ...state, username: e.target.value })} />
          <span className='field__label'>LCV website username</span>
        </label>
        <label className='field'>
          <input type='password'
            className='field__input'
            value={state.password}
            required
            onChange={(e) => setState({ ...state, password: e.target.value })} />
          <span className='field__label'>LCV website password</span>
        </label>
        {api.platform !== 'darwin' && (
          <label className='field checkbox'>
            <input className='checkbox__input'
              type='checkbox'
              checked={state.hideScrollbars}
              onChange={(e) => setState({ ...state, hideScrollbars: e.target.checked })} />
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

function mapStateToProps (state: ApplicationState) {
  return {
    open: state.ui.settingsVisible,
    username: state.settings.username,
    password: state.settings.password,
    hideScrollbars: state.ui.hideScrollbars,
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onToggle: () => dispatch({ type: TOGGLE_SETTINGS }),
    onSubmit: (settings: SettingsState) => {
      dispatch({
        type: SAVE_SETTINGS,
        payload: settings,
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
