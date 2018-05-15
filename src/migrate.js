'use strict';

import Umzug from 'umzug';

module.exports = function(db, done) {
    var umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize: db.sequelize,
        },
        migrations: {
            params: [db.sequelize.getQueryInterface(), db.sequelize.constructor, function() {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }],
            path: './src/migrations',
            pattern: /\.js$/
        }
    });
    umzug.up().then(function()  {
        console.log('Migration complete!');
        done();
    },function(err) {
        console.log('Migration failed ' + err);
        done(err);
    });
};