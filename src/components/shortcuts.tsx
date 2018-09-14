import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { TOGGLE_SHORTCUTS } from '../actions'
import ToolbarPanel from './toolbar_panel'
import Overlay from './overlay'
import KeyCapture from '../key_capture'

const CMD_OR_CONTROL = process.platform === 'darwin' ? '⌘' : 'Ctrl'

interface ShortcutsProps {
  readonly className: string
  readonly open: boolean
  readonly onToggle: () => void
}

class Shortcuts extends React.Component<ShortcutsProps> {
  private keyCapture: KeyCapture

  constructor (props: ShortcutsProps) {
    super(props)

    this.keyCapture = new KeyCapture({
      'Escape': props.onToggle
    })
  }

  componentWillUnmount () {
    this.keyCapture.deactivate()
  }

  componentWillReceiveProps (nextProps: ShortcutsProps) {
    if (nextProps.open && !this.props.open) {
      this.keyCapture.activate()
    } else if (!nextProps.open && this.props.open) {
      this.keyCapture.deactivate()
    }
  }

  render () {
    return (
      <ToolbarPanel className={this.props.className}
        toggleIcon={this.props.open ? 'close' : 'help'}
        onToggle={this.props.onToggle}>
        <Overlay className='toolbar__panel' open={this.props.open}>
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
