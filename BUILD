load("//tools/bzl:plugin.bzl", "gerrit_plugin")
load("//tools/js:eslint.bzl", "eslint")

gerrit_plugin(
    name = "zuul-results-summary",
    srcs = glob(["java/**/*.java"]),
    manifest_entries = [
        "Gerrit-PluginName: zuul-results-summary",
        "Gerrit-Module: com.googlesource.gerrit.plugins.zuulresultssummary.Module",
        "Implementation-Title: Zuul-Results-Summary plugin",
        "Implementation-URL: https://gerrit.googlesource.com/plugins/zuul-results-summary",
    ],
    resource_jars = ["//plugins/zuul-results-summary/zuul-results-summary"],
    resource_strip_prefix = "plugins/zuul-results-summary/resources",
    resources = glob(["resources/**/*"]),
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
