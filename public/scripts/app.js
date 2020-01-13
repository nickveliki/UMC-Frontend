"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IndecisionApp = function (_React$Component) {
    _inherits(IndecisionApp, _React$Component);

    function IndecisionApp(props) {
        _classCallCheck(this, IndecisionApp);

        var _this = _possibleConstructorReturn(this, (IndecisionApp.__proto__ || Object.getPrototypeOf(IndecisionApp)).call(this, props));

        _this.state = {
            options: _this.props.options,
            user: { name: undefined, age: undefined }
        };

        return _this;
    }

    _createClass(IndecisionApp, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var start = localStorage.getItem("options");
            if (start) {
                try {
                    var options = JSON.parse(start);
                    if (options) {
                        this.setState(function () {
                            return { options: options };
                        });
                    }
                } catch (e) {
                    localStorage.removeItem("options");
                }
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            if (prevState.options.length != this.state.options.length) {
                var update = JSON.stringify(this.state.options);
                localStorage.setItem("options", update);
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            console.log("Component will unmount");
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(Header, { subtitle: "put your life in the hands of a computer" }),
                React.createElement(User, { user: this.state.user }),
                React.createElement(Action, { options: this.state.options.length, chooseOption: function chooseOption() {
                        //console.log(this);
                        var action = Math.floor(Math.random() * _this2.state.options.length);
                        alert("do this: " + _this2.state.options[action]);
                    } }),
                React.createElement(Options, {
                    handleDeleteOptions: function handleDeleteOptions() {
                        _this2.setState(function () {
                            return { options: [] };
                        });
                    },
                    Options: this.state.options,
                    handleDeleteOption: function handleDeleteOption(option) {
                        _this2.setState(function () {
                            return { options: _this2.state.options.filter(function (arg) {
                                    return arg !== option;
                                }) };
                        });
                    }
                }),
                React.createElement(AddOption, { addOption: function addOption(option) {
                        if (!option) {
                            return "enter a valid, non-empty option";
                        }
                        if (_this2.state.options.includes(option)) {
                            return "enter an option that isn't recorded yet";
                        }
                        _this2.setState(function (prevState) {
                            return { options: prevState.options.concat(option) };
                        });
                    } })
            );
        }
    }]);

    return IndecisionApp;
}(React.Component);

IndecisionApp.defaultProps = {
    options: []
};

var Header = function Header(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            null,
            props.title
        ),
        props.subtitle && React.createElement(
            "h2",
            null,
            props.subtitle
        )
    );
};

Header.defaultProps = {
    title: "Indecision"
};
var Action = function Action(props) {
    return props.options > 0 ? React.createElement(
        "button",
        { onClick: props.chooseOption },
        "What should I do?"
    ) : React.createElement("br", null);
};

var Options = function Options(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h4",
            null,
            "Options"
        ),
        props.Options.length > 0 ? React.createElement(
            "button",
            { onClick: props.handleDeleteOptions },
            "remove all"
        ) : React.createElement(
            "p",
            null,
            "you're all out of options"
        ),
        React.createElement(
            "ol",
            null,
            props.Options.map(function (O) {
                return React.createElement(Option, { key: props.Options.indexOf(O), handleDeleteOption: props.handleDeleteOption, Option: O });
            })
        )
    );
};
var Option = function Option(props) {
    return React.createElement(
        "li",
        null,
        props.Option,
        " ",
        React.createElement(
            "button",
            { onClick: function onClick() {
                    return props.handleDeleteOption(props.Option);
                } },
            "remove"
        )
    );
};

var AddOption = function (_React$Component2) {
    _inherits(AddOption, _React$Component2);

    function AddOption(props) {
        _classCallCheck(this, AddOption);

        var _this3 = _possibleConstructorReturn(this, (AddOption.__proto__ || Object.getPrototypeOf(AddOption)).call(this, props));

        _this3.state = {
            error: undefined
        };
        return _this3;
    }

    _createClass(AddOption, [{
        key: "render",
        value: function render() {
            var _this4 = this;

            return React.createElement(
                "form",
                { onSubmit: function onSubmit(e) {
                        e.preventDefault();
                        var option = e.target.elements.option.value.trim();
                        e.target.elements.option.value = "";
                        _this4.setState(function () {
                            return { error: _this4.props.addOption(option) };
                        });
                    } },
                React.createElement("input", { type: "text", name: "option" }),
                React.createElement(
                    "button",
                    null,
                    "add Option"
                ),
                this.state.error && React.createElement(
                    "p",
                    { className: "Error" },
                    this.state.error
                )
            );
        }
    }]);

    return AddOption;
}(React.Component);

var User = function User(props) {
    return React.createElement(
        "div",
        null,
        props.user.name && React.createElement(
            "p",
            null,
            "Name: ",
            props.user.name
        ),
        props.user.age && React.createElement(
            "p",
            null,
            "age: ",
            props.user.age
        )
    );
};
ReactDOM.render(React.createElement(IndecisionApp, { options: ["Folie Douce", "Kanapee", "Römereck"] }), document.getElementById("app"));
