import React from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Dispatch } from 'redux'

import { notifications } from '../selectors'
import Icon from './icon'
import { dismiss, selectSong } from '../actions'

interface NotificationsProps {
  readonly notifications: Notification[]
  readonly onDismiss: (id: number) => void
  readonly onView: (song: string) => void
}

const Notifications: React.SFC<NotificationsProps> = ({ notifications, onDismiss, onView }) => (
  <TransitionGroup className='notification-container' component='div'>
    {notifications.map(({ id, message, icon, song }) => (
      <CSSTransition key={id} timeout={320} classNames='grow' unmountOnExit mountOnEnter>
        <div className='notification u-flex u-flex--horizontal'
          onClick={() => onDismiss(id)}>
          <Icon icon={icon} className='notification__icon u-flex__panel' />
          <span className='u-flex__panel u-flex__panel--grow'>
            {message + ' '}
            {song && (
              <span className='notification__song' onClick={() => onView(song)}>
                {song}
              </span>
            )}
          </span>
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
)

function mapStateToProps (state: ApplicationState) {
  return {
    notifications: notifications(state)
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onDismiss: (id: number) => dispatch(dismiss(id)),
    onView: (song: string) => dispatch(selectSong(song))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
