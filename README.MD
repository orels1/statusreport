![statusreport](http://i.imgur.com/PiLxgO5.png)

# StatusReport
>A one-click deploy github-hosted statuspage

## Demo
Why read, [when you can see it for yourself!](https://orels1.github.io/statusreport/)

Demo uses the exact code in this repo.  
Issues are loaded [from here](https://github.com/orels1/status.cogs.red/issues?utf8=%E2%9C%93&q=is%3Aissue%20)

## Usage
StatusReport was built to be deployed by simply forking this repo, so the process is simple

- Fork the repo
- Edit config.json in the `static` folder, [guide here](config.md)
- Edit meta tags inside index.html
- Set Github to use master branch for github pages in repo settings
- Add issue labels in your repo for each of the `statuses` and `services` from config.json + the extra `announcement` label for system-wide announcements - [example here](https://github.com/orels1/status.cogs.red/issues?utf8=%E2%9C%93&q=is%3Aissue%20)

Source files contain demo values, so you will have a working page right from the beginning.

And you're done! Everything will be updated automatically and cached by the client, without the need to rebuild or push anything.

## Features
 - [x] Client-sided updates
 - [x] Responsive design
 - [x] Deployment by forking the repo
 - [x] System-wide announcements

## Customize

Full list of config.json options and values can be [found here](config.md)

If you want to dive deeper - clone the repo to your local system and edit the CSS directly (in the file or through the inspector) and commit changes.

### Custom domain
If you want your statuspage to be accessible through custom domain - create a file named `CNAME` in the root of your repo, with your custom domain in it. And then in your domain's DNS settings add a new record pointing at `yourname.github.io`, where `yourname` is your GitHub's profile name

## Support
SatusReport is and will be absolutely free to use and re-distribute, however, if you like it and/or [my other projects](https://github.com/orels1) - consider signing up for a [small monthly donation on my patreon](https://patreon.com/orels1). It's a huge help!

## Develop

If you need to go deeper &copy; – you can edit the source JS and Sass files.

### Frameworks/libraries used
- React
- Sass
- Fetch
- Bootstrap v4
- Underscore
- React-Markdown
- MomentJS
- ExpressJS (for dev server)

### Requirements
- NodeJS
- NPM
- Sass
- Bower

>If you don't want to use nodejs server - you can fire up a python `devserver.py`, you'll need Flask installed for this to work, though.

### Installation

Get Bower, Browserify and Watchify (for on-the-fly updates)
```
npm install -g bower browserify watchify
```

Install package dependencies
```
npm install

bower install
```

### Running
Open terminal in the root repo directory

Start watchify to automatically build your JS
```
watchify src/source.js -t [ babelify --presets [ es2015 react ] ] -o static/bundle.js -v
```

Then start Sass in watch mode
```
sass --watch src:static
```

At last - run one of the included servers

For node
```
node devserver.js
```

For python
```
python devserver.py
```
