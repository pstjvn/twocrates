goog.provide('test');

goog.require('goog.dom');
goog.require('k3d.control.Main');
goog.require('k3d.ds.definitions');
goog.require('k3d.template');

/**
 * @fileoverview Provides the testing bed for our project.
 */
test = function() {
  var body = k3d.template.base({});
  var el = goog.dom.htmlToDocumentFragment(body);
  document.body.appendChild(el);

  // find header and apply size
  goog.dom.getElementByClass(goog.getCssName('header')).style.height =
    k3d.ds.definitions.headerHeight + 'px';

  var app = new k3d.control.Main();

  // // Init the error handler. Basically we want to have general app control that
  // // manages all those controls.
  // k3d.control.ErrorHandler.getInstance();

  // // load data in editor.
  // // k3d.control.Editor.getInstance().setWallSize(4000, 2450);
  // k3d.control.Editor.getInstance().install(document.body);

  // // instantiate the buttons for controls
  // k3d.control.Buttons.getInstance();

  // k3d.control.Loader.getInstance().getKitchen().addCallback(function(kitchen) {

  //   goog.asserts.assertInstanceof(kitchen, k3d.ds.KitchenProject,
  //     'Should have been a kitchen');

  //   k3d.control.Editor.getInstance().loadData(kitchen);
  //   // kitchen.setDescription('New descritpion for project 3');
  //   // setTimeout(function() {
  //   //   k3d.control.Loader.getInstance().saveKitchen(kitchen);
  //   // }, 1000);
  // });


  // var k3ditem1 = new k3d.component.Item();
  // k3ditem1.setModel(new k3d.ds.Item(item1));
  // k3d.control.Editor.getInstance().addItem(k3ditem1);

  // var k3ditem2 = new k3d.component.Item();
  // k3ditem2.setModel(new k3d.ds.Item(item2));
  // k3d.control.Editor.getInstance().addItem(k3ditem2);


  // var k3ditem3 = new k3d.component.Item();
  // k3ditem3.setModel(new k3d.ds.Item(item3));
  // k3d.control.Editor.getInstance().addItem(k3ditem3);

  // var k3ditem4 = new k3d.component.Item();
  // k3ditem4.setModel(new k3d.ds.Item(item4));
  // k3d.control.Editor.getInstance().addItem(k3ditem4, true);
  // var filler = new k3d.ui.Filler();
  // filler.decorate(goog.dom.getElementByClass(goog.getCssName('container')));
  // var child = new pstj.ui.TouchSheet();
  // child.setSize(new goog.math.Size(1000, 1000));
  // child.decorate(goog.dom.getElementByClass(goog.getCssName('child')));
  // filler.addChild(child);
};
