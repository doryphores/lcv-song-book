import React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { loadResources, alert, dismissAll } from '../actions'
import ToolbarPanel from './toolbar_panel'
import WebView from './web_view'

interface ScraperProps {
  readonly className: string
  readonly password: string
  readonly lastUpdate: number
  readonly onAlert: (message: string) => void
  readonly onDismissAllNotifications: () => void
  readonly onLoadResources: (resources: ScrapedResource[]) => void
}

interface ScraperState {
  readonly started: boolean
}

class Scraper extends React.Component<ScraperProps, ScraperState> {
  constructor (props: ScraperProps) {
    super(props)
    this.state = { started: false }
  }

  componentDidMount () {
    if (this.props.password) {
      const oneDay = 1000 * 60 * 60 * 24 // in milliseconds
      if (this.props.lastUpdate < (Date.now() - oneDay)) this.start()
    }
  }

  componentWillReceiveProps (nextProps: ScraperProps) {
    if (this.props.password === '' && nextProps.password !== '') this.start()
  }

  start () {
    if (this.state.started) return
    this.props.onDismissAllNotifications()
    this.setState({ started: true })
  }

  handleFinishLoad (e: GlobalEvent) {
    let webview = e.target as Electron.WebviewTag

    switch (webview.getURL()) {
      case 'https://www.londoncityvoices.co.uk/choir-resources/':
        webview.executeJavaScript(
          `(function () {
            if (document.body.textContent.includes("You've entered an invalid password")) {
              return true
            }
            document.querySelector('#smartPassword').value = '${this.props.password}'
            document.querySelector('#smartPWLogin').submit()
            return false
          })()`,
          true, (invalidPassword: boolean) => {
            if (invalidPassword) {
              this.props.onAlert('Invalid LCV website password. Check your password and try again.')
              this.setState({ started: false })
            }
          }
        )
        break
      case 'https://www.londoncityvoices.co.uk/choir-resources/choir-resources-2/':
        this.harvestData(webview)
        break
    }
  }

  harvestData (webview: Electron.WebviewTag) {
    webview.executeJavaScript(
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
      (resources: ScrapedResource[]) => {
        this.props.onLoadResources(resources)
        this.setState({ started: false })
      }
    )
  }

  renderBrowser () {
    if (!this.state.started) return undefined

    return (
      <WebView onDidFinishLoad={this.handleFinishLoad.bind(this)}
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

function mapStateToProps (state: ApplicationState) {
  return {
    password: state.settings.password,
    lastUpdate: state.settings.lastResourceUpdate
  }
}

function mapDispatchToProps (dispatch: ThunkDispatch<ApplicationState, void, Action>) {
  return {
    onDismissAllNotifications: () => dispatch(dismissAll()),
    onAlert: (message: string) => dispatch(alert(message)),
    onLoadResources: (resources: ScrapedResource[]) => dispatch(loadResources(resources))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scraper)
