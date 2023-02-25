import React from 'react'
import classnames from 'classnames'

import Icon from './icon'

type ToolbarPanelProps = {
  className: string
  toggleIcon: string
  disabled?: boolean
  spinToggle?: boolean
  onToggle: () => void
  children?: React.ReactNode
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
