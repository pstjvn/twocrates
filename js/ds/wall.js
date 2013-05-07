goog.provide('k3d.ds.Wall');

goog.require('k3d.ds.CabinetRow');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.ListItem');

/**
 * Provides the wall asbtraction data strucure. This structures represents a
 *   single wall in our design for a kitchen. It has knowledge of the rows of
 *   cabinets (floor and upper row).
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {Object} data The wall record literal object.
 */
k3d.ds.Wall = function(data) {
  /**
   * The top row.
   * @type {k3d.ds.CabinetRow}
   * @private
   */
  this.top_ = null;
  /**
   * The bottom row.
   * @type {k3d.ds.CabinetRow}
   * @private
   */
  this.bottom_ = null;
  goog.base(this, data);
};
goog.inherits(k3d.ds.Wall, pstj.ds.ListItem);

goog.scope(function() {

  var _ = k3d.ds.Wall.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /** @inheritDoc */
  _.convert = function() {
    var top = new k3d.ds.CabinetRow(
      this.getRawData()[Struct.ITEMS][Struct.TOP_ROW]);

    var bottom = new k3d.ds.CabinetRow(
      this.getRawData()[Struct.ITEMS][Struct.BOTTOM_ROW]);

    this.getRawData()[Struct.ITEMS][Struct.TOP_ROW] = top;
    this.getRawData()[Struct.ITEMS][Struct.BOTTOM_ROW] = bottom;
    this.top_ = top;
    this.bottom_ = bottom;
  };

  /**
   * Getter for the rows of cabinets as data structures.
   * @param {boolean=} top True if we want to access the top row.
   * @return {k3d.ds.CabinetRow}
   */
  _.getRow = function(top) {
    if (top) return this.top_;
    else return this.bottom_;
  };

  /**
   * Iterate over all the data and return the matrix of stop points.
   * @return {Array.<Array.<number>>} The stop point matrix.
   */
  _.getStopPoints = function() {
    var result = [];
    result[0] = this.top_.getStopPoints();
    result[1] = this.bottom_.getStopPoints();
    return result;
  };

  /**
   * Returns all image references in this wall instance. It will walk all the
   *   items that are currently applied on the wall (both top and floor rows)
   *   and gather all images linked in each item applied to the wall instance.
   * @return {Array.<string>}
   */
  _.getImageReferences = function() {
    return this.top_.getImageReferences().concat(
      this.bottom_.getImageReferences());
  };

});
