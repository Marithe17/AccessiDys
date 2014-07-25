var mainHTML = '<!-- Header -->'+
'<!-- End Header -->'+
'<div class="container" id="global_container">'+
'<div data-ng-init=\'initMain()\' document-methodes="">'+
	'<div  data-ng-controller=\'passportCtrl\' data-ng-init=\'init()\'>'+
		'<div ng-show=\'!guest\'>'+
			'<div ng-show=\'loginSign\'>'+
				'<div ng-show="!showlogin" id="loginbox" class="mainbox animated fadeInUp ">'+
					'<h2><span>{{stepsTitle}}</span><br><span class="blue-subtitle">{{stepsSubTitle}}</span></h2>'+
					'<div class="steps_progress" data-step="{{steps}}">'+
						'<ul>'+
							'<li>inscription</li>'+
							'<li>Compte DropBox</li>'+
							'<li>Ajouter aux favoris</li>'+
							'<li>Configurer profils</li>'+
						'</ul>'+
						'<div class="steps_bar">'+
							'<div class="progress_item">'+
								'&nbsp;'+
							'</div>'+
							'<div class="steps_mask">'+
								'<img src="/styles/images/steps_progressmask.png" alt=""/>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div ng-show=\'inscriptionStep1\' class=\'animated fadeInUp form_container\'>'+
						'<div style="display:none" id="login-alert" name="login-alert" class="alert alert-danger"></div>'+
						'<form id="loginform" class="" role="form">'+
							'<div ng-show="erreur.erreurSigninPrenom" class="alert alert-danger animated fadeInDown">{{erreur.erreurSigninPrenomMessage}}</div>'+
							'<p class="control_group">'+
							'<label class="" for="fname_etap-one" id="label_fname_etap-one">Prénom</label>'+
							'<input id="fname_etap-one" name="fname_etap-one" ng-model="obj.prenomSign" type="text" class="" placeholder="Prénom">'+
							'</p>'+
							'<div ng-show="erreur.erreurSigninNom" class="alert alert-danger animated fadeInDown">{{erreur.erreurSigninNomMessage}}</div>'+
							'<p class="control_group">'+
							'<label class="" for="name_etap-one" id="label_name_etap-one">Nom</label>'+
							'<input id="name_etap-one" name="name_etap-one" ng-model="obj.nomSign" type="text" class="" placeholder="Nom">'+
							'</p>'+
							'<div ng-show="erreur.erreurSigninEmail" class="alert alert-danger animated fadeInDown">{{erreur.erreurSigninEmailMessage}}</div>'+
							'<div ng-show="erreur.erreurSigninEmailNonDisponible" class="alert alert-warning animated fadeInDown">Cette adresse email est déjà utilisée.</div>'+
							'<p class="control_group">'+
							'<label class="" for="email_etap-one" id="label_email_etap-one">Email</label>'+
							'<input id="email_etap-one" name="email_etap-one" ng-model="obj.emailSign" type="text" class="" placeholder="xxx@exemple.fr">'+
							'</p>'+
							'<div ng-show="erreur.erreurSigninPasse" class="alert alert-danger animated fadeInDown">{{erreur.erreurSigninPasseMessage}}</div>'+
							'<p class="control_group">'+
							'<label class="" for="pwd_etap-one" id="label_pwd_etap-one">Mot de passe</label>'+
							'<input id="pwd_etap-one" name="pwd_etap-one" ng-model="obj.passwordSign" type="password" class="" placeholder="6 à 20 caractères">'+
							'</p>'+
							'<div ng-show="erreur.erreurSigninConfirmationPasse" class="alert alert-danger animated fadeInDown">{{erreur.erreurSigninConfirmationPasseMessage}}</div>'+
							'<p class="control_group last">'+
							'<label class="two_lignes" for="comfpsw_etap-one" id="label_comfpsw_etap-one">Confirmer le mot de passe</label>'+
							'<input id="comfpsw_etap-one" name="comfpsw_etap-one" ng-model="obj.passwordConfirmationSign" type="password" class="" placeholder="Confirmation du mot de passe">'+
							'</p>'+
							'<div class="form-group">'+
								'<!-- Button -->'+
								'<div>'+
									'<button ng-click=\'signin()\' class="btn_simple light_blue pull-right" title="{{\'Next\' | translate}}" name="next_one">Suivant</button>'+
								'</div>'+
							'</div>'+
						'</form>'+
					'</div>'+
					'<div ng-show=\'basculeButton\'><a href=\'\' ng-click=\'goNext()\' class="green_link" title="{{\'AlreadyHadaccount\' | translate}}">J\'ai déjà un compte</a></div>'+
					'<div ng-show=\'inscriptionStep2\' class=\'animated fadeInUp\'>'+
						'<div>'+
							'<div class="box">'+
								'<div>'+
									'<div class="centering">'+
										'<img src="/styles/images/dropbox.png" alt="Dropbox" />'+
									'</div>'+
									'<div class="info_txt" ng-show=\'showStep2part1\'>'+
'<p>L\’application CnedAdapt stocke vos documents structurés dans votre compte Dropbox. Pour cela l\’application CnedAdapt va également créer un dossier dans votre DropBox afin d\’y stocker automatiquement vos documents structurés. Vous devez donc disposer d\'un compte sur DropBox et autoriser l\'application CnedAdapt à y accéder. Si vous ne disposez pas d\'un compte Dropbox, vous allez être redirigé pour le créer en premier lieu. Lorsque DropBox vous demandera d\'autoriser l\'application CnedAdapt, vous devrez cliquer sur "accepter"/"autoriser".</p>'+
									'</div>'+
									'<div class="more">'+
										'<a href="/auth/dropbox" class="btn_simple light_blue pull-right" title="{{\'Next\' | translate}}" name="next_two">Suivant</a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div ng-show="showlogin" id="loginbox_second" class="mainbox animated fadeInUp">'+
					'<h2><span translate>LoginMessage </span><br><span class="blue-subtitle" translate>LoginMessageSub</span></h2>'+
					'<div class="form_container" >'+
						'<div style="display:none" id="login-alert" class="alert alert-danger "></div>'+
						'<form id="loginform" class="" role="form">'+
							'<div ng-show="erreurLogin" class="alert alert-danger animated fadeInDown" translate>LoginErreurPassword</div>'+
							'<fieldset submit-scope>'+
								'<p class="control_group">'+
								'<label id="label_user" for="email" class="">Login</label>'+
								'<input id="email" ng-model="emailLogin" type="text" class="" placeholder="votre email"  data-submit-action>'+
								'</p>'+
								'<p class="control_group last">'+
								'<label id="label_mdp" for="mdp" class="">Mot de passe</label>'+
								'<input id="mdp" ng-model="passwordLogin" type="password" class="" placeholder="votre mot de passe"  data-submit-action>'+
								'</p>'+
								'<div class="controls">'+
									'<a href="" ng-click=\'showPasswordRestorePanel()\' class="black_link pull_left" title="{{\'ForgotPassword\' | translate}}">Mot de passe oublié ?</a>'+
									'<button type="submit" data-submit-target ng-click=\'login()\' class="btn_simple light_blue pull-right" title="{{\'Seconnecter\' | translate}}" name="login_btn">Se connecter</button>'+
								'</div>'+
							'</fieldset>'+
						'</form>'+
					'</div>'+
					'<div><span class="simple_text">Ou</span>&nbsp;&nbsp;&nbsp;<a href=\'\' ng-click=\'goNext()\' class="green_link" title="{{\'CreateAccount\' | translate}}">créez un compte</a></div>'+
				'</div>'+
			'</div>'+
			'<div ng-show=\'passwordForgotten\' id="loginbox_second" class="mainbox animated fadeInUp">'+
				'<h2><span>Mot de passe oublié ? </span><br><span class="blue-subtitle">Saisissez votre adresse e-mail pour réinitialiser votre mot de passe. Vous devrez peut-être consulter votre dossier de spams ou autoriser adaptdoc@gmail.com.</span></h2>'+
				'<div class="form_container" >'+
					'<div style="display:none" id="login-alert" class="alert alert-danger "></div>'+
					'<form id="restorePasswordForm" class="" role="form">'+
						'<div ng-show=\'failRestore\' class="alert alert-danger animated fadeInDown"> {{passwordRestoreMessage}}</div>'+
						'<div ng-show=\'successRestore\' class="alert alert-success animated fadeInDown">Un Email comportant des instructions supplémentaires a été envoyé à votre adresse.</div>'+
						'<fieldset submit-scope>'+
							'<p class="control_group">'+
							'<label id="label_user" for="email" class="">Email</label>'+
							'<input id="email" ng-model="emailRestore" type="text" class="" placeholder="votre email"  data-submit-action>'+
							'</p>'+
							'<div class="controls">'+
								'<a href="" ng-click=\'showPasswordRestorePanel()\' class="black_link pull_left" title="Retour à l\'écran de connexion">Retour à l\'écran de connexion</a>'+
								'<button type="submit" data-submit-target ng-click=\'restorePassword()\' class="btn_simple light_blue pull-right" title="envoyer">envoyer</button>'+
							'</div>'+
						'</fieldset>'+
					'</form>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div  ng-show=\'showpart2\'>'+
			'<div class=\'animated fadeInRight\'>'+
				'<div>'+
					'<div class="box">t'+
						'<div>'+
							'<div class="centering">'+
								'<img src="/styles/images/dropbox.png" alt="Dropbox" />'+
							'</div>'+
							'<div class="info_txt" ng-show=\'showStep2part1\'>'+
								'<p>'+
								'L\’application CnedAdapt stocke vos documents structurés dans votre compte Dropbox. Pour cela l’application CnedAdapt va également créer un dossier dans votre DropBox afin d’y stocker automatiquement vos documents structurés. Vous devez donc disposer d\'un compte sur DropBox et autoriser l\'application CnedAdapt à y accéder. Si vous ne disposez pas d\'un compte Dropbox, vous allez être redirigé pour le créer en premier lieu. Lorsque DropBox vous demandera d\'autoriser l\'application CnedAdapt, vous devrez cliquer sur "accepter"/"autoriser".'+
								'</p>'+
							'</div>'+
							'<div class="more">'+
								'<a href="/auth/dropbox" class="btn_simple light_blue pull-right" title="{{\'Next\' | translate}}" id="next_three>Suivant</a>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<!-- Modal -->'+
		'<div class="row marketing">'+
			'<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
				'<div class="modal-dialog bigger">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<h3 class="modal-title light_bluehead" id="myModalLabel">Informations</h3>'+
						'</div>'+
						'<div class="modal-body adjust-modal-body">'+
							'<p class="modal_content-text">'+
							'Votre compte CnedAdapt a bien été créé. Vous pouvez désormais l\'utiliser pour accéder à l\'application CnedAdapt. Cependant vous ne pourrez le faire qu’après avoir associé ce compte à votre compte DropBox. Nous vous proposons d’en créer un si nécessaire dans l’étape suivante.'+
							'</p>'+
						'</div>'+
						'<div class="centering">'+
							'<button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal" title="OK">OK</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="modal fade in" id="reconnexionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
				'<div class="modal-dialog bigger">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<h3 class="modal-title light_bluehead" id="myModalLabel">Informations</h3>'+
						'</div>'+
						'<div class="modal-body adjust-modal-body">'+
							'<p class="modal_content-text">'+
							'Votre session a été inactif pendant plus d\'une heure veuillez vous reconnecter.'+
							'</p>'+
						'</div>'+
						'<div class="centering">'+
							'<button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal" title="Oui">Oui</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div></div>';
