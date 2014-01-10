goog.provide('k3d.ds.Wall');

goog.require('k3d.ds.CabinetRow');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.ListItem');



/**
 * Provides the wall asbtraction data strucure. This structures represents a
 *   single wall in our design for a kitchen. It has knowledge of the rows of
 *   cabinets (floor and upper row).
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {Object} data The wall record literal object.
 */
k3d.ds.Wall = function(data) {
  /**
   * The top row.
   * @type {k3d.ds.CabinetRow}
   * @private
   */
  this.top_ = null;
  /**
   * The bottom row.
   * @type {k3d.ds.CabinetRow}
   * @private
   */
  this.bottom_ = null;
  goog.base(this, data);
};
goog.inherits(k3d.ds.Wall, pstj.ds.ListItem);

goog.scope(function() {

var _ = k3d.ds.Wall.prototype;
var Struct = k3d.ds.definitions.Struct;


/** @inheritDoc */
_.convert = function() {
  var top = new k3d.ds.CabinetRow(
      this.getRawData()[Struct.ITEMS][Struct.TOP_ROW]);

  var bottom = new k3d.ds.CabinetRow(
      this.getRawData()[Struct.ITEMS][Struct.BOTTOM_ROW]);

  this.getRawData()[Struct.ITEMS][Struct.TOP_ROW] = top;
  this.getRawData()[Struct.ITEMS][Struct.BOTTOM_ROW] = bottom;
  this.top_ = top;
  this.bottom_ = bottom;
};


/**
 * Getter for the rows of cabinets as data structures.
 * @param {boolean=} opt_top True if we want to access the top row.
 * @return {k3d.ds.CabinetRow}
 */
_.getRow = function(opt_top) {
  if (opt_top) return this.top_;
  else return this.bottom_;
};


/**
 * Getter for the width of the wall.
 * @return {number} The wall width (all available space) in millimeters.
 */
_.getWidth = function() {
  return goog.asserts.assertNumber(this.getProp(Struct.WIDTH));
};


/**
 * Abstracts and hides the manner of determining the available space for
 * new items on a particular row on this wall.
 * @param {boolean} top If true the returned available space will be for the
 * top row on the wall, else it will be for the bottom (floor) row of items.
 * @return {number} The available width (free space) in millimeters.
 */
_.getAvailableWidth = function(top) {
  if (top) {
    return this.getWidth() - this.top_.getWidth() -
        this.bottom_.getTallItemsWidth();
  } else {
    return this.getWidth() - this.bottom_.getWidth();
  }
};


/**
 * Iterate over all the data and return the matrix of stop points.
 * @param {boolean} top If the stop points should be obtained from the top
 *   or bottom row.
 * @return {Array.<number>} The stop point matrix.
 */
_.getStopPoints = function(top) {
  if (top) return this.top_.getStopPoints();
  return this.bottom_.getStopPoints();
};


/**
 * Returns all image references in this wall instance. It will walk all the
 *   items that are currently applied on the wall (both top and floor rows)
 *   and gather all images linked in each item applied to the wall instance.
 * @return {Array.<string>}
 */
_.getImageReferences = function() {
  return this.top_.getImageReferences().concat(
      this.bottom_.getImageReferences());
};


/**
 * Replaces an existing item on its corresponding row with a new one.
 * @param {k3d.ds.Item} item The item to replace.
 * @param {k3d.ds.Item} newitem The new item to use.
 */
_.replaceItem = function(item, newitem) {
  var row = this.getRowOfItem(item);
  row.replaceItem(item, newitem);
};


/**
 * Removes an item from the wall.
 * @param {k3d.ds.Item} item The item to remove (reference).
 */
_.removeItem = function(item) {
  this.getRowOfItem(item).removeItem(item);
};


/**
 * Checks the cabinet for overflows. This might happen then on wall N a
 *   corner item is added and on wall N+1 the row already has items and thus
 *   the corner item duplicaterd on wall N+1 pushesh the cabinets outside of
 *   the wall restrains.
 * @return {boolean} True if the cabinets overflow the wall size.
 */
_.hasOverflow = function() {
  var width = this.getProp(Struct.WIDTH);
  if (this.getRow(true).getWidth() > width ||
      this.getRow(false).getWidth() > width) {
    return true;
  } else {
    return false;
  }
};


/**
 * Returns the row an item belongs to if found.
 * @param {k3d.ds.Item} item The item to look for.
 * @return {k3d.ds.CabinetRow} The row the item is in or null.
 */
_.getRowOfItem = function(item) {
  if (this.top_.hasItem(item)) {
    return this.top_;
  } else if (this.bottom_.hasItem(item)) {
    return this.bottom_;
  } else {
    return null;
  }
};

});  // goog.scope

