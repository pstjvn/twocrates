goog.provide('k3d.component.HandleItemTemplate');

goog.require('goog.asserts');
goog.require('k3d.template');
goog.require('pstj.ng.filters');
goog.require('pstj.ui.ListItemTemplate');

/**
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the template for the handle items in the select.
 * @constructor
 * @extends {pstj.ui.ListItemTemplate}
 */
k3d.component.HandleItemTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.HandleItemTemplate, pstj.ui.ListItemTemplate);
goog.addSingletonGetter(k3d.component.HandleItemTemplate);

goog.scope(function() {

  var _ = k3d.component.HandleItemTemplate.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /** @inheritDoc */
  _.getTemplate = function(model) {
    return k3d.template.handle(model);
  };
  /** @inheritDoc */
  _.generateTemplateData = function(component) {
    return {
      name: component.getModel().getProp(Struct.DESCRIPTION) + ' (' +
        component.getModel().getProp(Struct.DIMENTIONS) + ')',
      price: pstj.ng.filters.makePrice(goog.asserts.assertNumber(
        component.getModel().getProp(Struct.PRICE)), '0'),
      thumbnail: component.getModel().getProp(Struct.PICTURE)
    };
  };
});

