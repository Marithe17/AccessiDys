/*File: file.constant.js
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

angular.module('cnedApp').constant('FileConstant', {
    TYPE: {
        document: 'document',
        profile: 'profile'
    },
    MIME_TYPE: {
        document: 'text/html',
        profile: 'application/json',
        folder: 'application/vnd.google-apps.folder'
    },
    DEFAULT_FILE_PATH: {
        onedrive_default_folder: 'Accessidys'
    },
    ONE_DRIVE: {
        query: {
            profile: '.txt',
            document: '.html',
            filesAndFolders: 'filesAndFolders'
        }
    },
    DROPBOX: {
        query: {
            profile: '.json',
            document: '.html'
        }
    }
});