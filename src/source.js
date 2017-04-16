import 'whatwg-fetch'
import React from 'react';
import { render } from 'react-dom';
import { findWhere } from 'underscore';

// Import components
import Announcement from './Announcement';
import Header from './Header';
import Commits from './Commits';
import Issues from './Issues';
import Footer from './Footer';

class Statuspage extends React.Component {
  constructor(props){
    super(props);

    // Basic state setup with placeholders for the data loaded from config
    this.state = {
      'title': '',
      'name': '',
      'link': '',
      'repo': '',
      'statusRepo': '',
      'status': {},
      'announcement': false,
      'services': [],
      'statuses': {},
      'statusMessages': {},
      'serviceStates': {},
      'footer': ''
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
      this.setState(state);
  }

  componentDidMount() {
    // Load everything from config
    fetch(`static/config.json`)
      .then(response => response.json())
      .then(json => {
        // get topmost status for future use
        let topStatus = Object.keys(json.statuses)[0];
        // generate initial service states
        let serviceStates = {};
        for (let service of json.services) {
          // choose the topmost status from the list
          serviceStates[service] = topStatus;
        }
        // set initial status
        Object.assign(json, {status: {class: topStatus, text: json.statusMessages[topStatus]}});
        // assign new states to our json
        Object.assign(json, {serviceStates: serviceStates});
        // save everything to state
        this.setState(Object.assign({}, this.state, json));
      });
  }

  handleIssuesParse(payload) {
    // generate new service states to reperesen affected services
    let newServiceStates = this.state.serviceStates;
    // check if recieved affected services
    if (payload.affected) {
      // if so - change their states
      Object.assign(newServiceStates, payload.affected);
    }
    // check if we need to update global status
    Object.assign(payload, this.checkSeverity(payload.affected));
    // save everything to state
    this.setState(Object.assign({}, this.state, {
      announcement: payload.announcement,
      serviceStates: newServiceStates,
      status: payload.status
    }));
  }

  checkSeverity(services) {
    // get all the ststuses in order
    let statusArr = Object.keys(this.state.statusMessages);
    // get current status position
    let currentTop = statusArr.indexOf(this.state.status.class);
    for (let service of Object.keys(services)) {
      // get service status severity level
      let newTop = statusArr.indexOf(services[service]);
      // check if new status exceeds current
      if (newTop > currentTop) {
        currentTop =  newTop;
      }
    }
    // return final status to root component
    return {status: {class: statusArr[currentTop], text: this.state.statusMessages[statusArr[currentTop]]}};

  }

  render() {
    return(
      <div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Announcement announcement={this.state.announcement} />
          <Header
            link={this.state.link}
            status={this.state.status}
            name={this.state.name}
            services={this.state.services}
            statuses={this.state.statuses}
            serviceStates={this.state.serviceStates}
          />
          <div className="main-block d-flex flex-column">
            <Commits repo={this.state.repo} commits={this.state.commits} />
            <Issues
              onParse={this.handleIssuesParse.bind(this)}
              statuses={this.state.statuses}
              services={this.state.services}
              statusRepo={this.state.statusRepo}
              issues={this.state.issues}
            />
            <Footer text={this.state.footer} />
          </div>
        </div>
      </div>
    )
  }
}

render((<Statuspage />), document.getElementById('statuspage'));
