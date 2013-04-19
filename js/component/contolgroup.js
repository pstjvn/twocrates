goog.provide('k3d.component.ControlButtons');

goog.require('k3d.template');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.Templated');

/**
 * The control UI component.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
k3d.component.ControlButtons = function() {
  goog.base(this);
};
goog.inherits(k3d.component.ControlButtons, pstj.ui.Templated);


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
    var button = new pstj.ui.Button();
    this.addChild(button);
    button.decorate(element);
  };
})
