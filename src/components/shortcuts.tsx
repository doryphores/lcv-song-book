import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { TOGGLE_SHORTCUTS } from '../store/actions'
import ToolbarPanel from './toolbar_panel'
import Overlay from './overlay'
import KeyCapture from '../key_capture'

const CMD_OR_CONTROL = api.platform === 'darwin' ? '⌘' : 'Ctrl'

type ShortcutsProps = {
  className: string
  open: boolean
  onToggle: () => void
}

const Shortcuts: React.FC<ShortcutsProps> = ({
  className,
  open,
  onToggle
}) => {
  const keyCapture = useRef<KeyCapture>()

  useEffect(() => {
    keyCapture.current = new KeyCapture({
      'Escape': onToggle
    })

    return () => keyCapture.current.deactivate()
  }, [])

  useEffect(() => {
    if (open) keyCapture.current.activate()
    else keyCapture.current.deactivate()
  }, [open])

  return (
    <ToolbarPanel
      className={className}
      toggleIcon={open ? 'close' : 'help'}
      onToggle={onToggle}
    >
      <Overlay className='toolbar__panel' open={open}>
        <div className='modal__panel'>
          <h2 className='modal__heading'>Keyboard shortcuts</h2>

          <table className='shortcuts'>
            <tbody>
              <tr>
                <th>Play/Pause</th>
                <td>
                  <span className='shortcuts__keystroke'>SPACE</span>
                </td>
              </tr>
              <tr>
                <th>Place a marker on the track</th>
                <td>
                  <span className='shortcuts__keystroke'>M</span>
                </td>
              </tr>
              <tr>
                <th>Rewind (back to marker or beginning)</th>
                <td>
                  <span className='shortcuts__keystroke'>⬅</span>
                </td>
              </tr>
              <tr>
                <th>Fast forward (forward to the next marker)</th>
                <td>
                  <span className='shortcuts__keystroke'>➡</span>
                </td>
              </tr>
              <tr>
                <th>Select single voice recording</th>
                <td>
                  <span className='shortcuts__keystroke'>V</span>
                </td>
              </tr>
              <tr>
                <th>Select full recording</th>
                <td>
                  <span className='shortcuts__keystroke'>F</span>
                </td>
              </tr>
              <tr>
                <th>Select split voice recording (your selected voice on the left channel and all voices on the right)</th>
                <td>
                  <span className='shortcuts__keystroke'>B</span>
                </td>
              </tr>
              <tr>
                <th>Toggle search</th>
                <td>
                  <span className='shortcuts__keystroke'>
                    S
                  </span>
                </td>
              </tr>
              <tr>
                <th>Toggle sidebar</th>
                <td>
                  <span className='shortcuts__keystroke'>
                    {CMD_OR_CONTROL} + \
                  </span>
                </td>
              </tr>
              <tr>
                <th>Settings</th>
                <td>
                  <span className='shortcuts__keystroke'>
                    {CMD_OR_CONTROL} + ,
                  </span>
                </td>
              </tr>
              <tr>
                <th>Keyboard shortcuts</th>
                <td>
                  <span className='shortcuts__keystroke'>
                    ?
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Overlay>
    </ToolbarPanel>
  )
}

function mapStateToProps (state: ApplicationState) {
  return { open: state.ui.shortcutsVisible }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onToggle: () => dispatch({ type: TOGGLE_SHORTCUTS })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shortcuts)
