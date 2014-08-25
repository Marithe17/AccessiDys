/* File: profiles.js
 *
 * Copyright (c) 2014
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
/*global $:false */
/*jshint loopfunc:true*/

angular.module('cnedApp').controller('ProfilesCtrl', function($scope, $http, $rootScope, configuration, $location, serviceCheck, verifyEmail, $window) {

	/* Initialisations */
	$scope.successMod = 'Profil Modifie avec succes !';
	$scope.successAdd = 'Profil Ajoute avec succes !';
	$scope.successDefault = 'defaultProfileSelection';
	$scope.displayText = '<p>CnedAdapt est une application qui permet d\'adapter les documents.</p>';
	$scope.cancelDefault = 'cancelDefault';
	$scope.flag = false;
	$scope.colorLists = ['Couleur par défaut', 'Colorer les lignes', 'Colorer les mots', 'Surligner les mots', 'Surligner les lignes', 'Colorer les syllabes'];
	$scope.weightLists = ['Gras', 'Normal'];
	$scope.headers = ['Nom', 'Descriptif', 'Action'];
	$scope.profilTag = {};
	$scope.profil = {};
	$scope.listTag = {};
	$scope.editTag = null;
	$scope.colorList = null;
	$scope.tagStyles = [];
	$scope.deletedParams = [];
	$scope.tagProfilInfos = [];
	$scope.variableFlag = false;
	$scope.trashFlag = false;
	$scope.admin = $rootScope.admin;
	$scope.displayDestination = false;
	$scope.testEnv = false;
	$scope.loader = false;
	$scope.loaderMsg = '';

	$('#titreCompte').hide();
	$('#titreProfile').show();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();
	$('#titreTag').hide();

	$scope.policeLists = ['Arial', 'opendyslexicregular', 'Times New Roman'];
	$scope.tailleLists = [{
		number: '8',
		label: 'eight'
	}, {
		number: '10',
		label: 'ten'
	}, {
		number: '12',
		label: 'twelve'
	}, {
		number: '14',
		label: 'fourteen'
	}, {
		number: '16',
		label: 'sixteen'
	}, {
		number: '18',
		label: 'eighteen'
	}, {
		number: '20',
		label: 'tweenty'
	}];

	$scope.interligneLists = [{
		number: '10',
		label: 'ten'
	}, {
		number: '14',
		label: 'fourteen'
	}, {
		number: '18',
		label: 'eighteen'
	}, {
		number: '22',
		label: 'tweentytwo'
	}, {
		number: '26',
		label: 'tweentysix'
	}, {
		number: '30',
		label: 'thirty'
	}, {
		number: '35',
		label: 'thirtyfive'
	}, {
		number: '40',
		label: 'forty'
	}, {
		number: '45',
		label: 'fortyfive'
	}];

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$rootScope.$watch('admin', function() {
		$scope.admin = $rootScope.admin;
		$scope.apply; // jshint ignore:line
	});
	// $scope.currentTagProfil = null;
	$scope.initProfil = function() {
		var tmp = serviceCheck.getData();
		tmp.then(function(result) {
			// this is only run after $http completes
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$scope.utilisateur = result.user;
					$scope.verifProfil();
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					$('#profilePage').show();
					$scope.currentUser();
					$scope.token = {
						id: localStorage.getItem('compteId')
					};
					$scope.afficherProfils();

				}

			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}
		});
	};

	$scope.displayOwner = function(param) {
		if (param.state === 'mine' || ($scope.currentUserData.local.role === 'admin' && $scope.currentUserData._id === param.owner)) {
			return 'Moi-même';
		} else if (param.state === 'favoris') {
			return 'Favoris';
		} else if (param.state === 'delegated') {
			return 'Délégué';
		} else if (param.state === 'default') {
			return 'CnedAdapt';
		}
	};

	$scope.verifProfil = function() {
		if (!localStorage.getItem('listTagsByProfil')) {
			$scope.sentVar = {
				userID: $scope.utilisateur._id,
				actuel: true
			};
			if (!$scope.token && localStorage.getItem('compteId')) {
				$scope.token = {
					id: localStorage.getItem('compteId')
				};
			}
			$scope.token.getActualProfile = $scope.sentVar;
			$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
				.success(function(dataActuel) {
					$scope.chercherProfilActuelFlag = dataActuel;
					$scope.varToSend = {
						profilID: $scope.chercherProfilActuelFlag.profilID
					};
					$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
						idProfil: $scope.chercherProfilActuelFlag.profilID
					}).success(function(data) {
						$scope.chercherTagsParProfilFlag = data;
						localStorage.setItem('listTagsByProfil', JSON.stringify($scope.chercherTagsParProfilFlag));

					});
				});
		}
	};

	//Affichage des differents profils sur la page
	$scope.afficherProfils = function() {
		$http.get(configuration.URL_REQUEST + '/listerProfil', {
			params: $scope.token
		})
			.success(function(data) {
				$scope.listeProfils = data;
			}).error(function() {});
	};

	//gets the user that is connected 
	$scope.currentUser = function() {

		var tmp2 = serviceCheck.getData();
		tmp2.then(function(result) {
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$scope.currentUserData = result.user;
					$scope.afficherProfilsParUser();
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
				}
			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}

		});
	};
	$scope.tests = {};
	//displays user profiles
	$scope.afficherProfilsParUser = function() {
		$scope.loader = true;
		$scope.loaderMsg = 'Affichage de la liste des profils en cours ...';
		$http.get(configuration.URL_REQUEST + '/listeProfils', {
			params: $scope.token
		})
			.success(function(data) {
				if (data) {
					/* Filtre Profiles de l'Admin */
					if ($scope.currentUserData.local.role === 'admin') {
						for (var i = 0; i < data.length; i++) {
							if (data[i].type === 'profile' && data[i].state === 'mine') {
								for (var j = 0; j < data.length; j++) {
									if (data[i]._id === data[j]._id && data[j].state === 'default' && data[j].owner === $scope.currentUserData._id) {
										data[i].stateDefault = true;
										data.splice(j, 2);
									}
								}
							}
						}
					}

					$scope.listTags = JSON.parse(localStorage.getItem('listTags'));
					var tagText = '';

					for (var i = data.length - 1; i >= 0; i--) { // jshint ignore:line
						if (data[i].type === 'tags') {
							var tagShow = [];
							var nivTag = 0;
							var nivTagTmp = 0;
							// Ordere des Tags
							for (var j = 0; j < data[i].tags.length; j++) { // jshint ignore:line
								for (var k = 0; k < $scope.listTags.length; k++) {
									if (data[i].tags[j].tag === $scope.listTags[k]._id) {
										data[i].tags[j].position = $scope.listTags[k].position;
									}
								}
							}
							data[i].tags.sort(function(a, b) {
								return a.position - b.position;
							});

							for (var j = 0; j < data[i].tags.length; j++) { // jshint ignore:line
								nivTagTmp = nivTag;
								for (var k = 0; k < $scope.listTags.length; k++) { // jshint ignore:line
									if (data[i].tags[j].tag === $scope.listTags[k]._id) {
										if ($scope.listTags[k].libelle.toUpperCase().match('^TITRE')) {
											tagText = {
												texte: '<p class="text-center" data-font="' + data[i].tags[j].police + '" data-size="' + data[i].tags[j].taille + '" data-lineheight="' + data[i].tags[j].interligne + '" data-weight="' + data[i].tags[j].interligne + '" data-coloration="' + data[i].tags[j].coloration + '"><span style="color:#000">' + $scope.listTags[k].libelle + '</span> : Ceci est un exemple de' + $scope.listTags[k].libelle + ' </p>'
											};
										} else {
											tagText = {
												texte: '<p class="text-center" data-font="' + data[i].tags[j].police + '" data-size="' + data[i].tags[j].taille + '" data-lineheight="' + data[i].tags[j].interligne + '" data-weight="' + data[i].tags[j].interligne + '" data-coloration="' + data[i].tags[j].coloration + '"><span style="color:#000">' + $scope.listTags[k].libelle + '</span> : CnedAdapt est une application qui permet d\'adapter les documents. </p>'
											};
										}

										if ($scope.listTags[k].niveau && parseInt($scope.listTags[k].niveau) > 0) {
											nivTag = parseInt($scope.listTags[k].niveau);
											nivTagTmp = nivTag;
											nivTag++;
										}

										if (nivTagTmp === 0) {
											tagText.niveau = 0;
										} else {
											tagText.niveau = (nivTagTmp - 1) * 30;
										}

										tagShow.push(tagText);
										break;
									}
								}

							}
							data[i].tagsText = tagShow;

						}
						data[i].showed = true;
					}

					$scope.tests = data;
				}

				$scope.loader = false;
				$scope.loaderMsg = '';

			});

	};


	$scope.isDeletable = function(param) {
		if (param.favourite && param.delete) {
			return true;
		}
		if (param.favourite && !param.delete) {
			return false;
		}
	};

	// Affichage des differents profils sur la page avec effacement des styles
	$scope.afficherProfilsClear = function() {

		// $scope.listeProfils = data;
		$scope.profil = {};
		$scope.tagList = {};
		$scope.policeList = {};
		$scope.tailleList = {};
		$scope.interligneList = {};
		$scope.weightList = {};
		$scope.colorList = {};
		$scope.tagStyles = [];
		$scope.erreurAfficher = false;
		angular.element($('.shown-text-add').text($('.shown-text-add').text()));
		angular.element($('.shown-text-edit').text($('.shown-text-edit').text()));
		angular.element($('.shown-text-add').css('font-family', ''));
		angular.element($('.shown-text-add').css('font-size', ''));
		angular.element($('.shown-text-add').css('line-height', ''));
		angular.element($('.shown-text-add').css('font-weight', ''));
		angular.element($('.shown-text-add').text($scope.editInitText));
		angular.element($('.shown-text-edit').removeAttr('style'));

		//set customSelect jquery plugin span text to empty after cancel
		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tagList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');

		$scope.tagList = null;
		$scope.editTag = null;
		$scope.hideVar = true;
		$scope.tagList = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;
		$scope.affichage = false;
		$('#selectId').prop('disabled', false);
		$scope.currentTagProfil = null;

	};
	// Affiche les widgets en bleu;
	$scope.isTagStylesNotEmpty = function() {
		if ($scope.tagStyles.length >= 0) {
			return true;
		}
	};
	//Ajout d'un profil
	$scope.erreurAfficher = false;
	$scope.errorAffiche = [];

	$scope.ajouterProfil = function() {
		$scope.errorAffiche = [];
		$scope.addFieldError = [];

		if ($scope.profil.nom == null || $scope.profil.descriptif == null) { // jshint ignore:line
			if ($scope.profil.nom == null) { // jshint ignore:line
				$scope.addFieldError.push(' Nom ');
				$scope.affichage = true;
			}
			if ($scope.profil.descriptif == null) { // jshint ignore:line
				$scope.addFieldError.push(' Descriptif ');
				$scope.affichage = true;
			}
		} else {
			$scope.affichage = false;
		}

		if (($scope.profil.nom === null || $scope.profil.descriptif === null) && $scope.addFieldError.state) {
			$scope.erreurAfficher = true;
			$scope.errorAffiche.push(' profilInfos ');
		}

		if ($scope.tagStyles.length == 0) { // jshint ignore:line
			$scope.errorAffiche.push(' Règle ');
			$scope.erreurAfficher = true;
		}

		if ($scope.profil.nom !== null && $scope.profil.descriptif !== null && $scope.addFieldError.state) {
			$scope.errorAffiche = [];
		}

		if ($scope.tagStyles.length > 0 && $scope.errorAffiche.length == 0) { // jshint ignore:line
			$scope.loader = true;
			$scope.loaderMsg = 'Enregistrement du profil en cours ...';
			$('.addProfile').attr('data-dismiss', 'modal');
			$scope.profil.photo = './files/profilImage/profilImage.jpg';
			$scope.profil.owner = $scope.currentUserData._id;
			$scope.token.newProfile = $scope.profil;
			$http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.token)
				.success(function(data) {
					$scope.profilFlag = data; /*unit tests*/
					$rootScope.updateListProfile = !$rootScope.updateListProfile;
					$scope.lastDocId = data._id;
					$scope.ajouterProfilTag($scope.lastDocId);
					$scope.profil = {};
					$scope.tagStyles.length = 0;
					$scope.tagStyles = [];
					$scope.colorList = {};
					$scope.errorAffiche = [];
					$scope.addFieldError = [];
					angular.element($('.shown-text-add').text($('.shown-text-add').text()));
					angular.element($('.shown-text-add').css('font-family', ''));
					angular.element($('.shown-text-add').css('font-size', ''));
					angular.element($('.shown-text-add').css('line-height', ''));
					angular.element($('.shown-text-add').css('font-weight', ''));
					$('#addPanel').fadeIn('fast').delay(5000).fadeOut('fast');
					$scope.tagList = null;
					$scope.policeList = null;
					$scope.tailleList = null;
					$scope.interligneList = null;
					$scope.weightList = null;
					$scope.colorList = null;
					$('.addProfile').removeAttr('data-dismiss');
					$scope.affichage = false;
					$scope.erreurAfficher = false;
				});
		}
	};

	//Modification du profil
	$scope.modifierProfil = function() {
		$scope.addFieldError = [];
		$scope.errorAffiche = [];

		if ($scope.profMod.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profMod.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.tagStyles.length == 0) { // jshint ignore:line
			$scope.errorAffiche.push(' Règle ');
			$scope.erreurAfficher = true;
		}
		if ($scope.addFieldError.length == 0 && $scope.tagStyles.length > 0) { // jshint ignore:line
			$scope.loader = true;
			$scope.loaderMsg = 'Modification du profil en cours ...';
			$('.editionProfil').attr('data-dismiss', 'modal');
			if (!$scope.token || !$scope.token.id) {
				$scope.token = {
					id: localStorage.getItem('compteId')
				};
			}
			$scope.token.updateProfile = $scope.profMod;
			$http.post(configuration.URL_REQUEST + '/updateProfil', $scope.token)
				.success(function(data) {
					$scope.profilFlag = data; /*unit tests*/
					if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
						$scope.detailProfil.nom = $scope.profMod.nom;
						$scope.detailProfil.descriptif = $scope.profMod.descriptif;
					}
					$scope.editionAddProfilTag();
					$('.editionProfil').removeAttr('data-dismiss');
					$scope.affichage = false;
					$scope.tagStyles = [];
					$rootScope.updateListProfile = !$rootScope.updateListProfile;
					if ($scope.oldProfilNom === $('#headerSelect + .customSelect .customSelectInner').text()) {
						$('#headerSelect + .customSelect .customSelectInner').text($scope.profMod.nom);
					}
					$rootScope.actu = data;
					$rootScope.apply; // jshint ignore:line

					$scope.loader = false;
					$scope.loaderMsg = '';
				});
		}
	};

	//Suppression du profil
	$scope.supprimerProfil = function() {
		$scope.loader = true;
		$scope.loaderMsg = 'Suppression du profil en cours ...';
		$scope.removeVar = {
			profilID: $scope.sup._id,
			userID: $scope.currentUserData._id
		};
		$scope.token.removeProfile = $scope.removeVar;
		$http.post(configuration.URL_REQUEST + '/deleteProfil', $scope.token)
			.success(function(data) {
				$scope.profilFlag = data; /* unit tests */
				$scope.loader = false;
				$scope.loaderMsg = '';

				$scope.tagStyles.length = 0;
				$scope.tagStyles = [];
				$scope.removeUserProfileFlag = data; /* unit tests */
				if ($scope.sup.nom === $('#headerSelect + .customSelect .customSelectInner').text()) {
					$scope.token.defaultProfile = $scope.removeVar;
					$http.post(configuration.URL_REQUEST + '/setProfilParDefautActuel', $scope.token)
						.success(function() {
							localStorage.removeItem('profilActuel');
							localStorage.removeItem('listTags');
							localStorage.removeItem('listTagsByProfil');
							$window.location.reload();
						});
				} else {
					$rootScope.updateListProfile = !$rootScope.updateListProfile;
					$scope.afficherProfilsParUser();
				}
			});
	};

	//Premodification du profil
	$scope.preModifierProfil = function(profil) {
		if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
			$scope.profMod = {};
			$scope.profMod._id = profil._id;
			$scope.profMod.nom = profil.nom;
			$scope.profMod.descriptif = profil.descriptif;
			$scope.profMod.owner = profil.owner;
			$scope.profMod.photo = profil.photo;
			if (profil.preDelegated) {
				$scope.profMod.preDelegated = profil.preDelegated;
			}
			if (profil.delegated) {
				$scope.profMod.delegated = profil.delegated;
			}
		} else {
			$scope.profMod = profil;
		}
		$scope.oldProfilNom = $scope.profMod.nom;
		$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
			idProfil: $scope.profMod._id
		})
			.success(function(data) {
				$scope.tagStylesFlag = data; /* Unit tests*/
				$scope.tagStyles = data;
				$scope.afficherTags();
			});
	};

	//Presuppression du profil
	$scope.preSupprimerProfil = function(profil) {
		$scope.sup = profil;
	};

	//Affichage des tags
	$scope.afficherTags = function() {

		if (localStorage.getItem('listTags')) {
			$scope.listTags = JSON.parse(localStorage.getItem('listTags'));
			// Set disabled tags
			for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
				for (var j = $scope.listTags.length - 1; j >= 0; j--) {
					if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
						$scope.listTags[j].disabled = true;
						$scope.tagStyles[i].tagLibelle = $scope.listTags[j].libelle;
					}
				}
			}
		} else {
			$http.get(configuration.URL_REQUEST + '/readTags', {
				params: $scope.requestToSend
			})
				.success(function(data) {
					$scope.listTags = data;
					// Set disabled tags
					for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
						for (var j = $scope.listTags.length - 1; j >= 0; j--) {
							if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
								$scope.listTags[j].disabled = true;
								$scope.tagStyles[i].tagLibelle = $scope.listTags[j].libelle;
							}
						}
					}

				});
		}

	};

	$scope.preAddProfil = function() {
		$scope.tagStyles = [];
		$scope.afficherTags();
		$scope.affichage = false;
	};

	//Ajout du profil-Tag
	$scope.ajouterProfilTag = function(lastDocId) {

		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		}
		$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
			id: $scope.token.id,
			profilID: lastDocId,
			profilTags: JSON.stringify($scope.tagStyles)
		})
			.success(function(data) {
				$scope.profilTagFlag = data; /* unit tests */
				$scope.loader = false;
				$scope.loaderMsg = '';

				$scope.afficherProfilsParUser();
				$scope.profilTag = {};
				$scope.tagStyles.length = 0;
				$scope.tagStyles = [];

				$scope.tagList = {};
				$scope.policeList = {};
				$scope.tailleList = {};
				$scope.interligneList = {};
				$scope.weightList = {};
			});
	};

	/* Mettre à jour la liste des TagsParProfil */
	$scope.updateProfilActual = function(nbreTag, tagProfil) {
		var profilActual = JSON.parse(localStorage.getItem('profilActuel'));

		/* Mettre à jour l'apercu de la liste des profils */
		if (nbreTag === tagProfil) {
			if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
				$scope.initDetailProfil();
			} else {
				$scope.afficherProfilsParUser();
			}
		}
		if (profilActual && $scope.profMod._id === profilActual._id && nbreTag === tagProfil) {
			nbreTag = 0;
			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.profilFlag._id
			}).success(function(data) {
				localStorage.setItem('listTagsByProfil', JSON.stringify(data));
			});
		}
	};

	//enregistrement du profil-tag lors de l'edition
	$scope.editionAddProfilTag = function() {

		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		}

		$scope.nbreTags = 0;
		for (var i = 0; i < $scope.tagStyles.length; i++) {
			if ($scope.tagStyles[i].state) {
				$scope.nbreTags++;
			}
		}
		if ($scope.noStateVariableFlag) {
			$scope.nbreTags += $scope.tagProfilInfos.length;
		}
		if ($scope.trashFlag) {
			$scope.nbreTags += $scope.deletedParams.length;
		}

		$scope.nbreTagCount = 0;
		var tagsToAdd = [];
		$scope.tagStyles.forEach(function(item) {
			if (item.state) {
				var profilTag = {
					id_tag: item.tag,
					style: item.texte,
					police: item.police,
					taille: item.taille,
					interligne: item.interligne,
					styleValue: item.styleValue,
					coloration: item.coloration
				};
				tagsToAdd.push(profilTag);
			}
		});

		if (tagsToAdd.length > 0) {
			$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
				id: $scope.token.id,
				profilID: $scope.profMod._id,
				profilTags: JSON.stringify(tagsToAdd)
			})
				.success(function(data) {
					if (data !== 'err') {
						$scope.editionFlag = data; /* unit tests */
						if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
							$scope.initDetailProfil();
						} else {
							$scope.afficherProfilsParUser();
						}
						$scope.tagStyles.length = 0;
						$scope.tagStyles = [];
						$scope.tagList = {};
						$scope.policeList = null;
						$scope.tailleList = null;
						$scope.interligneList = null;
						$scope.weightList = null;
						$scope.listeProfils = {};
						$scope.editTag = null;
						$scope.colorList = null;
						angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
						angular.element($('.shown-text-edit').css('font-family', ''));
						angular.element($('.shown-text-edit').css('font-size', ''));
						angular.element($('.shown-text-edit').css('line-height', ''));
						angular.element($('.shown-text-edit').css('font-weight', ''));
						/* Mettre à jour la liste des TagsParProfil */
						$scope.nbreTagCount++;
						$scope.updateProfilActual($scope.nbreTagCount, $scope.nbreTags);
					}
				});
		}

		if ($scope.noStateVariableFlag) {
			$http.post(configuration.URL_REQUEST + '/modifierProfilTag', {
				id: $scope.token.id,
				tagsToEdit: JSON.stringify($scope.tagProfilInfos)
			})
				.success(function(data) {
					$scope.modProfilFlag = data; /*unit tests*/
					if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
						$scope.initDetailProfil();
					} else {
						$scope.afficherProfilsParUser();
					}
					angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
					angular.element($('.shown-text-edit').removeAttr('style'));
					$scope.noStateVariableFlag = false;
					/* Mettre à jour la liste des TagsParProfil */
					$scope.nbreTagCount++;
					$scope.updateProfilActual($scope.nbreTagCount, $scope.nbreTags);
				});
		}

		if ($scope.trashFlag) {
			$http.post(configuration.URL_REQUEST + '/supprimerProfilTag', {
				id: $scope.token.id,
				tagsToDelete: JSON.stringify($scope.deletedParams)
			})
				.success(function(data) {
					if (data !== 'err') {
						$scope.editionSupprimerTagFlag = data; /* Unit test */
						if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
							$scope.initDetailProfil();
						} else {
							$scope.afficherProfilsParUser();
						}
						$scope.trashFlag = false;
						$scope.currentTagProfil = null;
						$scope.deletedParams = [];
						/* Mettre à jour la liste des TagsParProfil */
						$scope.nbreTagCount++;
						$scope.updateProfilActual($scope.nbreTagCount, $scope.nbreTags);
					}
				});
		}

		$('#editPanel').fadeIn('fast').delay(1000).fadeOut('fast');
		angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
		angular.element($('.shown-text-edit').removeAttr('style'));

	};

	//Griser select après validation
	$scope.affectDisabled = function(param) {
		if (param) {
			return true;
		} else {
			return false;
		}
	};

	//verification des champs avant validation lors de l'ajout
	$scope.beforeValidationAdd = function() {
		$scope.addFieldError = [];
		$scope.affichage = false;

		if ($scope.profil.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profil.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.tagList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Règle ');
			$scope.affichage = true;
		}
		if ($scope.policeList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Police ');
			$scope.affichage = true;
		}
		if ($scope.tailleList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Taille ');
			$scope.affichage = true;
		}
		if ($scope.interligneList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Interligne ');
			$scope.affichage = true;
		}
		if ($scope.colorList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Coloration ');
			$scope.affichage = true;
		}
		if ($scope.weightList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Style ');
			$scope.affichage = true;
		}
		if ($scope.addFieldError.length === 0) {
			$scope.validerStyleTag();
			$scope.addFieldError.state = true;
			$scope.affichage = false;
			$scope.erreurAfficher = false;
			$scope.errorAffiche = [];
			$scope.colorationCount = 0;
			$scope.oldColoration = null;
		}
	};
	$scope.addFieldError = [];

	//verification des champs avant validation lors de la modification
	$scope.beforeValidationModif = function() {
		$scope.affichage = false;
		$scope.addFieldError = [];

		if ($scope.profMod.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profMod.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.editTag == null) { // jshint ignore:line
			$scope.addFieldError.push(' Règle ');
			$scope.affichage = true;
		}
		if ($scope.policeList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Police ');
			$scope.affichage = true;
		}
		if ($scope.tailleList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Taille ');
			$scope.affichage = true;
		}
		if ($scope.interligneList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Interligne ');
			$scope.affichage = true;
		}
		if ($scope.colorList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Coloration ');
			$scope.affichage = true;
		}
		if ($scope.weightList == null) { // jshint ignore:line
			$scope.addFieldError.push(' Style ');
			$scope.affichage = true;
		}
		if ($scope.addFieldError.length === 0) {
			$scope.editerStyleTag();
			$scope.affichage = false;
		}
	};

	//Valider
	$scope.validerStyleTag = function() {
		$scope.currentTag = JSON.parse($scope.tagList);
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if ($scope.listTags[i]._id === $scope.currentTag._id) {
				$scope.tagID = $scope.listTags[i]._id;
				$scope.listTags[i].disabled = true;
				break;
			}
		}

		var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';

		$scope.tagStyles.push({
			id_tag: $scope.currentTag._id,
			style: mytext,
			label: $scope.currentTag.libelle,
			police: $scope.policeList,
			taille: $scope.tailleList,
			interligne: $scope.interligneList,
			styleValue: $scope.weightList,
			coloration: $scope.colorList,

		});

		angular.element($('#style-affected-add').removeAttr('style'));
		$scope.editStyleChange('initialiseColoration', null);
		$('.shown-text-add').removeAttr('style');
		$('.shown-text-add').text('CnedAdapt est une application qui permet d\'adapter les documents.');

		$scope.colorationCount = 0;
		$scope.tagList = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;
		$('#addProfile .customSelectInner').text('');
	};

	$scope.checkStyleTag = function() {
		if ($scope.tagStyles.length > 0) {
			return false;
		}
		if ($scope.tagStyles.length === 0 && $scope.trashFlag) {
			return false;
		}
		return true;
	};

	//Edition StyleTag
	$scope.editerStyleTag = function() {
		if (!$scope.currentTagProfil) {
			/* Aucun tag n'est sélectionné */
			$scope.currentTagEdit = JSON.parse($scope.editTag);
			for (var i = $scope.listTags.length - 1; i >= 0; i--) {
				if ($scope.listTags[i]._id === $scope.currentTagEdit._id) {
					$scope.listTags[i].disabled = true;
					break;
				}
			}

			var textEntre = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';

			/* Liste nouveaux Tags */
			$scope.tagStyles.push({
				tag: $scope.currentTagEdit._id,
				tagLibelle: $scope.currentTagEdit.libelle,
				profil: $scope.lastDocId,
				police: $scope.policeList,
				taille: $scope.tailleList,
				interligne: $scope.interligneList,
				styleValue: $scope.weightList,
				coloration: $scope.colorList,
				texte: textEntre,
				state: true
			});

			angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
			angular.element($('#style-affected-edit').removeAttr('style'));

		} else {
			/* Tag sélectionné */
			if (!$scope.currentTagProfil.state) {
				var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + $scope.tailleList + '" data-lineheight="' + $scope.interligneList + '" data-weight="' + $scope.weightList + '" data-coloration="' + $scope.colorList + '"> </p>';

				/* Liste tags modifiés */
				$scope.tagProfilInfos.push({
					id: $scope.currentTagProfil._id,
					texte: mytext,
					police: $scope.policeList,
					taille: $scope.tailleList,
					interligne: $scope.interligneList,
					styleValue: $scope.weightList,
					coloration: $scope.colorList
				});

				$scope.currentTagProfil = null;
				$scope.noStateVariableFlag = true;

			}
		}

		$('#selectId option').eq(0).prop('selected', true);
		$('#selectId').prop('disabled', false);
		$scope.hideVar = true;
		$scope.editTag = null;
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.weightList = null;
		$scope.colorList = null;
		$scope.colorationCount = 0;
		$scope.oldColoration = null;
		$scope.editStyleChange('initialiseColoration', null);

		//set customSelect jquery plugin span text to empty string
		$('.shown-text-edit').removeAttr('style');
		$('.shown-text-edit').text('CnedAdapt est une application qui permet d\'adapter les documents.');
		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');
	};

	//Suppression d'un paramètre
	$scope.ajoutSupprimerTag = function(parameter) {
		var index = $scope.tagStyles.indexOf(parameter);
		if (index > -1) {
			$scope.tagStyles.splice(index, 1);
		}
		for (var j = $scope.listTags.length - 1; j >= 0; j--) {
			if ($scope.listTags[j]._id === parameter.id_tag) {
				$scope.listTags[j].disabled = false;
			}
		}
	};

	//Supression d'un tag lors de l'edition 
	$scope.editionSupprimerTag = function(parameter) {

		if (parameter.state) {
			var index = $scope.tagStyles.indexOf(parameter);
			if (index > -1) {
				$scope.tagStyles.splice(index, 1);
			}
			for (var k = $scope.listTags.length - 1; k >= 0; k--) {
				if (parameter.tag === $scope.listTags[k]._id) {
					$scope.listTags[k].disabled = false;
				}
			}
			$scope.currentTagProfil = null;
			$scope.policeList = null;
			$scope.tailleList = null;
			$scope.interligneList = null;
			$scope.colorList = null;
			$scope.weightList = null;

		} else {
			for (var i = $scope.listTags.length - 1; i >= 0; i--) {
				if (parameter.tag === $scope.listTags[i]._id) {
					$scope.listTags[i].disabled = false;
				}
			}
			var index2 = $scope.tagStyles.indexOf(parameter);
			if (index2 > -1) {
				$scope.tagStyles.splice(index2, 1);
			}
			$scope.deletedParams.push({
				param: parameter

			});
			$scope.trashFlag = true;
			$scope.currentTagProfil = null;
			$scope.hideVar = true;
		}

		angular.element($('#style-affected-edit').text($('.shown-text-add').text()));
		angular.element($('#style-affected-edit').removeAttr('style'));

		$('select[ng-model="editTag"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="policeList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="weightList"] + .customSelect .customSelectInner').text('');
		$('select[ng-model="colorList"] + .customSelect .customSelectInner').text('');

		$('#selectId option').eq(0).prop('selected', true);
		$scope.policeList = null;
		$scope.tailleList = null;
		$scope.interligneList = null;
		$scope.colorList = null;
		$scope.weightList = null;
		$('#selectId').removeAttr('disabled');
	};

	$scope.hideVar = true;
	//Modification d'un tag lors de l'edition 
	$scope.label_action = 'label_action';

	$scope.editionModifierTag = function(parameter) {
		$scope.hideVar = false;
		$('.label_action').removeClass('selected_label');
		$('#' + parameter._id).addClass('selected_label');
		$scope.currentTagProfil = parameter;
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if (parameter.tag === $scope.listTags[i]._id) {

				$scope.listTags[i].disabled = true;
				angular.element($('#selectId option').each(function() {
					var itemText = $(this).text();
					if (itemText === parameter.tagLibelle) {
						$(this).prop('selected', true);
						$('#selectId').prop('disabled', 'disabled');
						$('#editValidationButton').prop('disabled', false);
					}
				}));
				$('#editValidationButton').prop('disabled', false);
				$scope.editTag = parameter.tagLibelle;
				$scope.policeList = parameter.police;
				$scope.tailleList = parameter.taille;
				$scope.interligneList = parameter.interligne;
				$scope.weightList = parameter.styleValue;
				$scope.colorList = parameter.coloration;

				$scope.editStyleChange('police', $scope.policeList);
				$scope.editStyleChange('taille', $scope.tailleList);
				$scope.editStyleChange('interligne', $scope.interligneList);
				$scope.editStyleChange('style', $scope.weightList);
				$scope.editStyleChange('coloration', $scope.colorList);

				//set span text value of customselect
				$('select[ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagLibelle);
				$('select[ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
				$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
				$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
				$('select[ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
				$('select[ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);
			}
		}
	};

	$scope.reglesStyleChange = function(operation, value) {
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-add',
			'value': value
		});
	};

	$scope.editStyleChange = function(operation, value) {
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-edit',
			'value': value
		});
	};

	$scope.editHyphen = function() {
		angular.element($('.shown-text-edit').addClass('hyphenate'));
		$('#selectId').removeAttr('disabled');
		angular.element($('.shown-text-edit').removeAttr('style'));
	};

	$scope.mettreParDefaut = function(param) {
		$scope.defaultVar = {
			userID: param.owner,
			profilID: param._id,
			defaultVar: true
		};
		param.defautMark = true;
		param.defaut = true;
		$scope.token.addedDefaultProfile = $scope.defaultVar;
		$http.post(configuration.URL_REQUEST + '/setDefaultProfile', $scope.token)
			.success(function(data) {
				$scope.defaultVarFlag = data;
				$('#defaultProfile').fadeIn('fast').delay(5000).fadeOut('fast');
				$('.action_btn').attr('data-shown', 'false');
				$('.action_list').attr('style', 'display:none');
				if ($scope.testEnv === false) {
					$scope.afficherProfilsParUser();
				}
			});
	};

	$scope.retirerParDefaut = function(param) {
		$scope.defaultVar = {
			userID: param.owner,
			profilID: param._id,
			defaultVar: false
		};

		if ($scope.token && $scope.token.id) {
			$scope.token.cancelFavs = $scope.defaultVar;
		} else {
			$scope.token.id = localStorage.getItem('compteId');
			$scope.token.cancelFavs = $scope.defaultVar;
		}

		$http.post(configuration.URL_REQUEST + '/cancelDefaultProfile', $scope.token)
			.success(function(data) {
				$scope.cancelDefaultProfileFlag = data;
				$('#defaultProfileCancel').fadeIn('fast').delay(5000).fadeOut('fast');
				$('.action_btn').attr('data-shown', 'false');
				$('.action_list').attr('style', 'display:none');
				if ($scope.testEnv === false) {
					$scope.afficherProfilsParUser();
				}
			});
	};

	$scope.isDefault = function(param) {
		if (param && param.stateDefault) {
			return true;
		}
		return false;
	};

	$scope.isDelegated = function(param) {
		if (param && param.state === 'delegated') {
			return true;
		}
		return false;
	};

	$scope.isFavourite = function(param) {
		if (param && (param.state === 'favoris' || param.state === 'default')) {
			return true;
		}
		return false;
	};

	$scope.isProfil = function(param) {
		if (param && param.showed) {
			if (param.type === 'profile') {
				return true;
			}
		}
		return false;
	};

	$scope.isOwnerDelagate = function(param) {
		if (param && param.delegated && param.owner === $scope.currentUserData._id) {
			return true;
		}
		return false;
	};

	$scope.isAnnuleDelagate = function(param) {
		if (param && param.preDelegated && param.owner === $scope.currentUserData._id) {
			return true;
		}
		return false;
	};

	$scope.isDelegatedOption = function(param) {
		if (param && !param.delegated && !param.preDelegated && param.owner === $scope.currentUserData._id) {
			return true;
		}
		return false;
	};

	$scope.isDeletableIHM = function(param) {
		if (param.owner === $scope.currentUserData._id) {
			return true;
		}
		return false;
	};

	$scope.toViewProfil = function(param) {
		$location.search('idProfil', param._id).path('/detailProfil').$$absUrl; // jshint ignore:line
	};

	$scope.preRemoveFavourite = function(param) {
		$scope.profilId = param._id;
	};

	$scope.removeFavourite = function() {
		$scope.sendVar = {
			profilID: $scope.profilId,
			userID: $rootScope.currentUser._id,
			favoris: true
		};

		if ($scope.token && $scope.token.id) {
			$scope.token.favProfile = $scope.sendVar;
		} else {
			$scope.token.id = localStorage.getItem('compteId');
			$scope.token.favProfile = $scope.sendVar;
		}
		$http.post(configuration.URL_REQUEST + '/removeUserProfileFavoris', $scope.token)
			.success(function(data) {
				$scope.removeUserProfileFavorisFlag = data;
				localStorage.removeItem('profilActuel');
				localStorage.removeItem('listTagsByProfil');
				$rootScope.$broadcast('initProfil');
				if ($scope.testEnv === false) {
					$scope.afficherProfilsParUser();
				}

			});

	};

	/* envoi de l'email lors de la dupliquation */
	$scope.sendEmailDuplique = function() {
		$http.post(configuration.URL_REQUEST + '/findUserById', {
			idUser: $scope.oldProfil.owner
		}).success(function(data) {
			$scope.findUserByIdFlag = data;
			if (data) {
				var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
				$scope.sendVar = {
					emailTo: data.local.email,
					content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour dupliquer votre profil : ' + $scope.oldProfil.nom + '. </span>',
					subject: fullName + ' a dupliqué votre profil'
				};
				$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
					.success(function() {});
			}
		});
	};

	//preDupliquer le profil favori
	$scope.preDupliquerProfilFavorit = function(profil) {
		if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
			$scope.profMod = {};
			$scope.profMod._id = profil._id;
			$scope.profMod.nom = profil.nom;
			$scope.profMod.descriptif = profil.descriptif;
			$scope.profMod.owner = profil.owner;
			$scope.profMod.photo = profil.photo;
		} else {
			$scope.profMod = profil;
		}

		$scope.oldProfil = {
			nom: $scope.profMod.nom,
			owner: $scope.profMod.owner
		};

		$scope.profMod.nom = $scope.profMod.nom + ' Copie';
		$scope.profMod.descriptif = $scope.profMod.descriptif + ' Copie';
		$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
			idProfil: profil._id
		})
			.success(function(data) {
				$scope.tagStylesFlag = data; /* Unit tests*/
				$scope.tagStyles = data;

				$scope.tagStyles.forEach(function(item) {
					item.state = true;
				});
				$scope.afficherTags();
			});
	};

	//OnchangeStyle du profil
	$scope.dupliqueStyleChange = function(operation, value) {
		$rootScope.$emit('reglesStyleChange', {
			'operation': operation,
			'element': 'shown-text-duplique',
			'value': value
		});
	};

	//Dupliquer les tags du profil
	$scope.dupliqueProfilTag = function() {
		if (!$scope.token || !$scope.token.id) {
			$scope.token = {
				id: localStorage.getItem('compteId')
			};
		}

		var tagsToDupl = [];
		$scope.tagStyles.forEach(function(item) {
			if (item.state) {
				var profilTag = {
					id_tag: item.tag,
					style: item.texte,
					police: item.police,
					taille: item.taille,
					interligne: item.interligne,
					styleValue: item.styleValue,
					coloration: item.coloration
				};
				tagsToDupl.push(profilTag);
			}
		});

		if (tagsToDupl.length > 0) {
			$http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
				id: $scope.token.id,
				profilID: $scope.profMod._id,
				profilTags: JSON.stringify(tagsToDupl)
			})
				.success(function(data) {
					$scope.editionFlag = data; /* unit tests*/
					$scope.loader = false;
					$scope.loaderMsg = '';

					if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
						$scope.initDetailProfil();
					} else {
						$scope.afficherProfilsParUser();
					}
					$scope.tagStyles.length = 0;
					$scope.tagStyles = [];
					$scope.tagList = {};
					$scope.policeList = null;
					$scope.tailleList = null;
					$scope.interligneList = null;
					$scope.weightList = null;
					$scope.listeProfils = {};
					$scope.editTag = null;
					$scope.colorList = null;
					angular.element($('.shown-text-edit').text($('.shown-text-add').text()));
					angular.element($('.shown-text-edit').css('font-family', ''));
					angular.element($('.shown-text-edit').css('font-size', ''));
					angular.element($('.shown-text-edit').css('line-height', ''));
					angular.element($('.shown-text-edit').css('font-weight', ''));
				});
		}
	};

	//Dupliquer le profil
	$scope.dupliquerFavoritProfil = function() {
		$scope.addFieldError = [];
		if ($scope.profMod.nom == null) { // jshint ignore:line
			$scope.addFieldError.push(' Nom ');
			$scope.affichage = true;
		}
		if ($scope.profMod.descriptif == null) { // jshint ignore:line
			$scope.addFieldError.push(' Descriptif ');
			$scope.affichage = true;
		}
		if ($scope.addFieldError.length === 0) { // jshint ignore:line
			$scope.loader = true;
			$scope.loaderMsg = 'Duplication du profil en cours ...';
			$('.dupliqueProfil').attr('data-dismiss', 'modal');
			var newProfile = {};
			newProfile.photo = './files/profilImage/profilImage.jpg';
			newProfile.owner = $rootScope.currentUser._id; //$scope.currentUserData._id;
			newProfile.nom = $scope.profMod.nom;
			newProfile.descriptif = $scope.profMod.descriptif;
			if (!$scope.token || !$scope.token.id) {
				$scope.token = {
					id: localStorage.getItem('compteId')
				};
			}
			$scope.token.newProfile = newProfile;
			$http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.token)
				.success(function(data) {
					$scope.sendEmailDuplique();
					$scope.profilFlag = data; /*unit tests*/
					$scope.profMod._id = $scope.profilFlag._id;
					$rootScope.updateListProfile = !$rootScope.updateListProfile;
					$scope.dupliqueProfilTag();
					$('.dupliqueProfil').removeAttr('data-dismiss');
					$scope.affichage = false;
					$scope.tagStyles = [];
				});
		}
	};

	$scope.dupliqueModifierTag = function(parameter) {
		$scope.hideVar = false;
		$('.label_action').removeClass('selected_label');
		$('#' + parameter._id).addClass('selected_label');
		$scope.currentTagProfil = parameter;
		for (var i = $scope.listTags.length - 1; i >= 0; i--) {
			if (parameter.tag === $scope.listTags[i]._id) {
				$scope.listTags[i].disabled = true;
				angular.element($('#selectId option').each(function() {
					var itemText = $(this).text();
					if (itemText === parameter.tagLibelle) {
						$(this).prop('selected', true);
						$('#selectId').prop('disabled', 'disabled');
						$('#dupliqueValidationButton').prop('disabled', false);
					}
				}));
				$('#dupliqueValidationButton').prop('disabled', false);
				$scope.editTag = parameter.tagLibelle;
				$scope.policeList = parameter.police;
				$scope.tailleList = parameter.taille;
				$scope.interligneList = parameter.interligne;
				$scope.weightList = parameter.styleValue;
				$scope.colorList = parameter.coloration;

				$scope.dupliqueStyleChange('police', $scope.policeList);
				$scope.dupliqueStyleChange('taille', $scope.tailleList);
				$scope.dupliqueStyleChange('interligne', $scope.interligneList);
				$scope.dupliqueStyleChange('style', $scope.weightList);
				$scope.dupliqueStyleChange('coloration', $scope.colorList);

				//set span text value of customselect
				$('select[ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagLibelle);
				$('select[ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
				$('select[ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
				$('select[ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
				$('select[ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
				$('select[ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);
			}
		}
	};

	$scope.preDeleguerProfil = function(profil) {
		$scope.profDelegue = profil;
		$scope.errorMsg = '';
		$scope.successMsg = '';
		$scope.delegateEmail = '';
	};

	$scope.deleguerProfil = function() {
		$scope.errorMsg = '';
		$scope.successMsg = '';
		if (!$scope.delegateEmail || $scope.delegateEmail.length <= 0) {
			$scope.errorMsg = 'L\'email est obligatoire !';
			return;
		}
		if (!verifyEmail($scope.delegateEmail)) {
			$scope.errorMsg = 'L\'email est invalide !';
			return;
		}
		$http.post(configuration.URL_REQUEST + '/findUserByEmail', {
			email: $scope.delegateEmail
		})
			.success(function(data) {
				if (data) {
					$scope.findUserByEmailFlag = data;
					var emailTo = data.local.email;

					if (emailTo === $rootScope.currentUser.local.email) {
						$scope.errorMsg = 'Vous ne pouvez pas déléguer votre profil à vous même !';
						return;
					}

					$('#delegateModal').modal('hide');

					var sendParam = {
						idProfil: $scope.profDelegue._id,
						idDelegue: data._id
					};
					$http.post(configuration.URL_REQUEST + '/delegateProfil', sendParam)
						.success(function() {
							var profilLink = $location.absUrl();
							profilLink = profilLink.replace('#/profiles', '#/detailProfil?idProfil=' + $scope.profDelegue._id);
							var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
							$scope.sendVar = {
								emailTo: emailTo,
								content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour vous déléguer son profil : <a href=' + profilLink + '>' + $scope.profDelegue.nom + '</a>. </span>',
								subject: 'Profil délégué'
							};
							$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
								.success(function() {
									$('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
									$scope.msgSuccess = 'La demande est envoyée avec succés.';
									$scope.errorMsg = '';
									$scope.delegateEmail = '';
									$scope.afficherProfilsParUser();
								}).error(function() {
									$('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
									$scope.msgError = 'Erreur lors de l\'envoi de la demande.';
								});
						});
				} else {
					$scope.errorMsg = 'L\'email est introuvable !';
				}
			});
	};

	$scope.preRetirerDeleguerProfil = function(profil) {
		$scope.profRetirDelegue = profil;
	};

	$scope.retireDeleguerProfil = function() {
		var sendParam = {
			id: $rootScope.currentUser.local.token,
			sendedVars: {
				idProfil: $scope.profRetirDelegue._id,
				idUser: $rootScope.currentUser._id
			}
		};
		$http.post(configuration.URL_REQUEST + '/retirerDelegateUserProfil', sendParam)
			.success(function(data) {
				if (data) {
					$scope.retirerDelegateUserProfilFlag = data;
					$http.post(configuration.URL_REQUEST + '/findUserById', {
						idUser: data.delegatedID
					})
						.success(function(data) {
							if (data) {
								$scope.findUserByIdFlag2 = data;
								var emailTo = data.local.email;
								var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
								$scope.sendVar = {
									emailTo: emailTo,
									content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + $scope.profRetirDelegue.nom + '. </span>',
									subject: 'Retirer la délégation'
								};
								$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
									.success(function() {
										$('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
										$scope.msgSuccess = 'La demande est envoyée avec succés.';
										$scope.errorMsg = '';
										$scope.afficherProfilsParUser();
									}).error(function() {
										$('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
										$scope.msgError = 'Erreur lors de l\'envoi de la demande.';
									});
							}
						});
				}
			});
	};

	$scope.preAnnulerDeleguerProfil = function(profil) {
		$scope.profAnnuleDelegue = profil;
	};

	$scope.annuleDeleguerProfil = function() {
		var sendParam = {
			id: $rootScope.currentUser.local.token,
			sendedVars: {
				idProfil: $scope.profAnnuleDelegue._id,
				idUser: $rootScope.currentUser._id
			}
		};
		$http.post(configuration.URL_REQUEST + '/annulerDelegateUserProfil', sendParam)
			.success(function(data) {
				if (data) {
					$scope.annulerDelegateUserProfilFlag = data;
					$http.post(configuration.URL_REQUEST + '/findUserById', {
						idUser: $scope.profAnnuleDelegue.preDelegated
					})
						.success(function(data) {
							if (data) {
								$scope.findUserByIdFlag2 = data;
								var emailTo = data.local.email;
								var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
								$scope.sendVar = {
									emailTo: emailTo,
									content: '<span> ' + fullName + ' vient d\'annuler la demande de délégation de son profil : ' + $scope.profAnnuleDelegue.nom + '. </span>',
									subject: 'Annuler la délégation'
								};
								$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
									.success(function() {
										$('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
										$scope.msgSuccess = 'La demande est envoyée avec succés.';
										$scope.errorMsg = '';
										$scope.afficherProfilsParUser();
									}).error(function() {
										$('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
										$scope.msgError = 'Erreur lors de l\'envoi de la demande.';
									});
							}
						});
				}
			});
	};


	$scope.profilApartager = function(param) {
		$('#shareModal').show();
		$scope.profilPartage = param;
		$scope.currentUrl = $location.absUrl();
		$scope.socialShare();
	};

	/*load email form*/
	$scope.loadMail = function() {
		$scope.displayDestination = true;
	};

	$scope.clearSocialShare = function() {
		$scope.displayDestination = false;
		$scope.destinataire = '';
	};

	$scope.socialShare = function() {
		$scope.destination = $scope.destinataire;
		$scope.encodeURI = encodeURIComponent($location.absUrl());
		$scope.currentUrl = $location.absUrl();
		if ($scope.currentUrl.lastIndexOf('detailProfil') > -1) {
			$scope.envoiUrl = encodeURIComponent($scope.currentUrl);
		} else {
			$scope.envoiUrl = encodeURIComponent($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
		}
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			$('#confirmModal').modal('show');
			$('#shareModal').modal('hide');
		}
	};

	/*regex email*/
	$scope.verifyEmail = function(email) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	};

	/*envoi de l'email au destinataire*/
	$scope.sendMail = function() {
		$('#confirmModal').modal('hide');
		$scope.loaderMsg = 'Partage du profil en cours. Veuillez patienter ..';
		$scope.currentUrl = $location.absUrl();
		if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
			$scope.envoiUrl = decodeURI($scope.currentUrl);
		} else {
			$scope.envoiUrl = decodeURI($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
		}
		$scope.destination = $scope.destinataire;
		$scope.loader = true;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			if ($location.absUrl()) {
				if ($rootScope.currentUser.dropbox.accessToken) {
					if (configuration.DROPBOX_TYPE) {
						if ($rootScope.currentUser) {
							$scope.sendVar = {
								to: $scope.destinataire,
								content: ' vient de partager avec vous un profil sur l\'application CnedAdapt.  ' + $scope.envoiUrl,
								encoded: '<span> vient de partager avec vous un profil sur l\'application CnedAdapt.   <a href=' + $scope.envoiUrl + '>Lien de ce profil</a> </span>',
								prenom: $rootScope.currentUser.local.prenom,
								fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
								doc: $scope.envoiUrl
							};
							$http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
								.success(function(data) {
									$('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
									$scope.sent = data;
									$scope.envoiMailOk = true;
									$scope.destinataire = '';
									$scope.loader = false;
									$scope.displayDestination = false;
									$scope.loaderMsg = '';
								});
						}
					}
				}
			}
		} else {
			$('.sendingMail').removeAttr('data-dismiss', 'modal');
			$('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
		}
	};

	$scope.specificFilter = function() {
		// parcours des Profiles
		for (var i = 0; i < $scope.tests.length; i++) {
			if ($scope.tests[i].type === 'profile') {
				if ($scope.tests[i].nom.indexOf($scope.query) !== -1 || $scope.tests[i].descriptif.indexOf($scope.query) !== -1) {
					// Query Found
					$scope.tests[i].showed = true;
					$scope.tests[i + 1].showed = true;
				} else {
					// Query not Found
					$scope.tests[i].showed = false;
					$scope.tests[i + 1].showed = false;
				}
			}
		}
	};


	/****** Debut Detail Profil ******/
	/*
	 * Afficher la liste des tags triés avec gestion des niveaux.
	 */
	$scope.showTags = function() {
		if ($scope.listTags && $scope.listTags.length > 0) {
			/* Récuperer la position de listTags dans tagsByProfils */
			for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
				for (var j = $scope.listTags.length - 1; j >= 0; j--) {
					if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
						$scope.tagsByProfils[i].position = $scope.listTags[j].position;
					}
				}
			}
			/* Trier tagsByProfils avec position */
			$scope.tagsByProfils.sort(function(a, b) {
				return a.position - b.position;
			});
			var nivTag = 0;
			var nivTagTmp = 0;
			for (var i = 0; i < $scope.tagsByProfils.length; i++) { // jshint ignore:line
				nivTagTmp = nivTag;
				for (var j = 0; j < $scope.listTags.length; j++) { // jshint ignore:line
					if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
						if ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
							$scope.regles[i] = {
								texte: '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : Ceci est un exemple de' + $scope.listTags[j].libelle + ' </p>'
							};
						} else {
							$scope.regles[i] = {
								texte: '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '"><span style="color:#000">' + $scope.listTags[j].libelle + '</span> : CnedAdapt est une application qui permet d\'adapter les documents. </p>'
							};
						}
						/* Si le tag contient un niveau strictement positif */
						if ($scope.listTags[j].niveau && parseInt($scope.listTags[j].niveau) > 0) {
							nivTag = parseInt($scope.listTags[j].niveau);
							nivTagTmp = nivTag;
							nivTag++;
						}
						if (nivTagTmp === 0) {
							$scope.regles[i].niveau = 0;
						} else {
							$scope.regles[i].niveau = (nivTagTmp - 1) * 30;
						}
						break;
					}
				}
			}
		}
	};

	/*
	 * Gérer les buttons d'action dans le détail du profil.
	 */
	$scope.showProfilAndTags = function() {
		$scope.target = $location.search()['idProfil']; // jshint ignore:line
		var toSendCherche = {
			searchedProfile: $scope.target
		};
		if (localStorage.getItem('compteId')) {
			toSendCherche.id = localStorage.getItem('compteId');
		}
		/* Récuperer le profil et le userProfil courant */
		$http.post(configuration.URL_REQUEST + '/getProfilAndUserProfil', toSendCherche)
			.success(function(data) {
				$scope.detailProfil = data;
				if ($rootScope.currentUser) {
					$scope.showPartager = true;
					/* Non propriétaire du profil */
					if ($rootScope.currentUser._id !== $scope.detailProfil.owner) {
						$scope.showDupliquer = true;
					}
					/* Propriétaire du profil */
					if ($rootScope.currentUser._id === $scope.detailProfil.owner && !$scope.detailProfil.delegated) {
						$scope.showEditer = true;
					}
					/* Propriétaire du profil ou profil délégué ou profil par defaut */
					if ($rootScope.currentUser._id === $scope.detailProfil.owner || $scope.detailProfil.delegated || $scope.detailProfil.default || $scope.detailProfil.preDelegated) {
						$scope.showFavouri = false;
					} else {
						$scope.varToSend = {
							profilID: $scope.detailProfil.profilID,
							userID: $rootScope.currentUser._id
						};
						var tmpToSend = {
							id: $rootScope.currentUser.local.token,
							sendedVars: $scope.varToSend
						};
						$http.post(configuration.URL_REQUEST + '/findUserProfilFavoris', tmpToSend)
							.success(function(data) {
								/* Profil est déja favouris */
								if (data === 'true') {
									$scope.showFavouri = false;
								}
							});
					}
					/* profil délégué à l'utlisateur connecté */
					if ($scope.detailProfil.preDelegated && $rootScope.currentUser._id === $scope.detailProfil.preDelegated) {
						$scope.showDeleguer = true;
					}
				}

				$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
					idProfil: $scope.detailProfil.profilID
				}).success(function(data) {
					$scope.tagsByProfils = data;
					$scope.regles = [];
					$scope.requestToSend = {};
					if (localStorage.getItem('compteId')) {
						$scope.requestToSend = {
							id: localStorage.getItem('compteId')
						};
					}
					if (localStorage.getItem('listTags')) {
						$scope.listTags = JSON.parse(localStorage.getItem('listTags'));
						$scope.showTags();
					} else {
						$http.get(configuration.URL_REQUEST + '/readTags', {
							params: $scope.requestToSend
						}).success(function(data) {
							localStorage.setItem('listTags', JSON.stringify(data));
							$scope.listTags = JSON.parse(localStorage.getItem('listTags'));
							$scope.showTags();
						});
					}
				});
			});
	};

	/*
	 * Initialiser le detail du profil.
	 */
	$scope.initDetailProfil = function() {
		$scope.showDupliquer = false;
		$scope.showEditer = false;
		$scope.showFavouri = true;
		$scope.showDeleguer = false;
		$scope.showPartager = false;

		var dataProfile = {};
		if (localStorage.getItem('compteId')) {
			dataProfile = {
				id: localStorage.getItem('compteId')
			};
		}

		$http.get(configuration.URL_REQUEST + '/profile', {
			params: dataProfile
		})
			.success(function(result) {
				/* Authentifié */
				$rootScope.currentUser = result;
				$scope.showProfilAndTags();
			}).error(function() {
				/* Non authentifié */
				$scope.showFavouri = false;
				$scope.showProfilAndTags();
			});
	};

	/*
	 * Ajouter un profil à ses favoris.
	 */
	$scope.ajouterAmesFavoris = function() {
		if ($rootScope.currentUser && $scope.detailProfil) {
			var token = {
				id: $rootScope.currentUser.local.token,
				newFav: {
					userID: $rootScope.currentUser._id,
					profilID: $scope.detailProfil.profilID,
					favoris: true,
					actuel: false,
					default: false
				}
			};
			$http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', token).success(function(data) {
				$scope.favourite = data;
				$scope.showFavouri = false;
				$('#favoris').fadeIn('fast').delay(5000).fadeOut('fast');
				$rootScope.$broadcast('initCommon');
			});
		}
	};

	/*
	 * Accepter la délégation d'un profil.
	 */
	$scope.deleguerUserProfil = function() {
		$scope.loader = true;
		$scope.varToSend = {
			profilID: $scope.detailProfil.profilID,
			userID: $scope.detailProfil.owner,
			delegatedID: $rootScope.currentUser._id
		};
		var tmpToSend = {
			id: $rootScope.currentUser.local.token,
			sendedVars: $scope.varToSend
		};
		$http.post(configuration.URL_REQUEST + '/delegateUserProfil', tmpToSend)
			.success(function(data) {
				$scope.delegateUserProfilFlag = data;

				$http.post(configuration.URL_REQUEST + '/findUserById', {
					idUser: $scope.detailProfil.owner
				})
					.success(function(data) {
						if (data) {
							var emailTo = data.local.email;
							var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
							$scope.sendVar = {
								emailTo: emailTo,
								content: '<span> ' + fullName + ' vient d\'utiliser CnedAdapt pour accepter la délégation de votre profil : ' + $scope.profil.nom + '. </span>',
								subject: 'Confirmer la délégation'
							};
							$http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
								.success(function() {
									$scope.loader = false;
									$rootScope.updateListProfile = !$rootScope.updateListProfile;
									var profilLink = $location.absUrl();
									profilLink = profilLink.substring(0, profilLink.lastIndexOf('#/detailProfil?idProfil'));
									profilLink = profilLink + '#/profiles';
									$window.location.href = profilLink;
								});
						}
					});
			});
	};

	$scope.detailsProfilApartager = function() {
		$('#shareModal').show();
		$scope.socialShare();
	};

	/****** Fin Detail Profil ******/

});