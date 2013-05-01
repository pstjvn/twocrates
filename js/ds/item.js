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
 * The properties of the item.
 * @enum {string}
 */
k3d.ds.Item.Property = {
  ID: 'id',
  // The item is designed to be used next to a wall (single fron view)
  ATTACHED: 'is_attached_to_wall',
  DESCRIPTION: 'description',
  // the category ID, thees need to be clarified.
  CATEGORY: 'category_id',
  // the width of the item.
  WIDTH: 'width',
  // on items with two walls (corner items) the second wall (right) width
  WIDTH2: 'width2',
  // the height of the item
  HEIGHT: 'height',
  // depth of the item, used only in stone bench calculations.
  DEPTH: 'depth',
  // image of the item in front view
  DRAWING_IMAGE: 'front_picture',
  // Image of the item in side view
  SIDE_IMAGE: 'angle_picture',
  // THe item requires to be covered on top by the stone bench
  USE_TOP_BOARD: 'has_top_board',
  // THe model ID (number).
  MODEL: 'model_id',
  // the item is actually a spacer
  ISSPACE: 'is_spacer',
  // price in cents
  PRICE: 'price',
  // number of handles to use with this item
  HANDLES: 'required_handles'
};
