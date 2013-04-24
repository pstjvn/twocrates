goog.provide('k3d.ds.KitchenProject');

goog.require('goog.asserts');
goog.require('k3d.ds.Wall');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.List');
goog.require('pstj.ds.ListItem');

/**
 * The kitchen project data type.
 * @param {Object} data The literal object represeting a kitchen project.
 * @constructor
 * @extends {pstj.ds.ListItem}
 */
k3d.ds.KitchenProject = function(data) {
  this.walls = new pstj.ds.List();
  goog.base(this, data);
};
goog.inherits(k3d.ds.KitchenProject, pstj.ds.ListItem);

goog.scope(function() {

  var _ = k3d.ds.KitchenProject.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /** @inheritDoc */
  _.convert = function() {
    goog.asserts.assertArray(this.getRawData()[Struct.WALLS],
      'Unexpected data type, should have been an Array');
    goog.array.forEach(this.getRawData()[Struct.WALLS], this.addWall, this);
    this.getRawData()[Struct.WALLS] = this.walls;
  };

  /**
   * Adds a wall to the data structure.
   * @param {Object} wall The wall literal object.
   * @protected
   */
  _.addWall = function(wall) {
    this.walls.add(new k3d.ds.Wall(wall));
  };

});

