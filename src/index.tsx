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

const compose = ({ next, value }) =>
  next
    ? React.cloneElement(value, null, (...args) => compose(next(args)))
    : value;

export const genc = (gen_fn: GeneratorFunction) => {
  gen_fn = immutagen(gen_fn);
  return (...args) => compose(gen_fn(...args) as any);
}
