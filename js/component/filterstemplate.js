goog.provide('k3d.component.FiltersTemplate');

goog.require('k3d.template');
goog.require('pstj.ui.Template');
/**
 * Provides the template for the filter buttons in the select box.
 * @constructor
 * @extends {pstj.ui.Template}
 */
k3d.component.FiltersTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.FiltersTemplate, pstj.ui.Template);
goog.addSingletonGetter(k3d.component.FiltersTemplate);

goog.scope(function() {

  var _ = k3d.component.FiltersTemplate.prototype;
  /** @inheritDoc */
  _.getTemplate = function(model) {
    return k3d.template.filters({});
  };

});
