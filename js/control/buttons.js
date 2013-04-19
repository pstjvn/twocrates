goog.provide('k3d.control.Buttons');

goog.require('goog.ui.Component.EventType');
goog.require('k3d.component.ControlButtons');
goog.require('pstj.control.Base');

/**
 * Provides the control instance for the buttons on the bottom of the screen.
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Buttons = function() {
  goog.base(this);
  this.initialize();
};
goog.inherits(k3d.control.Buttons, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Buttons);

goog.scope(function() {
  var _ = k3d.control.Buttons.prototype;

  /** @inheritDoc */
  _.initialize = function() {
    if (!this.isInitialized()) {
      goog.base(this, 'initialize');
      this.buttonsComponent_ = new k3d.component.ControlButtons();
      this.buttonsComponent_.decorate(document.querySelector(
        '.' + goog.getCssName('design-tool-controls')));
      this.getHandler().listen(this.buttonsComponent_,
        goog.ui.Component.EventType.ACTION, this.handleAction);
    }
  };

  /**
   * Handles the action event from the button component.
   * @param {goog.events.Event} e The ACTION component event.
   * @protected
   */
  _.handleAction = function(e) {
    var target = /** @type {!pstj.ui.Button} */ (e.target);
    //console.log('Chld action', e.target.getActionName());
  }
});
