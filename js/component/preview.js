goog.provide('k3d.component.Preview');

goog.require('goog.dom.classlist');
goog.require('k3d.ds.definitions');
goog.require('k3d.template');
goog.require('pstj.ui.Template');
goog.require('pstj.ui.Templated');
/**
 * @constructor
 * @extends {pstj.ui.Template}
 */
k3d.component.PreviewTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.PreviewTemplate, pstj.ui.Template);
goog.addSingletonGetter(k3d.component.PreviewTemplate);

/** @inheritDoc */
k3d.component.PreviewTemplate.prototype.generateTemplateData = function(comp) {
  return {
    src: comp.defaultSrc_
  };
};

/** @inheritDoc */
k3d.component.PreviewTemplate.prototype.getTemplate = function(model) {
  return k3d.template.preview(model);
};

/**
 * My new class description
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template Optional template to use.
 * @param {string=} opt_default_src The default image to use when there is no
 *   preview.
 */
k3d.component.Preview = function(opt_template, opt_default_src) {
  goog.base(this, opt_template || k3d.component.PreviewTemplate.getInstance());
  this.defaultSrc_ = opt_default_src || '';
  this.img_ = new Image();
  this.img_.onload = goog.bind(this.handleLoadComplete, this);
};
goog.inherits(k3d.component.Preview, pstj.ui.Templated);

goog.scope(function() {

  var _ = k3d.component.Preview.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /** @inheritDoc */
  _.setModel = function(obj) {
    goog.base(this, 'setModel', obj);
    if (goog.isString(obj[Struct.IMAGE])) {
      this.loadImage(obj[Struct.IMAGE]);
    }
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.previewElement = this.getEls(goog.getCssName('k3d-preview-image'));
    this.previewElement.src = this.defaultSrc_;
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.getEls(goog.getCssName(
      'k3d-preview-toggler')), goog.events.EventType.CLICK, function(e) {
        e.stopPropagation();
        goog.dom.classlist.toggle(this.getElement(), goog.getCssName('on'));
    });
  }

  /**
   * Starts loading an image.
   * @param {string} src The URl of the image to load.
   * @protected
   */
  _.loadImage = function(src) {
    this.img_.src = src + '?' + goog.now();
  };

  /**
   * Handles the ready state of image loading. At this stage we are certain
   *   that the image is completely loaded and that the src of the image still
   *   points to the loaded url (event bubble). We can get the src url
   *   directly from the image tag as to avoid caching the value of the cache
   *   buster.
   * @param {Event} e The load event from the image tag.
   */
  _.handleLoadComplete = function(e) {
    this.previewElement.src = this.img_.src;
  };

});
