import * as React from "react";
import { Component, ReactNode } from "react";
import { get_path, set_path } from "@xialvjun/js-utils";
import immutagen from "immutagen";

export interface ElementProps {
  construct?(ele, props: ElementProps): void;
  componentDidMount?(ele: Element): void;
  shouldComponentUpdate?(ele: Element, nextProps: ElementProps, nextState): boolean;
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
    return shouldComponentUpdate ? shouldComponentUpdate(this, nextProps, nextState) : true;
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
  ele.set = ele.set_partial = (path, path_value, callback) => ele.set_value(set_path(ele.value, path, path_value), callback);
  ele.get = ele.get_partial = path => get_path(ele.value, path);
  ele.merge = ele.set_state = (value, callback) => ele.set_value(Object.assign({}, ele.value, value), callback);
};

export const init_state = state => ele => {
  ele.state = state;
  ele.set_state = (...args) => ele.setState(...args);
  ele.set_partial = (path, path_value, callback) => ele.set_state(set_path(ele.state, path, path_value), callback);
};

export const init_ref = (name: string) => ele => {
  name = name || "ref";
  ele[name] = React.createRef();
};

export const init_refs = (name: string, use_create_ref: boolean=true) => ele => {
  ele[name] = new Proxy(
    {},
    {
      get(obj, prop) {
        if (!obj[prop]) {
          const ref = obj[prop] = use_create_ref ? React.createRef() : e => (ref as any).current = e;
        }
        return obj[prop];
      }
    }
  );
};

export const init_api = (api: (...variables: any[]) => Promise<any>, variables?: any[]) => ele => {
  const loading = Object.prototype.toString.apply(variables) === "[object Array]";
  init_state({ data: null, error: null, loading })(ele);
  ele.api = async (...args) => {
    if (!ele.state.loading) {
      ele.set_state({ loading: true });
    }
    try {
      const data = await api(...args);
      ele.set_state({ data, error: null, loading: false });
      return data;
    } catch (error) {
      ele.set_state({ error, loading: false });
      throw error;
    }
  };
  if (loading) {
    ele.api(...variables);
  }
};

const compose = ({ next, value }) => {
  if (!!next) {
    const children = (...args) => compose(next(args));
    if (typeof value === "function") {
      if (value.prototype.isReactComponent) {
        return React.createElement(value, null, children);
      }
      // better compose to make it possible: yield ({ children }) => <OldRenderPropsComponent render={children} />
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
