# react-element
A very simple component, just offering the React.Component API, to write logic just in JSX.

## Install
`npm i @xialvjun/react-element` or `yarn add @xialvjun/react-element`

## Example

```jsx
import React from "react";
import { render } from "react-dom";
import { Element } from "@xialvjun/react-element";

const app = (
  <Element
    construct={ele => {
      ele.state = { count: 0 };
      ele.refs = {};
    }}
    componentDidMount={ele => console.log(ele.state.count)}
    componentDidUpdate={ele => console.log(ele.state.count)}
  >
    {ele => (
      <div>
        <h2 ref={e => (ele.refs.h2 = e)}>clicked {ele.state.count} times</h2>
        <button
          onClick={e => {
            console.log(ele.refs.h2.textContent);
            ele.setState({ count: ele.state.count + 1 });
          }}
        >
          click
        </button>
      </div>
    )}
  </Element>
);

render(app, document.querySelector("#app"));
```
