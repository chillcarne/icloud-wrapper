
# iCloud Wrapper
Electron wrapper for Apple iCloud (https://www.icloud.com)

## Features

#### Startup
- **Continue where you left off**  
  Automatically reopens the last visited page on next launch instead of the default homepage.

> ℹ️ Press `Alt` to open the settings menu.

## Installation

Download prebuilt installers from the [Releases page](https://github.com/chillcarne/icloud-wrapper/releases):

- Windows: `.exe` installer
- Linux: `.deb` package

> ℹ️ For other distributions (macOS, Fedora, Arch, etc.), build from source.

## Building from source

Make sure you have the following installed:

- Node.js
- npm
- Git

Then clone and install dependencies:

```bash
git clone https://github.com/chillcarne/icloud-wrapper.git
cd icloud-wrapper
npm install
```

**Run in development mode**

```bash
npm start
```

## Create distribution builds

Platform-specific builds are created with:


#### Windows
```bash
npm run dist-windows
```

#### Linux (DEB)
```bash
npm run dist-linux
```

#### macOS
```bash
npm run dist-macos
```
> ⚠️ **Note**: macOS builds have not been tested. Use at your own risk or build from source if needed.

#### All platforms (if supported on your system)
```bash
npm run dist-all
```

## Project structure

`main.js` — Main entry point for the Electron app

`resources/icon.*` — Platform-specific icons

`settings.json` — Saved in the user data directory (app.getPath('userData')), stores app preferences like window state, last URL, etc.

## Authors

[@Chillcarne](https://github.com/chillcarne/icloud-wrapper)
## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). See the `LICENSE` file for more details.
