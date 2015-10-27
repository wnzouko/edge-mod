define([
    "intern!object",
    "intern/chai!assert",
    "stix/StixPackage",
    "stix/Incident",
    "stix/Indicator",
    "stix/Observable",
    "stix/TTP",
    "intern/dojo/text!./data/Incident_package_01.json"
], function (registerSuite, assert, StixPackage, Incident, Indicator, Observable, TTP, package01) {
    "use strict";

    // statics go here
    var packageData = Object.freeze({
        "purple-secure-systems:incident-02468346-fdf2-4095-a905-f3731fccd58d": Object.freeze(JSON.parse(package01))
    });

    return registerSuite(function () {

        // suite variables go here
        var stixPackage = null;
        var classUnderTest = null;

        function loadPackage(rootId) {
            stixPackage = new StixPackage(packageData[rootId], rootId);
            classUnderTest = stixPackage.root;
        }

        return {
            name: "stix/Incident",
            "valid package": {
                setup: function () {
                    loadPackage("purple-secure-systems:incident-02468346-fdf2-4095-a905-f3731fccd58d");
                },
                "returns non-null": function () {
                    assert.isNotNull(classUnderTest);
                },
                "has correct id": function () {
                    assert.equal(classUnderTest.id(), "purple-secure-systems:incident-02468346-fdf2-4095-a905-f3731fccd58d");
                },
                "has correct title": function () {
                    assert.equal(classUnderTest.title(), "Bot-net found on intranet");
                },
                "has correct short description": function () {
                    assert.equal(classUnderTest.shortDescription(), "Bottom bot-net running");
                },
                "has correct description": function () {
                    assert.equal(classUnderTest.description(), "It appears that the 'Bottom' bot-net is running on our intranet");
                },
                "has correct TLP": function () {
                    assert.equal(classUnderTest.tlp(), "RED");
                },
                "has correct status": function () {
                    assert.equal(classUnderTest.status(), "Incident Reported");
                },
                "has correct reporter": function () {
                    assert.equal(classUnderTest.reporter(), "Cynthia James");
                },
                "has correct confidence": function () {
                    assert.equal(classUnderTest.confidence(), "High");
                },
                "has correct responders": function () {
                    assert.equal(classUnderTest.responders(), "Responser 2, Responser 1");
                },
                "has correct intended effects": function () {
                    assert.equal(classUnderTest.intendedEffects(), "Unauthorized Access, Traffic Diversion, ICS Control, Harassment, Fraud, Extortion, Exposure, Embarrassment, Disruption, Destruction, Denial and Deception, Degradation of Service, Competitive Advantage, Brand Damage, Account Takeover, Theft - Theft of Proprietary Information, Theft - Identity Theft, Theft - Credential Theft, Theft - Intellectual Property, Theft - Intellectual Property, Theft, Advantage - Political, Advantage - Military, Advantage - Economic, Advantage");
                },
                "has correct discovery methods": function () {
                    assert.equal(classUnderTest.discoveryMethods(), "Unknown, User, Security Alarm, NIDS, Log Review, IT Audit, HIPS, Fraud Detection, Financial Audit, Incident Response, Antivirus, Audit, Unrelated Party, Customer, Law Enforcement, Monitoring Service, Fraud Detection, Agent Disclosure");
                },
                "has correct impact assessment": function () {
                    assert.equal(classUnderTest.impactAssessment(), "User Data Loss, Unintended Access, Regulatory, Compliance or Legal Impact, Loss of Confidential / Proprietary Information or Intellectual Property, Unintended Access, Disruption of Service / Operations, Destruction, Degradation of Service, Data Breach or Compromise, Loss of Competitive Advantage - Political, Loss of Competitive Advantage - Military, Loss of Competitive Advantage - Economic, Loss of Competitive Advantage, Brand or Image Degradation");
                },
                "has correct leveraged TTPs": function () {
                    var actual = classUnderTest.leveragedTTPs();
                    assert.isArray(actual);
                    assert.lengthOf(actual, 1);
                    var actualRelatedIndicator = actual[0];
                    assert.instanceOf(actualRelatedIndicator, TTP);
                    assert.equal(actualRelatedIndicator.id(), "purple-secure-systems:ttp-fd4a07b1-0649-4d95-a5f2-761deb09ba32");
                },
                "has correct related incidents": function () {
                    var actual = classUnderTest.relatedIncidents();
                    assert.isArray(actual);
                    assert.lengthOf(actual, 2);
                    var actualRelatedIndicator1 = actual[0];
                    assert.instanceOf(actualRelatedIndicator1, Incident);
                    assert.equal(actualRelatedIndicator1.id(), "purple-secure-systems:incident-2ac2d36b-fa0f-49aa-87bc-bdc27a497f19");
                    var actualRelatedIndicator2 = actual[1];
                    assert.instanceOf(actualRelatedIndicator2, Incident);
                    assert.equal(actualRelatedIndicator2.id(), "purple-secure-systems:incident-0b0090ab-bae8-4167-a538-9cc68033f9c9");
                },
                "has correct related indicators": function () {
                    var actual = classUnderTest.relatedIndicators();
                    assert.isArray(actual);
                    assert.lengthOf(actual, 2);
                    var actualRelatedIndicator1 = actual[0];
                    assert.instanceOf(actualRelatedIndicator1, Indicator);
                    assert.equal(actualRelatedIndicator1.id(), "purple-secure-systems:indicator-d46e13c9-7dce-4272-a593-1cd2f9212a2d");
                    var actualRelatedIndicator2 = actual[1];
                    assert.instanceOf(actualRelatedIndicator2, Indicator);
                    assert.equal(actualRelatedIndicator2.id(), "purple-secure-systems:indicator-1cf691e8-6428-402c-a28e-b609ba7d6d2d");
                },
                "has correct related observables": function () {
                    var actual = classUnderTest.relatedObservables();
                    assert.isArray(actual);
                    assert.lengthOf(actual, 3);
                    var actualRelatedIndicator1 = actual[0];
                    assert.instanceOf(actualRelatedIndicator1, Observable);
                    assert.equal(actualRelatedIndicator1.id(), "purple-secure-systems:observable-f9faeb29-9c98-434c-b07a-4647e6cdd6f2");
                    var actualRelatedIndicator2 = actual[1];
                    assert.instanceOf(actualRelatedIndicator2, Observable);
                    assert.equal(actualRelatedIndicator2.id(), "purple-secure-systems:observable-1fb0e40b-d23d-4b81-ab78-0824e2642ebf");
                    var actualRelatedIndicator3 = actual[2];
                    assert.instanceOf(actualRelatedIndicator3, Observable);
                    assert.equal(actualRelatedIndicator3.id(), "purple-secure-systems:observable-9db11783-3887-4f32-9f10-f18ebf2fba98");
                }
            }
        }
    });
});
