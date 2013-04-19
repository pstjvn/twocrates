goog.provide('test');

goog.require('goog.dom');
goog.require('k3d.component.Item');
goog.require('k3d.control.Buttons');
goog.require('k3d.control.Editor');
goog.require('k3d.ds.Item');
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



  k3d.control.Editor.getInstance().setWallSize(4000, 2450);
  k3d.control.Editor.getInstance().install(document.body);

  k3d.control.Buttons.getInstance();

  // start adding items
  var item1 = {
    "id": "1",
    "is_attached_to_wall": true,
    "description": "Floor cabiner, 2 rows, one door, finish could be polished back and cherry, high orders and promotion.",
    "categoty_id": 2, //number 1 = up, 2 = down, 3 = up_corner, 4 = down_corner, 5 = two_row, 6 = two_row_corner, 7 = other
    "width": 300,
    "width2": 400, // ignored for items that do not have second back wall.
    "height": 550,
    "depts": 350,
    "front_picture": "assets/1.png",
    "angle_picture": "assets/HD_03.jpg",
    "has_top_board": true,
    "model_id": "23",
    "is_spacer": false,
    "price": 3500, // number, AU * 100 to avoid floating point arythmetics.
    "required_handles": 0 // not sure for this, how do we calculate price for handles?
  };

  var item2 = {
    "id": "2",
    "is_attached_to_wall": true,
    "description": "Floor cabiner, 2 rows, one door",
    "categoty_id": 2, //number 1 = up, 2 = down, 3 = up_corner, 4 = down_corner, 5 = two_row, 6 = two_row_corner, 7 = other
    "width": 550,
    "width2": 400, // ignored for items that do not have second back wall.
    "height": 550,
    "depts": 350,
    "front_picture": "assets/2.png",
    "angle_picture": "assets/HD_03.jpg",
    "has_top_board": true,
    "model_id": "23",
    "is_spacer": false,
    "price": 3500, // number, AU * 100 to avoid floating point arythmetics.
    "required_handles": 0 // not sure for this, how do we calculate price for handles?
  };

  var item3 = {
    "id": "3",
    "is_attached_to_wall": true,
    "description": "Refrigerator, single door, 300 liters.",
    "categoty_id": 2, //number 1 = up, 2 = down, 3 = up_corner, 4 = down_corner, 5 = two_row, 6 = two_row_corner, 7 = other
    "width": 650,
    "width2": 400, // ignored for items that do not have second back wall.
    "height": 1200,
    "depts": 350,
    "front_picture": "assets/3.png",
    "angle_picture": "assets/HD_03.jpg",
    "has_top_board": true,
    "model_id": "23",
    "is_spacer": false,
    "price": 3500, // number, AU * 100 to avoid floating point arythmetics.
    "required_handles": 0 // not sure for this, how do we calculate price for handles?
  };

  var item4 = {
    "id": "4",
    "is_attached_to_wall": true,
    "description": "Upper row glass cabinet with two shelfs.",
    "categoty_id": 1, //number 1 = up, 2 = down, 3 = up_corner, 4 = down_corner, 5 = two_row, 6 = two_row_corner, 7 = other
    "width": 700,
    "width2": 400, // ignored for items that do not have second back wall.
    "height": 440,
    "depts": 350,
    "front_picture": "assets/4.png",
    "angle_picture": "assets/HD_03.jpg",
    "has_top_board": true,
    "model_id": "23",
    "is_spacer": false,
    "price": 3500, // number, AU * 100 to avoid floating point arythmetics.
    "required_handles": 0 // not sure for this, how do we calculate price for handles?
  };

  var k3ditem1 = new k3d.component.Item();
  k3ditem1.setModel(new k3d.ds.Item(item1));
  k3d.control.Editor.getInstance().addItem(k3ditem1);

  var k3ditem2 = new k3d.component.Item();
  k3ditem2.setModel(new k3d.ds.Item(item2));
  k3d.control.Editor.getInstance().addItem(k3ditem2);


  var k3ditem3 = new k3d.component.Item();
  k3ditem3.setModel(new k3d.ds.Item(item3));
  k3d.control.Editor.getInstance().addItem(k3ditem3);

  var k3ditem4 = new k3d.component.Item();
  k3ditem4.setModel(new k3d.ds.Item(item4));
  k3d.control.Editor.getInstance().addItem(k3ditem4, true);
  // var filler = new k3d.ui.Filler();
  // filler.decorate(goog.dom.getElementByClass(goog.getCssName('container')));
  // var child = new pstj.ui.TouchSheet();
  // child.setSize(new goog.math.Size(1000, 1000));
  // child.decorate(goog.dom.getElementByClass(goog.getCssName('child')));
  // filler.addChild(child);
};
