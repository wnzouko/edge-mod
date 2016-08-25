define([
    "dcl/dcl",
    "knockout",
    "./CourseOfAction",
    "./Incident",
    "./Indicator",
    "./Observable",
    "./TTP",
    "./ExploitTarget",
    "./ThreatActor",
    "./Campaign",
    "./StixRealPackage",
    "common/cert-utils"
], function (declare, ko, CourseOfAction, Incident, Indicator, Observable, TTP, ExploitTarget, ThreatActor, Campaign, StixRealPackage, Utils) {
    "use strict";

    var TYPES = Object.freeze({
        "act": {
            "class": ThreatActor, "collection": "threat_actors", "label": "ThreatActor", "code": "act"
        },
        "cam": {
            "class": Campaign, "collection": "campaigns", "label": "Campaign", "code": "cam"
        },
        "coa": {
            "class": CourseOfAction, "collection": "courses_of_action", "label": "Course Of Action", "code": "coa"
        },
        "inc": {
            "class": Incident, "collection": "incidents", "label": "Incident", "code": "inc"
        },
        "ind": {
            "class": Indicator, "collection": "indicators", "label": "Indicator", "code": "ind"
        },
        "obs": {
            "class": Observable, "collection": "observables.observables", "label": "Observable", "code": "obs"
        },
        "tgt": {
            "class": ExploitTarget, "collection": "exploit_targets", "label": "ExploitTarget", "code": "tgt"
        },
        "ttp": {
            "class": TTP, "collection": "ttps.ttps", "label": "TTP", "code": "ttp"
        },
        "pkg": {
            "class": StixRealPackage, "collection": "related_packages.related_packages", "label": "Package", "code": "pkg"
        }
    });


    var PATTERN = Object.freeze({
        namespace: "[a-z][\\w\\d-]+",
        type: "[a-z]+",
        uuid: "[a-f\\d]{8}-[a-f\\d]{4}-[a-f\\d]{4}-[a-f\\d]{4}-[a-f\\d]{12}",
        draft: ":draft:[a-f\\d]{32}"
    });

    function parseId(/*String*/ id) {
        if (!(typeof id === "string")) {
            throw new TypeError("Identifier must be a string");
        }
        var pattern = new RegExp(
            "^(" + PATTERN.namespace + "):(" + PATTERN.type + ")-" + PATTERN.uuid + "(" + PATTERN.draft + ")?$",
            "i"
        );
        var match = pattern.exec(id);
        if (!match) {
            throw new Error("Unable to parse id: " + id);
        }
        return match;
    }

    function findType(id, data) {

        for (var typename in TYPES) {
            var collection_path = TYPES[typename]['collection'];
            if (!Utils.checkNestedFieldExistsArray(data, collection_path.split('.'))) {
                continue;
            }
            var collection = Utils.getNestedFieldArray(data, collection_path.split('.'));
            if (typename === 'pkg') {
                var found_type = ko.utils.arrayFirst(collection, function (item) {
                    return id === item.package.id;
                });
            } else {
                var found_type = ko.utils.arrayFirst(collection, function (item) {
                    return id === item.id;
                });
            }


            if (found_type == null) {
                continue;
            }
            return TYPES[typename];
        }

        throw new TypeError("Unsupported type for id: " + id);
    }

    function findNamespace(parsedId) {
        return parsedId[1];
    }

    return declare(null, {
        declaredClass: "StixId",
        constructor: function (id, data) {
            var parsedId = parseId(id);
            this._id = id;
            this._type = findType(id, data);
            this._namespace = findNamespace(parsedId);
        },
        id: function () {
            return this._id;
        },
        type: function () {
            return this._type;
        },
        namespace: function () {
            return this._namespace;
        }
    });
});
