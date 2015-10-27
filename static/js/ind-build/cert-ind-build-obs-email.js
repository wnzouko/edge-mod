define([
    "dcl/dcl",
    "ind-build/indicator-builder-shim",
    "ind-build/validation"
], function (declare, indicator_builder, validation) {
    "use strict";

    var CERTObservableEmail = declare(indicator_builder.ObservableEmail, {
        constructor: function () {
            this.from.extend({
                validate: {
                    "isValidCallback": validation.isNotEmpty,
                    "failedValidationMessage": "The 'from' field must be populated."
                }
            }).valueHasMutated();

            this.subject.extend({
                validate: {
                    "isValidCallback": validation.isNotEmpty,
                    "failedValidationMessage": "The subject is required."
                }
            }).valueHasMutated();
        },

        doValidation: declare.superCall(function (sup) {
            return function () {
                var msgs = sup.call(this);
                if (this.from.hasError()) {
                    msgs.addError(this.from.errorMessage());
                }
                if (this.subject.hasError()) {
                    msgs.addError(this.subject.errorMessage());
                }
                return msgs;
            };
        })
    });
    indicator_builder.ObservableEmail = CERTObservableEmail;
    return CERTObservableEmail;
});