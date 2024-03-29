// Copyright (c) 2020 Red Hat
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

// TODO(ianw) : find some way to make this configurable
const ZUUL_PRIORITY = [22348];

/*
 * Tab contents
 */
class ZuulSummaryStatusTab extends Polymer.Element {

  /** Get properties
   *
   * @returns {dict} change and revision
   */
  static get properties() {
    return {
      plugin: Object,
      _enabled: Boolean,
      change: {
        type: Object,
        observer: '_processChange',
      },
      revision: Object,
    };
  }

  /** Get template
   *
   * @returns {Polymer.html} the template
   */
  static get template() {
    return Polymer.html`
  <style>
    table {
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      text-align: left;
      padding: 2px;
    }

    th {
      background-color: var(--background-color-primary, #f7ffff);
      font-weight: normal;
      color: var(--primary-text-color, rgb(33, 33, 33));
    }

    thead tr th:first-of-type,
    tbody tr td:first-of-type {
     padding-left: 12px;
    }

    a:link, a:visited {
      color: var(--link-color);
    }

    tr:nth-child(even) {
     background-color: var(--background-color-secondary, #f2f2f2);
    }

    tr:nth-child(odd) {
     background-color: var(--background-color-tertiary, #f7ffff);
    }

    tr:hover td {
     background-color: var(--hover-background-color, #fffed);
    }

    .status-SUCCESS {
      color: green;
    }

    .status-FAILURE {
      color: red;
    }

    .status-ERROR {
      color: red;
    }

    .status-RETRY_LIMIT {
      color: red;
    }

    .status-SKIPPED {
      color: #73bcf7;
    }

    .status-ABORTED {
      color: orange;
    }

    .status-MERGER_FAILURE {
      color: orange;
    }

    .status-NODE_FAILURE {
      color: orange;
    }

    .status-TIMED_OUT {
      color: orange;
    }

    .status-POST_FAILURE {
      color: orange;
    }

    .status-CONFIG_ERROR {
      color: orange;
    }

    .status-DISK_FULL {
      color: orange;
    }

    .date {
      color: var(--deemphasized-text-color);
    }
  </style>

  <template is="dom-if" if="[[!_enabled]]">
      Zuul integration is not enabled.
  </template>
  <template is="dom-repeat" items="[[__table]]">
   <div style="padding-bottom:2px;">
   <table>
    <thead>
     <tr>
      <th>
       <template is="dom-if" if="{{item.succeeded}}"><gr-icon icon="check" style="color:var(--success-foreground)"></gr-icon></template>
       <template is="dom-if" if="{{!item.succeeded}}"><gr-icon icon="close" style="color:var(--error-foreground)"></gr-icon></template>
       <b>[[item.author_name]]</b> on Patchset <b>[[item.revision]]</b> in pipeline <b>[[item.pipeline]]</b></th>
      <th><template is="dom-if" if="{{item.rechecks}}">[[item.rechecks]] rechecks</template></th>
      <th><span class="date"><gr-date-formatter show-date-and-time="" date-str="[[item.gr_date]]"></gr-date-formatter></span></th>
     </tr>
    </thead>
    <tbody>
     <template is="dom-repeat" items="[[item.results]]" as="job">
      <tr>
       <template is="dom-if" if="{{job.link}}"><td><a href="{{job.link}}">[[job.job]]</a></td></template>
       <template is="dom-if" if="{{!job.link}}"><td><span style="color: var(--secondary-text-color)">[[job.job]]</span></td></template>
       <template is="dom-if" if="{{job.errormsg}}"><td><span title="[[job.errormsg]]" class$="status-[[job.result]]">[[job.result]]</span></td></template>
       <template is="dom-if" if="{{!job.errormsg}}"><td><span class$="status-[[job.result]]">[[job.result]]</span></td></template>
       <td>[[job.time]]</td>
      </tr>
     </template>
    </tbody>
   </table>
   </div>
  </template>`;
  }

  /**
   * Process the change. Retrieve project configuration, and if it's
   * enabled for Zuul, parse the messages and render Zuul Summary tab.
   *
   * @param {Object} change
   */
  async _processChange(change) {
    // TODO(davido): Cache results of project config request
    this._enabled = await this._projectEnabled(change.project);
    if (this._enabled) {
      this._processMessages(change);
    }
  }

  /**
   * Returns whether the project is enabled for Zuul.
   *
   * @param {string} project
   * @return {promise<boolean>} Resolves to true if the project is enabled
   *     otherwise, false.
   */
  async _projectEnabled(project) {
    const configPromise = this.plugin.restApi().get(
        `/projects/${encodeURIComponent(project)}/` +
        `${encodeURIComponent(this.plugin.getPluginName())}~config`);
    try {
      const config = await configPromise;
      return config && config.enabled;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /** Look for Zuul tag in message
   *
   * @param{ChangeMessageInfo} message
   * @returns {bool} if this is a Zuul message or not
   */
  _match_message_via_tag(message) {
    return !!(message.tag &&
        message.tag.startsWith('autogenerated:zuul'));
  }

  /** Look for 3rd-party CI messages via regex
   *
   * @param{ChangeMessageInfo} message
   * @returns {bool} if this is a Zuul-ish message or not
   */
  _match_message_via_regex(message) {
    // TODO: allow this to be passed in via config
    const authorRe = /^(?<author>.* CI|Zuul)/;
    const author = authorRe.exec(message.author.name);
    return !!author;
  }

  /** Extract the status and pipeline from the message
   *
   * @param{ChangeMessageInfo} message
   * @returns {list} status and pipeline
   */
  _get_status_and_pipeline(message) {
    // Look for the full Zuul-3ish build status message, e.g.:
    //    Build succeeded (check pipeline).
    const statusRe = /^Build (?<status>\w+) \((?<pipeline>[\w]+) pipeline\)\./gm;
    let statusMatch = statusRe.exec(message.message);
    if (!statusMatch) {
      // Match non-pipeline CI comments, e.g.:
      //   Build succeeded.
      const statusRe = /^Build (?<status>\w+)\./gm;
      statusMatch = statusRe.exec(message.message);
    }
    if (!statusMatch) {
      return false; // we can't parse this
    }

    const status = statusMatch.groups.status;
    const pipeline = statusMatch.groups.pipeline ?
      statusMatch.groups.pipeline : 'unknown';
    return [status, pipeline];
  }

  /** Change Modified */
  _processMessages(change) {
    /*
     * change-view-tab-content gets passed ChangeInfo object [1],
     * registered in the property "change".  We walk the list of
     * messages with some regexps to extract into a data structure
     * stored in __table
     *
     * __table is an [] of objects
     *
     *  author: "<string> CI"
     *  date: Date object of date message posted, useful for
     *    sorting, diffs, etc.
     *  gr_date: original message timestamp sutiable to pass to
     *    gr-date-formatter
     *  revision: the revision the patchset was made against
     *  rechecks: the number of times we've seen the same
     *    ci run for the same revision
     *  status: one of <succeeded|failed>
     *  pipeline: string of reporting pipeline
     *    (may be undefined for some CI)
     *  results: [] of objects
     *    job: job name
     *    link: raw URL link to logs
     *    result: one of <SUCCESS|FAILURE>
     *    time: duration of run in human string (e.g. 2m 5s)
     *
     * This is then presented by the template
     *
     * [1] https://gerrit-review.googlesource.com/Documentation/rest-api-changes.html#change-info
     */
    this.__table = [];
    change.messages.forEach(message => {
      if (! (this._match_message_via_tag(message) ||
                    this._match_message_via_regex(message))) {
        return;
      }

      const date = new Date(message.date);
      const revision = message._revision_number;
      const sp = this._get_status_and_pipeline(message);
      if (!sp) {
        // This shouldn't happen as we've validated it is a Zuul message.
        return;
      }
      const status = sp[0];
      const pipeline = sp[1];

      // We only want the latest entry for each CI system in
      // each pipeline
      const existing = this.__table.findIndex(entry =>
        (entry.author_id === message.author._account_id) &&
                    (entry.pipeline === pipeline));

      // If this is a comment by the same CI on the same pipeline and
      // the same revision, it's considered a "recheck" ... i.e. likely
      // manually triggered to run again.  Take a note of this.
      let rechecks = 0;
      if (existing !== -1) {
        if (this.__table[existing].revision === revision) {
          rechecks = this.__table[existing].rechecks + 1;
        }
      }

      // Find each result line
      const results = [];
      const lines = message.message.split('\n');
      // We have to match a few different things ...
      // A "standard" line is like
      //   - passing-job http://... : SUCCESS in 2m 45s
      // Skipped jobs don't have a time, e.g.
      //   - skipped-job http://... : SKIPPED
      // Error status has a string before the time
      //   - error-job http://... : ERROR A freeform string in 2m 45s

      const resultRe = /^- (?<job>[^ ]+) (?:(?<link>https?:\/\/[^ ]+)|[^ ]+) : ((ERROR (?<errormsg>.*?) in (?<errtime>.*))|(?<result>[^ ]+)( in (?<time>.*))?)/;
      lines.forEach(line => {
        const result = resultRe.exec(line);
        if (result) {
          if (result.groups.result === "SKIPPED") {
            result.groups.link = null;
          }
          // Note you can't duplicate match group names, even if
          // it's behind an | statement like above.  So for error
          // matches we copy things into the right place to display.
          if (result.groups.errormsg) {
            result.groups.result = "ERROR";
            result.groups.time = result.groups.errtime;
          }
          results.push(result.groups);
        }
      });

      const table = {
        author_name: message.author.name,
        author_id: message.author._account_id,
        revision,
        rechecks,
        date,
        gr_date: message.date,
        status,
        succeeded: status === 'succeeded',
        pipeline,
        results,
      };

      if (existing === -1) {
        this.__table.push(table);
      } else {
        this.__table[existing] = table;
      }

      // Sort first by listed priority, then by date
      this.__table.sort((a, b) => {
        // >>> 0 is just a trick to convert -1 to uint max
        // of 2^32-1
        const p_a = ZUUL_PRIORITY.indexOf(a.author_id) >>> 0;
        const p_b = ZUUL_PRIORITY.indexOf(b.author_id) >>> 0;
        const priority = p_a - p_b;
        const date = b.date - a.date;
        return priority || date;
      });
    });
  }
}

customElements.define('zuul-summary-status-tab',
    ZuulSummaryStatusTab);

/*
 * Tab Header Element
 */
class ZuulSummaryStatusTabHeader extends Polymer.Element {
  /** Get template
   *
   * @returns {Polymer.html} the template
   */
  static get template() {
    return Polymer.html`Zuul Summary`;
  }
}

customElements.define('zuul-summary-status-tab-header',
    ZuulSummaryStatusTabHeader);

/*
 * Install plugin
 */
Gerrit.install(plugin => {
  'use strict';

  plugin.registerDynamicCustomComponent(
      'change-view-tab-header',
      'zuul-summary-status-tab-header'
  );

  plugin.registerDynamicCustomComponent(
      'change-view-tab-content',
      'zuul-summary-status-tab'
  );
});
