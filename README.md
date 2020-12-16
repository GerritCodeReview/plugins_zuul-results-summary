# Zuul Results Summary

Polygerrit plugin to show a summary of Zuul results in a change tab

Results are show in reverse chronological order, additionally sorted
by CI userid's in ZUUL_PRIORITY (earlier entry in the list means
sorted first in the output table).  i.e. if you consider one of your
CI reporters to be the main one, you should place it first in this
list.

## UI tests

UI tests are still a work in progress

## Test plugin on Gerrit

1. Clone gerrit `git clone https://gerrit.googlesource.com/gerrit`
1. Clone plugin to `plugins/zuul-results-summary` `cd plugins; git clone https://gerrit.googlesource.com/plugins/zuul-results-summary
1. Run build `cd ..; bazel build plugins/zuul-results-summary:zuul-results-summary`
1. Copy resulting plugin `bazel-bin/plugins/zuul-results-summary/zuul-results-summary.js` to Gerrit plugins directory

