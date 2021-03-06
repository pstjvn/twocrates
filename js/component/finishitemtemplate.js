goog.provide('k3d.component.FinishItemTemplate');

goog.require('k3d.template');
goog.require('pstj.ui.ListItemTemplate');



/**
 * The template for the finish item in the select.
 * @constructor
 * @extends {pstj.ui.ListItemTemplate}
 */
k3d.component.FinishItemTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.FinishItemTemplate, pstj.ui.ListItemTemplate);
goog.addSingletonGetter(k3d.component.FinishItemTemplate);


goog.scope(function() {
var _ = k3d.component.FinishItemTemplate.prototype;
var Struct = k3d.ds.definitions.Struct;


/** @inheritDoc */
_.getTemplate = function(model) {
  return k3d.template.finish(model).getContent();
};


/** @inheritDoc */
_.generateTemplateData = function(component) {
  return {
    name: component.getModel().getProp(Struct.DESCRIPTION),
    color: component.getModel().getProp(Struct.COLOR),
    picture: component.getModel().getProp(Struct.PICTURE)
  };
};
});  // goog.scope
