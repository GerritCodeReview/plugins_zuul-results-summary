// Copyright (C) 2021 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.googlesource.gerrit.plugins.zuulresultssummary;

import static com.google.gerrit.server.project.ProjectResource.PROJECT_KIND;

import com.google.gerrit.extensions.annotations.Exports;
import com.google.gerrit.extensions.api.projects.ProjectConfigEntryType;
import com.google.gerrit.extensions.registration.DynamicSet;
import com.google.gerrit.extensions.restapi.RestApiModule;
import com.google.gerrit.extensions.webui.JavaScriptPlugin;
import com.google.gerrit.extensions.webui.WebUiPlugin;
import com.google.gerrit.server.config.ProjectConfigEntry;

public class Module extends RestApiModule {
  static final String KEY_PLUGIN_ENABLED = "enabled";

  @Override
  protected void configure() {
    // Point to the JavaScript that provides the main functionality of this plugin.
    DynamicSet.bind(binder(), WebUiPlugin.class)
        .toInstance(new JavaScriptPlugin("zuul-results-summary.js"));

    // Register the config endpoint used by the JavaScript client code.
    get(PROJECT_KIND, "config").to(GetConfig.class);

    // Configure UI element to be exposed on the project view
    bind(ProjectConfigEntry.class)
        .annotatedWith(Exports.named(KEY_PLUGIN_ENABLED))
        .toInstance(
            new ProjectConfigEntry(
                "Enable Zuul results summary",
                "false",
                ProjectConfigEntryType.BOOLEAN,
                null,
                false,
                "Parse comment messages and render CI build results on Zuul Summary tab."));
  }
}
