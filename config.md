# config.json fields
config.json is the main way to configure your own instance of StatusReport.

>config.json is located in `static` folder

Most of the fields are self-explanatory, but I will list them all for the good measure

Field | Description
--|--
`title`|Used in navbar, which is turned off by default
`name`|Defines the text in the link to your website/api
`link`|Link to your website/api/repo
`repo`|Repo to gather last commits from
`statusRepo`|Repo for issue tracking (usually your fork's own repo)
`services`|List of services to track
`statuses`|List of statuses used in issues with corresponding colors. Should be in ascending order, from least critical to the most. Should not include `announcement` label, since it's managed separetely
`statusMessages`|List of system-wide status messages in the same order as in `statuses`
`footer`|Text to go onto the bottom of the page, supports Markdown

You can always add more fields and then access them in your `StatusPage` React component
