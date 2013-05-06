goog.provide('k3d.control.Buttons');

goog.require('goog.asserts');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlRenderer');
goog.require('pstj.control.Base');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.widget.ControlGroup');
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
      // create instance of pstj's control button group and use it, we do not
      // need special template as we are decorating.
      this.buttonsComponent_ = new pstj.widget.ControlGroup(null,
        goog.ui.ControlRenderer.getCustomRenderer(pstj.ui.CustomButtonRenderer,
          goog.getCssName('design-tool-control-button')));

      //this.buttonsComponent_ = new k3d.component.ControlButtons();
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
    this.notify(null, goog.asserts.assertString(target.getActionName()));
    //console.log('Chld action', e.target.getActionName());
  };
});
