define(['services'], function (services) {
    'use strict';

    /* Services */
    var testserv = function () {
        this.testbystructfunc = function (x) {

            alert(x + " by structfunc");
        };
    };

    testserv.prototype.testbyprototype = function (x) {
        alert(x + " by prototype");
    };

    services.service('testserv', testserv);
});

