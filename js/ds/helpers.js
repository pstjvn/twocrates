goog.provide('k3d.ds.helpers');

goog.require('goog.array');
goog.require('k3d.ds.definitions');

/** @author regardingscot@gmail.com (Peter StJ) */

goog.scope(function() {
  var _ = k3d.ds.helpers;

  /**
   * Checks if an item is of corner type.
   * @param {pstj.ds.ListItem} item The item to check.
   * @return {boolean} True if item's category matches the corner collection
   *   of types.
   */
  _.isCornerItem = function(item) {
    return goog.array.contains(k3d.ds.definitions.CORNER_CATEGORIES,
      item.getProp(k3d.ds.definitions.Struct.CATEGORY));
  };

  /**
   * Checks if the item is clone of another item.
   * @param {pstj.ds.ListItem} item The item to check.
   * @return {boolean} True if the item is a clone.
   */
  _.isClone = function(item) {
    return !!item.getProp(k3d.ds.definitions.Struct.CLONE);
  };

  /**
   * Decides if the item ciould be put on the upper row of a kitchen wall.
   * @param {pstj.ds.ListItem} item The item to check against.
   * @return {boolean} True if the item could be put on a up row.
   */
  _.isUpperRowItem = function(item) {
    var category = item.getProp(k3d.ds.definitions.Struct.CATEGORY);
    if (category == 1 || category == 3) return true;
    return false;
  };

});
