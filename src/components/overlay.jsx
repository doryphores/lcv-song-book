import React from 'react'
import classnames from 'classnames'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import FirstChild from './first_child'

const Overlay = ({ open, className, children }) => (
  <CSSTransitionGroup component={FirstChild}
    transitionName='slide-down'
    transitionEnterTimeout={400}
    transitionLeaveTimeout={400}>
    {open && (<div className={classnames(className, 'modal u-flex u-flex--vertical u-flex--center')}>
      {children}
    </div>)}
  </CSSTransitionGroup>
)

export default Overlay
