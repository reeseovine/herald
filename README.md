<div align="center">
  <img src="img/wordmark.svg" height=128 alt="Herald logo"><br>
  Prettier frontend for the <a href="https://miniflux.app/index.html">Miniflux</a> feed reader using Express, React, and Bootstrap<br>
  <a href="https://github.com/katacarbix/herald/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/katacarbix/herald"></a>
  <a href="https://github.com/katacarbix/herald/actions/workflows/docker-push.yml"><img src="https://github.com/katacarbix/herald/actions/workflows/docker-push.yml/badge.svg" alt="Build"></a>
  <a href="https://hub.docker.com/repository/docker/katacarbix/herald"><img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/katacarbix/herald"></a>
</div>

#### NOTE: This project is in beta and is not guaranteed to be stable. Proceed at your own risk!

## Features
- Newspaper/magazine-like layout with Bootstrap
- Light and dark mode
- Responsive layout
- Full-text search
- Bookmarks
- Basic weather widget
- Syntax highlighting in code blocks powered by [highlight.js](https://highlightjs.org/)
- Mark articles as read just by scrolling to the bottom (or with a button)

## Limitations
- Intentionally implements only a subset of the Miniflux API to minimize potential damage that could be caused by malicious visitors.
- Feed contents are only as good as what is provided by Miniflux. I recommend telling Miniflux to fetch the original contents and setting [rules](https://miniflux.app/docs/rules.html) to get the best quality.
- Opinionated. I'm making this for *me* first, and some of the design choices may reflect that.

## Setup
1. [Install Miniflux](https://miniflux.app/docs/installation.html), then add some categories and feeds.
2. In your Miniflux instance, go to `Settings` -> `API Keys`, and click the `Create a new API key` button. Enter a name for this key (such as `herald`) and click `Save`.
3. Copy the API Endpoint URL and the newly created key and save them as the `MINIFLUX_API_ENDPOINT` and `MINIFLUX_API_KEY` environment variables (respectively).
4. Install Herald with one of the methods below. It should be on a host on the same network as Miniflux.
5. Optionally you can put Herald behind a reverse proxy to make it available from the outside. even though there's not much someone can do to mess with your Herald instance, it's highly recommended to password protect it if it's accessible from the public internet.

### Docker Compose
```yaml
version: '3.3'
services:
  miniflux:
    image: miniflux/miniflux:latest
    ...
  
  herald:
    image: katacarbix/herald:latest
    ports:
      - 80:5000
    environment:
      - MINIFLUX_API_ENDPOINT=<api url>
      - MINIFLUX_API_KEY=<api key>
```

### Docker
```sh
docker run -it -e MINIFLUX_API_ENDPOINT=<api url> MINIFLUX_API_KEY=<api key> -p 80:5000 katacarbix/herald:latest
```

### Node JS (not recommended)
1. Download the compiled code from [Releases](https://github.com/katacarbix/herald/releases) and extract it.
2. Open a terminal in the `herald/` directory.
3. Run `npm install --only=prod`.
4. Copy `sample.env` to `.env` and enter your environment variables into this new file.
5. Start Herald with `yarn production`. You will need to run this command and leave the terminal open every time you want to start it. You can stop Herald with `Ctrl+C`.

## Docker tags

- `latest` - The most recent stable release
- `edge` - The most recent commit, may not be stable
- `v0.1.1`, etc. - A specific version from the repo's tags/releases

## Environment variables

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
