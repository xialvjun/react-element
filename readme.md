# react-element
A very simple component, just offering the React.Component API, to write logic just in JSX. With a `genc(generator component)` helper.

## Install
`npm i @xialvjun/react-element` or `yarn add @xialvjun/react-element`

## Example

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { Element, init_value, genc, init_state, init_ref, init_refs } from "@xialvjun/react-element";

const App = genc(function*() {
  const [a] = yield <Element construct={init_value("a")} componentDidMount={ele => console.log('didMount', ele.value)} />;
  const [b] = yield <Element construct={init_value("b")} />;
  const [c] = yield <Element construct={init_value("c")} />;
  return (
    <div>
      <button onClick={_ => a.set_value(a.value + "a")}>{a.value}</button>
      <button onClick={_ => b.set_value(b.value + "b")}>{b.value}</button>
      <button onClick={_ => c.set_value(c.value + "c")}>{c.value}</button>
      {/* genc can be used both outside and inside of jsx... but hooks can only be used outside of jsx... */}
      <Element construct={init_value("d")}>
        {genc(function*(ele) {
          const [a] = yield <Element construct={init_value("a")} />;
          const [b] = yield <Element construct={init_value("b")} />;
          const [c] = yield <Element construct={init_value("c")} />;
          return (
            <div>
              <button onClick={_ => a.set_value(a.value + "a")}>
                {a.value}
              </button>
              <button onClick={_ => b.set_value(b.value + "b")}>
                {b.value}
              </button>
              <button onClick={_ => c.set_value(c.value + "c")}>
                {c.value}
              </button>
            </div>
          );
        })}
      </Element>
    </div>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

[![Edit zl2j7q0r2m](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/zl2j7q0r2m)

## Drawback
The `genc` will lead to a `vdom hell`. Well, the source code is plain, but the `React Developer Tools` will show a `vdom hell`.

And it's impossible to write a plain version of `genc` because we need a `Lazy` component: `const Lazy = ({ chidlren }) => chidlren();` to wait for the render-props-component's args. Then one render-props-component needs one deeper level `Lazy`. It's still `vdom hell`.
