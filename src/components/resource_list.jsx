import React from 'react'
import { connect } from 'react-redux'

class ResourceList extends React.Component {
  render () {
    return (
      <ul>
        {this.props.resources.map(r => (
          <li key={r.title}>{r.title}</li>
        ))}
      </ul>
    )
  }
}

function mapStateToProps (state) {
  return {
    resources: state.resources
  }
}

export default connect(mapStateToProps)(ResourceList)
