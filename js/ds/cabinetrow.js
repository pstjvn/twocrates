goog.provide('k3d.ds.CabinetRow');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.ListItem');

/**
 * The class represents a row on a wall.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {Array.<Object>} items The items that are already on this wall.
 */
k3d.ds.CabinetRow = function(items) {
  goog.base(this);
  /**
   * The list of items on this row. Rows do not have notion of their blonging
   *   and rows can contains more than one copy of an item.
   * @type {Array.<pstj.ds.ListItem>}
   * @private
   */
  this.items_ = [];
  goog.array.forEach(items, function(record) {
    this.addItem(new pstj.ds.ListItem(record));
  }, this);
};
goog.inherits(k3d.ds.CabinetRow, goog.events.EventTarget);

goog.scope(function() {

  var _ = k3d.ds.CabinetRow.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /**
   * Ads a new item to the list of cabinets on this row.
   * @param {pstj.ds.ListItem} item The raw literal object represeting the
   *   cabinet.
   */
  _.addItem = function(item) {

    this.items_.push(item);
  };

  /**
   * Returns all referenced images images in the row. Those are not guaranteed
   *   to be unique.
   * @return {Array.<string>}
   */
  _.getImageReferences = function() {
    var result = [];
    goog.array.forEach(this.items_, function(item) {
      result.push(item.getProp(Struct.DRAWING_IMAGE));
      result.push(item.getProp(Struct.SIDE_IMAGE));
    });
    return result;
  };

  /**
   * Provides the strinfigy method for JSON convertion to allow easier
   *   serialization.
   * @override
   */
  _['toJSON'] = function() {
    return this.items_;
  };

});
