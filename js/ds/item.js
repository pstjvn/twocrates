goog.provide('k3d.ds.Item');

goog.require('pstj.ds.ListItem');

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
 * The properties of the item.
 * @enum {string}
 */
k3d.ds.Item.Property = {
  ID: 'id',
  WIDTH: 'w',
  HEIGHT: 'h'
};
