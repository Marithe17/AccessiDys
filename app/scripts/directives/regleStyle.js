/* File: regleStyle.js
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

/*
 * Directive to apply a rule of style to a paragraph.
 */
angular.module('cnedApp').directive('profileStyle',

    function () {
        return {
            restrict: 'A',
            scope: {
                profile: '='
            },
            link: function (scope, element) {

                var generateProfileStyle = function () {

                    if (scope.profile) {
                        var profile = scope.profile.data;
                        var className = '.' + profile.className;
                        var profileStyle = '';

                        for (var i = 0; i < profile.profileTags.length; i++) {
                            var fontWeight = profile.profileTags[i].styleValue === 'Gras' ? 'bold' : 'normal';

                            profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' {';
                            profileStyle += 'font-family: ' + profile.profileTags[i].police + ' !important;';
                            profileStyle += 'font-size: ' + (profile.profileTags[i].taille / 12) + 'em !important;';
                            profileStyle += 'line-height: ' + (1.286 + (profile.profileTags[i].interligne - 1) * 0.18) + 'em !important;';
                            profileStyle += 'word-spacing: ' + (0 + (profile.profileTags[i].spaceSelected - 1) * 0.18) + 'em !important;';
                            profileStyle += 'letter-spacing: ' + (0 + (profile.profileTags[i].spaceCharSelected - 1) * 0.12) + 'em !important;';
                            profileStyle += 'font-weight: ' + fontWeight + ';';
                            profileStyle += '}';

                            profileStyle += className + '.preview ' + profile.profileTags[i].tagDetail.balise + ' {';
                            if (profile.profileTags[i].tagDetail.balise === 'p') {
                                profileStyle += 'height: ' + ((1.286 + (profile.profileTags[i].interligne - 1) * 0.18) * 4) + 'em' + ';';
                            } else {
                                profileStyle += 'height: ' + (1.286 + (6) * 0.18) + 'em' + ';';
                                profileStyle += 'line-height: ' + (1.286 + (6) * 0.18) + 'em !important;';

                                if (profile.profileTags[i].tagDetail.balise === 'mark') {
                                    profileStyle += 'display: inline-block !important;';
                                }
                            }
                            profileStyle += 'overflow: hidden;';
                            profileStyle += '}';

                            switch (profile.profileTags[i].coloration) {
                                case 'Colorer les lignes RBV':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #066ED9 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;
                                case 'Colorer les lignes RVJ':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #ECE20F !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;
                                case 'Colorer les lignes RBVJ':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #066ED9 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line4 {';
                                    profileStyle += 'color: #ECE20F !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';
                                    break;

                                case 'Colorer les lignes Personnaliser':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += ('color: ' + profile.profileTags[i].colorsList[0] + ' !important;');
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += ('color: ' + profile.profileTags[i].colorsList[1] + ' !important;');
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += ('color: ' + profile.profileTags[i].colorsList[2] + ' !important;');
                                    profileStyle += '}';

                                    if(profile.profileTags[i].colorsList.length > 3) {
                                        profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line4 {';
                                        profileStyle += ('color: ' + profile.profileTags[i].colorsList[3] + ' !important;');
                                        profileStyle += '}';
                                    }

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';
                                    break;


                                case 'Colorer les mots':
                                case 'Colorer les syllabes':

                                profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                profileStyle += 'color: #D90629 !important;';
                                profileStyle += '}';

                                profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n-1) {';
                                profileStyle += 'color: #066ED9 !important;';
                                profileStyle += '}';

                                profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n) {';
                                profileStyle += 'color: #4BD906 !important;';
                                profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';
                                break;

                                case 'Colorer les syllabes RBV':
                                case 'Colorer les syllabes RVJ':
                                case 'Colorer les syllabes RBVJ':
                                case 'Colorer les syllabes Personnaliser':
                                case 'Colorer les mots RBV':
                                case 'Colorer les mots RVJ':
                                case 'Colorer les mots RBVJ':
                                case 'Colorer les mots Personnaliser':
                                case 'Colorer les groupes de souffle [Maj. - \'.\'] RBV':
                                case 'Colorer les groupes de souffle [Maj. - \',\' - \'.\'] RBV':
                                case 'Colorer les groupes de souffle [Maj. - \';\' - \'.\'] RBV':
                                case 'Colorer les groupes de souffle [Maj. - \'.\'] RVJ':
                                case 'Colorer les groupes de souffle [Maj. - \',\' - \'.\'] RVJ':
                                case 'Colorer les groupes de souffle [Maj. - \';\' - \'.\'] RVJ':
                                case 'Colorer les groupes de souffle [Maj. - \'.\'] RBVJ':
                                case 'Colorer les groupes de souffle [Maj. - \',\' - \'.\'] RBVJ':
                                case 'Colorer les groupes de souffle [Maj. - \';\' - \'.\'] RBVJ':
                                case 'Colorer les groupes de souffle [Maj. - \'.\'] Personnaliser':
                                case 'Colorer les groupes de souffle [Maj. - \',\' - \'.\'] Personnaliser':
                                case 'Colorer les groupes de souffle [Maj. - \';\' - \'.\'] Personnaliser':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                    profileStyle += 'color: ' + profile.profileTags[i].colorsList[0] + ' !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(4n-2) {';
                                    profileStyle += 'color: ' + profile.profileTags[i].colorsList[1] + ' !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(4n-1) {';
                                    profileStyle += 'color: ' + profile.profileTags[i].colorsList[2] + ' !important;';
                                    profileStyle += '}';

                                    if(profile.profileTags[i].colorsList.length > 3) {
                                        profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(4n) {';
                                        profileStyle += 'color: ' + profile.profileTags[i].colorsList[3] + ' !important;';
                                        profileStyle += '}';
                                    }

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;

                                case 'Colorer les syllabes':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                    profileStyle += 'color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n-1) {';
                                    profileStyle += 'color: #066ED9 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n) {';
                                    profileStyle += 'color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';


                                    break;

                                case 'Surligner les mots':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #fffd01 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n-1) {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #04ff04 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n) {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #04ffff !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';


                                    break;

                                case 'Surligner les syllabes RBV':
                                case 'Surligner les syllabes RVJ':
                                case 'Surligner les syllabes RBVJ':
                                case 'Surligner les syllabes Personnaliser':
                                case 'Surligner les mots RBV':
                                case 'Surligner les mots RVJ':
                                case 'Surligner les mots RBVJ':
                                case 'Surligner les mots Personnaliser':
                                case 'Surligner les groupes de souffle [Maj. - \'.\'] RBV':
                                case 'Surligner les groupes de souffle [Maj. - \',\' - \'.\'] RBV':
                                case 'Surligner les groupes de souffle [Maj. - \';\' - \'.\'] RBV':
                                case 'Surligner les groupes de souffle [Maj. - \'.\'] RVJ':
                                case 'Surligner les groupes de souffle [Maj. - \',\' - \'.\'] RVJ':
                                case 'Surligner les groupes de souffle [Maj. - \';\' - \'.\'] RVJ':
                                case 'Surligner les groupes de souffle [Maj. - \'.\'] RBVJ':
                                case 'Surligner les groupes de souffle [Maj. - \',\' - \'.\'] RBVJ':
                                case 'Surligner les groupes de souffle [Maj. - \';\' - \'.\'] RBVJ':
                                case 'Surligner les groupes de souffle [Maj. - \'.\'] Personnaliser':
                                case 'Surligner les groupes de souffle [Maj. - \',\' - \'.\'] Personnaliser':
                                case 'Surligner les groupes de souffle [Maj. - \';\' - \'.\'] Personnaliser':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[0] + ' !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(4n-2) {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[1] + ' !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(4n-1) {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[2] + ' !important;';
                                    profileStyle += '}';

                                    if(profile.profileTags[i].colorsList.length > 3) {
                                        profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(4n) {';
                                        profileStyle += 'color: #000 !important;';
                                        profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[3] + ' !important;';
                                        profileStyle += '}';
                                    }

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;

                                case 'Surligner les lignes RBV':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #066ED9 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;
                                case 'Surligner les lignes RVJ':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #ECE20F !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;
                                case 'Surligner les lignes RBVJ':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #D90629 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #066ED9 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #4BD906 !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line4 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: #ECE20F !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;

                                case 'Surligner les lignes Personnaliser':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[0] + ' !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[1] + ' !important;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[2] + ' !important;';
                                    profileStyle += '}';

                                    if(profile.profileTags[i].colorsList.length > 3) {
                                        profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line4 {';
                                        profileStyle += 'color: #000 !important;';
                                        profileStyle += 'background-color: ' + profile.profileTags[i].colorsList[3] + ' !important;';
                                        profileStyle += '}';
                                    }

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' a span {';
                                    profileStyle += 'text-decoration: underline;';
                                    profileStyle += '}';

                                    break;

                                default:

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' {';
                                    profileStyle += 'color: #000 !important;';
                                    profileStyle += '}';

                                    break;

                            }

                        }


                        profileStyle += ' @media print {' + profileStyle + '}';

                        element.html(profileStyle);

                    }

                };

                scope.$watch('profile', function () {
                    generateProfileStyle();
                }, true);

            }
        };


    });