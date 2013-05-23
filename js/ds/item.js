goog.provide('k3d.ds.Item');

goog.require('pstj.ds.ListItem');
goog.require('goog.object');

/**
 * My new class description
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

});
