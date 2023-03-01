import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { selectSong, resizeSidebar, toggleSidebar, selectList } from '../store/actions'
import Icon from './icon'
import Resizer from './resizer'
import KeyCapture from '../key_capture'

type SidebarProps = {
  className: string
  visible: boolean
  width: number
  songs: Song[]
  selectedSongTitle: string
  selectedList: ApplicationState['selectedList']
  onToggle: () => void
  onSelect: (song: string) => void
  onSelectList: (list: List) => void
  onResize: (width: number) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  visible,
  width,
  songs,
  selectedSongTitle,
  selectedList,
  onToggle,
  onSelect,
  onSelectList,
  onResize
}) => {
  const toggleKeyCapture = useRef<KeyCapture>(null)
  const searchingKeyCapture = useRef<KeyCapture>(null)
  const sidebar = useRef<HTMLDivElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const songList = useRef<HTMLUListElement>(null)
  const songRefs = useRef<HTMLLIElement[]>([])

  const [search, setSearch] = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    toggleKeyCapture.current = new KeyCapture({
      's': () => {
        if (!visible) onToggle()
        searchInput.current.select()
      }
    })
    toggleKeyCapture.current.activate()

    return () => toggleKeyCapture.current.deactivate()
  }, [visible])

  useEffect(() => {
    searchingKeyCapture.current = new KeyCapture({
      'Enter': () => {
        if (highlighted > -1) {
          onSelect(filterSongs()[highlighted].title)
          searchInput.current.blur()
        }
      },
      'Escape': () => searchInput.current.blur(),
      'ArrowUp': () => updateHighlighted(highlighted - 1),
      'ArrowDown': () => updateHighlighted(highlighted + 1)
    })

    if (searching) searchingKeyCapture.current.activate()

    return () => searchingKeyCapture.current.deactivate()
  }, [highlighted, searching])

  useEffect(() => {
    sidebar.current.addEventListener('transitionend', () => {
      window.dispatchEvent(new UIEvent('resize'))
    })

  }, [sidebar])

  useEffect(() => {
    if (selectedSongTitle) {
      const selectedItem = document.querySelector('.sidebar__menu-item--selected')
      selectedItem && selectedItem.scrollIntoView()
    }
  }, [])


  useEffect(() => {
    if (highlighted > -1) {
      const highlightedElement = songRefs.current[highlighted]
      if (!highlightedElement) return

      const listRect = songList.current.getBoundingClientRect()
      const itemRect = highlightedElement.getBoundingClientRect()
      if (itemRect.bottom > listRect.bottom) {
        highlightedElement.scrollIntoView(false)
      } else if (itemRect.top < listRect.top) {
        highlightedElement.scrollIntoView(true)
      }
    }
  }, [highlighted])

  const filterSongs = useCallback(() => {
    const searchString = search.toLowerCase()
    return songs.filter(s => {
      if (selectedList === 'term' && !s.thisTerm) return false
      if (search === '') return true
      return s.title.toLowerCase().includes(searchString)
    })
  }, [songs, search, selectedList])

  const updateHighlighted = useCallback((value: number) => {
    const listLength = filterSongs().length
    if (value < 0) {
      value = listLength - 1
    } else if (value >= listLength) {
      value = 0
    }

    setHighlighted(value)
  }, [filterSongs])

  const startSearch = useCallback(() => {
    setSearching(true)
    setHighlighted(filterSongs().findIndex(s => s.title === selectedSongTitle))
    searchingKeyCapture.current.activate()
  }, [selectedSongTitle])

  const stopSearch = useCallback(() => {
    setSearching(false)
    setHighlighted(-1)
    searchingKeyCapture.current.deactivate()
  }, [])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setHighlighted(-1)
  }, [])

  const classNames = useCallback((classNames: string) => {
    return classnames(classNames, className, {
      'sidebar--collapsed': !visible
    })
  }, [visible, className])

  const itemClassNames = useCallback((title: string, index: number) => {
    return classnames('sidebar__menu-item', {
      'sidebar__menu-item--selected': title === selectedSongTitle,
      'sidebar__menu-item--highlighted': index === highlighted
    })
  }, [selectedSongTitle, highlighted])

  return (
    <div ref={sidebar}
      className={classNames('sidebar')}
      style={{ width: (visible && width) || 0 }}>
      <div className='sidebar__inner u-flex u-flex--vertical'
        style={{ width: width }}>
        <div className='sidebar__search u-flex__panel'>
          <input ref={searchInput}
            type='text'
            placeholder='Search'
            className='sidebar__search-field field__input'
            value={search}
            onFocus={startSearch}
            onBlur={stopSearch}
            onChange={handleSearch} />
          <Icon icon='search' className='sidebar__icon sidebar__search-icon' />
          <Icon icon='close'
            className='sidebar__icon sidebar__close-icon'
            style={{ display: search === '' ? 'none' : 'block' }}
            onClick={() => setSearch('')} />
        </div>
        <ul ref={songList}
          className='sidebar__menu u-flex__panel u-flex__panel--grow'>
          {filterSongs().map((s, i) => (
            <li key={s.title}
              ref={(el) => songRefs.current[i] = el}
              className={itemClassNames(s.title, i)}
              onClick={() => onSelect(s.title)}
              // onContextMenu={() => this.popupMenu(s.title)}
            >
              {s.title}
            </li>
          ))}
        </ul>
        <div className='sidebar__playlist-selector theme--dark u-flex__panel'>
          <label className='field field--dropdown'>
            <select
              className='field__input field__input--select'
              value={selectedList}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => onSelectList(e.target.value as List)}
            >
              <option value='all'>All songs</option>
              <option value='term'>This term</option>
            </select>
            <Icon className='field__icon' icon='arrow_drop_down' />
          </label>
        </div>
      </div>
      <Resizer className='sidebar__resizer'
        onResize={onResize} />
    </div>
  )
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onToggle: () => dispatch(toggleSidebar()),
    onSelect: (title: string) => dispatch(selectSong(title)),
    onSelectList: (list: List) => dispatch(selectList(list)),
    onResize: (width: number) => dispatch(resizeSidebar(width))
  }
}

function mapStateToProps (state: ApplicationState) {
  return {
    selectedSongTitle: state.selectedSong,
    selectedList: state.selectedList,
    songs: state.songs,
    visible: state.ui.sidebarVisible,
    width: state.ui.sidebarWidth
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
