import React from 'react'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import { DISMISS } from '../actions'

const Notifications = ({ notifications, onDismiss }) => (
  <CSSTransitionGroup component='div'
    className='notifications'
    transitionName='grow'
    transitionEnterTimeout={200}
    transitionLeaveTimeout={200}>
    {notifications.map((notification, i) => (
      <div key={notification}
        className='notifications__item'
        onClick={() => onDismiss(notification)}>
        {notification}
      </div>
    ))}
  </CSSTransitionGroup>
)

function mapStateToProps ({ notifications }) {
  return { notifications }
}

function mapDispatchToProps (dispatch) {
  return {
    onDismiss: (notification) => dispatch({
      type: DISMISS,
      payload: notification
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
