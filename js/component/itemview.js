goog.provide('k3d.component.ItemView');

goog.require('k3d.template');
goog.require('pstj.ng.Template');
goog.require('pstj.ui.Button');

/**
 * Implements the item details view. It is partially an ng template and built
 *   on top with some actions/buttons.
 * @constructor
 * @extends {pstj.ng.Template}
 */
k3d.component.ItemView = function() {
  goog.base(this);
  /**
   * @private
   * @type {Element}
   */
  this.contentElement_ = null;
  /**
   * @private
   * @type {pstj.ui.Button}
   */
  this.dismissButton_ = new pstj.ui.Button();
  this.addChild(this.dismissButton_);
  /**
   * @private
   * @type {pstj.ui.Button}
   */
  this.changeModel_ = new pstj.ui.Button();
  this.addChild(this.changeModel_);
  /**
   * @private
   * @type {pstj.ui.Button}
   */
  this.changeSize_ = new pstj.ui.Button();
  this.addChild(this.changeSize_);
  this.render();
};
goog.inherits(k3d.component.ItemView, pstj.ng.Template);
goog.addSingletonGetter(k3d.component.ItemView);

goog.scope(function() {
  var _ = k3d.component.ItemView.prototype;

  /** @inheritDoc */
  _.getContentElement = function() {
    return this.contentElement_;
  };

  /** @inheritDoc */
  _.getTemplate = function() {
    return k3d.template.itemview({})
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.contentElement_ = this.getEls(goog.getCssName('item-view-controls'));
    // use decoration to allow easier translation of the buttons (i.e. labels
    // come from the templates and thus from the translation files).
    this.dismissButton_.decorate(this.querySelector(
      '.' + goog.getCssName('pstj-button') + '[data-action="close"]'));
    this.changeSize_.decorate(this.querySelector(
      '.' + goog.getCssName('pstj-button') + '[data-action="change-size"]'));
    this.changeModel_.decorate(this.querySelector(
      '.' + goog.getCssName('pstj-button') + '[data-action="change-model"]'))
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.dispose(this.dismissButton_);
    goog.dispose(this.changeSize_);
    goog.dispose(this.changeModel_);
    this.dismissButton_ = null;
    this.changeSize_ = null;
    this.changeModel_ = null;
    goog.base(this, 'disposeInternal');
  };
});
