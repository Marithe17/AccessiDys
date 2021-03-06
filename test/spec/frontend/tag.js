/* File: tag.js
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
/* global jasmine, spyOn:false */

describe('Controller:TagCtrl', function () {
    var $scope, controller;
    var tags = [{
        _id: '52c588a861485ed41c000001',
        libelle: 'Exercice',
        balise: 'H1'
	}, {
        _id: '52c588a861485ed41c000002',
        libelle: 'Cours',
        balise: 'p'
	}];
    var tag = {
        _id: '52c588a861485ed41c000003',
        libelle: 'TP',
        balise: 'div'
    };

    var tag1 = {
        _id: '52c588a861485ed41c44343',
        libelle: 'Exercice',
        balise: 'H1',
        niveau: 1
    };

    var compteId = 'hsqhbhjds3543skdksdsddsd';

    beforeEach(module('cnedApp'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, configuration) {
        $scope = $rootScope.$new();
        controller = $controller('TagCtrl', {
            $scope: $scope
        });

        localStorage.setItem('compteId', compteId);
        $rootScope.testEnv = true;
        $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=' + $scope.requestToSend.id).respond(tags);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond(tags);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/addTag', $scope.requestToSend).respond(tag);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/deleteTag').respond(tag);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/updateTag').respond(tag);
    }));

    it('TagCtrl:getLibelleNiveau', function () {
        expect($scope.getLibelleNiveau).toBeDefined();
        var libNiv = $scope.getLibelleNiveau(2);
        expect(libNiv).toBe('Niveau 2');
    });

    it('TagCtrl:afficherTags', inject(function ($httpBackend) {
        expect($scope.afficherTags).toBeDefined();

        $scope.tag = tag;
        $scope.tag.libelle = '';

        $scope.afficherTags();
        $httpBackend.flush();

    }));


    it('TagCtrl:create', function () {
        expect($scope.create).toBeDefined();
        $scope.create();
        $scope.tag = tag;
        $scope.tag.libelle = '';
        $scope.create();
        $scope.tag = tag;
        $scope.tag.libelle = 'Solution';
        $scope.create();
        $scope.tag = tag;
        $scope.tag.libelle = 'Solution';
        $scope.showNiveauTag = false;
        $scope.tag.position = 1;
        $scope.tag.niveau = undefined;
        $scope.create();
        $scope.tag.libelle = 'Solution';
        $scope.showNiveauTag = true;
        $scope.tag.position = 1;
        $scope.create();
        $scope.tag = tag;
        $scope.tag.balise = undefined;
        $scope.create();

        $scope.files = [{
            'webkitRelativePath': '',
            'lastModifiedDate': '2014-06-12T10:12:18.000Z',
            'name': 'p4.png',
            'type': 'image/png',
            'size': 1208
		}];
        $scope.create();


        $scope.xhrObj = jasmine.createSpyObj('xhrObj', ['addEventListener', 'open', 'send']);
        spyOn(window, 'XMLHttpRequest').and.returnValue($scope.xhrObj);
        $scope.files = undefined;
        $scope.create();
        $scope.files = [{
            'webkitRelativePath': '',
            'lastModifiedDate': '2014-06-12T10:12:18.000Z',
            'name': 'p4.png',
            'type': 'image/png',
            'size': 1208
		}];
        $scope.create();
    });

    it('TagCtrl:edit', function () {
        expect($scope.edit).toBeDefined();
        $scope.fiche = tag1;
        $scope.fiche.libelle = '';
        $scope.edit();
        $scope.fiche = tag1;
        $scope.fiche.libelle = 'Solution';
        $scope.edit();
        $scope.fiche = tag1;
        $scope.fiche.libelle = 'Solution';
        $scope.showNiveauTag = false;
        $scope.fiche.position = 1;
        $scope.fiche.niveau = undefined;
        $scope.edit();
        $scope.fiche.libelle = 'Solution';
        $scope.showNiveauTag = true;
        $scope.fiche.position = 1;
        $scope.edit();
        $scope.fiche.balise = undefined;
        $scope.edit();

        $scope.fiche = tag1;
        $scope.fiche.libelle = 'Titre 1';


        $scope.xhrObj = jasmine.createSpyObj('xhrObj', ['addEventListener', 'open', 'send']);
        spyOn(window, 'XMLHttpRequest').and.returnValue($scope.xhrObj);
        $scope.files = [{
            'webkitRelativePath': '',
            'lastModifiedDate': '2014-06-12T10:12:18.000Z',
            'name': 'p4.png',
            'type': 'image/png',
            'size': 1208
		}];
        $scope.edit();
    });
});