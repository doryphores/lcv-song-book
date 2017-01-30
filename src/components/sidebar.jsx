import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectSong } from '../actions'
import Icon from './icon'
import KeyCapture from '../key_capture'

class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      search: '',
      highlighted: -1,
      searching: false
    }

    this.keyCapture = new KeyCapture()
    this.keyCapture.register('S', () => this.refs.searchInput.focus())

    this.searchKeyListeners = [
      this.keyCapture.register('enter', () => {
        if (this.state.highlighted > -1) {
          this.props.onSelect(this.filterSongs()[this.state.highlighted].title)
        }
      }, { active: false }),
      this.keyCapture.register('escape', () => {
        this.refs.searchInput.blur()
      }, { active: false }),
      this.keyCapture.register('down', () => {
        this.updateHighlighted(this.state.highlighted + 1)
      }, { active: false }),
      this.keyCapture.register('up', () => {
        this.updateHighlighted(this.state.highlighted - 1)
      }, { active: false })
    ]
  }

  componentDidMount () {
    if (this.props.selectedSong) {
      document.querySelector('.sidebar__menu-item--selected').scrollIntoView()
    }
    this.keyCapture.activate()
  }

  componentWillUnmount () {
    this.keyCapture.deactivate()
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
    this.searchKeyListeners.forEach(l => l.activate())
  }

  stopSearch () {
    this.setState({
      searching: false,
      highlighted: -1
    })
    this.searchKeyListeners.forEach(l => l.deactivate())
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
