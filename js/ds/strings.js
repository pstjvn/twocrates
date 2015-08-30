goog.provide('k3d.ds.strings');

goog.require('k3d.ds.definitions');
goog.require('k3d.template');


goog.scope(function() {
var _ = k3d.ds.strings;


/** final {string} */
_.cornerItemAlreadyExists = k3d.template.conernerItemExistsText({})
    .getContent();


/** final {string} */
_.noItemsSuitFilter = k3d.template.noIemFits({}).getContent();


/** final {string} */
_.assignwithoutloggin = k3d.template.savewhenuserunknown({
  login_link: k3d.ds.definitions.Path.FBLOGIN,
  register_link: k3d.ds.definitions.Path.REGISTER
}).getContent();


/** final {string} */
_.willloosework = k3d.template.willloosework({
  login_link: k3d.ds.definitions.Path.FBLOGIN,
  register_link: k3d.ds.definitions.Path.REGISTER
}).getContent();


/** final {string} */
_.alreadysaved = k3d.template.alreadysaved({}).getContent();


/** final {string} */
_.nomoresaves = k3d.template.nomoresaves({
  projects_link: k3d.ds.definitions.Path.PROJECTS
}).getContent();


/** final {string} */
_.overflowInNextWall = k3d.template.itemPushedBack({}).getContent();


/** final {string} */
_.confirmationMessageOnClose = k3d.template.confirmationMessageOnClose({})
    .getContent();

});  // goog.scope
