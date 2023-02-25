import { BrowserView, BrowserWindow, session, WebRequestFilter } from "electron"
import { mapKeys, sortBy, unionBy } from "lodash"

export async function getSongs (appWindow: BrowserWindow, credentials: Credentials) {
  const scraper = new Scraper(appWindow)
  return await scraper.run(credentials)
}

const LOGIN_URL = 'https://www.londoncityvoices.co.uk/lcv/forms/login'
const SONGS_URL = 'https://www.londoncityvoices.co.uk/choirmembership/all-songs'

class Scraper {
  appWindow: BrowserWindow
  view: BrowserView

  constructor (appWindow: BrowserWindow) {
    this.appWindow = appWindow
    this.view = new BrowserView({
      webPreferences: { partition: this.setupSession() }
    })

    this.appWindow.addBrowserView(this.view)
    this.view.setBounds({ x: 0, y: 50, width: 0, height: 0 })
    // this.view.webContents.openDevTools()
  }

  setupSession () {
    const partition = 'scraper'
    const ses = session.fromPartition(partition)

    const filter: WebRequestFilter = {
      urls: [
        'mp3',
        'png',
        'jpeg',
        'jpg',
        'css',
        'svg',
        'woff',
        'otf',
        'woff2'
      ].map(ext => `https://*/*.${ext}`)
    }

    // block all unnecessary asset requests to optimize scraping process
    ses.webRequest.onBeforeRequest(filter, (_request, callback) => {
      callback({ cancel: true })
    })

    return partition
  }

  async run ({ username, password }: Credentials) {
    await this.loadURL(LOGIN_URL)
    await this.waitForElement('input[name=username]')
    await this.fill('username', username)
    await this.fill('password', password)
    await this.submitForm()
    // FIXME: return error when login fails
    await this.waitForContent('Welcome to LCV!')
    await this.loadURL(SONGS_URL)
    const songs = await this.collectSongs()
    this.appWindow.removeBrowserView(this.view)
    return songs
  }

  private async collectSongs (pageURL: string = SONGS_URL, songs: Song[] = []): Promise<Song[]> {
    await this.loadURL(pageURL)
    const pageSongs = await this.collectSongsFromPage()
    const nextPage = await this.runScript(`document.querySelector('[aria-label="Next Page"]')?.href`)
    songs = unionBy(songs, pageSongs, 'title')
    if (nextPage) return await this.collectSongs(nextPage, songs)

    for (const song of songs) {
      const { sheets, recordings } = await this.collectSongDetails(song.url)

      song.sheets = mapKeys(sheets, (_v, k) => k.toLowerCase())
      song.recordings = mapKeys(recordings, (_v, k) => k.toLowerCase())
    }

    return sortBy(songs, 'title')
  }

  private async collectSongsFromPage (): Promise<Song[]> {
    return this.runScript(`
      Array.from(document.querySelectorAll('h1.songtitle')).map(el => {
        return {
          title: el.innerText,
          url: el.parentElement.parentElement.href
        }
      }).filter(s => s.url)
    `, false)
  }

  private async collectSongDetails (url: string): Promise<Song> {
    await this.loadURL(url)
    console.log(`collecting ${url}`)
    return this.runScript(`
      (function () {
        const sheets = Array.from(document.querySelectorAll('.pdf-button')).reduce((r, button) => {
          return {
            ...r,
            [button.textContent]: button.href
          }
        }, {})
        const recordings = Array.from(document.querySelectorAll('[data-plyr=download]')).reduce((r, el) => {
          return {
            ...r,
            [el.parentElement.parentElement.parentElement.previousSibling.textContent]: el.href
          }
        }, {})
        return { sheets, recordings }
      })()
    `, false)
  }

  private loadURL (url: string): Promise<void> {
    this.view.webContents.loadURL(url)
    return new Promise(resolve => {
      this.view.webContents.once('dom-ready', () => {
        resolve()
      })
    })
  }

  private runScript (script: string, userGesture = true) {
    return this.view.webContents.executeJavaScript(
      script,
      userGesture
    )
  }

  private fill (inputName: string, value: string) {
    return this.runScript(`
      const ${inputName} = document.querySelector('input[name=${inputName}]')
      ${inputName}.value = '${value}'
      ${inputName}.dispatchEvent(new Event('input', { bubbles: true }))
    `)
  }

  private submitForm (): Promise<void> {
    this.runScript(`
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      document.querySelector('button').dispatchEvent(clickEvent)
    `)
    return new Promise(resolve => {
      this.view.webContents.once('did-finish-load', () => resolve())
    })
  }

  private waitForElement (selector: string) {
    return this.waitFor(`document.querySelector('${selector}')`)
  }

  private waitForContent (content: string) {
    return this.waitFor(`document.body.textContent.includes('${content}')`, `waiting for content #{content}`)
  }

  private waitFor (condition: string, msg = '') {
    return this.runScript(`
      function delay (timeout, cb) {
        return new Promise (resolve => {
          setTimeout(() => resolve(cb()), timeout)
        })
      }
      async function waitForCondition () {
        if (${condition}) {
          console.log('found content!')
          return
        }
        console.log('${msg}')
        return await delay(100, waitForCondition)
      }
      waitForCondition()
    `)
  }
}
