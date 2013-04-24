goog.provide('k3d.ds.Item');

goog.require('pstj.ds.ListItem');
goog.require('goog.object')

/**
 * The item that we have on the drawing board.
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {Object} data The raw data record.
 */
k3d.ds.Item = function(data) {
  goog.base(this, data);
};
goog.inherits(k3d.ds.Item, pstj.ds.ListItem);

/**
 * Clones the record type's raw date.
 * @return {Object} The raw record data cloned.
 */
k3d.ds.Item.prototype.clone = function() {
  return goog.asserts.assertObject(goog.object.unsafeClone(this.getRawData()));
};

/**
 * The properties of the item.
 * @enum {string}
 */
k3d.ds.Item.Property = {
  ID: 'id',
  WIDTH: 'width',
  HEIGHT: 'height',
  PRICE: 'price',
  DRAWING_IMAGE: 'front_picture',
  SIDE_IMAGE: 'angle_picture',
  DESCRIPTION: 'description',
  CATEGORY: 'category_id'
};
