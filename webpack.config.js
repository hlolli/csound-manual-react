const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const destDir = __dirname + "/lib/manual";

module.exports = {
  entry: {
    main: "./tmp/index.jsx",
    synopsis: "./tmp/synopsis.jsx"
  },
  output: {
    libraryExport: "default",
    libraryTarget: "umd",
    publicPath: "/manual/",
    path: destDir
  },
  optimization: {
    namedModules: true,
    namedChunks: true,
    splitChunks: { cacheGroups: { default: false } }
  },
  // target: "node",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-router-dom": path.resolve(
        __dirname,
        "./node_modules/react-router-dom"
      )
    }
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    },
    "react-router-dom": {
      commonjs: "react-router-dom",
      commonjs2: "react-router-dom",
      amd: "ReactRouterDOM",
      root: "ReactRouterDOM"
    },
    "react-codemirror2": {
      commonjs: "react-codemirror2",
      commonjs2: "react-codemirror2"
    },
    "react-debounce-input": {
      commonjs: "react-debounce-input",
      commonjs2: "react-debounce-input"
    },
    "react-perfect-scrollbar": {
      commonjs: "react-perfect-scrollbar",
      commonjs2: "react-perfect-scrollbar"
    }
    // unescape: {
    //     commonjs: "unescape",
    //     commonjs2: "unescape"
    // }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin(
      [
        {
          from: path.resolve(__dirname, "./manual/examples/*.wav"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.aiff"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.mp3"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.mid"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.ats"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.dat"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.sdif"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.het"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.sf2"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.png"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.txt"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/*.matrix"),
          to: destDir,
          context: "manual/examples"
        },
        {
          from: path.resolve(__dirname, "./manual/examples/HRTFcompact"),
          to: destDir,
          context: "manual/examples"
        }
      ],
      {
        flatten: true
      }
    )
  ]
};
