load("//tools/bzl:js.bzl", "gerrit_js_bundle")

package_group(
    name = "visibility",
    packages = ["//plugins/zuul-results-summary/..."],
)

package(default_visibility = [":visibility"])

gerrit_js_bundle(
    name = "zuul-results-summary",
    entry_point = "plugin.js",
)
