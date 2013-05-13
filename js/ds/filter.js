goog.provide('k3d.ds.filter');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.List');

/** @author regardingscot@gmail.com (Peter StJ) */

goog.scope(function() {

  var _ = k3d.ds.filter;
  var Struct = k3d.ds.definitions.Struct;

  /**
   * GLobal flag, this flag should be updated whenever we load a wall in the
   *   editor. It is used wihtout expecting it from the individual filters.
   * @type {boolean}
   * @private
   */
  _.isAttachedToWall_ = false;

  /**
   * Lists all the indexes of items that are attached to a wall.
   * @type {Array.<number>}
   * @private
   */
  _.attached_ = [];

  /**
   * Lists all indexes of items that are not attached to a wall.
   * @type {Array.<number>}
   * @private
   */
  _.detached_ = [];

  /**
   * Keeps reference to the list of items we should filter on.
   * @type {pstj.ds.List}
   * @private
   */
  _.items_ = null;

  /**
   * Pre-parse some filtering rules for faster parse time later.
   * @param {pstj.ds.List} items The list of items we are ging to filter on.
   */
  k3d.ds.filter.preFilter = function(items) {
    goog.asserts.assertInstanceof(items, pstj.ds.List);
    _.items_ = items;
    _.items_.forEach(function(item, index) {
      if (item.getProp(Struct.ATTACHED)) {
        _.attached_.push(index);
      } else {
        _.detached_.push(index);
      }
    });
  };

  /**
   * Sets the flag for the attached to wall property of the kitchen side we
   *   are filtering for.
   * @param {boolean} attached True if the kitchen side is to be attached to a
   *   wall.
   */
  _.setAttachedToWall = function(attached) {
    _.isAttachedToWall_ = attached;
  };

  /**
   * Creates a filter function that will iterate over the items and return
   *   true for any element that should be excluded from the result. Note that
   *   the general mathcing is done in avdance by the attached / detached
   *   parameter matching and thus reducing the comarisons to be made.
   * @param {number} category The category id of the component to look
   *   replacement matching for.
   * @param {number} availablewidth The maximum width of the item to look up.
   * @param {boolean=} use_second_width Flag if the item is corner item and is
   *   the first in the row.
   * @return {function(pstj.ds.ListItem): boolean} The produced filter
   *   function.
   */
  _.createChangeFilter = function(category, availablewidth, use_second_width) {
    console.log(category, availablewidth, use_second_width);
    return function(item) {

      // if item is in the wrong list
      if (!goog.array.contains(
        (_.isAttachedToWall_) ? _.attached_ : _.detached_,
          _.items_.getIndexByItem(item))) {
        return true;
      }

      // If category is different from the searched one.
      if (item.getProp(Struct.CATEGORY) != category) {
        return true;
      }

      // If item is wider than the available width.
      if (item.getProp(
        (!!use_second_width) ? Struct.WIDTH2 : Struct.WIDTH) > availablewidth) {

        return true;
      }

      return false;

    };
  };

  /**
   * Filter the items based on an item's model and width available.
   * @param {string} model The model id of the item to change the size of.
   * @param {number} availablewidth The width that is available on the wall.
   * @param {boolean=} use_second_width If the secondary width of the items
   *   should be used.
   * @return {function(pstj.ds.ListItem): boolean} The produced filter
   *   function.
   */
  _.createModelFilter = function(model, availablewidth, use_second_width) {
    return function(item) {
      // if model is different
      if (item.getProp(Struct.MODEL) != model) {
        return true;
      }
      // if item will not fit
      if (item.getProp(
        (!!use_second_width) ? Struct.WIDTH2 : Struct.WIDTH) > availablewidth) {

        return true;
      }

      return false;

    };
  };

});
