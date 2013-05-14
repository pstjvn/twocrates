goog.provide('k3d.component.DrawingBoard');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('k3d.component.Item');
goog.require('pstj.ui.TouchSheet');

/**
 * @fileoverview Provides the drawing board sheet for the project's editor
 *   implementation. It is constructed to e used with the editor control.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */


/**
 * The drawing board for the kitchen project.
 * @constructor
 * @extends {pstj.ui.TouchSheet}
 * @param {pstj.ui.Template=} opt_template Optional template.
 */
k3d.component.DrawingBoard = function(opt_template) {
  goog.base(this, opt_template);
  /**
   * The moved child if there is one.
   * @type {k3d.component.Item}
   * @private
   */
  this.movedChild_ = null;
  /**
   * Flag if a child is currently moved from its stationary position.
   * @type {boolean}
   * @private
   */
  this.isChildMoving_ = false;
};
goog.inherits(k3d.component.DrawingBoard, pstj.ui.TouchSheet);

/**
 * The events that are specific for our application.
 * @enum {string}
 */
k3d.component.DrawingBoard.EventType = {
  REQUIRES_STOP_POINTS: goog.events.getUniqueId('a'),
  RELEASE_OF_CHILD: goog.events.getUniqueId('b')
};

goog.scope(function() {

  var _ = k3d.component.DrawingBoard.prototype;

  /** @inheritDoc */
  _.addChild = function(child, render) {
    goog.asserts.assertInstanceof(child, k3d.component.Item, 'drawingboard');
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

  /**
   * Handles the relase touch event from a child.
   * @param {pstj.ui.Touchable.Event} e The RELEASE touch event.
   * @private
   */
  _.handleRelease_ = function(e) {
    if (!this.isChildMoving_) return;
    if (e.target != this) {
      this.isChildMoving_ = false;
      this.movedChild_ = null;
      goog.dom.classlist.remove(this.getElement(),
        goog.getCssName('k3d-transition'));
      this.dispatchEvent(k3d.component.DrawingBoard.EventType.RELEASE_OF_CHILD);
    }
  };

  /** @inheritDoc */
  _.onMove = function(e) {
    if (!this.isChildMoving_) {
      goog.base(this, 'onMove', e);
    }
  };

  /**
   * Handles the long press event from children. This is we need to mark the
   *   child as the one we will be moving and record it for reference.
   * @param {pstj.ui.Touchable.Event} e The LONG_PRESS event.
   * @private
   */
  _.handleLongPress_ = function(e) {
    // make sure the event comes from a child.
    if (e.target != this) {
      this.isChildMoving_ = true;
      this.movedChild_ = /** @type {k3d.component.Item} */ (e.target);
      goog.dom.classlist.add(this.getElement(), goog.getCssName('k3d-transition'));
      this.dispatchEvent(
        k3d.component.DrawingBoard.EventType.REQUIRES_STOP_POINTS);
    }
  };

  /**
   * Getter for the last recorded child that was moved independently of the
   *   sheet.
   * @return {k3d.component.Item}
   */
  _.getMovedChild = function() {
    return this.movedChild_;
  };

  /** @inheritDoc */
  _.applySize = function() {
    goog.base(this, 'applySize');
    if (!goog.isNull(this.size)) {
      this.dispatchEvent(goog.events.EventType.RESIZE);
    }
  };
});
