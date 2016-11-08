const {Selection, TextSelection, NodeSelection, Plugin, PluginKey} = require("prosemirror-state")
const {Decoration, DecorationSet} = require("prosemirror-view")

// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
class AddNodeMenuState {
  constructor(decorations) {
    this.deco = decorations
  }
}

const selectionInEmptyTextNode = (selection) => {
  return selection.empty && selection.$from.parent.content.size === 0;
}

const getDecorationsForSelection = (doc, selection) => {
  const menu = document.createElement('div');
  menu.innerHTML = 'Insert: Image, HR, Table';
  menu.style.border = '1px solid black';
  menu.style.padding = '2px';
  const decos = [Decoration.widget(selection.$from.pos, menu)]
  return DecorationSet.create(doc, decos)
}

const decorationsForState = (state) => {
  return selectionInEmptyTextNode(state.selection) ? getDecorationsForSelection(state.doc, state.selection) : DecorationSet.empty
}

function addNodeMenu() {
  return new Plugin({
    key: 'add-node-menu',

    state: {
      init(config, state) {
        return new AddNodeMenuState(decorationsForState(state))
      },
      applyAction(action, addNodeMenuState, oldState, newState) {
        if (action.type === "selection" || action.type === "transform") {
          return new AddNodeMenuState(decorationsForState(newState))
        } else {
          return addNodeMenuState
        }
      }
    },
    props: {
      decorations(state) {
        return this.getState(state).deco
      }
    }
  })
}
exports.addNodeMenu = addNodeMenu
