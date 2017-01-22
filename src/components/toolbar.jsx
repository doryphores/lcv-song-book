import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { SELECT_VOICE } from '../actions'
import Scraper from './scraper'
import Icon from './icon'

const VOICES = ['Soprano 1', 'Soprano 2', 'Alto 1', 'Alto 2', 'Tenor 1', 'Tenor 2', 'Bass']

class Toolbar extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false
    }
  }

  toggleSettings () {
    this.setState({ open: !this.state.open })
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'toolbar u-flex u-flex--horizontal')}>
        <label className='field field--dropdown u-flex__panel u-flex__panel--grow'>
          <select className='field__input field__input--select'
            value={this.props.selectedVoice}
            onChange={(e) => this.props.onSelect(e.target.value)}>
            {VOICES.map(v => <option key={v}>{v}</option>)}
          </select>
          <Icon className='field__icon' icon='arrow_drop_down' />
        </label>

        <Scraper className='u-flex__panel' open={this.state.open} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    selectedVoice: state.selectedVoice
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSelect: (voice) => dispatch({
      type: SELECT_VOICE,
      payload: voice
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
