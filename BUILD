load("//tools/bzl:js.bzl", "polygerrit_plugin")
load("//tools/js:eslint.bzl", "eslint")

polygerrit_plugin(
    name = "zuul-results-summary",
    srcs = glob([
         "zuul-results-summary/*.js"
    ]),
    app = "zuul-results-summary/zuul-results-summary.js",
)


# Define the eslinter for the plugin
# The eslint macro creates 2 rules: lint_test and lint_bin
eslint(
    name = "lint",
    srcs = glob([
        "zuul-results-summary/**/*.js",
    ]),
    config = ".eslintrc.json",
    data = [],
    extensions = [
        ".js",
    ],
    ignore = ".eslintignore",
    plugins = [
        "@npm//eslint-config-google",
        "@npm//eslint-plugin-html",
        "@npm//eslint-plugin-import",
        "@npm//eslint-plugin-jsdoc",
    ],
)
