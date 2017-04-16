import React from 'react';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <nav className="navbar navbar-light bg-faded">
        <a className="navbar-brand">{this.props.title}</a>
      </nav>
    )
  }
}

export default Navbar;
