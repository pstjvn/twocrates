goog.provide('k3d.component.PriceLabelTemplate');

goog.require('k3d.template');
goog.require('pstj.ui.Template');

/** @author regardingscot@gmail.com (Peter StJ) */

/**
 * Provides the static html template for the price label UI part.
 * @constructor
 * @extends {pstj.ui.Template}
 */
k3d.component.PriceLabelTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.PriceLabelTemplate, pstj.ui.Template);
goog.addSingletonGetter(k3d.component.PriceLabelTemplate);

goog.scope(function() {
  var _ = k3d.component.PriceLabelTemplate.prototype;
  /** @inheritDoc */
  _.getTemplate = function(model) {
    return k3d.template.pricelabel({});
  };
});


