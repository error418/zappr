import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { fetchReposIfNeeded } from '../actions/api'
import { setEnabled as setRepoEnabled } from '../actions/repo'
import Optional from '../components/optional.jsx'
import ZapprNav from '../components/navbar.jsx'
import { logger } from '../../common/debug'
const log = logger('app')

function mapStateToProps(state) {
  return {
    path: state.router.path,
    user: state.user,
    githubRepos: state.githubRepos,
    isAuthenticated: state.auth.isAuthenticated
  }
}

class App extends React.Component {
  static propTypes = {
    path: React.PropTypes.string.isRequired,
    user: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  }

  componentDidMount() {
    log('componentDidMount', this.props)
    if (this.props.isAuthenticated) {
      this.props.fetchReposIfNeeded()
    }
  }

  onRepoToggle(id, isActive) {
    log('onRepoToggle', isActive)
    this.props.setRepoEnabled(id, isActive)
  }

  render() {
    const childrenProps = {
      githubRepos: this.props.githubRepos,
      onRepoToggle: this.onRepoToggle.bind(this)
    }
    return (
      <div>
        <Optional if={this.props.path.search(/^\/login/) === -1}>
          <ZapprNav path={this.props.path}
                    user={this.props.user}/>
        </Optional>
        <div className="container">
          {React.cloneElement(this.props.children, childrenProps)}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, {fetchReposIfNeeded, setRepoEnabled})(App)
