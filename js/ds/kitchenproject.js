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

  /**
   * Returns all image references withint the project.
   * @return {Array.<string>}
   */
  _.getImageReferences = function() {
    var images;
    var result = [];
    for (var i = 0, len = this.walls.getCount(); i < len; i++) {
      images = this.walls.getByIndex(i).getImageReferences();
      for (var ii = 0, len2 = images.length; ii < len2; ii++) {
        if (images[ii] != '') {
          goog.array.insert(result, images[ii]);
        }
      }
    }
    return result;
  };

  /**
   * Getter for the wall by an index. No checks are performed, thus null can
   *   be returned.
   * @param {number} index The index to look up the data under.
   * @return {k3d.ds.Wall} The wall instance if one exists.
   */
  _.getWall = function(index) {
    return goog.asserts.assertInstanceof(this.walls.getByIndex(index),
      k3d.ds.Wall, 'Wall instance expected');
  };

  /**
   * Checks if a wall with this index exists in the project.
   * @param {number} index The index to look up.
   * @return {boolean} True if such wall exists.
   */
  _.hasWallWithIndex = function(index) {
    return (index < this.walls.getCount());
  };

});

