/* File: utils.js
 *
 * Copyright (c) 2013-2016
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';

var mongoose = require('mongoose');
var config = require('../../../env/config.test.json');
var io = require('socket.io').listen(5000);
global.io = io;

var events = require('events');
global.eventEmitter = new events.EventEmitter();

global.appVersion = {
	version: 2,
	hard: true
};
/* Before the beginning of all the tests. */
before(function(done) {

	function clearDB() {
                /* To correct an error reported by JSHint:  Don't make functions within a loop*/
		function callBack() {}
		for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(callBack);
		}
		return done();
	}

	if (mongoose.connection.readyState === 0) {
		mongoose.connect('mongodb://' + config.MONGO_URI + '/' + config.MONGO_DB, function(err) {
			if (err) {
				throw err;
			}
			return clearDB();
		});
	} else {
		return clearDB();
	}
});

/* After the end of all the tests */
after(function(done) {
	mongoose.disconnect();
	return done();
});
