goog.provide('k3d.control.Editor');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');
goog.require('goog.ui.Component.EventType');
goog.require('k3d.component.DrawingBoard');
goog.require('k3d.component.ItemView');
goog.require('k3d.component.PopOver');
goog.require('k3d.ds.Wall');
goog.require('k3d.ui.Filler');
goog.require('pstj.control.Base');
goog.require('pstj.ds.List');
goog.require('pstj.math.utils');


/**
 * Provides the design tool's editor controls.
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Editor = function() {
  goog.base(this);
  /**
   * @type {number}
   * @protected
   */
  this.width = 0;
  /**
   * @type {number}
   * @protected
   */
  this.height = 0;
  this.frame = new k3d.ui.Filler();
  this.drawsheet = new k3d.component.DrawingBoard();
  /**
   * Referrence to the kitchen project data structure.
   * @type {k3d.ds.KitchenProject}
   * @protected
   */
  this.data = null;
  /**
   * Referrence to the currently displayed wall.
   * @type {k3d.ds.Wall}
   * @protected
   */
  this.currentWall = null;
};
goog.inherits(k3d.control.Editor, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Editor);

/**
 * Provides symbol names for the actions.
 * @enum {string}
 */
k3d.control.Editor.Actions = {
  CLOSE: 'close'
};

// TODO: when loading a wall make sure to load all relevant images by items!
// This way we have a guarantee that when the user presses edit the images will
// be ready

goog.scope(function() {
  var _ = k3d.control.Editor.prototype;
  var Actions = k3d.control.Editor.Actions;
  var Struct = k3d.de.definitions.Struct;

  /**
   * @protected
   * @type {number}
   */
  _.heightOfUpperRow = 2100;

  /**
   * Loads the kitcen project data record.
   * @param {k3d.ds.KitchenProject} kitchen The kitchen data structure.
   */
  _.loadData = function(kitchen) {
    this.data = kitchen;
    this.initialize();
  };

  /**
   * Put logic here that marks that everything possible to be preloaded (prior
   *   and after the initial showing) is done loading.
   */
  _.onLoadComplete = function() {

  };

  /** @inheritDoc */
  _.initialize = function() {
    goog.base(this, 'initialize');
    this.getHandler().listen(this.drawsheet,
      goog.ui.Component.EventType.ACTIVATE, this.handleActionEvent);
    this.getHandler().listen(k3d.component.ItemView.getInstance(),
      goog.ui.Component.EventType.ACTION, this.handleItemViewAction);
    // find the first wall and load it.
    this.loadWall(0);
  };

  /**
   * Handle actions from the itemview control.
   * @param {goog.events.Event} e The ACTION event from the view.
   * @protected
   */
  _.handleItemViewAction = function(e) {
    var target = /** @type {!pstj.ui.Button} */ (e.target);
    if (target.getActionName() == Actions.CLOSE) {
      k3d.component.PopOver.getInstance().hide();
    }
  };

  /**
   * Loads a wall by its index
   * @param {number} index The wall number (index).
   */
  _.loadWall = function(index) {
    if (this.data.hasWallWithIndex(index)) {
      this.currentWall = this.data.getWall(index);
    } else {
      return;
    }
    // clear the drawing
    this.drawsheet.removeChildren();
    // using the data structure find out the wall sizes and set them
    this.setWallSize(goog.asserts.assertNumber(this.currentWall.getProp(
      k3d.ds.Wall.Property.WIDTH)), goog.asserts.assertNumber(
        this.currentWall.getProp(Struct.HEIGHT)));
    // calculate the potistion of the items on the drawing and store them as
    // pixel values
    this.visualizeItems();
    // calculate percentages
  };

  /**
   * Handles the action event from a component (this or a child one).
   * @param {goog.events.Event} e The ACTIVATE event.
   * @protected
   */
  _.handleActionEvent = function(e) {
    if (e.target == this.drawsheet) return;
    // assume one of the items was activated
    var target = /** @type {k3d.component.Item} */ (e.target);
    var model = target.getModel();
    // open dialog for change.
    k3d.component.ItemView.getInstance().setModel(model);
    k3d.component.PopOver.getInstance().embed(
      k3d.component.ItemView.getInstance());
    k3d.component.PopOver.getInstance().show();
  };


  /**
   * Sets the sizes of the wall, this should be done in the controler
   * @param {number} w The width of the wall.
   * @param {number} h The height of the wall in the room.
   * @protected
   */
  _.setWallSize = function(w, h) {
    this.width = w + 400;
    this.height = h + 400;
    if (this.drawsheet.isInDocument()) {
      this.resetSheetSize();
    }
  };

  _.visualizeItems = function() {
    // iterate top and bottom row and for each calculate the percentage position and pixel difference
    //goog.array.forEach()
  };

  // /**
  //  * Adds an item to the drawing board, initially we will only add to two rows
  //  *   and in sequence.
  //  * @param {k3d.component.Item} item The new component to add.
  //  * @param {boolean=} upper_row If the item should be added to the top row.
  //  *   Defaults to false.
  //  */
  // _.addItem = function(item, upper_row) {
  //   // get the item's size and and setup its styling parameters to match the
  //   // size of the wall.
  //   var model = item.getModel();
  //   var w = model.getProp(k3d.ds.Item.Property.WIDTH);
  //   var h = model.getProp(k3d.ds.Item.Property.HEIGHT);
  //   goog.asserts.assertNumber(w, 'Width of the cabinet should be a number');
  //   goog.asserts.assertNumber(h, 'Height of the cabinet should be a number');
  //   //calculate percentage based on the wall's sizes.
  //   var width = pstj.math.utils.getPercentFromValue(w, this.width);
  //   var height = pstj.math.utils.getPercentFromValue(h, this.height);
  //   // now determine where it should stand.
  //   //var initialoffsetx = pstj.math.utils.getPercentFromValue(200, this.width);
  //   var yoffset;
  //   if (!!upper_row) {
  //     yoffset = pstj.math.utils.getPercentFromValue(
  //       this.height - 200 - this.heightOfUpperRow, this.height);

  //   } else {
  //     yoffset = pstj.math.utils.getPercentFromValue(
  //       this.height - 200 - h, this.height);
  //   }
  //   // based on the row add all width of other items....
  //   var xoffset = this.calculateNextXOffset((!!(upper_row)) ?
  //     this.upRow : this.bottomRow);
  //   item.applyStyle(width, height, xoffset, yoffset);
  //   if (!!upper_row) {
  //     this.upRow.add(model);
  //   } else {
  //     this.bottomRow.add(model);
  //   }
  //   this.drawsheet.addChild(item, true);
  // };

  /**
   * Calculates the next available offset for items. This should become smarted.
   * @param {pstj.ds.List} row The list to calculate offset based on.
   * @protected
   */
  _.calculateNextXOffset = function(row) {
    var init = 200;
    var count = row.getCount();
    for (var i = 0; i < count; i++) {
      init += (+row.getByIndex(i).getProp(Struct.WIDTH));
    }
    return pstj.math.utils.getPercentFromValue(init, this.width);
  };

  /**
   * Install the editor in the DOM.
   * @param {!Element} el The element to install the editor in.
   */
  _.install = function(el) {
    this.frame.decorate(goog.dom.getElementByClass(goog.getCssName(
      'container'), el));

    this.resetSheetSize();
    this.drawsheet.decorate(goog.dom.getElementByClass(goog.getCssName(
      'child'), el));

    this.frame.addChild(this.drawsheet);
  };

  /**
   * This is called when the wall is actually changed and we want to reset the
   *   size of the sheet to 'notify' the user.
   * @protected
   */
  _.resetSheetSize = function() {
    var size = new goog.math.Size(this.width, this.height);
    goog.asserts.assertInstanceof(this.frame.size, goog.math.Size,
      'The frame size should be already set when resizing the sheet ' +
      'inside of it');
    size.scaleToFit(this.frame.size);
    this.drawsheet.setSize(size);
  };

});
