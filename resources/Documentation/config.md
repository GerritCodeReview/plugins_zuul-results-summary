Plugin @PLUGIN@
===============

The plugin populates tab that shows a summary of results posted
by the Zuul Project Gating system.

It can be configured per project whether Zuul integration is enabled
or not. To disable Zuul integration for a project, add the following
entry to its `project.config` file in the `refs/meta/config` branch:

```
  [plugin "@PLUGIN@"]
    enabled = false
```

The default is true (Zuul integration is enabled).

Zuul v4:
--------
Zuul v4 gerrit comments don't have the Zuul URL/Tenant information.
So, You can add your Zuul URL/Tenant with url/tenant variable.
```
  [plugin "@PLUGIN@"]
    url = https://example.org/
    tenant = public
```

Extra feature:
--------
If the job name has a naming rule with token, then you can show job name as
separated table columns. the default jobNameToken is "__".
```
  [plugin "@PLUGIN@"]
    jobNameRule = OS__Branch__Mode__Chip__Config
    jobNameToken = __
```
