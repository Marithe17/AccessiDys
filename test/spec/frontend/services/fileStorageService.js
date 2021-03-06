/* File: fileStorageService.js
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
/* global spyOn:false */

describe(
    'Service: fileStorageService',
    function () {

        var dropbox, q, deferred, localForage, synchronisationStoreService, docArray = [{
            filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
            filename: 'file1',
            dateModification: '2015-9-20'
        }];

        beforeEach(module('cnedApp'));

        beforeEach(function () {
            dropbox = {
                search: function (query) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (query === '.html' || query === 'file1') {
                        deferred
                            .resolve([{
                                path_display: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                                modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
                            }]);
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                download: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve('fileContent');
                    return deferred.promise;
                },
                rename: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve('<h1>test</h1>');
                    return deferred.promise;
                },
                delete: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve();
                    return deferred.promise;
                },
                upload: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({
                        path_display: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                        modified: 'Sun, 20 Sep 2015 16:09:46 +0000'
                    });
                    return deferred.promise;
                },
                shareLink: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({
                        url: 'http://test.com'
                    });
                    return deferred.promise;
                }
            };
            localForage = {
                getItem: function (item) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (item === 'listDocument' || item === 'document.file1') {
                        deferred
                            .resolve(docArray);
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                setItem: function (item) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (item === 'listDocument' || item === 'document.file1') {
                        deferred.resolve();
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                removeItem: function (item) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (item === 'document.file1' || item === 'file1') {
                        deferred.resolve();
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                }
            };
            synchronisationStoreService = {
                storeDocumentToSynchronize: function () {
                },
            };
            spyOn(dropbox, 'search').and.callThrough();
            spyOn(dropbox, 'download').and.callThrough();
            spyOn(dropbox, 'rename').and.callThrough();
            spyOn(dropbox, 'delete').and.callThrough();
            spyOn(dropbox, 'upload').and.callThrough();
            spyOn(dropbox, 'shareLink').and.callThrough();
            spyOn(localForage, 'setItem').and.callThrough();
            spyOn(localForage, 'removeItem').and.callThrough();
            spyOn(synchronisationStoreService, 'storeDocumentToSynchronize').and.callThrough();

            module(function ($provide) {
                $provide.value('dropbox', dropbox);
                $provide.value('$localForage', localForage);
                $provide.value('synchronisationStoreService', synchronisationStoreService);
            });
        });
        beforeEach(inject(function ($rootScope) {
            $rootScope.currentUser = {
                local: {
                    email: 'yoniphilippe@gmail.com'
                }
            };
        }));
        it('fileStorageService:list', inject(function (fileStorageService, configuration, $q, $rootScope) {
            var deferredSuccess;
            spyOn(localForage, 'getItem').and.callFake(function () {
                return deferredSuccess.promise;
            });

            // online case
            q = $q;
            deferredSuccess = $q.defer();
            deferredSuccess.resolve();
            spyOn(fileStorageService, 'updateFileListInStorage').and.returnValue(deferredSuccess.promise);
            fileStorageService.list(true, 'token');
            $rootScope.$apply();
            expect(dropbox.search).toHaveBeenCalledWith('.html', 'token');
            expect(fileStorageService.updateFileListInStorage).toHaveBeenCalled();

            // offline case
            q = $q;
            deferredSuccess = $q.defer();
            deferredSuccess.resolve();
            fileStorageService.list(false, 'token');
            expect(localForage.getItem).toHaveBeenCalledWith('listDocument');
        }));


        it('fileStorageService:get', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var result;
            // for online
            fileStorageService.get(true, 'file1', 'token').then(function (data) {
                result = data;
            });
            expect(dropbox.search).toHaveBeenCalledWith('_file1_', 'token');
            // Force to execute callbacks
            $rootScope.$apply();
            // for offline
            spyOn(fileStorageService, 'searchFilesInStorage').and.callThrough();
            fileStorageService.get(false, 'file1', 'token');
            expect(fileStorageService.searchFilesInStorage).toHaveBeenCalledWith('file1');
        }));

        it('fileStorageService:renameFile', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            // for an online user
            var deferred19 = q.defer();
            deferred19.resolve('content');
            spyOn(fileStorageService, 'getFileInStorage').and.returnValue(deferred19.promise);
            spyOn(fileStorageService, 'saveFileInStorage').and.returnValue(deferred19.promise);
            spyOn(fileStorageService, 'deleteFileInStorage').and.callThrough();
            fileStorageService.renameFile(true, 'file1', 'file2', 'token', false);
            $rootScope.$apply();
            expect(dropbox.rename).toHaveBeenCalledWith('file1', 'file2', 'token', false);
            expect(fileStorageService.getFileInStorage).toHaveBeenCalledWith('file1');
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
            expect(fileStorageService.deleteFileInStorage).toHaveBeenCalled();

            // for an offline user
            spyOn(fileStorageService, 'renameFileInStorage').and.callThrough();
            fileStorageService.renameFile(false, 'file1', 'file2', 'token');
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalled();
            expect(fileStorageService.renameFileInStorage).toHaveBeenCalledWith('file1', 'file2');
        }));

        it('fileStorageService:deleteFile', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            // For an online user
            spyOn(fileStorageService, 'deleteFileInStorage').and.callThrough();
            fileStorageService.deleteFile(true, 'file1', 'token', false);
            $rootScope.$apply();
            expect(dropbox.delete).toHaveBeenCalledWith('file1', 'token', false);
            expect(fileStorageService.deleteFileInStorage).toHaveBeenCalled();

            // for an offline user
            fileStorageService.deleteFile(false, 'file1', 'token');
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalledWith({
                owner: 'yoniphilippe@gmail.com',
                docName: 'file1',
                action: 'delete',
                content: null
            });
        }));

        it('fileStorageService:saveFile', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            spyOn(fileStorageService, 'saveFileInStorage').and.callFake(function () {
                return deferred.promise;
            });
            spyOn(fileStorageService, 'searchFilesInStorage').and.callFake(function () {
                var defer2 = q.defer();
                defer2.resolve([]);
                return defer2.promise;
            });
            fileStorageService.saveFile(true, 'file1', 'content', 'token', false);
            $rootScope.$apply();
            expect(dropbox.upload).toHaveBeenCalledWith('file1', 'content', 'token', false);

            // for an offline user and no files corresponding
            deferred = q.defer();
            deferred.resolve();
            fileStorageService.saveFile(false, 'file1', 'content', 'token', false);
            $rootScope.$apply();
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalled();
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();

            // for an offline user and a file corresponding
            deferred = q.defer();
            deferred.resolve([{file: 'file1'}]);
            fileStorageService.saveFile(false, 'file1', 'content', 'token', false);
            $rootScope.$apply();
            expect(synchronisationStoreService.storeDocumentToSynchronize).toHaveBeenCalled();
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
        }));

        it('fileStorageService:saveTempFile', inject(function (fileStorageService, configuration, $q) {
            q = $q;
            fileStorageService.saveTempFile('content');
            expect(localForage.setItem).toHaveBeenCalledWith('docTemp', 'content');
        }));

        it('fileStorageService:saveTempFileForPrint', inject(function (fileStorageService, configuration, $q) {
            q = $q;
            fileStorageService.saveTempFileForPrint('content');
            expect(localForage.setItem).toHaveBeenCalledWith('printTemp', 'content');
        }));

        it('fileStorageService:getTempFileForPrint', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            spyOn(localForage, 'getItem').and.returnValue(deferredSuccess.promise);
            fileStorageService.getTempFileForPrint();
            // Force to execute callbacks
            $rootScope.$apply();
            expect(localForage.getItem).toHaveBeenCalledWith('printTemp');
        }));

        it('fileStorageService:getTempFile', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferredSuccess = $q.defer();
            spyOn(localForage, 'getItem').and.returnValue(deferredSuccess.promise);
            fileStorageService.getTempFile();
            deferredSuccess.resolve();
            // Force to execute callbacks
            $rootScope.$apply();
            expect(localForage.getItem).toHaveBeenCalledWith('docTemp');
        }));

        it('fileStorageService:shareFile', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            fileStorageService.shareFile('file1', 'token');
            $rootScope.$apply();
            expect(dropbox.shareLink).toHaveBeenCalledWith('file1', 'token');
        }));


        it('fileStorageService:deleteFromListDocument ', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            // file founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.deleteFromListDocument('/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html');
            $rootScope.$apply();
            expect(docArray.length).toBe(0);
            expect(localForage.setItem).toHaveBeenCalled();

            // file not founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.deleteFromListDocument('inexistant');
            $rootScope.$apply();
            expect(docArray.length).toBe(1);
            expect(localForage.setItem).toHaveBeenCalled();
        }));

        it('fileStorageService:saveOrUpdateInListDocument   ', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            // file founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.saveOrUpdateInListDocument({
                filepath: 'nouveau chemin',
                filename: 'file1',
                dateModification: '2015-9-20'
            });
            $rootScope.$apply();
            expect(docArray.length).toBe(1);
            expect(localForage.setItem).toHaveBeenCalled();


            // file not founded
            docArray = [{
                filepath: '/path/2015-9-20_file1_8fbf8a33b1e9ad28f0f6f5d54a727cbb.html',
                filename: 'file1',
                dateModification: '2015-9-20'
            }];
            fileStorageService.saveOrUpdateInListDocument({
                filepath: 'nouveau chemin',
                filename: 'file2',
                dateModification: '2015-9-20'
            });
            $rootScope.$apply();
            expect(docArray.length).toBe(2);
            expect(localForage.setItem).toHaveBeenCalled();
        }));

        it('fileStorageService:renameFileInStorage', inject(function (fileStorageService, configuration, $q, $rootScope) {
            q = $q;
            var deferred19 = q.defer();
            deferred19.resolve([{filepath: '/content'}]);
            spyOn(fileStorageService, 'searchFilesInStorage').and.returnValue(deferred19.promise);
            spyOn(fileStorageService, 'getFileInStorage').and.returnValue(deferred19.promise);
            spyOn(fileStorageService, 'saveFileInStorage').and.returnValue(deferred19.promise);
            spyOn(fileStorageService, 'deleteFileInStorage').and.callThrough();
            fileStorageService.renameFileInStorage('file1', 'file2');
            $rootScope.$apply();
            expect(fileStorageService.getFileInStorage).toHaveBeenCalled();
            expect(fileStorageService.searchFilesInStorage).toHaveBeenCalled();
            expect(fileStorageService.saveFileInStorage).toHaveBeenCalled();
            expect(fileStorageService.deleteFileInStorage).toHaveBeenCalled();
        }));
    });