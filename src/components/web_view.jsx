import React from 'react'

export default class WebView extends React.Component {
  componentDidMount () {
    this.webview.addEventListener('did-finish-load', this.props.onDidFinishLoad)
  }

  componentWillUnmount () {
    this.webview.removeEventListener('did-finish-load', this.props.onDidFinishLoad)
  }

  bindWebView (el) {
    this.webview = el
  }

  render () {
    return (
      <webview ref={this.bindWebView.bind(this)}
        style={{ width: 0, height: 0 }}
        src={this.props.src} />
    )
  }
}
