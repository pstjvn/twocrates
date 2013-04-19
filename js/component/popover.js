goog.provide('k3d.component.PopOver');

goog.require('k3d.template');
goog.require('pstj.ui.Templated');

/**
 * Provides the popover dialog widget.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
k3d.component.PopOver = function() {
  goog.base(this);
  this.render(document.body);
};
goog.inherits(k3d.component.PopOver, pstj.ui.Templated);
goog.addSingletonGetter(k3d.component.PopOver);

goog.scope(function() {
  var _ = k3d.component.PopOver.prototype;
  /** @inheritDoc */
  _.getTemplate = function() {
    return k3d.template.popover({});
  };

  _.getContentElement = function() {
    return this.getEls(goog.getCssName('popover-frame'));
  };

  _.show = function() {
    this.getElement().style.display = 'table';
  };

  _.hide = function() {
    this.getElement().style.display = 'none';
  };

  _.embed = function(component) {
    if (this.hasChildren()) {
      if (component != this.getChildAt(0)) {
        this.removeChildren();
      }
    }
    this.addChild(component);
  };

});
