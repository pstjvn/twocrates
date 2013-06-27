goog.provide('k3d.ds.strings');

goog.require('k3d.template');
goog.require('k3d.ds.definitions');

goog.scope(function() {

  var _ = k3d.ds.strings;

  _.cornerItemAlreadyExists = k3d.template.conernerItemExistsText({});

  _.noItemsSuitFilter = k3d.template.noIemFits({});

  _.assignwithoutloggin = k3d.template.savewhenuserunknown({
    login_link: k3d.ds.definitions.Path.FBLOGIN,
    register_link: k3d.ds.definitions.Path.REGISTER
  });

  _.willloosework = k3d.template.willloosework({
    login_link: k3d.ds.definitions.Path.FBLOGIN,
    register_link: k3d.ds.definitions.Path.REGISTER
  });

  _.alreadysaved = k3d.template.alreadysaved({});

  _.nomoresaves = k3d.template.nomoresaves({
    projects_link: k3d.ds.definitions.Path.PROJECTS
  });

  _.overflowInNextWall = k3d.template.itemPushedBack({});

});

