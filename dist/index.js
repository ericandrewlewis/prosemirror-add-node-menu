var ref = require("prosemirror-state");
var Selection = ref.Selection;
var TextSelection = ref.TextSelection;
var NodeSelection = ref.NodeSelection;
var Plugin = ref.Plugin;
var PluginKey = ref.PluginKey;
var ref$1 = require("prosemirror-view");
var Decoration = ref$1.Decoration;
var DecorationSet = ref$1.DecorationSet;

// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
var AddNodeMenuState = function AddNodeMenuState(decorations) {
  this.deco = decorations
};

var selectionInEmptyTextNode = function (selection) {
  return selection.empty && selection.$from.parent.content.size === 0;
}

// A decoration should have a way to invoke onAction to update the editor view's state.
var getDecorationsForState = function (state, onAction) {
  var menu = document.createElement('div');
  var button = document.createElement('button');
  button.innerHTML = 'Insert HR';
  button.addEventListener('mousedown', function (event) {
    var hr = state.schema.nodes.horizontal_rule;
    onAction(state.tr.replaceSelection(hr.create()).action());
  });
  menu.appendChild(button);
  menu.style.border = '1px solid black';
  menu.style.padding = '2px';
  var decos = [Decoration.widget(state.selection.$from.pos, menu)]
  return DecorationSet.create(state.doc, decos)
}

var decorationsForState = function (state, onAction) {
  return selectionInEmptyTextNode(state.selection) ? getDecorationsForState(state, onAction) : DecorationSet.empty
}

function addNodeMenu(config) {
  // config.onAction
  return new Plugin({
    key: 'add-node-menu',

    state: {
      init: function init(config, state) {
        return new AddNodeMenuState(decorationsForState(state))
      },
      applyAction: function applyAction(action, addNodeMenuState, oldState, newState) {
        if (action.type === "selection" || action.type === "transform") {
          return new AddNodeMenuState(decorationsForState(newState, config.onAction))
        } else {
          return addNodeMenuState
        }
      }
    },
    props: {
      decorations: function decorations(state) {
        return this.getState(state).deco
      }
    }
  })
}
exports.addNodeMenu = addNodeMenu
