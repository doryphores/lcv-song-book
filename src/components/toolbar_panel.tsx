import React from 'react'
import classnames from 'classnames'

import Icon from './icon'

interface ToolbarPanelProps {
  readonly className: string
  readonly toggleIcon: string
  readonly disabled?: boolean
  readonly spinToggle?: boolean
  readonly onToggle: () => void
  readonly children?: React.ReactChild | React.ReactChild[]
}

const ToolbarPanel: React.FC<ToolbarPanelProps> = ({
  className,
  toggleIcon,
  disabled = false,
  spinToggle = false,
  onToggle,
  children
}) => (
  <div className={className}>
    {children}

    <button className={buttonClassnames(spinToggle)}
      onClick={onToggle}
      disabled={disabled}>
      <Icon icon={toggleIcon} className='toolbar__button-icon' />
    </button>
  </div>
)

function buttonClassnames (spin: boolean) {
  return classnames('toolbar__button', {
    'toolbar__button--spinning': spin
  })
}

export default ToolbarPanel
