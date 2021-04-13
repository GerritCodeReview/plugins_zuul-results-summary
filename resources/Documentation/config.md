Plugin @PLUGIN@
===============

The plugin populates tab that shows a summary of results posted
by the Zuul Project Gating system.

It can be configured per project whether Zuul integration is enabled
or not. To disable Zuul integration for a project, add the following
entry to its `project.config` file in the `refs/meta/config` branch:

```
  [plugin "zuul-results-summary"]
    enabled = false
```

The default is true (Zuul integration is enabled).
