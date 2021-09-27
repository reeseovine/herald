# herald

prettier frontend for the [miniflux](https://miniflux.app/index.html) feed reader using react and bootstrap

### NOTE: this project is in beta and is not very stable or featureful. proceed at your own risk!

## setup

1. [install miniflux](https://miniflux.app/docs/installation.html), then add some categories and feeds.
2. in your miniflux instance, go to Settings -> API Keys, and click the "Create a new API key" button. enter a name for this key (such as `herald`) and click "Save".
3. copy the API Endpoint URL and the newly created key and save them as the `MINIFLUX_API_ENDPOINT` and `MINIFLUX_API_KEY` environment variables (respectively).
4. install herald with one of the methods below. it should be on a host on the same network as miniflux.

### Docker Compose (preferred)
*coming soon...*

### Docker
*coming soon...*

### Node JS (not recommended)
1. download the source code from the [Releases section](#) and extract it. alternatively you can use `git clone https://github.com/katacarbix/herald` if you have git installed.
2. open a terminal in the `herald/` directory.
3.
  a. if you cloned the source from github, run `npm install && yarn build`
  b. otherwise, run `npm install --only=prod`
4. copy `sample.env` to `.env` and enter your environment variables into this new file.
5. start herald with `yarn production`. you will need to run this command and leave the terminal open every time you want to start it. you can stop herald with `Ctrl+C`.

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
