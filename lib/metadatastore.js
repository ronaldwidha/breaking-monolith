'use strict';

exports.transform = function(filemeta) {
    // console.log(filemeta)
    return new Promise(function (resolve, reject) {
        resolve(filemeta);
    });
};

exports.store = function(items) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}