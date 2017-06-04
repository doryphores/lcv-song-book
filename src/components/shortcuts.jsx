import React from 'react'
import { connect } from 'react-redux'

import { TOGGLE_SHORTCUTS } from '../actions'
import ToolbarPanel from './toolbar_panel'
import Overlay from './overlay'

let cmdOrCtrl = process.os === 'darwin' ? '⌘' : 'Ctrl'

class Shortcuts extends React.Component {
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
                      {cmdOrCtrl} + \
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Settings</th>
                  <td>
                    <span className='shortcuts__keystroke'>
                      {cmdOrCtrl} + ,
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

function mapStateToProps (state) {
  return { open: state.ui.shortcutsVisible }
}

function mapDispatchToProps (dispatch) {
  return {
    onToggle: () => dispatch({ type: TOGGLE_SHORTCUTS })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shortcuts)
