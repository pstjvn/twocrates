goog.provide('k3d.component.Notice');
goog.provide('k3d.component.NoticeTemplate');

goog.require('k3d.template');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');

/**
 * @constructor
 * @extends {pstj.ui.Template}
 */
k3d.component.NoticeTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.NoticeTemplate, pstj.ui.Template);
goog.addSingletonGetter(k3d.component.NoticeTemplate);

/** @inheritDoc */
k3d.component.NoticeTemplate.prototype.getTemplate = function(model) {
  return k3d.template.notice({});
};
/** @inheritDoc */
k3d.component.NoticeTemplate.prototype.getContentElement = function(component) {
  return component.getEls(goog.getCssName('k3d-note-text'));
};

/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template Optional template for the widget.
 */
k3d.component.Notice = function(opt_template) {
  goog.base(this, opt_template || k3d.component.NoticeTemplate.getInstance());
  /**
   * The action button.
   * @private
   * @type {pstj.ui.Button}
   */
  this.button_ = new pstj.ui.Button();
  this.addChild(this.button_);
};
goog.inherits(k3d.component.Notice, pstj.ui.Templated);

goog.scope(function() {
  var _ = k3d.component.Notice.prototype;

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.button_.decorate(this.getEls(goog.getCssName('action-trigger')));
  };

  /**
   * Sets the content text.
   * @param {string} text The content text to display.
   */
  _.setText = function(text) {
    if (goog.isNull(this.getElement())) {
      this.render();
    }
    this.getContentElement().innerHTML = text;
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.button_ = null;
    this.action_ = null;
  };

});
