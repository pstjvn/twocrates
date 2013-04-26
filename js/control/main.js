goog.provide('k3d.control.Main');

goog.require('goog.asserts');
goog.require('k3d.control.Buttons');
goog.require('k3d.control.Editor');
goog.require('k3d.control.ErrorHandler');
goog.require('k3d.control.Loader');
goog.require('k3d.mb');
goog.require('pstj.control.Base');

/**
 * My new class description
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Main = function() {
  goog.base(this);
  this.initialize();
};
goog.inherits(k3d.control.Main, pstj.control.Base);

goog.scope(function() {

  var _ = k3d.control.Main.prototype;

  /** @inheritDoc */
  _.initialize = function() {
    k3d.control.ErrorHandler.getInstance().setParentControlInstance(this);
    k3d.control.Buttons.getInstance().setParentControlInstance(this);
    k3d.control.Editor.getInstance().setParentControlInstance(this);
    k3d.control.Editor.getInstance().install(/** @type {!Element} */ (
      document.body));

    k3d.control.Loader.getInstance().getKitchen().addCallback(
      function(kitchen) {

        goog.asserts.assertInstanceof(kitchen, k3d.ds.KitchenProject,
          'Should have been a kitchen');

        k3d.control.Editor.getInstance().loadData(kitchen);
        // kitchen.setDescription('New descritpion for project 3');
        // setTimeout(function() {
        //   k3d.control.Loader.getInstance().saveKitchen(kitchen);
        // }, 1000);
    });
  };

});

