goog.provide('k3d.component.DrawingBoard');

goog.require('k3d.component.Item');
goog.require('pstj.ui.TouchSheet');

/**
 * The drawing board for the kitchen.
 * @constructor
 * @extends {pstj.ui.TouchSheet}
 */
k3d.component.DrawingBoard = function() {
  goog.base(this);
};
goog.inherits(k3d.component.DrawingBoard, pstj.ui.TouchSheet);

goog.scope(function() {

  var _ = k3d.component.DrawingBoard.prototype;

  /** @inheritDoc */
  _.addChild = function(child, render) {
    goog.asserts.assertInstanceof(child, k3d.component.Item);
    goog.base(this, 'addChild', child, render);
  };
});
