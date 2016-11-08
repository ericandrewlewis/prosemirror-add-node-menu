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

// A decoration should have a way to invoke onAction to update the editor view's state.
const getDecorationsForState = (state, onAction) => {
  const menu = document.createElement('div');
  const button = document.createElement('button');
  button.innerHTML = 'Insert HR';
  button.addEventListener('mousedown', (event) => {
    const hr = state.schema.nodes.horizontal_rule;
    onAction(state.tr.replaceSelection(hr.create()).action());
  });
  menu.appendChild(button);
  menu.style.border = '1px solid black';
  menu.style.padding = '2px';
  const decos = [Decoration.widget(state.selection.$from.pos, menu)]
  return DecorationSet.create(state.doc, decos)
}

const decorationsForState = (state, onAction) => {
  return selectionInEmptyTextNode(state.selection) ? getDecorationsForState(state, onAction) : DecorationSet.empty
}

function addNodeMenu(config) {
  return new Plugin({
    key: 'add-node-menu',

    state: {
      init(config, state) {
        return new AddNodeMenuState(decorationsForState(state))
      },
      applyAction(action, addNodeMenuState, oldState, newState) {
        if (action.type === "selection" || action.type === "transform") {
          return new AddNodeMenuState(decorationsForState(newState, config.onAction))
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
