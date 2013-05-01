goog.provide('k3d.ds.Items');

goog.require('pstj.ds.List');

/**
 * Provides the items collection with filtering functions built in.
 * @constructor
 * @extends {pstj.ds.List}
 */
k3d.ds.Items = function(items) {
  goog.base(this, items)
};
goog.inherits(k3d.ds.Items, pstj.ds.List);

goog.scope(function() {

  var _ = k3d.ds.Items.prototype;

  /**
   * Filters the items with function expressing and items that do not meet the
   *   criteria are returned in a new array.
   * @return {Array.<string>} The ids of the items that do not match the
   *   filter criteria.
   */
  _.filter = function() {
    return [];
  };

});

