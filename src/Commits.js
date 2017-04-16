import React from 'react';
import moment from 'moment';

class Commits extends React.Component {
  constructor(props) {
    super(props);
    // local state is fine here
    this.state = {
      'commits': localStorage.getItem('commits') && JSON.parse(localStorage.getItem('commits')).commits || []
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    // check if config was loaded
    if (this.props.repo != '') {
      this.getCommits(this.props.repo);
    }
  }

  componentWillReceiveProps(nextProps) {
    // check if config was loaded
    if (nextProps.repo != '') {
      this.getCommits(nextProps.repo);
    }
  }

  getCommits(repo) {
    // get last update timestamp
    let commitsUpdatedAt = localStorage.getItem('commitsUpdatedAt');
    // check if it's time to update
    if (!commitsUpdatedAt || moment().subtract(5, 'minutes').format('x') - parseInt(commitsUpdatedAt, 10) > 0) {
      // make an API call if it is
      fetch(`https://api.github.com/repos/${repo}/commits`,
        {
          headers: new Headers({
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Red-Portal-Status'
          })
        })
        .then(response => response.json())
        .then(json => {
            // cache all the data in localStorage
            localStorage.setItem('commitsUpdatedAt', moment().format('x'))
            localStorage.setItem('commits', JSON.stringify({'commits': json.slice(0,3)}))
            // save all the commits to state
            this.setState(Object.assign({}, this.state, {commits: json.slice(0,5)}))
        })
    }
  }

  render() {
    let commits = this.state.commits.map((commit, index) => {
      return(
        <li key={`commit-${index}`} className="commit d-flex flex-column align-items-start">
          <div className="commit-message">
            <a href={commit.html_url}>{commit.commit.message}</a>
          </div>
          <div className="commit-info w-100 d-flex justify-content-start">
            <div className="commit-date">{moment(commit.commit.committer.date).from(moment())}</div>
            <div className="commit-author">&nbsp;by {commit.commit.committer.name}</div>
          </div>
        </li>
      )
    })
    return (
      <div className="last-updates d-flex w-100 flex-column justify-content-start align-items-center">
        <div className="last-updates-inner w-100">
          <div className="commit-container d-flex">
            <div className="last-commit-title d-flex w-100 justify-content-center align-items-center flex-column">
              <div>
                <a href={`https://github.com/${this.props.repo}/commits/master`}>
                  <h2>Latest<br />commit</h2>
                </a>
              </div>
            </div>
            <div className="commits-list w-100 d-flex flex-column justify-content-center align-items-start">
              {commits.length > 0 && commits[0] || <i className="fa fa-cog fa-spin fa-3x fa-inverse"></i>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Commits;
