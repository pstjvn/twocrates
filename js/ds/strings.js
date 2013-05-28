goog.provide('k3d.ds.strings');

goog.require('k3d.template');
goog.require('k3d.ds.definitions');

goog.scope(function() {

  var _ = k3d.ds.strings;

  _.cornerItemAlreadyExists = 'Croner item already exists on this wall, edit it or alternatively delete it';

  _.noItemsSuitFilter = 'No item from this category can be added to to the current configuration of your project';

  _.assignwithoutloggin = k3d.template.savewhenuserunknown({
    login_link: k3d.ds.definitions.Path.FBLOGIN,
    register_link: k3d.ds.definitions.Path.REGISTER
  });

  _.alreadysaved = k3d.template.alreadysaved({});

  _.nomoresaves = k3d.template.nomoresaves({
    projects_link: k3d.ds.definitions.Path.PROJECTS
  });

  _.overflowInNextWall = 'The cabinet just added pushesh the cabinets on the adjacent wall outside of the allowed size.';

});

