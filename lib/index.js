"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_1 = require("react");
var js_utils_1 = require("@xialvjun/js-utils");
var immutagen_1 = require("immutagen");
var Element = /** @class */ (function (_super) {
    tslib_1.__extends(Element, _super);
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
        return shouldComponentUpdate ? shouldComponentUpdate(this, nextProps, nextState) : true;
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
    ele.set_value = function (value, callback) {
        ele.value = value;
        ele.forceUpdate(callback);
    };
    ele.set_partial = function (path, path_value) { return ele.set_value(js_utils_1.set_path(ele.value, path, path_value)); };
}; };
exports.init_state = function (state) { return function (ele) {
    ele.state = state;
    ele.set_state = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return ele.setState.apply(ele, args);
    };
    ele.set_partial = function (path, path_value) { return ele.set_state(js_utils_1.set_path(ele.state, path, path_value)); };
}; };
exports.init_ref = function (name) { return function (ele) {
    name = name || "ref";
    ele[name] = React.createRef();
}; };
exports.init_refs = function (name) { return function (ele) {
    ele[name] = new Proxy({}, {
        get: function (obj, prop) {
            if (!obj[prop]) {
                obj[prop] = React.createRef();
            }
            return obj[prop];
        }
    });
}; };
exports.init_api = function (api, variables) { return function (ele) {
    var loading = Object.prototype.toString.apply(variables) === "[object Array]";
    exports.init_state({ data: null, error: null, loading: loading })(ele);
    ele.api = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var data, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ele.state.loading) {
                            ele.set_state({ loading: true });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api.apply(void 0, args)];
                    case 2:
                        data = _a.sent();
                        ele.set_state({ data: data, error: null, loading: false });
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        ele.set_state({ error: error_1, loading: false });
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    if (loading) {
        ele.api.apply(ele, variables);
    }
}; };
var compose = function (_a) {
    var next = _a.next, value = _a.value;
    if (!!next) {
        var children = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return compose(next(args));
        };
        if (typeof value === "function") {
            if (value.prototype.isReactComponent) {
                return React.createElement(value, null, children);
            }
            // better compose to make it possible: yield ({ children }) => <OldRenderPropsComponent render={children} />
            return value({ children: children });
        }
        if (React.isValidElement(value)) {
            return React.cloneElement(value, null, children);
        }
        return compose(next(value));
    }
    return value;
};
exports.genc = function (gen_fn) {
    gen_fn = immutagen_1.default(gen_fn);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return compose(gen_fn.apply(void 0, args));
    };
};
