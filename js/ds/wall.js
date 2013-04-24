goog.provide('k3d.ds.Wall');

goog.require('k3d.ds.CabinetRow');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.ListItem');

/**
 * Provides the wall asbtraction data strucure.
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {Object} data The wall record literal object.
 */
k3d.ds.Wall = function(data) {
  goog.base(this, data);
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
};
goog.inherits(k3d.ds.Wall, pstj.ds.ListItem);

goog.scope(function() {

  var _ = k3d.ds.Wall.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /** @inheritDoc */
  _.convert = function() {
    var top = new k3d.ds.CabinetRow(this.getRawData()[Struct.ITEMS][Struct.TOP_ROW]);

    var bottom = new k3d.ds.CabinetRow(
      this.getRawData()[Struct.ITEMS][Struct.BOTTOM_ROW]);

    this.getRawData()[Struct.ITEMS][Struct.TOP_ROW] = top;
    this.getRawData()[Struct.ITEMS][Struct.BOTTOM_ROW] = bottom;
    this.top_ = top;
    this.bottom_ = bottom;
  };

});
