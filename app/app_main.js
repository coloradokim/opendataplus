/**
 * Put all controllers here
 *
 **/

'use strict';

module.exports = function(router) {
    /* GET home page. */
    router.get('/', function(req, res) {
       res.redirect("/html");
    });

    //Authorization route and controller
    //require('./auth').loadRoutes(router);

    //load routes from the controllers
    require('./apps/app_controller').loadRoutes(router);
    require('./appspaces/appspace_controller').loadRoutes(router);
    require('./datasets/dataset_controller').loadRoutes(router);
    require('./docs/doc_controller').loadRoutes(router);
    require('./users/user_controller').loadRoutes(router);
};