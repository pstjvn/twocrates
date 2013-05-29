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
   * Global flag set per wall. If this is the last wall no corner items should be alloed on it.
   * @private
   * @type {boolean}
   */
  _.isLastWall_ = false;

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
    goog.asserts.assertInstanceof(items, pstj.ds.List, 'filters');
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
   * Sets the last wall flag, Walls that are the last ones should set this to
   *   true.
   * @param {boolean} islast True if the wall is the last one thus does not
   *   allow corner items.
   */
  _.setIsLastWall = function(islast) {
    _.isLastWall_ = islast;
  };


  /**
   * Generates a filter by names.
   * @param {string} filterName The filter name.
   * @param {number} top The available space at the top row.
   * @param {number} bottom The available space at the bottom row.
   * @param {boolean} ctop True if the top row should not accept corner item.
   * @param {boolean} cbottom True if the bottom row should not accept
   *   addition of corner item.
   * @return {function(pstj.ds.ListItem): boolean} The filter to use.
   */
  _.createNamedFilter = function(filterName, top, bottom, ctop, cbottom) {
    return function(item) {
      var cat = item.getProp(Struct.CATEGORY);
      var width = item.getProp(Struct.WIDTH);
      switch (filterName) {
        case 'filter1':
          // top regular, can only happen on attached walls
          if (!_.isAttachedToWall_) return true;
          if (cat != 1) return true;
          if (width > top) return true;
          return false;
        case 'filter2':
          //bottom regular, can happen anywhere
          if (cat != 2) return true;
          if (width > bottom) return true;
          return false;
        case 'filter3':
          // top corner, can happen only on attacched wall and if the wall is
          // NOT the last one.
          if (ctop) return true;
          if (!_.isAttachedToWall_) return true;
          if (_.isLastWall_) return true;
          if (cat != 3) return true;
          if (width > top) return true;
          return false;
        case 'filter4':
          // Bottom corner can happen on any wall if it is not the last one
          if (cbottom) return true;
          if (_.isLastWall_) return true;
          if (cat != 4) return true;
          if (width > bottom) return true;
          return false;
        case 'filter5':
          if (cat != 5) return true;
          if (width > bottom) return true;
          return false;
        case 'filter6':
          if (cat != 7) return true;
          if (width > bottom) return true;
          return false;
        default: return true;
      }
    };
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
