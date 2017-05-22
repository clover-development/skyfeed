A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

## To start dev env

### Install dependencies
```
npm install
```
### Run the app
```
npm start
```
### Code
```
stb.render(sokiable)
```
### Install electron packager and electron-forge
```
sudo npm install electron-packager -g
sudo npm install -g electron-forge
```
### Build native package
```
electron-forge package --platform=linux --arch=x64
```
### Build distros (only works for current platform)
```
electron-forge make
```

## Debugging
DevTools: F12
Reload Page: F5
Inspect: Ctrl + Shift + C

## Links

[Electron API](http://electron.atom.io/docs/latest)

[Electron API Demos](http://electron.atom.io/#get-started)

[Quick Start Guide](http://electron.atom.io/docs/latest/tutorial/quick-start)

[Electron Window ref](https://github.com/jprichardson/electron-window)
