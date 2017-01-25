import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectSong, RESIZE_SIDEBAR } from '../actions'

class Sidebar extends React.Component {
  constructor () {
    super()
    this.handleResize = this.handleResize.bind(this)
    this.stopResize = this.stopResize.bind(this)
  }

  startResize () {
    window.addEventListener('mousemove', this.handleResize)
    window.addEventListener('mouseup', this.stopResize)
  }

  stopResize () {
    window.removeEventListener('mousemove', this.handleResize)
    window.removeEventListener('mouseup', this.stopResize)
  }

  handleResize (e) {
    this.props.onResize(e.clientX)
    window.dispatchEvent(new window.Event('resize'))
  }

  classNames (classNames) {
    return classnames(classNames, this.props.className, {
      'sidebar--collapsed': !this.props.visible
    })
  }

  itemClassNames (title) {
    return classnames('sidebar__menu-item', {
      'sidebar__menu-item--selected': title === this.props.selectedSong.title
    })
  }

  render () {
    return (
      <div className={this.classNames('sidebar')}>
        <ul className='sidebar__menu'
          style={{ width: this.props.width }}>
          {this.props.songs.map(s => (
            <li key={s.title}
              className={this.itemClassNames(s.title)}
              onClick={() => this.props.onSelect(s.title)}>
              {s.title}
            </li>
          ))}
        </ul>
        <div className='sidebar__resizer u-flex__panel'
          onMouseDown={this.startResize.bind(this)} />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSelect: (title) => dispatch(selectSong(title)),
    onResize: (width) => {
      dispatch({
        type: RESIZE_SIDEBAR,
        payload: width
      })
    }
  }
}

function mapStateToProps (state) {
  return {
    selectedSong: state.selectedSong,
    songs: state.songs,
    width: state.ui.sidebarWidth,
    visible: state.ui.sidebarVisible
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
