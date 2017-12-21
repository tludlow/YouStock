import React, { Component } from 'react';

export default class Main extends Component {

  //Main component that renders child components.
  render() {
    return (
      <div>
        {/* We use cloneElement here so we can auto pass down props to other components within the tree. */}
        { React.cloneElement(this.props.children, this.props) }
      </div>
    );
  }

}
