goog.provide('k3d.control.Main');

goog.require('goog.asserts');
goog.require('goog.async.DeferredList');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('k3d.control.Buttons');
goog.require('k3d.control.Editor');
goog.require('k3d.control.ErrorHandler');
goog.require('k3d.control.Loader');
goog.require('k3d.control.Price');
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
  /**
   * Reference the project id currently edited for easier access.
   * @type {number}
   * @private
   */
  this.projectid_ = 0;

  this.delayLoad_ = new goog.async.Delay(this.postLoad, 200, this);

  this.getImageDelay_ = new goog.async.Delay(function() {
    k3d.control.Loader.getInstance().getPreview(this.previewCallback_);
  }, 500, this);

  /**
   * Reference the preview window, it will update when we save
   * @type {k3d.component.Preview}
   * @private
   */
  this.preview_ = null;

  /**
   * This function should be the callback of the getPrview call.
   * @type {function(Object): undefined}
   * @private
   */
  this.previewCallback_ = goog.bind(function(obj) {
    this.preview_.setModel(obj);
  }, this);

  // Start the damn thing
  this.initialize();

};
goog.inherits(k3d.control.Main, pstj.control.Base);

goog.scope(function() {

  var _ = k3d.control.Main.prototype;

  /** @inheritDoc */
  _.initialize = function() {

    k3d.control.ErrorHandler.getInstance().setParentControlInstance(this);
    // first start loading data from server as this tends to be the slowest
    // process.
    k3d.control.Loader.getInstance().start(goog.bind(
      this.onPreloadReady, this));
  };

  /**
   * At this point we have certainty that the needed data has been loaded.
   */
  _.onPreloadReady = function() {
    var body = k3d.template.base({
      links: goog.global['HEADER_LINKS'],
      prefix: goog.global['ASSETS_PREFIX']
    });
    var el = goog.dom.htmlToDocumentFragment(body);
    document.body.appendChild(el);

    // find header and apply size
    goog.dom.getElementByClass(goog.getCssName('header')).style.height =
      k3d.ds.definitions.headerHeight + 'px';

    k3d.control.Buttons.getInstance().setParentControlInstance(this);
    k3d.control.Editor.getInstance().setParentControlInstance(this);
    k3d.control.Editor.getInstance().install(/** @type {!Element} */ (
      document.body));

    k3d.control.Loader.getInstance().getKitchen().addCallback(goog.bind(
      function(kitchen) {

        goog.asserts.assertInstanceof(kitchen, k3d.ds.KitchenProject,
          'Should have been a kitchen');

        this.projectid_ = kitchen.getId();

        // tell the price calculator about the data model.
        k3d.control.Price.getInstance().loadData(kitchen);
        k3d.control.Editor.getInstance().loadData(kitchen);
        this.delayLoad_.start();
        // kitchen.setDescription('New descritpion for project 3');
        // setTimeout(function() {
        //   k3d.control.Loader.getInstance().saveKitchen(kitchen);
        // }, 1000);
      }, this)
    );

    this.preview_ = new k3d.component.Preview(undefined,
      'public/assets/bgb.jpg');

    this.preview_.render(document.body);
  };

  /** @inheritDoc */
  _.notify = function(child, action) {
    if (child == k3d.control.Buttons.getInstance()) {
      switch (action) {
        case 'previous':
          k3d.control.Editor.getInstance().loadSiblingWall(false);
          break;
        case 'next':
          k3d.control.Editor.getInstance().loadSiblingWall(true);
          break;
        case 'add':
          k3d.control.Editor.getInstance().addNewItem();
          break;
        case 'select-finish':
          k3d.control.Editor.getInstance().showSelectFinishes();
          break;
        case 'select-handles':
          k3d.control.Editor.getInstance().showSelectHandles();
          break;
        case 'save':
          //k3d.control.Loader.getInstance().assignProject(this.projectid_);
          break;
      }
    }
    goog.base(this, 'notify', child, action);
  };

  /**
   * Execute pre-loading of data AFTER the initial paint.
   */
  _.postLoad = function() {

    // Setup the action to take when the data record changes.
    k3d.control.Editor.getInstance().setDataChangeHandler(goog.bind(
      function(kitchen) {
        k3d.control.Loader.getInstance().saveKitchen(kitchen);
        this.getImageDelay_.start();
      }, this));

    //Notify the editor when all images have been loaded, including ones on post
    //load.
    k3d.control.Loader.getInstance().getAllImagesLoadedDeferred().addCallback(
      function() {
        k3d.control.Editor.getInstance().onLoadComplete();

      });

    k3d.control.Loader.getInstance().getItems();
    k3d.control.Loader.getInstance().getFinishes();
    k3d.control.Loader.getInstance().getHandles();
  };
});
