goog.provide('k3d.ds.CabinetRow');

goog.require('goog.events.EventTarget');
goog.require('k3d.ds.Item');

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
   * @type {Array.<k3d.ds.Item>}
   * @private
   */
  this.items_ = [];
  goog.array.forEach(items, this.addItem, this);
};
goog.inherits(k3d.ds.CabinetRow, goog.events.EventTarget);

goog.scope(function() {

  var _ = k3d.ds.CabinetRow.prototype;

  /**
   * Ads a new item to the list of cabinets on this row.
   * @param {Object} item The raw literal object represeting the cabinet.
   */
  _.addItem = function(item) {
    // we assume the itesm is viable!
    var record = new k3d.ds.Item(item);
    this.items_.push(record);
  };

  /**
   * Provides the strinfigy method for JSON convertion to allow easier serialization.
   * @override
   */
  _['toJSON'] = function() {
    return this.items_;
  };

});
