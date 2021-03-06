import React from 'react'
import classnames from 'classnames'

const ICON_GROUPS: { [key: string]: string } = {
  'arrow_drop_down': 'navigation',
  'audiotrack': 'image',
  'check': 'navigation',
  'close': 'navigation',
  'cloud_download': 'file',
  'error': 'alert',
  'help': 'action',
  'help_outline': 'action',
  'info': 'action',
  'info_outline': 'action',
  'pause_circle_filled': 'av',
  'play_circle_filled': 'av',
  'refresh': 'navigation',
  'search': 'action',
  'settings': 'action',
  'voicemail': 'communication'
}

interface IconProps {
  readonly className: string
  readonly icon: string
  readonly style?: {}
  readonly onClick?: () => void
}

const Icon: React.SFC<IconProps> = ({ className, icon, style, onClick }) => (
  <svg className={classnames(className, 'icon')} style={style} onClick={onClick}>
    <use xlinkHref={`../static/sprites/svg-sprite-${ICON_GROUPS[icon]}.svg#ic_${icon}_24px`} />
  </svg>
)

export default Icon
