load("//tools/bzl:plugin.bzl", "gerrit_plugin")

gerrit_plugin(
    name = "zuul-results-summary",
    srcs = glob(["java/**/*.java"]),
    manifest_entries = [
        "Gerrit-PluginName: zuul-results-summary",
        "Gerrit-Module: com.googlesource.gerrit.plugins.zuulresultssummary.Module",
        "Implementation-Title: Zuul-Results-Summary plugin",
        "Implementation-URL: https://gerrit.googlesource.com/plugins/zuul-results-summary",
    ],
    resource_jars = ["//plugins/zuul-results-summary/web:zuul-results-summary"],
    resource_strip_prefix = "plugins/zuul-results-summary/resources",
    resources = glob(["resources/**/*"]),
)
