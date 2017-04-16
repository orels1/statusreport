import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let services = this.props.services.map((service, index) => {
      return(
        <div
          key={`service-${index}`}
          className="service d-flex flex-column">
          <div className="service-name">
            {service}
          </div>
          <div
            className={`service-status`}
            style={{'color': this.props.statuses[this.props.serviceStates[service]]}}
            >
            {this.props.serviceStates[service]}
          </div>
        </div>
      )
    })
    return(
      <div className="current-status d-flex w-100 flex-column align-items-center justify-content-center">
        <div
          className="status"
          style={{
            'background': this.props.statuses[this.props.status.class],
            'boxShadow': `0 0 30px ${this.props.statuses[this.props.status.class]}`
          }}
          >
          {this.props.status.text}
        </div>
        {this.props.status.class === 'operational' &&
          <div className="visit-link">
            <a href={this.props.link} target="_blank">
              open {this.props.name}
            </a>
          </div>
        }
        <div className="services d-flex flex-wrap justify-content-between flex-column flex-sm-column flex-md-row">
            {services}
        </div>
        <div className="info-spacer w-100 d-flex flex-column justify-content-end align-items-center">
          <div>System status is updated every minute</div>
        </div>
      </div>
    )
  }
}

export default Header;
