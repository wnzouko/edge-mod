define([
    "dcl/dcl",
    "knockout",
    "./ReviewValue",
    "./StixObject",
    "kotemplate!common-fields-TLP:./templates/commonTLP.html"
], function (declare, ko, ReviewValue, StixObject) {
    "use strict";

    function simpleItem(item) {
        return item;
    }

    return declare(StixObject, {
        constructor: function (data, stixPackage) {
            this.markingStructures = stixPackage.safeArrayGet(this.data(), "handling.0.marking_structures", simpleItem, this)
                || stixPackage.safeArrayGet(stixPackage.header(), "handling.0.marking_structures", simpleItem, this);

            this.tlp = ko.computed(function () {
                var validation = stixPackage.validations().findByProperty(this.id(), "tlp");
                return this.findByXsiType(this.markingStructures, "TLPMarkingStructureType", "color", validation);
            }, this);
            this.marking = ko.computed(function () {
                var validation = stixPackage.validations().findByProperty(this.id(), "marking");
                return this.findByXsiType(this.markingStructures, "SimpleMarkingStructureType", "statement", validation);
            }, this);
            this.termsOfUse = ko.computed(function () {
                var validation = stixPackage.validations().findByProperty(this.id(), "termsOfUse");
                return this.findByXsiType(this.markingStructures, "TermsOfUseMarkingStructureType", "terms_of_use", validation);
            }, this);
        },

        findByXsiType: function (markingStructures, xsiType, valueKey, validation) {
            var value = (ko.utils.arrayMap(ko.utils.arrayFilter(markingStructures, function (item) {
                return item["xsi:type"].split(":", 2)[1] === xsiType;
            }), function (item) {
                return item[valueKey];
            })).join(", ");
            return new ReviewValue(value, validation.state, validation.message);
        }
    });
});
