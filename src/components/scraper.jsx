import React from 'react'
import { connect } from 'react-redux'
import WebView from 'react-electron-webview'
import cheerio from 'cheerio'

import { LOAD_RESOURCES } from '../actions'

class Scraper extends React.Component {
  constructor () {
    super()
    this.state = {
      password: '',
      progress: '',
      started: false
    }
  }

  getResources () {
    this.setState({
      started: true,
      progress: 'Accessing LCV website...'
    })
  }

  handleFinishLoad (e) {
    switch (e.target.getURL()) {
      case 'http://www.londoncityvoices.co.uk/choir-resources/':
        e.target.executeJavaScript(`
          document.querySelector('#smartPassword').value = '${this.state.password}'
          document.querySelector('#smartPWLogin').submit()
        `, true, () => this.setState({ progress: 'Logging in to resources area...' }))
        break
      case 'http://www.londoncityvoices.co.uk/choir-resources/choir-resources-2/':
        this.setState({ progress: 'Retrieving LCV resource information...' })
        this.harvestData(e.target)
        break
    }
  }

  harvestData (webView) {
    webView.executeJavaScript('document.querySelector("#downloads").innerHTML', true, html => {
      let $ = cheerio.load(html)

      let resources = $('a[href$=pdf], a[href$=mp3]').map((i, el) => {
        return {
          title: $(el).closest('tr').find('td:first-child').text().trim(),
          voice: $(el).text().trim(),
          url: $(el).attr('href').trim()
        }
      }).toArray()

      this.props.loadResources(resources)

      this.setState({
        progress: `Retrieved ${resources.length} resources`
      })
    })
  }

  renderBrowser () {
    if (!this.state.started) return null

    return (
      <WebView style={{ width: 0, height: 0 }}
        onDidFinishLoad={this.handleFinishLoad.bind(this)}
        src='http://www.londoncityvoices.co.uk/choir-resources/' />
    )
  }

  render () {
    return (
      <div className='scraper'>
        <input type='password'
          placeholder='LCV resources password'
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })} />
        <button onClick={this.getResources.bind(this)}>Get resources</button>
        <span>{this.state.progress}</span>
        {this.renderBrowser()}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadResources: resources => dispatch({
      type: LOAD_RESOURCES,
      payload: resources
    })
  }
}

export default connect(undefined, mapDispatchToProps)(Scraper)
