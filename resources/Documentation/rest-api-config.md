@PLUGIN@ - /config/ REST API
============================

This page describes the '/config/' REST endpoint that is added by the
@PLUGIN@ plugin.

Please also take note of the general information on the
[REST API](../../../Documentation/rest-api.html).

<a id="project-endpoints"> @PLUGIN@ Endpoints
--------------------------------------------

### <a id="get-config"> Get Config
_GET /projects/[ProjectName](#project-name)/@PLUGIN@~config_

Gets per project configuration of the @PLUGIN@ plugin.

#### Request

```
  GET /projects/foo/@PLUGIN@~config HTTP/1.0
```

As response a [ConfigInfo](#config-info) entity is returned that
contains the configuration of the @PLUGIN@ plugin.

#### Response

```
  HTTP/1.1 200 OK
  Content-Disposition: attachment
  Content-Type: application/json;charset=UTF-8

  )]}'
  {
    "enabled": true,
    "zuul_url": "https://example.org",
    "zuul_tenant": "public",
    "zuul_job_name_rule": "OS__Branch__Mode__Chip__Config",
    "zuul_job_name_token": "__",
  }
```

### <a id="project-name"></a>ProjectName

The name of the project.

If the name ends with `.git`, the suffix will be automatically removed.


### <a id="config-info"></a>ConfigInfo

The `ConfigInfo` entity contains the configuration of the @PLUGIN@
plugin.

|Field Name         |Description|
|-------------------|-----------|
|enabled            | Whether the project is enabled for Zuul integration|
|zuul_url           | Zuul Web URL|
|zuul_tenant        | Zuul Tenant name|
|zuul_job_name_rule | Zuul Job name rules|
|zuul_job_name_token| Zuul Job name token|

SEE ALSO
--------

* [Config related REST endpoints](../../../Documentation/rest-api-config.html)

GERRIT
------
Part of [Gerrit Code Review](../../../Documentation/index.html)
