import React from 'react'

interface WebViewProps {
  readonly onDidFinishLoad: (event: GlobalEvent) => void
  readonly src: string
}

export default class WebView extends React.Component<WebViewProps> {
  private webviewElement?: Electron.WebviewTag

  componentDidMount () {
    this.webviewElement!.addEventListener(
      'did-finish-load',
      this.props.onDidFinishLoad
    )
  }

  componentWillUnmount () {
    this.webviewElement!.removeEventListener(
      'did-finish-load',
      this.props.onDidFinishLoad
    )
  }

  render () {
    return (
      <webview ref={(el: Electron.WebviewTag) => this.webviewElement = el}
        style={{ width: 0, height: 0 }}
        src={this.props.src} />
    )
  }
}
