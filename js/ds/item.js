goog.provide('k3d.ds.Item');

goog.require('goog.object');
goog.require('k3d.ds.definitions');
goog.require('k3d.ds.helpers');
goog.require('pstj.ds.ListItem');



/**
 * Provides the base item for the kitchen. The data structure represents
 * a single cabinet.
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {Object} data The data to use as source for the item.
 */
k3d.ds.Item = function(data) {
  goog.base(this, data);
  /**
   * Additional visual offset forced by bottom row items.
   * @type {number}
   * @private
   */
  this.visualOffset_ = 0;
};
goog.inherits(k3d.ds.Item, pstj.ds.ListItem);

goog.scope(function() {

var _ = k3d.ds.Item.prototype;
var Struct = k3d.ds.definitions.Struct;


/**
 * Sets additional forces visula offset for items that are pushed back by
 *   items on the bottom row.
 * @param {number} offset The offset to force further back.
 */
_.setVisualOffset = function(offset) {
  this.visualOffset_ = offset;
};


/**
 * Getter for the current visual offset of the item.
 * @return {number}
 */
_.getVisualOffset = function() {
  return this.visualOffset_;
};


/**
 * @override
 * @return {k3d.ds.Item}
 */
_.clone = function() {
  return new k3d.ds.Item(goog.asserts.assertObject(
      goog.object.unsafeClone(this.getRawData())));
};


/**
 * Getter for the width. The cirect width is returned based on the
 * item structure. This is useful for corner items especially as they
 * have two widths defined.
 * @return {number}
 */
_.getWidth = function() {
  if (this.getProp(Struct.CLONE) && k3d.ds.helpers.isCornerItem(this)) {
    return goog.asserts.assertNumber(this.getProp(Struct.WIDTH2));
  } else {
    return goog.asserts.assertNumber(this.getProp(Struct.WIDTH));
  }
};

});  // goog.scope
