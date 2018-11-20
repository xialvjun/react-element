import * as React from "react";
import { Component, ReactNode } from "react";
import { set_path } from "@xialvjun/js-utils";
import immutagen from "immutagen";

export interface ElementProps {
  construct?(ele, props: ElementProps): void;
  componentDidMount?(ele: Element): void;
  shouldComponentUpdate?(
    ele: Element,
    nextProps: ElementProps,
    nextState
  ): boolean;
  componentDidUpdate?(ele: Element, prevProps: ElementProps, prevState): void;
  componentWillUnmount?(ele: Element): void;
  chidlren?: ((ele: Element) => ReactNode) | ReactNode;
}

export class Element extends Component<ElementProps> {
  constructor(props: ElementProps) {
    super(props);
    props.construct && props.construct(this, props);
  }
  componentDidMount() {
    const { componentDidMount } = this.props;
    componentDidMount && componentDidMount(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { shouldComponentUpdate } = this.props;
    return shouldComponentUpdate
      ? shouldComponentUpdate(this, nextProps, nextState)
      : true;
  }
  componentDidUpdate(prevProps, prevState) {
    const { componentDidUpdate } = this.props;
    componentDidUpdate && componentDidUpdate(this, prevProps, prevState);
  }
  componentWillUnmount() {
    const { componentWillUnmount } = this.props;
    componentWillUnmount && componentWillUnmount(this);
  }
  render() {
    const { children } = this.props;
    return typeof children === "function" ? children(this) : children || null;
  }
}

export const init_value = value => ele => {
  ele.value = value;
  ele.set_value = (value, callback) => {
    ele.value = value;
    ele.forceUpdate(callback);
  };
  ele.set_partial = (path, path_value) =>
    ele.set_value(set_path(ele.value, path, path_value));
};

export const init_state = state => ele => {
  ele.state = state;
  ele.set_state = (...args) => ele.setState(...args);
  ele.set_partial = (path, path_value) =>
    ele.set_state(set_path(ele.state, path, path_value));
};

export const init_ref = (name: string) => ele => {
  name = name || "ref";
  ele[name] = (React as any).createRef();
};

export const init_refs = (name: string) => ele => {
  ele[name] = new Proxy(
    {},
    {
      get(obj, prop) {
        if (!obj[prop]) {
          obj[prop] = (React as any).createRef();
        }
        return obj[prop];
      }
    }
  );
};

const compose = ({ next, value }) => {
  if (!!next) {
    const children = (...args) => compose(next(args));
    if (typeof value === "function") {
      if (value.prototype.isReactComponent) {
        return React.createElement(value, null, children);
      }
      return value({ children });
    }
    if (React.isValidElement(value)) {
      return React.cloneElement(value, null, children);
    }
    return compose(next(value));
  }
  return value;
};

export const genc = (gen_fn: GeneratorFunction) => {
  gen_fn = immutagen(gen_fn);
  return (...args) => compose(gen_fn(...args) as any);
};

// // gen_component_plain is impossible because you need <Result>{_ => if (previous_args) xxx else xxx }</Result>...
// // 也就是每个 yield 都需要深一层的 <Result> 来获取 previous_args 来做 yield 后面的逻辑判断，于是组件深度是与 gen_component_hell 是一样的
// export const gencp = (gen_fn: GeneratorFunction) => {
//   gen_fn = immutagen(gen_fn);
//   return (...args) => {
//     const gen = gen_fn(...args);

//     const compose = ({ next, value }, eles) => {
//       if (next) {
//         // let g;
//         // eles.concat(React.cloneElement(value, null, (...args) => {
//         //   g = next(args);
//         // }))
//         // return compose(g, eles);

//         // const ele = React.cloneElement(value, null, (...args) => {
//         //   compose(next(args),  eles.concat(ele));
//         // })
//         // return;

//         let g;
//         const ele = React.cloneElement(value, null, (...args) => {
//           g = next(args);
//           return null;
//         });
//         return compose(g, eles.concat(ele));
//       }
//       return eles.concat(value)
//     }

//     let eles = [];

//     const { next, value } = gen.next() as any;
//     if (next) {
//       return React.cloneElement(value as any, null, (...args) => {
//         const { next, value } = gen.next(args) as any;

//       });
//     }
//   }
// }

// ! nearly right gencp
// gen_component_plain is impossible because you need <Result>{_ => if (previous_args) xxx else xxx }</Result>...
// 也就是每个 yield 都需要深一层的 <Result> 来获取 previous_args 来做 yield 后面的逻辑判断，于是组件深度是与 gen_component_hell 是一样的
const Lazy = ({ chidlren }) => chidlren();
export const gencp = (gen_fn: GeneratorFunction) => {
  gen_fn = immutagen(gen_fn);
  return (...args) => {
    const gen = gen_fn(...args);
    const compose = ({ next, value }) => {
      if (next) {
        let g, lazy;
        const ele = React.cloneElement(value, null, (...args) => {
          g = next(args);
          lazy.forceUpdate();
          return null;
        });
        return [ele].concat(
          (React.createElement as any)(Lazy, { ref: e => (lazy = e) }, _ => compose(g))
        );
      }
      return value;
    };
    return compose(gen as any);
  };
};
