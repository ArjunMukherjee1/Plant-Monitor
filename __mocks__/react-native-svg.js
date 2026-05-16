const React = require('react');
const { View } = require('react-native');

const Svg = ({ children, ...props }) => React.createElement(View, props, children);
const Circle = (props) => React.createElement(View, props);
const Polyline = (props) => React.createElement(View, props);
const Polygon = (props) => React.createElement(View, props);
const Path = (props) => React.createElement(View, props);

module.exports = { default: Svg, Svg, Circle, Polyline, Polygon, Path };
