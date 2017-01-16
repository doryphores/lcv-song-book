import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { SELECT_VOICE } from '../actions'
// import Scraper from './scraper'

const VOICES = ['Soprano 1', 'Soprano 2', 'Alto 1', 'Alto 2', 'Tenor 1', 'Tenor 2', 'Bass']

const Toolbar = ({ className, selectedVoice, onSelect }) => (
  <div className={classnames(className, 'toolbar')}>
    <select value={selectedVoice} onChange={(e) => onSelect(e.target.value)}>
      {VOICES.map(v => (
        <option key={v}>{v}</option>
      ))}
    </select>
  </div>
)

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
