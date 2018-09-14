import classnames from 'classnames'
import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { selectVoice } from '../actions'
import { sheetMusicURL } from '../selectors'
import Scraper from './scraper'
import Downloader from './downloader'
import Settings from './settings'
import Shortcuts from './shortcuts'
import Icon from './icon'

interface ToolbarProps {
  readonly className: string
  readonly selectedVoice: string
  readonly sheetMusicURL: string
  readonly onSelectVoice: (voice: string) => void
}

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

class Toolbar extends React.Component<ToolbarProps> {
  selectVoice (e: ChangeEvent<HTMLSelectElement>) {
    this.props.onSelectVoice(e.target.value)
    e.target.blur()
  }

  render () {
    return (
      <div className={classnames(this.props.className, 'toolbar u-flex u-flex--horizontal')}>
        <div className='toolbar__voice-selector u-flex__panel theme--dark'>
          <label className='field field--dropdown'>
            <select className='field__input field__input--select'
              value={this.props.selectedVoice}
              onChange={this.selectVoice.bind(this)}>
              {VOICES.map(v => <option key={v}>{v}</option>)}
            </select>
            <Icon className='field__icon' icon='arrow_drop_down' />
          </label>
        </div>

        <Scraper className='u-flex__panel' />
        <Downloader className='u-flex__panel'
          pdfURL={this.props.sheetMusicURL} />
        <Settings className='u-flex__panel' />
        <Shortcuts className='u-flex__panel' />
      </div>
    )
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    selectedVoice: state.selectedVoice,
    sheetMusicURL: sheetMusicURL(state)!
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onSelectVoice: (voice: string) => dispatch(selectVoice(voice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
