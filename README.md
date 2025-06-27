# Put.io M3U Download

**Download the latest user script from the [Releases page](https://github.com/missingfoot/putio-m3u-dl/releases).**

Adds an M3U download button next to XSPF on put.io, making it easy to generate and download M3U playlists directly from the put.io web interface. 

**The main goal of this script is to let you open M3U streams with the MPC-HC (Media Player Classic - Home Cinema) application on Windows.**

## Features
- Adds a styled "MPC-HC playlist" (M3U) download button next to the existing XSPF button on put.io
- Converts XSPF playlists to M3U format on the fly
- Downloads the M3U file with a relevant filename

## Installation
1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) in your browser.
2. Go to the [Releases page](https://github.com/missingfoot/putio-m3u-dl/releases) and click the [`putio_m3u_download.user.js`](https://github.com/missingfoot/putio-m3u-dl/releases/latest) link. Your userscript manager will prompt you to install the script automatically.
3. (Recommended) In Windows Explorer, right-click any `.m3u` file, choose "Open with" > "Choose another app", and look for the MPC-HC directory in the Program Files folder and set **MPC-HC** (or your preferred M3U-capable app) as the default. This lets you easily double-click the M3U files to open them in your chosen application.
4. Visit [put.io](https://app.put.io/) and enjoy the new M3U download button

## Repository
[https://github.com/missingfoot/putio-m3u-dl](https://github.com/missingfoot/putio-m3u-dl) 