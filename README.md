<div align="center">
  <img src="img/wordmark.svg" height=128 alt="Herald logo"><br>
  prettier frontend for the <a href="https://miniflux.app/index.html">miniflux</a> feed reader using express, react, and bootstrap
</div>

### NOTE: this project is in beta and is not very stable or featureful. proceed at your own risk!

## features
* newspaper/magazine-like layout with Bootstrap
* light and dark mode
* responsive layout
* full-text search
* basic weather widget
* syntax highlighting in code blocks powered by [highlight.js](https://highlightjs.org/)
* mark articles as read just by scrolling to the bottom (or with a button)

## limitations
* intentionally implements only a subset of the Miniflux API to reduce potential damage that could be caused by malicious visitors.
* feed contents are only as good as what is provided by miniflux. i recommend telling miniflux to fetch the original contents and setting [rules](https://miniflux.app/docs/rules.html) to get the best quality.

## setup
1. [install miniflux](https://miniflux.app/docs/installation.html), then add some categories and feeds.
2. in your miniflux instance, go to Settings -> API Keys, and click the "Create a new API key" button. enter a name for this key (such as `herald`) and click "Save".
3. copy the API Endpoint URL and the newly created key and save them as the `MINIFLUX_API_ENDPOINT` and `MINIFLUX_API_KEY` environment variables (respectively).
4. install herald with one of the methods below. it should be on a host on the same network as miniflux.
5. optionally you can put herald behind a reverse proxy to make it available from the outside. even though there's not much someone can do to mess with your herald instance, it's highly recommended to password protect it if it's facing the public internet.

### Docker Compose (preferred)
*coming soon...*

### Docker
1. clone the source from github
2. open a terminal in the `herald/` directory.
3. run `docker build -t katacarbix/herald .`
4. copy `sample.env` to `.env` and enter your environment variables into this new file.
5. start herald with `docker run -it --env-file=.env -p 80:5000 katacarbix/herald:latest`. you can stop it with `Ctrl+C`.

### Node JS (not recommended)
1. download the source code from the [Releases section](#) and extract it. alternatively you can use `git clone https://github.com/katacarbix/herald` if you have git installed.
2. open a terminal in the `herald/` directory.
3. if you cloned the source from github, run `npm install && yarn build`.  
   otherwise, run `npm install --only=prod`.
4. copy `sample.env` to `.env` and enter your environment variables into this new file.
5. start herald with `yarn production`. you will need to run this command and leave the terminal open every time you want to start it. you can stop herald with `Ctrl+C`.

## Docker tags

- `latest` - The most recent stable release
- `edge` - The most recent commit, may not be stable
- `v0.1.1`, etc. - A specific version from the repo's tags/releases

## environment variables

| variable name           | example value                                                             |
|:------------------------|:--------------------------------------------------------------------------|
| `MINIFLUX_API_ENDPOINT` | `http://localhost:1234/v1/`                                               |
| `MINIFLUX_API_KEY`      | `Z2l0aHViLmNvbS9rYXRhY2FyYml4L3RyaWJ1bmUgICA=`                            |
| `NEWSPAPER_NAME`        | `The Daily Bugle`                                                         |
| `OWM_API_KEY`           | `68656c6c6f20746865726521203a4420`                                        |
| `OWM_LATITUDE`          | `34.05223`                                                                |
| `OWM_LONGITUDE`         | `-118.24368`                                                              |
| `OWM_LANG`              | `en` (default, [see more](https://openweathermap.org/current#multi))      |
| `OWM_UNITS`             | `standard` (default, [see more](https://openweathermap.org/current#data)) |
