goog.provide('k3d.ds.CabinetRow');

goog.require('goog.array');
goog.require('goog.asserts');
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
   * Getter for the numbered items.
   * @param {number} index The index of the item to get.
   * @return {pstj.ds.ListItem}
   */
  _.getItemByIndex = function(index) {
    return this.items_[index] || null;
  };

  /**
   * Executes a function for each item in the list.
   * @param {function(this: S, pstj.ds.ListItem, number,
   *   Array.<pstj.ds.ListItem>): ?} fn The function to execute.
   * @param {S=} opt_obj The object in which context to execute the function.
   * @template S
   */
  _.forEach = function(fn, opt_obj) {
    goog.array.forEach(this.items_, fn, opt_obj);
  };

  /**
   * Returns the X offset (in millimeters) for an item with this index. If
   *   index is out of bound the offset for the next item to be added is
   *   returned.
   * @param {number} index The index of the item.
   * @return {number}
   */
  _.getXOffsetByIndex = function(index) {
    var xoffset = 0;
    var len = this.items_.length - 1;
    for (var i = 0; i < index; i++) {
      if (index > len) {
        return xoffset;
      }
      // FIXME: Make sure the cabinets with two walls are considered.
      xoffset += goog.asserts.assertNumber(
        this.items_[i].getProp(Struct.WIDTH));
    }
    return xoffset;
  };

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
   * Returns the current stop points for the row.
   * @return {Array.<number>}
   */
  _.getStopPoints = function() {
    var result = [];
    var advancement = 0;
    var width = 0;
    goog.array.forEach(this.items_, function(item) {

      width = goog.asserts.assertNumber(
        item.getProp(goog.array.contains(k3d.ds.definitions.CORNER_CATEGORIES,
          item.getProp(Struct.CATEGORY)) ? Struct.WIDTH2 : Struct.WIDTH));

      result.push(advancement + (width / 2));
      advancement += width;
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
