import React from 'react';
import ReactMarkdown from 'react-markdown'

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div className="footer w-100 d-flex flex-column justify-content-center align-items-center">
          <ReactMarkdown source={this.props.text} />
        </div>
    )
  }
}

export default Footer;
