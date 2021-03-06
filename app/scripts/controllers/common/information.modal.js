/* File: informationModal.js
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

angular.module('cnedApp').controller('InformationModalCtrl', function($scope, $rootScope, $uibModalInstance,
                                                                      $location, gettextCatalog,  title, content, redirection, isTranslate, showTipsAgain) {
    $scope.title = '';
    $scope.content = '';
    $scope.showTipsAgain = showTipsAgain;
    $scope.notShowAgain = false;

    if(!isTranslate){
        $scope.title = gettextCatalog.getString(title);
        $scope.content = gettextCatalog.getString(content);
    } else {
        $scope.title = title;
        $scope.content = content;
    }

    $scope.onCheckboxChange = function () {
        $scope.notShowAgain = !$scope.notShowAgain;
    };


    /**
     * Close modal and redirect to path if exist
     */
    $scope.closeModal = function() {
        $uibModalInstance.close({
            notShowAgain: $scope.notShowAgain
        });

        if (redirection) {
            $location.path(redirection);
        }
    };

});
