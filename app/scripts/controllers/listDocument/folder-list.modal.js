/* File: folder-list.modal.js
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
/* jshint loopfunc:true */

angular.module('cnedApp').controller('folderListCtrl', function ($scope, $uibModalInstance, _, documentService, ToasterService, folderList) {
    $scope.folderList = [];
    $scope.selectedFolder = null;

    var folderIndex = 0;


    function calculateIndex(list) {
        if (list) {
            _.each(list, function (value) {
                value.index = folderIndex;
                value.selected = false;

                folderIndex++;

                if (value.content && value.content.length > 0) {
                    calculateIndex(value.content);
                }
            });
        }
    }

    $scope.selectFolder = function (folder) {
        $scope.selectedFolder = folder;
    };

    $scope.validateFolder = function () {
        $uibModalInstance.close({
            selectedFolder: $scope.selectedFolder
        });
    };


    $scope.createFolder = function () {

        documentService.createFolder('/').then(function (folder) {

            ToasterService.showToaster('#folder-list-success-toaster', 'folder.message.create.ok');
            $scope.folderList[0].content.push(folder);
            folderIndex = 0;
            calculateIndex($scope.folderList);
        });

    };


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };


    $uibModalInstance.opened.then(function () {
        $scope.folderList = [{
            filename: 'Aucun dossier',
            filepath: '/',
            type: 'folder',
            content: angular.copy(folderList)
        }];
        calculateIndex($scope.folderList);
    });


});
