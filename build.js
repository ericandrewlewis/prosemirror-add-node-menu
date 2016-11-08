#!/usr/bin/env node

// This script builds the ProseMirror packages which don't have a dist/ directory
// because we're including the latest from Github.
let child = require("child_process")

let modules = [ "prosemirror-state", "prosemirror-view", "prosemirror-example-setup", "prosemirror-menu", "prosemirror-model", "prosemirror-schema-basic", "prosemirror-schema-list", "prosemirror-schema-table" ];


function buildModules() {
  modules.forEach(repo => {
    console.log(repo + ":")
    try {
      console.log(run('npm', ['run', 'build'], repo))
    } catch (e) {
      console.log(e.toString())
      process.exit(1)
    }
  })
}

function run(cmd, args, wd) {
  return child.execFileSync(cmd, args, {cwd: "node_modules/" + wd, encoding: "utf8"})
}

buildModules()
