goog.provide('k3d.control.Main');

goog.require('goog.asserts');
goog.require('goog.async.DeferredList');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('k3d.control.Buttons');
goog.require('k3d.control.Editor');
goog.require('k3d.control.ErrorHandler');
goog.require('k3d.control.Loader');
goog.require('k3d.ds.definitions');
goog.require('k3d.mb');
goog.require('k3d.template');
goog.require('pstj.control.Base');

/**
 * Our main controller. Get an instance of it to bootstrap the application.
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Main = function() {
  goog.base(this);
  this.delayLoad_ = new goog.async.Delay(this.postLoad, 200, this);
  this.initialize();

};
goog.inherits(k3d.control.Main, pstj.control.Base);

goog.scope(function() {

  var _ = k3d.control.Main.prototype;

  /** @inheritDoc */
  _.initialize = function() {

    // first start loading data from server as this tends to be the slowest
    // process.
    k3d.control.Loader.getInstance().start(goog.bind(
      this.onPreloadReady, this));
  };

  /**
   * At this point we have certainty that the needed data has been loaded.
   */
  _.onPreloadReady = function() {
    var body = k3d.template.base({links: goog.global['HEADER_LINKS']});
    var el = goog.dom.htmlToDocumentFragment(body);
    document.body.appendChild(el);

    // find header and apply size
    goog.dom.getElementByClass(goog.getCssName('header')).style.height =
      k3d.ds.definitions.headerHeight + 'px';

    k3d.control.ErrorHandler.getInstance().setParentControlInstance(this);
    k3d.control.Buttons.getInstance().setParentControlInstance(this);
    k3d.control.Editor.getInstance().setParentControlInstance(this);
    k3d.control.Editor.getInstance().install(/** @type {!Element} */ (
      document.body));

    k3d.control.Loader.getInstance().getKitchen().addCallback(goog.bind(
      function(kitchen) {

        goog.asserts.assertInstanceof(kitchen, k3d.ds.KitchenProject,
          'Should have been a kitchen');

        k3d.control.Editor.getInstance().loadData(kitchen);
        this.delayLoad_.start();
        // kitchen.setDescription('New descritpion for project 3');
        // setTimeout(function() {
        //   k3d.control.Loader.getInstance().saveKitchen(kitchen);
        // }, 1000);
      }, this)
    );
  };

  /**
   * Execute pre-loading of data AFTER the initial paint.
   */
  _.postLoad = function() {
    // gather the results and notify the editor control when ready.

    k3d.control.Loader.getInstance().getAllImagesLoadedDeferred().addCallback(
      function() {
        k3d.control.Editor.getInstance().onLoadComplete();
      }
    );
  };

});

