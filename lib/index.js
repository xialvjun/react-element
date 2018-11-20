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
var React = require("react");
var react_1 = require("react");
var js_utils_1 = require("@xialvjun/js-utils");
var immutagen_1 = require("immutagen");
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
    ele.set_value = function (value, callback) {
        ele.value = value;
        ele.forceUpdate(callback);
    };
    ele.set_partial = function (path, path_value) {
        return ele.set_value(js_utils_1.set_path(ele.value, path, path_value));
    };
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
    ele.set_partial = function (path, path_value) {
        return ele.set_state(js_utils_1.set_path(ele.state, path, path_value));
    };
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
var Lazy = function (_a) {
    var chidlren = _a.chidlren;
    return chidlren();
};
exports.gencp = function (gen_fn) {
    gen_fn = immutagen_1.default(gen_fn);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var gen = gen_fn.apply(void 0, args);
        var compose = function (_a) {
            var next = _a.next, value = _a.value;
            if (next) {
                var g_1, lazy_1;
                var ele = React.cloneElement(value, null, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    g_1 = next(args);
                    lazy_1.forceUpdate();
                    return null;
                });
                return [ele].concat(React.createElement(Lazy, { ref: function (e) { return (lazy_1 = e); } }, function (_) { return compose(g_1); }));
            }
            return value;
        };
        return compose(gen);
    };
};
