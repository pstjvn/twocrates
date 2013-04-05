goog.provide('k3d.control.Editor');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('k3d.component.DrawingBoard');
goog.require('k3d.ui.Filler');
goog.require('pstj.ds.List');
goog.require('pstj.math.utils');

/**
 * @constructor
 */
k3d.control.Editor = function() {
  this.width = 0;
  this.height = 0;
  this.frame = new k3d.ui.Filler();
  this.drawsheet = new k3d.component.DrawingBoard();
  this.bottomRow = new pstj.ds.List();
  this.upRow = new pstj.ds.List();
};
goog.addSingletonGetter(k3d.control.Editor);

goog.scope(function() {
  var _ = k3d.control.Editor.prototype;

  /**
   * @protected
   * @type {number}
   */
  _.heightOfUpperRow = 2100;

  /**
   * Sets the sizes of the wall, this should be done in the controler
   * @param {number} w The width of the wall.
   * @param {number} h The height of the wall in the room.
   */
  _.setWallSize = function(w, h) {
    this.width = w + 400;
    this.height = h + 400;
    if (this.drawsheet.isInDocument()) {
      this.resetSheetSize();
    }
  };

  /**
   * Adds an item to the drawing board, initially we will only add to two rows
   *   and in sequence.
   * @param {k3d.component.Item} item The new component to add.
   * @param {boolean=} upper_row If the item should be added to the top row.
   *   Defaults to false.
   */
  _.addItem = function(item, upper_row) {
    // get the item's size and and setup its styling parameters to match the
    // size of the wall.
    var model = item.getModel();
    var w = model.getProp(k3d.ds.Item.Property.WIDTH);
    var h = model.getProp(k3d.ds.Item.Property.HEIGHT);
    goog.asserts.assertNumber(w, 'Width of the cabinet should be a number');
    goog.asserts.assertNumber(h, 'Height of the cabinet should be a number');
    //calculate percentage based on the wall's sizes.
    var width = pstj.math.utils.getPercentFromValue(w, this.width);
    var height = pstj.math.utils.getPercentFromValue(h, this.height);
    // now determine where it should stand.
    //var initialoffsetx = pstj.math.utils.getPercentFromValue(200, this.width);
    var yoffset;
    if (!!upper_row) {
      yoffset = pstj.math.utils.getPercentFromValue(
        this.height - 200 - this.heightOfUpperRow, this.height);

    } else {
      yoffset = pstj.math.utils.getPercentFromValue(
        this.height - 200 - h, this.height);
    }
    // based on the row add all width of other items....
    var xoffset = this.calculateNextXOffset((!!(upper_row)) ?
      this.upRow : this.bottomRow);
    item.applyStyle(width, height, xoffset, yoffset);
    if (!!upper_row) {
      this.upRow.add(model);
    } else {
      this.bottomRow.add(model);
    }
    this.drawsheet.addChild(item, true);
  };

  /**
   * Calculates the next available offset for items. This should become smarted.
   * @param {pstj.ds.List} row The list to calculate offset based on.
   * @protected
   */
  _.calculateNextXOffset = function(row) {
    var init = 200;
    var count = row.getCount();
    for (var i = 0; i < count; i++) {
      init += (+row.getByIndex(i).getProp(k3d.ds.Item.Property.WIDTH));
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
   * This is called when the wall is actually chenged and we want to reset the
   *   size of the sheet to 'notife' the user.
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
