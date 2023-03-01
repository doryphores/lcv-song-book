import React from 'react'
import classnames from 'classnames'

import ActionSprite from '../static/sprites/svg-sprite-action.svg'
import AlertSprite from '../static/sprites/svg-sprite-alert.svg'
import NavigationSprite from '../static/sprites/svg-sprite-navigation.svg'
import ImageSprite from '../static/sprites/svg-sprite-image.svg'
import FileSprite from '../static/sprites/svg-sprite-file.svg'
import AVSprite from '../static/sprites/svg-sprite-av.svg'
import CommunicationSprite from '../static/sprites/svg-sprite-communication.svg'

const ICON_GROUPS: { [key: string]: string } = {
  'arrow_drop_down': NavigationSprite,
  'audiotrack': ImageSprite,
  'check': NavigationSprite,
  'close': NavigationSprite,
  'cloud_download': FileSprite,
  'error': AlertSprite,
  'help': ActionSprite,
  'help_outline': ActionSprite,
  'info': ActionSprite,
  'info_outline': ActionSprite,
  'pause_circle_filled': AVSprite,
  'play_circle_filled': AVSprite,
  'refresh': NavigationSprite,
  'search': ActionSprite,
  'settings': ActionSprite,
  'voicemail': CommunicationSprite,
}

type IconProps = {
  className: string
  icon: string
  style?: React.CSSProperties
  onClick?: () => void
}

const Icon: React.FC<IconProps> = ({ className, icon, style, onClick }) => (
  <svg className={classnames(className, 'icon')} style={style} onClick={onClick}>
    <use xlinkHref={`${ICON_GROUPS[icon]}#ic_${icon}_24px`} />
  </svg>
)

export default Icon
