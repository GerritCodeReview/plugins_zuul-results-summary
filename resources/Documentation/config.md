Plugin @PLUGIN@
===============

The plugin populates tab that shows a summary of results posted
by the Zuul CI system.

It can be configured per project whether the Zuul CI integration is
enabled or not. To enable the Zuul CI integration for a project the
project must have the following entry in its `project.config` file in
the `refs/meta/config` branch:

```
  [plugin "zuul-results-summary"]
    enabled = true
```
