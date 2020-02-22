import React from 'react'
import { lastPart } from '../ts/util'
import { Project } from '../@types/project'

interface Props extends Project {

}
export default class ProjectView extends React.Component<Props>{

  get title (): string {
    return lastPart(window.location.pathname)
  }

  render () {
    return (
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          <p className="title is-3 is-size-5-mobile">{ this.title }</p>
        </div>
      </div>
    )
  }
}