goog.provide('k3d.component.SelectItemTemplate');

goog.require('k3d.ds.definitions');
goog.require('pstj.ui.ListItemTemplate');
/**
 * My new class description
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
  _.generateTemplateData = function(component) {
    return {
      name: component.getModel().getProp(Struct.DESCRIPTION) + '(' +
        component.getModel().getProp(Struct.WIDTH) + 'x' +
        component.getModel().getProp(Struct.HEIGHT) + 'x' +
        component.getModel().getProp(Struct.DEPTH) + ')',
      thumbnail: component.getModel().getProp(Struct.SIDE_IMAGE)
    };
  };

});
