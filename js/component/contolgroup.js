goog.provide('k3d.component.ControlButtons');

goog.require('goog.ui.ControlRenderer');
goog.require('k3d.template');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides a control widget with touch enabled buttons inside
 *   of it. Each button has an 'action' designated to it by using a dataset
 *   string in the DOM. The buttons are activated by PRESS (triggered by mouse
 *   or touch events) and the action is then propagated to the enclosing
 *   component. Controls should listen to the control component for the
 *   actions. This way we achieve to hide the implementation details of the
 *   action triggering by from the control instance.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * The control UI component.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
k3d.component.ControlButtons = function() {
  goog.base(this);
};
goog.inherits(k3d.component.ControlButtons, pstj.ui.Templated);

/**
 * @private
 * @type {pstj.ui.CustomButtonRenderer}
 */
k3d.component.ControlButtons.
  renderer_ = /** @type {pstj.ui.CustomButtonRenderer} */(
    goog.ui.ControlRenderer.getCustomRenderer(
      pstj.ui.CustomButtonRenderer, goog.getCssName(
        'design-tool-control-button')));

goog.scope(function() {
  var _ = k3d.component.ControlButtons.prototype;

  /** @inheritDoc */
  _.getTemplate = function() {
    return k3d.template.viewcontrols({});
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    var buttons = this.querySelectorAll(
      '.' + goog.getCssName('design-tool-control-button') + '[data-action]');
    goog.array.forEach(buttons, this.createActionButton_, this);
  };

  /**
   * Creates a new button and asd is a child by decorating an existing element
   *   in the tree.
   * @private
   * @param {Element} element The element to decorate.
   */
  _.createActionButton_ = function(element) {
    element = /** @type {Element} */ (element);
    var button = new pstj.ui.Button(k3d.component.ControlButtons.renderer_);
    this.addChild(button);
    button.decorate(element);
  };

});
