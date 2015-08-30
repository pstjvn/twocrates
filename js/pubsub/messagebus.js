/**
 * @fileoverview Provides generalized message bug for the application and the
 *   main topics on the bus.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('k3d.mb');

goog.require('goog.pubsub.PubSub');


goog.scope(function() {
var _ = k3d.mb;


/**
 * @enum {string}
 */
_.Topic = {
  ERROR: 'error'
};


/**
 * The message bus instance.
 * @type {goog.pubsub.PubSub}
 */
_.Bus = new goog.pubsub.PubSub();

});  // goog.scope
