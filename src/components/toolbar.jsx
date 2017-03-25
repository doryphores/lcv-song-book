import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectVoice } from '../actions'
import Scraper from './scraper'
import Settings from './settings'
import Icon from './icon'

const VOICES = [
  'Soprano 1',
  'Soprano 2',
  'Alto 1',
  'Alto 2',
  'Tenor 1',
  'Tenor 2',
  'Bass 1',
  'Bass 2'
]

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

  selectVoice (e) {
    this.props.onSelect(e.target.value)
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'toolbar u-flex u-flex--horizontal')}>
        <div className='toolbar__voice-selector u-flex__panel theme--dark'>
          <label className='field field--dropdown'>
            <select className='field__input field__input--select'
              value={this.props.selectedVoice}
              onChange={this.selectVoice.bind(this)}
              onClick={(e) => e.target.blur()}>
              {VOICES.map(v => <option key={v}>{v}</option>)}
            </select>
            <Icon className='field__icon' icon='arrow_drop_down' />
          </label>
        </div>

        <Scraper className='u-flex__panel' />
        <Settings className='u-flex__panel' />
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
    onSelect: (voice) => dispatch(selectVoice(voice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
