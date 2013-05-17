goog.provide('k3d.ds.CabinetRow');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('k3d.ds.definitions');
goog.require('k3d.ds.helpers');
goog.require('pstj.ds.ListItem');

/**
 * @fileoverview Data structure to present a row of cabinets in a kitchen wall.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

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
   * Returns the width of an item that is to be used in calculations. It takes
   *   into account corner items and on which corner of the row they are.
   * @param {pstj.ds.ListItem} item The item to obtain the width of.
   * @return {number} The widht to use in millimeters.
   */
  _.getItemWidth = function(item) {
    if (k3d.ds.helpers.isCornerItem(item) && this.getIndexByItem(item) == 0) {
      return goog.asserts.assertNumber(item.getProp(Struct.WIDTH2));
    } else {
      return goog.asserts.assertNumber(item.getProp(Struct.WIDTH));
    }
  };

  /**
   * Getter for the number of items on the row.
   * @return {number}
   */
  _.getItemCount = function() {
    return this.items_.length;
  };

  /**
   * Gets the index of the item in the list.
   * @param {pstj.ds.ListItem} item The item to look up.
   * @return {number} The index, could be -1.
   */
  _.getIndexByItem = function(item) {
    return goog.array.indexOf(this.items_, item);
  };

  /**
   * Checks if an item is in the list.
   * @param {pstj.ds.ListItem} item The item to check if we have it.
   * @return {boolean} True if there is such item in the list.
   */
  _.hasItem = function(item) {
    return goog.array.contains(this.items_, item);
  };

  /**
   * Calculates the used up widht on this row.
   * @return {number} The used up widht in millimeters.
   */
  _.getWidth = function() {
    var taken = 0;
    this.forEach(function(item) {
      taken = taken + this.getItemWidth(item);
    }, this);
    return taken;
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
    // if we have come items, if the item is corner one and is not a clone,
    // shift it last
    if (this.getItemCount() > 0 &&
      k3d.ds.helpers.isCornerItem(
        goog.asserts.assertInstanceof(
          goog.array.peek(this.items_), pstj.ds.ListItem)) &&
      !k3d.ds.helpers.isClone(
        goog.asserts.assertInstanceof(
          goog.array.peek(this.items_), pstj.ds.ListItem))) {

      goog.array.insertBefore(this.items_, item, goog.array.peek(this.items_));
    } else {
      this.items_.push(item);
    }
  };

  /**
   * Adds an item as clone (basically item from a preceeding wall)
   * @param {pstj.ds.ListItem} item The item to clone from the previous wall.
   * @param {number=} index Optionally where to add the clone (used by clones
   *   for two row items).
   */
  _.addClone = function(item, index) {
    if (this.getItemCount() > 0 && k3d.ds.helpers.isClone(this.items_[0])) {
      throw new Error('Cloned item already exists in wall!');
    }
    if (!goog.isNumber(index)) index = 0;
    var newitem = item.clone();
    newitem.mutate(Struct.CLONE, true);
    goog.array.insertAt(this.items_, newitem, index);
  };

  /**
   * Replaces an item on the cabinet row with a new one, no checks are
   *   performed.
   * @param {pstj.ds.ListItem} item The item to replace.
   * @param {pstj.ds.ListItem} newitem The item that will replace the original
   *   one.
   */
  _.replaceItem = function(item, newitem) {
    var index = goog.array.indexOf(this.items_, item);
    if (index != -1) {
      this.items_[index] = newitem;
    } else {
      throw new Error('Trying to replace item that does not exists');
    }
  };

  /**
   * Removes the item from the cabinet row.
   * @param {pstj.ds.ListItem} item The item record to remove.
   */
  _.removeItem = function(item) {
    goog.array.remove(this.items_, item);
  };

  /**
   * Removes the element from its current position and inserts it at a new
   *   position that is shifted with the move index.
   * @param {pstj.ds.ListItem} item The data record item to move.
   * @param {number} moveIndex The number of position to move, negative means
   *   to the left in the array.
   * @return {boolean} True if the move was performed successfully.
   */
  _.shiftItem = function(item, moveIndex) {
    var index = goog.array.indexOf(this.items_, item);
    if (index < 0) return false;
    if (!goog.array.removeAt(this.items_, index)) return false;
    goog.array.insertAt(this.items_, item, index + moveIndex);
    return true;
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

      // If the item is a clone, we should not move it, put negative number
      if (k3d.ds.helpers.isClone(item)) {
        result.push(-10000);
      } else if (!k3d.ds.helpers.isCornerItem(item)) {
        result.push(advancement + (width / 2));
      }

      advancement += width;

    });
    return result;
  };


  /**
   * Test if the cabinet raw already has corner item.
   * @return {boolean} True if corner item presents on this raw.
   */
  _.hasCornerItem = function() {
    return goog.array.some(this.items_, function(item) {
      return k3d.ds.helpers.isCornerItem(item);
    });
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
