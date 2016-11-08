const {Schema, DOMParser} = require("prosemirror-model")
const {EditorState} = require("prosemirror-state")
const {schema} = require("prosemirror-schema-basic")
const {addListNodes} = require("prosemirror-schema-list")
const {addTableNodes} = require("prosemirror-schema-table")
const {MenuBarEditorView} = require("prosemirror-menu")
const {exampleSetup} = require("prosemirror-example-setup")
const {addNodeMenu} = require("./parent/dist")

const demoSchema = new Schema({
  nodes: addListNodes(addTableNodes(schema.nodeSpec, "block+", "block"), "paragraph block*", "block"),
  marks: schema.markSpec
})

let state = EditorState.create({
  doc: DOMParser.fromSchema(demoSchema).parse(document.querySelector("#content")),
  plugins: exampleSetup({schema: demoSchema}).concat([addNodeMenu()])
  // plugins: exampleSetup({schema: demoSchema})
})

let view = window.view = new MenuBarEditorView(document.querySelector(".full"), {
  state,
  onAction: action => {
    // debugger
    return view.updateState(view.editor.state.applyAction(action))
  }
})
