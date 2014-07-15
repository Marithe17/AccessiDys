'use strict';

angular.module('gettext').run(['gettextCatalog',
	function(gettextCatalog) {
		gettextCatalog.setStrings('en_US', {
			'Regles': 'Setting',
			'validerLaRegle': 'Valid settings',
			'Accueil': 'Home',
			'Action': 'Action',
			'Photo': 'Picture',
			'Ajouter': 'Add',
			'Ajouter un profil': 'Add new profile',
			'Annuler': 'Cancel',
			'CNED': 'CNED',
			'Descriptif': 'Description',
			'Documents': 'My Documents',
			'Dupliquer le profil': 'Clone profile',
			'Apercu' : 'Aperçu',
			'Modifier': 'Modifier',
			'Enregistrer': 'Save',
			'Entrez le descriptif': 'Tape the description',
			'Entrez le nom': 'Tape the name',
			'Gestion des profils': 'Manage profiles',
			'Interligne': 'Line spacing',
			'Mes profils  :': 'Profiles :',
			'Modifier le profil': 'Edit profile',
			'Partager le profil' : 'Partager le profil',
			'AccepterDemandeDelegation' : 'Accepter la demande de délégation',
			'Modifier les informations': 'Edit data',
			'Niveau scolaire': 'Level of qualification',
			'Nom': 'Name',
			'Parametres': 'Settings',
			'Partager': 'Share',
			'Police': 'Font',
			'Profils': 'My Profiles',
			'Style': 'Style',
			'Supprimer': 'Delete',
			'Supprimer le profil': 'Delete profile',
			'Taille': 'Size',
			'Type': 'Type',
			'Coloration': 'Colors',
			'Valider': 'Submit',
			'Voir un aperçu': 'Preview',
			'messageSuppression': 'Do you really want deleting the profile ?',
			'modifie avec succes': 'successfully changed',
			'style avec succes': 'successfully styled',
			'Profil Ajoute avec succes !': 'Profile successfully added !',
			'Enregistrer le profil': 'Save profile',
			'Profil Modifie avec succes !': 'Profile successfully changed',
			'monCompte': 'My account',
			'Administration': 'Administration',
			'MonCompte': 'My account',
			'Document': 'Document structure',
			'Telecharger': 'Upload',
			'modifie': 'modified',
			'Seconnecter': 'Login',
			'SeDeconnecter': 'Logout',
			'Ajouter un Document': 'ADD A DOCUMENT',
			'listDocument': 'Your Documents',
			'defaultProfileSelection': 'Default profile successfully selected !',
			'defaultProfile' : 'Profil par défaut',
			'Delegate':'Déléguer',
			'CancelDeleguation' : 'Annuler la déléguation',
			'RemoveDeleguation' : 'Retirer la déléguation',
			'enregistrerCeProfil': 'Save this profile',
			'detailsProfil': 'Profiles details',
			'deleteFavoris': 'Delete profile from favourite',
			'bookmarklet': 'My Bookmarklet',
			'LoginMessage': 'LOGIN TO YOUR ACCOUNT CnedAdapt',
			'LoginMessageSub': 'Use your login and password to login',
			'LoginErreurPassword': 'The email or password you entered is incorrect.',
			'ForgotPassword' : 'Forgot your password?',
			'AlreadyHadaccount' : 'J\'ai déjà un compte',
			'CreateAccount' : 'créez un compte',
			'Next' : 'Next',
			'StyleTexte': 'Style text',
			'modifierVersionApplication': 'Upgrade the application\'s version',
			'DeleteTag' : 'Delete Tag',
			'EditTag' : 'Edit le tag',
			'Partager sur Facebook' : 'Partager sur Facebook',
			'Partager sur Twitter' : 'Partager sur Twitter',
			'Partager sur GooglePlus' : 'Partager sur Google+',
			'Envoyer' : 'Envoyer',
			'Resize' : "réduire / agrandir",
			'Editer le texte' : 'Editer le texte',
			'Dupliquer le bloc' : 'Dupliquer le bloc',
			'Supprimer le bloc' : 'Supprimer le bloc',
			'synthese vocale' : 'synthèse vocale',
			'Enregistrer sur ma Dropbox' : 'Enregistrer sur ma Dropbox',
			'Modifier sur ma Dropbox' : 'Modifier sur ma Dropbox',
			'Supprimer calque' : 'Supprimer le calque',
			'Dupliquer calque' : 'Dupliquer le calque',
			'Type de calque' : 'Type de calque',
			'Changer le mot de passe' : 'Changer le mot de passe'

		});
		gettextCatalog.setStrings('fr_FR', {
			'Profil Modifie avec succes !': 'Profil Modifié avec succès !',
			'Profil Ajoute avec succes !': 'Profil Ajouté avec succès !',
			'style avec succes': ' ',
			'Regles': 'Règle',
			'Coloration': 'Coloration',
			'Accueil': 'Accueil',
			'Action': 'Action',
			'Ajouter': 'Ajouter',
			'Ajouter un profil': 'Ajouter un profil',
			'Apercu' : 'Aperçu',
			'Modifier': 'Modifier',
			'Annuler': 'Annuler',
			'CNED': 'CNED',
			'Descriptif': 'Descriptif',
			'Documents': 'Mes Documents',
			'Dupliquer le profil': 'Dupliquer le profil',
			'Enregistrer': 'Enregistrer',
			'Entrez le descriptif': 'Entrez la description',
			'Entrez le nom': 'Entrez le nom',
			'Gestion des profils': 'Gestion des profils',
			'Interligne': 'Interligne',
			'Mes profils  :': 'Mes profils  :',
			'Modifier le profil': 'Modifier le profil',
			'Partager le profil' : 'Partager le profil',
			'AccepterDemandeDelegation' : 'Accepter la demande de délégation',
			'Modifier les informations': 'Modifier les informations',
			'modifie avec succes': 'modifié avec succès',
			'Niveau scolaire': 'Niveau scolaire',
			'Nom': 'Nom',
			'Partager': 'Partager',
			'Police': 'Police',
			'Profils': 'Mes Profils',
			'Style': 'Style',
			'Supprimer': 'Supprimer',
			'Supprimer le profil': 'Supprimer le profil',
			'Taille': 'Taille',
			'Type': 'Type',
			'Valider': 'Valider',
			'Voir un apercu': 'Voir un aperçu',
			'messageSuppression': 'Vous êtes sur le point de supprimer le profil ?',
			'Enregistrer le profil': 'Enregistrer le profil',
			'validerLaRegle': 'Valider la règle',
			'Photo': 'Photo',
			'monCompte': 'Mon compte',
			'Administration': 'Administration',
			'MonCompte': 'Mon compte',
			'Document': 'Structurer Document',
			'Telecharger': 'Télécharger',
			'modifie': ' ',
			'Seconnecter': 'Se connecter',
			'SeDeconnecter': 'Se Deconnecter',
			'Ajouter un Document': 'Ajouter un Document',
			'listDocument': 'Liste des Documents',
			'defaultProfileSelection': 'Profil par défaut selectionné avec succès !',
			'defaultProfile' : 'Profil par défaut',
			'Delegate':'Déléguer',
			'CancelDeleguation' : 'Annuler la déléguation',
			'RemoveDeleguation' : 'Retirer la déléguation',
			'enregistrerCeProfil': 'Enregistrer ce profil',
			'detailsProfil': 'Détails du profil',
			'deleteFavoris': 'Supprimer le profil de la liste des profils favoris',
			'bookmarklet': 'Ma Bookmarklet',
			'LoginMessage': 'CONNECTEZ VOUS A VOTRE COMPTE CnedAdapt',
			'LoginMessageSub': 'Utilisez votre login et mot de passe pour vous connecter',
			'LoginErreurPassword': 'L\'e-mail ou le mot de passe saisi est incorrect.',
			'ForgotPassword' : 'Mot de passe oublié ?',
			'AlreadyHadaccount' : 'J\'ai déjà un compte',
			'CreateAccount' : 'créez un compte',
			'Next' : 'Suivant',
			'StyleTexte': 'Style de texte',
			'modifierVersionApplication': 'Mettre à jour la version de l\'application',
			'DeleteTag' : 'Supprimer le tag',
			'EditTag' : 'Edit le tag',
			'Partager sur Facebook' : 'Partager sur Facebook',
			'Partager sur Twitter' : 'Partager sur Twitter',
			'Partager sur GooglePlus' : 'Partager sur Google+',
			'Envoyer' : 'Envoyer',
			'Resize' : "réduire / agrandir",
			'Editer le texte' : 'Editer le texte',
			'Dupliquer le bloc' : 'Dupliquer le bloc',
			'Supprimer le bloc' : 'Supprimer le bloc',
			'synthese vocale' : 'synthèse vocale',
			'Enregistrer sur ma Dropbox' : 'Enregistrer sur ma Dropbox',
			'Modifier sur ma Dropbox' : 'Modifier sur ma Dropbox',
			'Supprimer calque' : 'Supprimer le calque',
			'Dupliquer calque' : 'Dupliquer le calque',
			'Type de calque' : 'Type de calque',
			'Changer le mot de passe' : 'Changer le mot de passe'
		});

	}
]);