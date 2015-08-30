/**
 * @fileoverview Provides the embeddeable dialog widget for showing details on
 *   an item and offering options to alter it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('k3d.component.ItemView');
goog.provide('k3d.component.ItemViewTemplate');

goog.require('k3d.ds.helpers');
goog.require('k3d.template');
goog.require('pstj.ng.Template');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.Template');



/**
 * The app item template.
 * @constructor
 * @extends {pstj.ui.Template}
 */
k3d.component.ItemViewTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.ItemViewTemplate, pstj.ui.Template);
goog.addSingletonGetter(k3d.component.ItemViewTemplate);


/** @inheritDoc */
k3d.component.ItemViewTemplate.prototype.getTemplate = function(model) {
  return k3d.template.itemview({
    prefix: goog.global['ASSETS_PREFIX']
  }).getContent();
};


/** @inheritDoc */
k3d.component.ItemViewTemplate.prototype.getContentElement = function(comp) {
  return comp.getEls(goog.getCssName('item-view-controls'));
};



/**
 * Implements the item details view. It is partially an ng template and built
 *   on top with some actions/buttons.
 * @constructor
 * @extends {pstj.ng.Template}
 * @param {pstj.ui.Template=} opt_template Alternative template to use.
 * @param {string=} opt_null_value Optioal null value to use in NG template.
 */
k3d.component.ItemView = function(opt_template, opt_null_value) {
  goog.base(this, opt_template || k3d.component.ItemViewTemplate.getInstance(),
      opt_null_value);
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

  /**
   * @private
   * @type {pstj.ui.Button}
   */
  this.delete_ = new pstj.ui.Button();
  this.addChild(this.delete_);

  this.render();
};
goog.inherits(k3d.component.ItemView, pstj.ng.Template);
goog.addSingletonGetter(k3d.component.ItemView);


goog.scope(function() {
var _ = k3d.component.ItemView.prototype;


/** @inheritDoc */
_.setModel = function(model) {
  goog.base(this, 'setModel', model);
  goog.asserts.assertInstanceof(this.getModel(), pstj.ds.ListItem,
      'The model should be a list item');
  var enable = !k3d.ds.helpers.isClone(this.getModel());
  this.delete_.setEnabled(enable);
  this.changeSize_.setEnabled(enable);
  this.changeModel_.setEnabled(enable);
};


/** @inheritDoc */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  // use decoration to allow easier translation of the buttons (i.e. labels
  // come from the templates and thus from the translation files).
  this.dismissButton_.decorate(this.querySelector('[data-action="close"]'));

  this.changeSize_.decorate(this.querySelector(
      '[data-action="change-size"]'));

  this.changeModel_.decorate(this.querySelector(
      '[data-action="change-model"]'));

  this.delete_.decorate(this.querySelector('[data-action="delete"]'));
};


/** @inheritDoc */
_.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.dismissButton_ = null;
  this.changeSize_ = null;
  this.changeModel_ = null;
  this.delete_ = null;
};
});  // goog.scope
