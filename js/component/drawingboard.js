goog.provide('k3d.component.DrawingBoard');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('k3d.component.Item');
goog.require('pstj.ui.TouchSheet');

/**
 * The drawing board for the kitchen.
 * @constructor
 * @extends {pstj.ui.TouchSheet}
 * @param {pstj.ui.Template=} opt_template Optional template.
 */
k3d.component.DrawingBoard = function(opt_template) {
  goog.base(this, opt_template);
  this.movedChild_ = null;
  this.isChildMoving_ = false;
};
goog.inherits(k3d.component.DrawingBoard, pstj.ui.TouchSheet);

/**
 * The events that are specific for our application.
 * @enum {string}
 */
k3d.component.DrawingBoard.EventType = {
  REQUIRES_STOP_POINTS: goog.events.getUniqueId('a')
};

goog.scope(function() {

  var _ = k3d.component.DrawingBoard.prototype;

  /** @inheritDoc */
  _.addChild = function(child, render) {
    goog.asserts.assertInstanceof(child, k3d.component.Item);
    goog.base(this, 'addChild', child, render);
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    // handle long press from children
    this.getHandler().listen(this, pstj.ui.Touchable.EventType.LONG_PRESS,
      this.handleLongPress_).listen(this, pstj.ui.Touchable.EventType.RELEASE,
      this.handleRelease_);
  };

  _.handleRelease_ = function(e) {
    if (e.target != this) {
      this.isChildMoving_ = false;
      this.movedChild_ = null;
      goog.dom.classlist.remove(this.getElement(), 'k3d-transition');
    }
  };

  /** @inheritDoc */
  _.onMove = function(e) {
    if (!this.isChildMoving_) {
      goog.base(this, 'onMove', e);
    }
  };

  _.handleLongPress_ = function(e) {
    // make sure the event comes from a child.
    if (e.target != this) {
      this.isChildMoving_ = true;
      this.movedChild_ = e.target;
      goog.dom.classlist.add(this.getElement(), 'k3d-transition');
      this.dispatchEvent(
        k3d.component.DrawingBoard.EventType.REQUIRES_STOP_POINTS);
    }
  };

  _.getMovedChild = function() {
    return this.movedChild_;
  };

  /** @inheritDoc */
  _.applySize = function() {
    goog.base(this, 'applySize');
    if (!goog.isNull(this.size)) {
      this.dispatchEvent(goog.events.EventType.RESIZE);
    }
  }
});
