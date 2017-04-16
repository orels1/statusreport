import React from 'react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { filter, isEqual, reject, map, findWhere } from 'underscore';

class Issues extends React.Component {
  constructor(props) {
    super(props);
    // local state is fine here, everything else is being passed to parent
    this.state = {
      'issues': localStorage.getItem('issues') && JSON.parse(localStorage.getItem('issues')).issues || [],
      'parsed': false
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    // check if config was loaded
    if (this.props.statusRepo != '') {
      this.getIssues(this.props.statusRepo);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // check if config was loaded and we haven't parsed issues already
    if (this.props.statusRepo != '' && !this.state.parsed) {
      this.getIssues(this.props.statusRepo);
    }
  }

  getIssues(statusRepo) {
    // get last update timestamp
    let issuesUpdatedAt = localStorage.getItem('issuesUpdatedAt');
    // check if it's time to update
    if (!issuesUpdatedAt || moment().subtract(1, 'minutes').format('x') - parseInt(issuesUpdatedAt, 10) > 0) {
      // make an API call if it is
      fetch(`https://api.github.com/repos/${statusRepo}/issues?state=all`,
        {
          headers: new Headers({
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Red-Portal-Status'
          })
        })
        .then(response => response.json())
        .then(json => {
            // cache all the data in localStorage
            localStorage.setItem('issuesUpdatedAt', moment().format('x'))
            localStorage.setItem('issues', JSON.stringify({'issues': json}))
            let payload = {};
            // check for announcements before saving
            Object.assign(payload, this.checkForAnnouncements(json));
            // affect services states from cache
            Object.assign(payload, this.affectServices(json.slice(0,5)));
            // return data to the root component
            this.props.onParse(payload);
            // Save that we've parsed everything
            this.setState(Object.assign({}, this.state, {issues: payload.issues, parsed: true}))
        })
    } else {
      let payload = {};
      // check for announcements before saving
      Object.assign(payload, this.checkForAnnouncements(this.state.issues));
      // affect services states from cache
      Object.assign(payload, this.affectServices(this.state.issues));
      // return data to the root component
      this.props.onParse(payload);
      // Save that we've parsed everything
      this.setState(Object.assign({}, this.state, {issues: payload.issues, parsed: true}))
    }
  }

  checkForAnnouncements(issues) {
    // get all the announcements from issues list
    let announcements = filter(issues, issue => findWhere(issue.labels, {name: 'announcement'}) !== undefined);
    // delete them from main issues list
    let newIssues = reject(issues, issue => findWhere(announcements, {title: issue.title}) !== undefined);
    // check if announcement exists and isn't closed
    let announcement = announcements.length > 0 && announcements[0].state !== 'closed' && announcements[0].title || false;
    // save the updated issues state and add announcement if there is one
    return {issues: newIssues, announcement: announcement};
  }

  affectServices(issues) {
    let affectedServices = {};
    // generate service list for modification
    for (let service of this.props.services) {
      affectedServices[service] = 'operational';
    }
    // find affected services
    for (let issue of issues) {
      let labels = map(issue.labels, label => label.name);
      // check if we have any other labels except the service names
      if (reject(labels, label => this.props.services.includes(label)).length > 0) {
        // if so - change status of those services
        let affected = reject(labels, label => !this.props.services.includes(label));
        // pass if nothing was affected
        if (affected.length === 0) {
          continue
        }
        // extract labels other than service names
        let affectedStatuses = reject(labels, label => this.props.services.includes(label));
        // leave only supported statuses
        affectedStatuses = reject(affectedStatuses, status => !Object.keys(this.props.statuses).includes(status))
        // update affected services status
        for (let service of affected) {
          // assign service an affected status
          affectedServices[service] = affectedStatuses[0];
        }
      }
    }
    // pass affected services and their new status back to root component
    return {'affected': affectedServices};
  }

  checkResolved(issue) {
    // check if the issue was resolved
    let resolved = true;
    // if the issue was closed - it is considered resolved no matter what
    if (issue.state != 'closed') {
      // check if there are no other labels other than service names
      for (let label of issue.labels) {
        // if there are - consider issue still unresolved
        if (!this.props.services.includes(label.name)) {
          resolved = false;
        }
      }
    }
    return resolved;
  }

  render() {
    let issues = this.state.issues.map((issue, index) => {
      // extracted labels for ease of use
      let labelsServices = filter(issue.labels, label => this.props.services.includes(label.name)).map((label, index) => {
        return label.name;
      })
      let labelsSeverity = filter(issue.labels, label => !this.props.services.includes(label.name)).map((label, index) => {
        return {color: `#${label.color}`, name: label.name};
      })
      return(
        <div key={`issue-${index}`} className="issue d-flex">
          {this.props.services.length > 0 &&  this.checkResolved(issue) &&
            <div
              className="issue-badges d-flex flex-column w-100 justify-content-center align-items-center"
              style={{'background': '#2ecc71'}}
            >
              <div className="issue-labels d-flex flex-wrap">
                Resolved
              </div>
              <div className="issue-date">{moment(issue.created_at).from(moment())}</div>
            </div>
            ||
            <div
              className="issue-badges d-flex flex-column w-100 justify-content-center align-items-center"
              style={{'background': labelsSeverity[0].color}}
            >
              <div className="issue-labels d-flex flex-wrap">
                {labelsSeverity[0].name}
              </div>
              <div className="issue-date">{moment(issue.created_at).from(moment())}</div>
            </div>
          }
          <div className="issue-info w-100 d-flex flex-column justify-content-center align-items-start">
            <div className="issue-inner">
              <div className="issue-title">
                {issue.title}
              </div>
              <div className="issue-message"><ReactMarkdown source={issue.body} /></div>
              <div className="issue-affected">Affected systems: {labelsServices.join(', ')}</div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className="incidents d-flex flex-column justify-content-start align-items-center">
        <a
          href={`https://github.com/${this.props.statusRepo}/issues`}
          className="w-100"
        >
          <h2 className="incidents-title d-flex w-100 justify-content-center align-items-center">
            <i className="fa fa-fire">&nbsp;&nbsp;</i>
            Incidents
          </h2>
        </a>
        <div className="issues-list">{issues.length > 0 && issues || <i className="fa fa-cog fa-spin fa-3x fa-inverse"></i>}</div>
      </div>
    )
  }
}

export default Issues;
