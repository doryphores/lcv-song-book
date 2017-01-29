import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectSong } from '../actions'
import Icon from './icon'

class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      search: '',
      highlighted: -1,
      searching: false
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount () {
    if (this.props.selectedSong) {
      document.querySelector('.sidebar__menu-item--selected').scrollIntoView()
    }
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.highlighted - this.state.highlighted) {
      let highlightedElement = this.refs[`item-${this.state.highlighted}`]
      let listRect = this.refs.songList.getBoundingClientRect()
      let itemRect = highlightedElement.getBoundingClientRect()
      if (itemRect.bottom > listRect.bottom) {
        highlightedElement.scrollIntoView(false)
      } else if (itemRect.top < listRect.top) {
        highlightedElement.scrollIntoView(true)
      }
    }
  }

  handleKeyDown (e) {
    switch (e.which) {
      case 83: // S
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
        this.refs.searchInput.focus()
        e.preventDefault()
        break
      case 40: // Down arrow
        if (!this.state.searching) return
        e.preventDefault()
        this.updateHighlighted(this.state.highlighted + 1)
        break
      case 38: // Up arrow
        if (!this.state.searching) return
        e.preventDefault()
        this.updateHighlighted(this.state.highlighted - 1)
        break
      case 13: // Enter
        if (!this.state.searching || this.state.highlighted === -1) return
        this.props.onSelect(this.filterSongs()[this.state.highlighted].title)
        break
      case 27: // Escape
        if (!this.state.searching) return
        this.refs.searchInput.blur()
        break
    }
  }

  updateHighlighted (value) {
    let listLength = this.filterSongs().length
    if (value < 0) {
      value = listLength - 1
    } else if (value >= listLength) {
      value = 0
    }
    this.setState({ highlighted: value })
  }

  filterSongs () {
    if (this.state.search === '') return this.props.songs
    let pattern = new RegExp(`${this.state.search}`, 'i')
    return this.props.songs.filter(s => pattern.test(s.title))
  }

  startSearch () {
    this.setState({
      searching: true
    })
  }

  stopSearch () {
    this.setState({
      searching: false,
      highlighted: -1
    })
  }

  handleSearch (e) {
    this.setState({
      search: e.target.value,
      highlighted: -1
    })
  }

  classNames (classNames) {
    return classnames(classNames, this.props.className, {
      'sidebar--collapsed': !this.props.visible
    })
  }

  itemClassNames (title, index) {
    return classnames('sidebar__menu-item', {
      'sidebar__menu-item--selected': title === this.props.selectedSong.title,
      'sidebar__menu-item--highlighted': index === this.state.highlighted
    })
  }

  render () {
    return (
      <div className={this.classNames('sidebar u-flex u-flex--vertical')}>
        <div className='sidebar__search u-flex__panel'>
          <input ref='searchInput'
            type='text'
            placeholder='Search'
            className='sidebar__search-field field__input'
            value={this.state.search}
            onFocus={this.startSearch.bind(this)}
            onBlur={this.stopSearch.bind(this)}
            onChange={this.handleSearch.bind(this)} />
          <Icon icon='search' className='sidebar__icon sidebar__search-icon' />
          <Icon icon='close'
            className='sidebar__icon sidebar__close-icon'
            style={{ display: this.state.search === '' ? 'none' : 'block' }}
            onClick={() => this.setState({ search: '' })} />
        </div>
        <ul ref='songList'
          className='sidebar__menu u-flex__panel u-flex__panel--grow'>
          {this.filterSongs().map((s, i) => (
            <li key={s.title}
              ref={`item-${i}`}
              className={this.itemClassNames(s.title, i)}
              onClick={() => this.props.onSelect(s.title)}>
              {s.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSelect: (title) => dispatch(selectSong(title))
  }
}

function mapStateToProps (state) {
  return {
    selectedSong: state.selectedSong,
    songs: state.songs,
    visible: state.ui.sidebarVisible
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
