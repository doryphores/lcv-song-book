import React from 'react'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'

type OverlayProps  = {
  open: boolean
  className?: string
  children: React.ReactNode
}

const Overlay: React.FC<OverlayProps> = ({ open, className, children }) => (
  <CSSTransition in={open} classNames='slide-down' timeout={320} unmountOnExit mountOnEnter>
    <div className={classnames(className, 'modal u-flex u-flex--vertical u-flex--center')}>
      {children}
    </div>
  </CSSTransition>
)

export default Overlay
