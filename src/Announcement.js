import React from 'react';

class Announcement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div className="announcement w-100 d-flex">
          {this.props.announcement &&
            <div className="d-flex w-100 justify-content-center">
              <i className="fa fa-info-circle align-self-center">&nbsp;&nbsp;</i>
              <div>{this.props.announcement}</div>
            </div>
          }
        </div>
    )
  }
}

export default Announcement;
