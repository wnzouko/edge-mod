define([
    "dcl/dcl",
    "knockout",
    "kotemplate!modal-container:./modal-template.html",
    "kotemplate!modal-default-content:./text-content.html"
], function (declare, ko, modalContainerTemplate, defaultContentTemplate) {
    "use strict";

    return declare(null, {
        constructor: function (options) {
            this.title = options["title"];
            this.titleIcon = options["titleIcon"];

            this.contentTemplate = options["contentTemplate"] || defaultContentTemplate.id;
            this.contentData = options["contentData"]; // No default viewmodel, let the bindings fail instead...

            this.buttonData = ko.observableArray(options["buttonData"] || [
                    {
                        label: "OK"
                    }
                ]);

            this.width = options["width"];
            this.height = options["height"];

            this.modalReference = null;
        },

        show: function () {
            if (this.modalReference !== null) {
                console.log("Attempt to show modal (title: " + this.title() + ") that is already open.");
                this.modalReference.modal("hide");
                this.modalReference = null;
            }

            var self = this;

            var targetDiv = document.createElement("div");
            targetDiv.style.display = "none";
            document.body.appendChild(targetDiv);

            ko.renderTemplate(
                modalContainerTemplate.id,
                this,
                {
                    afterRender: function(nodes) {
                        // Get the modal:
                        var modalElements = nodes.filter(function(node) {
                            return node.nodeType === 1; // Ignore text
                        });
                        var modal = $(modalElements);

                        // Ensure it always removes itself from the DOM when closed, and clean up the KO bindings:
                        modal.on("hidden.bs.modal", function () {
                            modal.each(function (index, element) { ko.cleanNode(element); });
                            modal.remove();
                        });

                        // Show it:
                        modal.modal({
                            backdrop: "static",
                            keyboard: false,
                            width: self.width,
                            height: self.height
                        });

                        self.modalReference = modal;
                    }
                },
                targetDiv,
                "replaceNode"
            );
        },

        handleClick: function (button) {
            if (typeof button.callback === "function") {
                button.callback();
            }
            if (button.noClose !== true) {
                this.modalReference.modal("hide");
                this.modalReference = null;
            }
        }
    });
});
