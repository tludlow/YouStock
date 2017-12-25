import React, { Component } from 'react';
import {StripeProvider} from "react-stripe-elements";

export default class Main extends Component {

  //Main component that renders child components.
  render() {
    return (
      <StripeProvider apiKey="pk_test_uRsCi66QQQhKPb5JRUoAR8hh">
        <div>
          {/* We use cloneElement here so we can auto pass down props to other components within the tree. */}
          { React.cloneElement(this.props.children, this.props) }
        </div>
      </StripeProvider>
    );
  }

}
