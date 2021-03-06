define([
    "dcl/dcl",
    "knockout",
    "./StixObject",
    "kotemplate!flat-pkg:./templates/flat-Package.html",
    "kotemplate!root-pkg:./templates/root-Package.html"
], function (declare, ko, StixObject) {
    "use strict";

    return declare(StixObject, {
        constructor: function (data, stixPackage) {
            this.title = ko.computed(function () {
                return stixPackage.safeValueGet(this.id, data, "stix_header.title");
            }, this);
            this.description = ko.computed(function () {
                return stixPackage.safeValueGet(this.id, data, "stix_header.description");
            }, this);
            this.indicators = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "indicators", "idref");
            }, this, this.DEFER_EVALUATION);
            this.COAs = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "courses_of_action", "idref");
            }, this, this.DEFER_EVALUATION);
            this.campaigns = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "campaigns", "idref");
            }, this, this.DEFER_EVALUATION);
            this.ttps = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "ttps.ttps", "idref");
            }, this, this.DEFER_EVALUATION);
            this.observables = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "observables.observables", "idref");
            }, this, this.DEFER_EVALUATION);
            this.threatActors = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "threat_actors", "idref");
            }, this, this.DEFER_EVALUATION);
            this.exploitTargets = ko.computed(function () {
                return stixPackage.safeReferenceArrayGet(this.id, data, "exploit_targets", "idref");
            }, this, this.DEFER_EVALUATION);
        }
    });
});
