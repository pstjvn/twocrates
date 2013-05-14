goog.provide('k3d.ds.ItemPool');

goog.require('goog.structs.Pool');
goog.require('k3d.component.Item');

/**
 * The item pool for items on the drawing board.
 * @constructor
 * @extends {goog.structs.Pool}
 */
k3d.ds.ItemPool = function() {
  goog.base(this, 0, 20);
};
goog.inherits(k3d.ds.ItemPool, goog.structs.Pool);
goog.addSingletonGetter(k3d.ds.ItemPool);

goog.scope(function() {

  var _ = k3d.ds.ItemPool.prototype;

  /**
   * @override
   * @return {k3d.component.Item}
   */
  _.createObject = function() {
    return new k3d.component.Item();
  };

});
