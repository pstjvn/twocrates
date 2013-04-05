goog.provide('k3d.component.Item');

goog.require('pstj.ui.MoveTouch')
goog.require('goog.asserts');

/**
 * The item that we work with on the drawing board.
 * @constructor
 * @extends {pstj.ui.MoveTouch}
 */
k3d.component.Item = function() {
  goog.base(this);
  /**
   * @private
   * @type {Array.<number>}
   */
  this.styleoptions_ = [0.0, 0.0, 0.0, 0.0];
}
goog.inherits(k3d.component.Item, pstj.ui.MoveTouch);

/**
 * The events of the items on the drawing board.
 * @enum {string}
 */
k3d.component.Item.EventType = {
  MODEL_CHANGE: goog.events.getUniqueId('model-change')
};

goog.scope(function() {

  var _ = k3d.component.Item.prototype;

  /** @inheritDoc */
  _.getTemplate = function() {
    return k3d.template.item({});
  };

  /**
   * @override
   * @return {k3d.ds.Item} The data record for the item.
   */
  _.getModel;

  /** @inheritDoc */
  _.setModel = function(model) {
    goog.asserts.assertInstanceof(model, k3d.ds.Item,
      'The data record should be one of kitchen item');
    goog.base(this, 'setModel', model);
    if (this.isInDocument()) {
      this.dispatchEvent(k3d.component.Item.EventType.MODEL_CHANGE);
    }
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.applySizeOnDOM_();
  };

  /**
   * Applies the internally stored size to the DOM node attached to the
   *   component.
   * @private
   */
  _.applySizeOnDOM_ = function() {
    this.getElement().style.position = 'absolute';
    this.getElement().style.width = this.styleoptions_[0] + '%';
    this.getElement().style.height = this.styleoptions_[1] + '%';
    this.getElement().style.top = this.styleoptions_[2] + '%';
    this.getElement().style.left = this.styleoptions_[3] + '%';
    this.getElement().style.backgroundColor = this.getModel().getProp(
      'c').toString();
  };

  /**
   * Applies the size values to the child of the drawing canvas.
   * @param {number} w The width of the child.
   * @param {number} h The height.
   * @param {number} l Left offset.
   * @param {number} t Top offset.
   */
  _.applyStyle = function(w, h, l, t) {
    this.styleoptions_[0] = w;
    this.styleoptions_[1] = h;
    this.styleoptions_[2] = t;
    this.styleoptions_[3] = l;
    this.styleIsDirty_ = true;
    if (this.isInDocument()) this.update();
  };

});
