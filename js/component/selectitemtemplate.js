goog.provide('k3d.component.SelectItemTemplate');

goog.require('k3d.ds.definitions');
goog.require('k3d.template');
goog.require('pstj.ui.ListItemTemplate');

/** @author regardingscot@gmail.com (Peter StJ) */

/**
 * The template for the select item in item select.
 * @constructor
 * @extends {pstj.ui.ListItemTemplate}
 */
k3d.component.SelectItemTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.SelectItemTemplate, pstj.ui.ListItemTemplate);
goog.addSingletonGetter(k3d.component.SelectItemTemplate);

goog.scope(function() {

  var _ = k3d.component.SelectItemTemplate.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /** @inheritDoc */
  _.getTemplate = function(model) {
    return k3d.template.cabinet(model);
  };

  /** @inheritDoc */
  _.generateTemplateData = function(component) {
    return {
      desc: component.getModel().getProp(Struct.DESCRIPTION),
      size: '(' +
        component.getModel().getProp(Struct.WIDTH) + 'x' +
        component.getModel().getProp(Struct.HEIGHT) + 'x' +
        component.getModel().getProp(Struct.DEPTH) + ')',
      wallmounted: component.getModel().getProp(Struct.ATTACHED),
      thumbnail: component.getModel().getProp(Struct.SIDE_IMAGE)
    };
  };
});

