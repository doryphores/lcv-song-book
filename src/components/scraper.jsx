import React from 'react'
import { connect } from 'react-redux'
import WebView from 'react-electron-webview'

import { loadResources, alert, DISMISS_ALL } from '../actions'
import ToolbarPanel from './toolbar_panel'

class Scraper extends React.Component {
  constructor () {
    super()
    this.state = { started: false }
  }

  componentDidMount () {
    if (this.props.password) {
      let oneDay = 1000 * 60 * 60 * 24 // in milliseconds
      if (this.props.lastUpdate < (Date.now() - oneDay)) this.start()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.password === '' && nextProps.password !== '') {
      this.start()
    }
  }

  start () {
    if (this.state.started) return
    this.props.dismissAllNotifications()
    this.setState({ started: true })
  }

  handleFinishLoad (e) {
    switch (e.target.getURL()) {
      case 'https://www.londoncityvoices.co.uk/choir-resources/':
        e.target.executeJavaScript(
          `(function () {
            if (document.body.textContent.includes("You've entered an invalid password")) {
              return true
            }
            document.querySelector('#smartPassword').value = '${this.props.password}'
            document.querySelector('#smartPWLogin').submit()
            return false
          })()`,
          true, (invalidPassword) => {
            if (invalidPassword) {
              this.props.alert('Invalid LCV website password. Check your password and try again.')
              this.setState({ started: false })
            }
          }
        )
        break
      case 'https://www.londoncityvoices.co.uk/choir-resources/choir-resources-2/':
        this.harvestData(e.target)
        break
    }
  }

  harvestData (webView) {
    webView.executeJavaScript(
      `Array.prototype.slice.call(
        document.querySelectorAll('#downloads a[href$=pdf], #downloads a[href$=mp3]'),
        0
      ).filter(el => el.href.indexOf('/admin/') === -1).map(el => {
        return {
          title: el.closest('tr').querySelector('td:first-child').innerHTML.trim(),
          voice: el.innerHTML.trim(),
          url: el.href
        }
      })`,
      true,
      resources => {
        this.props.loadResources(resources)
        this.setState({ started: false })
      }
    )
  }

  renderBrowser () {
    if (!this.state.started) return null

    return (
      <WebView style={{ width: 0, height: 0 }}
        onDidFinishLoad={this.handleFinishLoad.bind(this)}
        src='https://www.londoncityvoices.co.uk/choir-resources/' />
    )
  }

  render () {
    return (
      <ToolbarPanel className={this.props.className}
        toggleIcon='refresh'
        onToggle={this.start.bind(this)}
        spinToggle={this.state.started}>
        {this.renderBrowser()}
      </ToolbarPanel>
    )
  }
}

function mapStateToProps (state) {
  return {
    password: state.settings.password,
    lastUpdate: state.settings.lastResourceUpdate
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dismissAllNotifications: () => dispatch({ type: DISMISS_ALL }),
    alert: notification => dispatch(alert(notification)),
    loadResources: resources => dispatch(loadResources(resources))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scraper)
