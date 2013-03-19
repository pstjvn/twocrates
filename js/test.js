goog.provide('test');

goog.require('k3d.ds.definitions');
goog.require('k3d.template');
goog.require('k3d.ui.Filler');
goog.require('goog.dom');
goog.require('goog.ui.Component');

/**
 * @fileoverview Provides the testing bed for our project
 */
test = function() {
  var body = k3d.template.base({});
  var el = goog.dom.htmlToDocumentFragment(body);
  document.body.appendChild(el);

  // find header and apply size
  goog.dom.getElementByClass(goog.getCssName('header')).style.height =
    k3d.ds.definitions.headerHeight + 'px';

  var filler = new k3d.ui.Filler();
  filler.decorate(goog.dom.getElementByClass(goog.getCssName('container')));
  var child = new goog.ui.Component();
  child.decorate(goog.dom.getElementByClass('child'));
  filler.addChild(child);

  var buf = '<div>sdkrfweityeogerogherlgherkghrtkgh</div>'
  var a = new Array(50);
  child.getElement().innerHTML = a.join(buf);
};
