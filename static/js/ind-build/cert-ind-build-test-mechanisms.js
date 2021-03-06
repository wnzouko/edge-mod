define([
    "dcl/dcl",
    "knockout",
    "ind-build/builder-shim",
    "ind-build/indicator-builder-shim",
    "common/cert-abstract-builder-form",
    "ind-build/cert-ind-build-snort-rule",
    "ind-build/cert-ind-build-yara-rule"
], function (declare, ko, builder, indicator_builder, AbstractBuilderForm, SnortRule, YaraRule) {
    "use strict";

    var TestMechanisms = declare(AbstractBuilderForm, {
        declaredClass: "TestMechanisms",

        constructor: declare.superCall(function (sup) {
            return function () {
                this.snortRules = ko.observableArray([]);
                this.yaraRules = ko.observableArray([]);
                this.rules = ko.computed(function () {
                    return this.snortRules().concat(this.yaraRules());
                }, this);

                sup.call(this, "Test Mechanisms");
            }
        }),

        addSnortRule: function () {
            var new_rule = new SnortRule();
            this.addSnortRuleValidation(new_rule);
            new_rule.rules.push(ko.observable(''));
            this.snortRules.push(new_rule);
        },

        addYaraRule: function () {
            var new_rule = new YaraRule();
            this.addYaraRuleValidation(new_rule);
            this.yaraRules.push(new_rule);
        },

        removeSnortRule: function (rule) {
            ko.utils.objectForEach(rule, function (key, rules) {
                ko.utils.arrayForEach(rules(), function (rules) {
                    this.validationGroup.remove(rules)
                }.bind(this))
            }.bind(this));
            this.snortRules.remove(rule);
        },

        removeYaraRule: function (rule) {
            this.validationGroup.remove(rule.rule);
            this.yaraRules.remove(rule);
        },

        addYaraRuleValidation: function (new_rule) {
            new_rule.rule.extend({
                requiredGrouped: {
                    required: true,
                    group: this.validationGroup,
                    displayMessage: "You need to enter a value for your Yara rule"
                }
            });
        },

        addSnortRuleValidation: function (new_rule) {
            new_rule.rules.subscribe(function () {
                ko.utils.arrayForEach(new_rule.rules(), function (rule) {
                    rule.extend({
                        requiredGrouped: {
                            required: true,
                            group: this.validationGroup,
                            displayMessage: "You need to enter a value for your Snort rule"
                        }
                    });
                }.bind(this))
            }.bind(this));

            new_rule.rules.subscribe(function () {
                ko.utils.arrayForEach(new_rule.rules(), function (rule) {
                    this.validationGroup.remove(rule);
                }.bind(this))
            }.bind(this), null, "beforeChange");
        },

        load: function (data) {
            this.snortRules.removeAll();
            this.yaraRules.removeAll();
            if ('test_mechanisms' in data) {
                ko.utils.arrayForEach(data['test_mechanisms'], function (data) {
                    if (data['type'] == 'Snort') {
                        var new_id = new SnortRule();
                        this.addSnortRuleValidation(new_id);
                        new_id.load(data['rules']);
                        this.snortRules.push(new_id);
                    }
                    else if (data['type'] == 'Yara') {
                        var new_id = new YaraRule();
                        this.addYaraRuleValidation(new_id);
                        new_id.load(data['rule']);
                        this.yaraRules.push(new_id);
                    }
                }.bind(this));
            }
        },

        save: function () {
            var data = {};
            data['test_mechanisms'] = [];
            ko.utils.arrayForEach(this.rules(), function (rule) {
                data['test_mechanisms'].push(rule.to_json());
            });

            return data;
        },

        counter: function () {
            return this.rules().length || "";
        }

    });
    indicator_builder.TestMechanisms = TestMechanisms;
    return TestMechanisms;
});
