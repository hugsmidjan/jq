# jq

**Hugsmidjan's eplica-cdn (codecentre) jQuery modules and utilities.**

This repository contains two sorts of things:

1. flat list of dumb jQuery plugins written and maintained by Hugsmiðjan's staff, plus a small selection of commonly used 3rd party jQuery plugins plus some stand-alone utilities.

2. es6 modules that `import` said jQuery plugins and rely on their side-effects to extend the global scope - same as if they were loaded via `<script />` tag

The script files are publicly available on `https://eplica-cdn.is/jq/*`


## About the jQuery plugins and utilities.

These plugins are all pretty old-school, and have the following characteristics:

  1. _None_ of them resolve/declare their own dependencies on other plugins.
  2. _Most_ rely on `window.jQuery` being defined and extend that object.
  3. _Some_ are CommonJS compatible with an optional method to register a jQuery plugin.


## ES6 modules with dependency declarations

The `req/` folder contains a collection of files that provide es6-based  normalization layer and basic dependency resolution.

This means that most plugins/utilities in the root-folder (and the `x/` folder) can be `imported` via a simple `import  'jq/req/myplugin';`.

The es6 modules rely on the normal side-effects of the utilities/jQuery plugins to set and/or extend objects in the global window scope.

This provides results similar to loading the plugin script file (and its dependencies) via series of `<script src="jq/myplugin-1.0-source.js"></script>` tags.


## Install

    npm install --save-dev git+git@github.com:hugsmidjan/jq.git#v1
