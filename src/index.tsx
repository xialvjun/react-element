import * as React from "react";
import { Component, ReactNode } from "react";

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
