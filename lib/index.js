"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var js_utils_1 = require("@xialvjun/js-utils");
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element(props) {
        var _this = _super.call(this, props) || this;
        props.construct && props.construct(_this, props);
        return _this;
    }
    Element.prototype.componentDidMount = function () {
        var componentDidMount = this.props.componentDidMount;
        componentDidMount && componentDidMount(this);
    };
    Element.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var shouldComponentUpdate = this.props.shouldComponentUpdate;
        return shouldComponentUpdate
            ? shouldComponentUpdate(this, nextProps, nextState)
            : true;
    };
    Element.prototype.componentDidUpdate = function (prevProps, prevState) {
        var componentDidUpdate = this.props.componentDidUpdate;
        componentDidUpdate && componentDidUpdate(this, prevProps, prevState);
    };
    Element.prototype.componentWillUnmount = function () {
        var componentWillUnmount = this.props.componentWillUnmount;
        componentWillUnmount && componentWillUnmount(this);
    };
    Element.prototype.render = function () {
        var children = this.props.children;
        return typeof children === "function" ? children(this) : children || null;
    };
    return Element;
}(react_1.Component));
exports.Element = Element;
exports.init_value = function (value) { return function (ele) {
    ele.value = value;
    ele.setValue = function (value) {
        ele.value = value;
        ele.forceUpdate();
    };
    ele.set_partial = function (path, path_value) { return ele.setValue(js_utils_1.set_path(ele.value, path, path_value)); };
}; };
exports.init_state = function (state) { return function (ele) {
    ele.state = state;
    ele.set_partial = function (path, path_value) { return ele.setState(js_utils_1.set_path(ele.state, path, path_value)); };
}; };
