define([
    "dcl/dcl"
], function (declare) {
    "use strict";

    function isValueSet(value) {
        return (typeof value === "string" && value.length > 0)
            || (typeof value === "number" && isFinite(value))
            || (typeof value === "boolean");
    }

    function findValue(valueObj) {
        return isValueSet(valueObj) ? valueObj : (valueObj && isValueSet(valueObj["value"])) ? valueObj["value"] : null;
    }

    function formatName(name) {
        return name.replace(/(^|_)(\w)/g, function (wholeString, underscore, letter) {
            return (underscore && " ") + letter.toUpperCase();
        });
    }

    var NamedProperty = declare(null, {
        declaredClass: "NamedProperty",
        constructor: function (name, value) {
            var useName = findValue(name);
            if (typeof useName !== "string") {
                throw new TypeError("name must be a string: " + name);
            }
            this._name = formatName(useName);
            this._value = findValue(value);
        },
        name: function () {
            return this._name;
        },
        value: function () {
            return this._value;
        }
    });
    NamedProperty.addToPropertyList = function (aPropertyList, name, value) {
        var namedProperty = new NamedProperty(name, value);
        var realValue = namedProperty.value();
        if (realValue) {
            aPropertyList.push({label: namedProperty.name(), value: realValue});
        }
    };
    return NamedProperty;
});