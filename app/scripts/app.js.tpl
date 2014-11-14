'use strict';
/* global io,headerHTML, listDocumentHTML, mainHTML, adminPanelHTML, footerHTML, inscriptionContinueHTML, passwordRestoreHTML, apercuHTML, imagesHTML, printHTML, profilesHTML, tagHTML, userAccountHTML, detailProfilHTML, errorHandlingHTML, errorPageHTML, needUpdateHTML */

var cnedApp = angular.module('cnedApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'gettext',
	'ui.bootstrap',
	'angular-md5',
	'services.config',
	'ngDialog',
	'pasvaz.bindonce'
]);

cnedApp.run(function($templateCache, emergencyUpgrade, $location) {


	try {
		$templateCache.put('header.html', headerHTML);
		$templateCache.put('listDocument.html', listDocumentHTML);
		$templateCache.put('main.html', mainHTML);
		$templateCache.put('adminPanel.html', adminPanelHTML);
		$templateCache.put('footer.html', footerHTML);
		$templateCache.put('inscriptionContinue.html', inscriptionContinueHTML);
		$templateCache.put('passwordRestore.html', passwordRestoreHTML);
		$templateCache.put('apercu.html', apercuHTML);
		$templateCache.put('images.html', imagesHTML);
		$templateCache.put('print.html', printHTML);
		$templateCache.put('profiles.html', profilesHTML);
		$templateCache.put('tag.html', tagHTML);
		$templateCache.put('userAccount.html', userAccountHTML);
		$templateCache.put('detailProfil.html', detailProfilHTML);
		$templateCache.put('errorHandling.html', errorHandlingHTML);
		$templateCache.put('errorPage.html', errorPageHTML);
		$templateCache.put('needUpdate.html', needUpdateHTML);

	} catch (e) {
		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
		}
		var tmp15 = emergencyUpgrade.starting();
		tmp15.then(function(data) {
			console.log('here we take action');
			console.log(data);
			if (data.action == 'reload') {
				window.location.reload();
			} else if (data.action == 'redirect') {
				console.log('redirection');
				window.location.href = '<%= URL_REQUEST %>';
			} else {
				console.log('do nothing');
			}
		});
	}
});

cnedApp.config(function($routeProvider, $sceDelegateProvider, $httpProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'**'
	]);
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	$routeProvider.when('/', {
		templateUrl: 'main.html',
		controller: 'MainCtrl'
	})
		.when('/workspace', {
			templateUrl: 'images.html',
			controller: 'ImagesCtrl'
		})
		.when('/apercu', {
			templateUrl: 'apercu.html',
			controller: 'ApercuCtrl'
		})
		.when('/print', {
			templateUrl: 'print.html',
			controller: 'PrintCtrl'
		})
		.when('/profiles', {
			templateUrl: 'profiles.html',
			controller: 'ProfilesCtrl'
		})
		.when('/tag', {
			templateUrl: 'tag.html',
			controller: 'TagCtrl'
		})
		.when('/userAccount', {
			templateUrl: 'userAccount.html',
			controller: 'UserAccountCtrl'
		})
		.when('/inscriptionContinue', {
			templateUrl: 'inscriptionContinue.html',
			controller: 'passportContinueCtrl'
		})
		.when('/adminPanel', {
			templateUrl: 'adminPanel.html',
			controller: 'AdminPanelCtrl'
		})
		.when('/listDocument', {
			templateUrl: 'listDocument.html',
			controller: 'listDocumentCtrl'
		})
		.when('/passwordHelp', {
			templateUrl: 'passwordRestore.html',
			controller: 'passwordRestoreCtrl'
		})
		.when('/detailProfil', {
			templateUrl: 'detailProfil.html',
			controller: 'ProfilesCtrl'
		})
		.when('/404', {
			templateUrl: 'errorPage.html',
			controller: 'notFoundCtrl'
		})
		.when('/needUpdate', {
			templateUrl: 'needUpdate.html',
			controller: 'needUpdateCtrl'
		})
		.otherwise({
			redirectTo: '/404'
		});
});
angular.module('cnedApp').run(function(gettextCatalog) {

	if (localStorage.getItem('langueDefault')) {
		try {
			JSON.parse(localStorage.getItem('langueDefault'));
			console.log('OK');
		} catch (e) {
			console.log(e);
			console.log('Not OK');
			localStorage.setItem('langueDefault', JSON.stringify({
				name: 'FRANCAIS',
				shade: 'fr_FR'
			}));
		}
		gettextCatalog.currentLanguage = JSON.parse(localStorage.getItem('langueDefault')).shade;
	} else {
		gettextCatalog.currentLanguage = 'fr_FR';
		localStorage.setItem('langueDefault', JSON.stringify({
			name: 'FRANCAIS',
			shade: 'fr_FR'
		}));
		gettextCatalog.debug = true;
	}
});

//rend les liens safe 
angular.module('cnedApp').config(['$compileProvider',
	function($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
	}
]);


angular.module('cnedApp').run(function($rootScope, $location, $http, dropbox, configuration, $templateCache, $timeout) {
	/*global $:false */

	/* Initilaisation du Lock traitement de Documents sur DropBox */
	localStorage.setItem('lockOperationDropBox', false);

	$templateCache.put('header.html', headerHTML);
	if (typeof io !== 'undefined') {
		$rootScope.socket = io.connect('<%= URL_REQUEST %>');
	}
	if ($rootScope.socket) {
		$rootScope.socket.on('news', function(data) {
			console.log('data from socket');
			console.log(data);
			$rootScope.socket.emit('my other event', {
				my: 'data ehhoooo'
			});
		});
	}
	$rootScope.backToHome = function() {
		console.log('redirect nNNNOw');
		// $('#errModal').modal('hide');
		if ($location.absUrl().indexOf('/listDocument') > 0) {
			window.location.reload();
		} else {
			window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
		}
	}
	$rootScope.$on('$routeChangeStart', function(event, next) {

		$rootScope.MonCompte = false;
		$rootScope.Document = false;
		$rootScope.Profil = false;
		$rootScope.loaderImg = '<%- URL_REQUEST %>/styles/images/loader_points.gif';
		var data = {
			id: false
		};

		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
			localStorage.setItem('dropboxLink', $location.absUrl().substring(0, $location.absUrl().indexOf('?key')));
			$rootScope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
			$timeout(function() {
				window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
			}, 1000, false);
		} else {
			if (localStorage.getItem('compteId')) {
				data = {
					id: localStorage.getItem('compteId')
				};
			}

			if (next.templateUrl) {
				if (next.templateUrl === 'main.html' || next.templateUrl === 'inscriptionContinue.html' || next.templateUrl === 'passwordRestore.html' || next.templateUrl === 'errorPage.html' || next.templateUrl === 'needUpdate.html') {

					$('body').addClass('page_authentification');
				} else {
					$('body').removeClass('page_authentification');
				}
				if (next.templateUrl === 'images.html') {
					$rootScope.showWorkspaceAction = true;
				} else {
					$rootScope.showWorkspaceAction = false;
				}
			}
			var browzerState = false;
			if (navigator) {
				browzerState = navigator.onLine;
			} else {
				browzerState = true;
			}
			if (browzerState) {
				$http.get('<%= URL_REQUEST %>/profile', {
					params: data
				})
					.success(function(result) {
						if (next.templateUrl && next.templateUrl === 'listDocument.html') {
							if (localStorage.getItem('lastDocument')) {
								var urlDocStorage = localStorage.getItem('lastDocument').replace('#/apercu', '');
								var titreDocStorage = decodeURI(urlDocStorage.substring(urlDocStorage.lastIndexOf('/') + 1, urlDocStorage.length));
								var searchDoc = dropbox.search(titreDocStorage, result.dropbox.accessToken, configuration.DROPBOX_TYPE);
								searchDoc.then(function(res) {
									if (!res || res.length <= 0) {
										localStorage.removeItem('lastDocument');
									}
								});
							}
						}
						if (next.templateUrl && next.templateUrl === 'tag.html' && result.local.role !== 'admin') {
							$location.path('listDocument.html');
						}

					})
					.error(function() {
						$rootScope.loged = false;
						$rootScope.dropboxWarning = true;
						if (next.templateUrl) {
							var lien = window.location.href;
							var verif = false;
							if ((lien.indexOf('https://dl.dropboxusercontent.com') > -1)) {
								console.log('lien dropbox');
								verif = true;
							}
							if ((next.templateUrl === 'tag.html') || (verif !== true && next.templateUrl !== 'main.html' && next.templateUrl !== 'images.html' && next.templateUrl !== 'apercu.html' && next.templateUrl !== 'passwordRestore.html' && next.templateUrl !== 'detailProfil.html' && next.templateUrl !== 'errorPage.html' && next.templateUrl !== 'needUpdate.html')) {
								$location.path('main.html');
							}
						}

					});
			}

		}



	});


});