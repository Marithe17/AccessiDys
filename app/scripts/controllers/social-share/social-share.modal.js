/* File: social-share.modal.js
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

var FB = FB;

angular.module('cnedApp').controller('SocialShareModalCtrl', function ($rootScope, $scope, $uibModalInstance, DropboxProvider,
                                                                       EmailService, ToasterService, LoaderService, $log,
                                                                       $timeout, UserService, mode, itemToShare) {


    $scope.hasRightToShare = false;
    $scope.facebookLink = '';
    $scope.twitterLink = '';
    $scope.mode = '';
    $scope.shareAnnotation = false;
    $scope.hasAnnotation = false;
    $scope.itemToShare = {
        linkToShare: '',
        name: '',
        annotationsToShare: []
    };
    $scope.shareMethod = '';
    $scope.form = {
        email: ''
    };

    $uibModalInstance.opened.then(function () {
        $scope.itemToShare = itemToShare;
        $scope.mode = mode;

        if($scope.itemToShare.annotationsToShare && $scope.itemToShare.annotationsToShare.length > 0){
            $scope.hasAnnotation = true;
        }

        if (mode === 'profile') {
            $scope.attachFacebook();
            $scope.twitterLink = encodeURIComponent($scope.itemToShare.linkToShare);
        }
    });


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

    // TODO To be review
    $scope.changed = function (shareAnnotation) {
        $scope.shareAnnotation = shareAnnotation;
    };

    /**
     * If there are annotations then upload to dropbox
     */
    $scope.processAnnotation = function () {
        if ($scope.shareAnnotation && $scope.itemToShare.name && $scope.itemToShare.annotationsToShare) {

            var fileName = $scope.itemToShare.name + '.json';

            // TODO mettre en place le filestorage service
            DropboxProvider.upload(fileName, $scope.itemToShare.annotationsToShare)
                .then(function (data) {
                    DropboxProvider.shareLink(data.path_display)
                        .then(function (result) {
                            $scope.itemToShare.linkToShare += '&annotation=' + result.url;
                            $scope.itemToShare.linkToShare = $scope.itemToShare.linkToShare;
                            $scope.hasRightToShare = true;
                            $scope.attachFacebook();
                            $scope.twitterLink = encodeURIComponent($scope.itemToShare.linkToShare);
                        });
                });
        } else {
            $scope.itemToShare.linkToShare = $scope.itemToShare.linkToShare;
            $scope.hasRightToShare = true;
            $scope.attachFacebook();
            $scope.twitterLink = encodeURIComponent($scope.itemToShare.linkToShare);
        }
    };

    $scope.shareByEmail = function () {

        $log.debug('$scope.itemToShare.linkToShare', $scope.itemToShare.linkToShare);


        if (EmailService.verifyEmail($scope.form.email)) {

            LoaderService.showLoader('label.share.inprogress', false);

            var emailParams = {
                to: $scope.form.email,
                prenom: UserService.getData().firstName, // the first name
                fullName: UserService.getData().firstName + ' ' + UserService.getData().lastName,
                content: '',
                encoded: '',
                doc: null
            };

            if ($scope.mode === 'document') {
                // Document mode
                emailParams.content = ' a utilisé Accessidys pour partager un fichier avec vous !  ' + $scope.itemToShare.linkToShare;
                emailParams.encoded = '<span> vient d\'utiliser Accessidys pour partager ce fichier avec vous : <a href=' + $scope.itemToShare.linkToShare + '>' + $scope.itemToShare.name + '</a> </span>';
                emailParams.doc = $scope.itemToShare.name;

            } else if ($scope.mode === 'profile') {
                // Profile Mode
                emailParams.content = ' vient de partager avec vous un profil sur l\'application Accessidys.  ' + $scope.itemToShare.linkToShare;
                emailParams.encoded = '<span> vient de partager avec vous un profil sur l\'application Accessidys.   <a href=' + $scope.itemToShare.linkToShare + '>Lien de ce profil</a> </span>';
                emailParams.doc = $scope.itemToShare.linkToShare;
            }

            EmailService.sendMail(emailParams)
                .then(function () {
                    LoaderService.hideLoader();
                    $uibModalInstance.close({
                        status: 'OK'
                    });
                }, function () {
                    LoaderService.hideLoader();
                    $uibModalInstance.close({
                        status: 'KO'
                    });
                });

        } else {
            ToasterService.showToaster('#social-share-error-toaster', 'profile.message.save.ko.email.notvalid');
        }
    };

    $scope.attachFacebook = function () {
        $scope.facebookLink = decodeURIComponent($scope.itemToShare.linkToShare);
    };
});