goog.provide('k3d.control.Main');

goog.require('goog.asserts');
goog.require('goog.async.DeferredList');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('k3d.component.Preview');
goog.require('k3d.control.Buttons');
goog.require('k3d.control.Editor');
goog.require('k3d.control.ErrorHandler');
goog.require('k3d.control.Loader');
goog.require('k3d.control.Price');
goog.require('k3d.ds.definitions');
goog.require('k3d.ds.strings');
goog.require('k3d.mb');
goog.require('k3d.template');
goog.require('pstj.control.Base');
goog.require('pstj.configure');



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
    k3d.control.Loader.getInstance().getPreview(this.projectid_,
        this.previewCallback_);
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

  // Setup unload handler if we do not know the user.
  if (!goog.global['USER_IS_KNOWN']) {
    goog.events.listen(window, goog.events.EventType.BEFOREUNLOAD, function(e) {
      setTimeout(function() {
        k3d.mb.Bus.publish(k3d.mb.Topic.ERROR,
            k3d.ds.definitions.Static.RUNTIME, 1002);
      }, 300);
      var confirmationMessage = k3d.ds.strings.confirmationMessageOnClose;
      (e || window.event).returnValue = confirmationMessage;
      e.preventDefault();
      return confirmationMessage;
    }, undefined, this);
  }

  this.ga_();
};


/**
 * Attach analytics.
 * @private
 */
_.ga_ = function() {
  var link = document.querySelector('a[href="gagq"]');
  var isAlreadyCounted_ = false;
  if (goog.isNull(link)) return;
  goog.events.listen(link, goog.events.EventType.CLICK, function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAlreadyCounted_) {
      isAlreadyCounted_ = true;
      if (goog.isDefAndNotNull(goog.global['_gaq'])) {
        goog.global['_gaq'].push(['_trackEvent', 'Get Quote',
          this.projectid_.toString()]);
      }
    }
    k3d.mb.Bus.publish(k3d.mb.Topic.ERROR,
        k3d.ds.definitions.Static.STRUCTURED_ERROR, 1001,
        goog.global['QUOTE_NOT_SUPPORTED']);
  }, undefined, this);
};


/**
 * makes sure buttons are active only when action is possible.
 * @private
 */
_.pnc_ = function() {
  var res = k3d.control.Editor.getInstance().isFirstOrLast();
  if (res == 3) {
    k3d.control.Buttons.getInstance().enable(0, true);
    k3d.control.Buttons.getInstance().enable(5, true);
  } else if (res == 2) {
    k3d.control.Buttons.getInstance().enable(0, true);
    k3d.control.Buttons.getInstance().enable(5, false);
  } else if (res == 1) {
    k3d.control.Buttons.getInstance().enable(0, false);
    k3d.control.Buttons.getInstance().enable(5, true);
  } else if (res == 0) {
    k3d.control.Buttons.getInstance().enable(0, false);
    k3d.control.Buttons.getInstance().enable(5, false);
  }
};


/** @inheritDoc */
_.notify = function(child, action) {
  if (child == k3d.control.Buttons.getInstance()) {
    switch (action) {
      case 'previous':
        k3d.control.Editor.getInstance().loadSiblingWall(false);
        this.pnc_();
        break;
      case 'next':
        k3d.control.Editor.getInstance().loadSiblingWall(true);
        this.pnc_();
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
        k3d.control.Loader.getInstance().assignProject(this.projectid_);
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

  goog.async.DeferredList.gatherResults([
    k3d.control.Loader.getInstance().getKitchen(),
    k3d.control.Loader.getInstance().getItems(),
    k3d.control.Loader.getInstance().getFinishes(),
    k3d.control.Loader.getInstance().getHandles()
  ]).addCallback(function(list) {
    var kitchen = /** @type {k3d.ds.KitchenProject} */(list[0]);
    var finishes = /** @type {pstj.ds.List} */(list[2]);
    var handles = /** @type {pstj.ds.List} */(list[3]);
    if (goog.asserts.assertBoolean(pstj.configure.getRuntimeValue(
        'USE_PRICE_LABEL', false, 'TWOCRATES.CONFIG'))) {
      k3d.control.Price.getInstance().loadData(kitchen, finishes, handles);
    }
  });
  this.pnc_();
  this.getImageDelay_.start();
};

});  // goog.scope
