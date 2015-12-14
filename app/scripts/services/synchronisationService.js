/*File: synchronisationService.js
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

var cnedApp = cnedApp;

/**
 * Service de synchronisation lorsque l'utilisateur redevient connecté.
 */
cnedApp.service('synchronisationService', function($localForage, fileStorageService, profilsService, configuration, dropbox, $q) {
    
    var self = this;

    /**
     * Lance la synchronisation des documents et des profils.
     * 
     * @param compteId l'identifiant du compte
     * @param token :
     *            le token dropbox
     */
    this.sync = function(compteId, token) {
        var syncOperations = [];
        syncOperations.push(this.syncDocuments(token));
        syncOperations.push(this.syncProfils());
        return $q.all(syncOperations);
    };

    /**
     * Synchronise les documents.
     * 
     * @param le
     *            token d'accès à dropbox
     */
    this.syncDocuments = function(token) {
        var docArray = $localForage.getItem('docToSync');
        var operations = [];
        var rejectedItems = [];
        if (docArray) {
            for (var i = 0; i < docArray.length; i++) {
                var docItem = docArray[i];
                self.syncDocument(token, docItem, operations, rejectedItems);
            }
        }
        return $q.all(operations).then(null, function() {
            $localForage.setItem('docToSync', rejectedItems);
        });
    };

    /**
     * Synchronise un document.
     * 
     * @param le
     *            token d'accès à dropbox
     * @param docItem le document
     * @param operations la liste des opérations de synchronisation
     * @param rejectedItems la liste des opérations rejetées
     */
    this.syncDocument = function(token, docItem, operations, rejectedItems) {
        if (docItem.action === 'update') {
            operations.push(fileStorageService.saveFile(docItem.docName, docItem.content, token).then(null, function() {
                rejectedItems.push(docItem);
            }));
        }
        if (docItem.action === 'delete') {
            operations.push(fileStorageService.deleteFile(docItem.docName, token).then(null, function() {
                rejectedItems.push(docItem);
            }));
        }
        if (docItem.action === 'rename') {
            operations.push(fileStorageService.renameFile(docItem.oldDocName, docItem.newDocName, token).then(null, function() {
                rejectedItems.push(docItem);
            }));
        }
    };

    /**
     * Synchronise les profils.
     * @param compteId l'identifiant du compte client
     */
    this.syncProfils = function() {
        var profilesArray = $localForage.getItem('profilesToSync');
        var operations = [];
        var rejectedItems = [];
        if (profilesArray) {
            for (var i = 0; i < profilesArray.length; i++) {
                var profileItem = profilesArray[i];
                self.syncProfil(profileItem, operations, rejectedItems);
            }
        }
        return $q.all(operations).then(null, function() {
            return $localForage.setItem('docToSync', rejectedItems);
        });
    };

    /**
     * Synchronise un profil.
     * @param profileItem le profil
     * @param operations la liste des opérations de synchronisation
     * @param rejectedItems la liste des opérations rejetées
     */
    this.syncProfil = function(profileItem, operations, rejectedItems) {
        if (profileItem.action === 'create') {
            operations.push(profilsService.addProfil(profileItem.profil, profileItem.profilTags).then(null, function() {
                rejectedItems.push(profileItem);
            }));
        } else if (profileItem.action === 'update') {
            operations.push(profilsService.updateProfil(profileItem.profil).then(function() {
                return profilsService.updateProfilTags(profileItem.profil._id, profileItem.profilTags);
            }, function() {
                rejectedItems.push(profileItem);
            }));
        } else if (profileItem.action === 'delete') {
            operations.push(profilsService.deleteProfil(localStorage.getItem('compteId'), profileItem.profil._id).then(null, function() {
                rejectedItems.push(profileItem);
            }));
        }
    };
});