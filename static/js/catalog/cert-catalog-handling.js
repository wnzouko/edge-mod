define([
    "dcl/dcl",
    "knockout",
    "./cert-catalog-handling-modal",
    "kotemplate!list-select:./templates/publish_handling.html",
    "text!config-service"
], function (declare, ko, HandlingModal, ListSelectsTemplate, configService) {
    "use strict";

    var config = Object.freeze(JSON.parse(configService));
    var sharing_groups = config.sharing_groups;

    return declare(null, {
        declaredClass: "cert-catalog-handling",
        constructor: function () {
            this.choices = ko.observableArray(this.parseSharingGroups(sharing_groups))
        },

        parseSharingGroups: function (sharingGroups) {
            var LabelList = [];
            for (var key in sharingGroups) {
                if (sharingGroups.hasOwnProperty(key)) {
                    LabelList.push(sharingGroups[key])
                }
            }
            return LabelList
        },

        onPublish: function (callback) {
            var contentData = {
                choices: this.choices(),
                phase: ko.observable("INPUT"),
                message: ko.observable(""),
                publicationMessage: ko.observable(""),
                waitingForResponse: ko.observable(false)
            };

            var confirmModal = new HandlingModal({
                title: "Handling Caveats",
                titleIcon: "glyphicon-info-sign",
                contentData: contentData,
                contentTemplate: ListSelectsTemplate.id,
                buttonData: [
                    {
                        label: "Yes",
                        noClose: true,
                        callback: this._onHandlingModalOK.bind(this, callback),
                        disabled: ko.observable(false),
                        icon: "glyphicon-ok",
                        hide: ko.observable(false)
                    },
                    {
                        label: "No",
                        icon: "glyphicon-remove",
                        disabled: ko.observable(false),
                        hide: ko.observable(false)
                    },
                    {
                        label: "Publish",
                        hide: ko.observable(true),
                        callback: ko.observable()
                    }
                ]
            });
            confirmModal.show();
        },


        _onHandlingModalOK: function (callback, modal) {
            var yesButton = modal.getButtonByLabel("Yes");
            var noButton = modal.getButtonByLabel("No");
            var publishButton = modal.getButtonByLabel("Publish");

            yesButton.disabled(true);
            noButton.disabled(true);

            modal.contentData.waitingForResponse(true);
            modal.contentData.message("Setting Handling Caveats ...");

            this.publish({
                'handling': this.parseSharingtoStix(modal.items())
            }, function (response) {
                modal.contentData.phase("RESPONSE");
                modal.contentData.waitingForResponse(false);

                var success = !!(response["success"]);
                var errorMessage = response["error_message"];
                if (errorMessage) {
                    errorMessage = errorMessage.replace(/^[A-Z]/, function (match) {
                        return match.toLowerCase();
                    }).replace(/[,.]+$/, "");
                }
                var message = success ?
                    "The Handling Caveats were succesfully set" :
                "An error occurred during editing the STIX object (" + errorMessage + ")";
                var title = success ? "Success" : "Error";
                var titleIcon = success ? "glyphicon-ok-sign" : "glyphicon-exclamation-sign";

                modal.title(title);
                modal.titleIcon(titleIcon);
                modal.contentData.message(message);

                yesButton.hide(true);
                noButton.hide(true);
                publishButton.hide(false);
                publishButton.callback = callback.bind(modal);
            }.bind(this));
        },

        publish: function (onConfirmData, onPublishCallback) {
            postJSON("../review/handling/", ko.utils.extend(onConfirmData, {
                rootId: window["rootId"]
            }), onPublishCallback);
        },

        parseSharingtoStix: function (selectedSharingGroups) {
            var stixValues = [];
            ko.utils.arrayForEach(selectedSharingGroups, function (selectedGroup) {
                for (var key in sharing_groups) {
                    if (sharing_groups[key] == selectedGroup) {
                        stixValues.push(key);
                        break;
                    }
                }
            });
            return stixValues
        }
    });
});
