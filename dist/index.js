var ref = require("prosemirror-state");
var Selection = ref.Selection;
var TextSelection = ref.TextSelection;
var NodeSelection = ref.NodeSelection;
var Plugin = ref.Plugin;
var PluginKey = ref.PluginKey;
var ref$1 = require("prosemirror-view");
var Decoration = ref$1.Decoration;
var DecorationSet = ref$1.DecorationSet;
var crel = require("crel")

// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
var AddNodeMenuState = function AddNodeMenuState(decorations) {
  this.deco = decorations
};

var addNodeMenuKey = new PluginKey("add-node-menu")

var selectionInEmptyTextNode = function (selection) {
  if (!selection instanceof TextSelection) {
    return false;
  }
  if (selection.$from.parent.nodeSize !== 2) {
    return false;
  }
  return true;
}

/**
 * Show the Add Node Menu when the selection is in an empty text node.
 */
var showNodeMenu = function (doc, selection) {
  return selectionInEmptyTextNode(selection);
}

var getDecorationsForSelection = function (doc, selection) {
  var dom = document.createElement('div')
  dom.style.width = 0;
  dom.style.display = 'inline-block';
  dom.style.overflow = 'visible';
  dom.style.position = 'relative';
  dom.style.cursor = 'pointer';
  var menuCaret = document.createElement('div');
  menuCaret.style.border = '1px solid black';
  menuCaret.style.transform = 'rotate(45deg) scale(.5)';
  menuCaret.style.width = '10px';
  menuCaret.style.height = '10px';
  dom.appendChild(menuCaret);
  menuCaret.style.position = 'absolute';
  menuCaret.style.left = '2px';
  menuCaret.style.bottom = 0;
  var menu = document.createElement('div');
  menu.innerHTML = 'Insert: Image, HR, Table';
  menu.style.position = 'absolute';
  menu.style.left = '7px';
  menu.style.bottom = '-4px';
  menu.style.border = '1px solid black';
  menu.style.padding = '2px';
  menu.style.width = '200px';
  dom.appendChild(menu);
  var decos = [Decoration.widget(selection.$from.pos, dom)]
  return DecorationSet.create(doc, decos)
}

function addNodeMenu() {
  return new Plugin({
    key: addNodeMenuKey,

    state: {
      init: function init() {
        return new AddNodeMenuState(DecorationSet.empty)
      },
      applyAction: function applyAction(action, addNodeMenuState, state) {
        debugger
        if (action.type == "selection") {
          var decos
          if (showNodeMenu(state.doc, action.selection)) {
            decos = getDecorationsForSelection(state.doc, action.selection)
          } else {
            decos = DecorationSet.empty
          }
          return new AddNodeMenuState(decos)
        }
        return addNodeMenuState
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
