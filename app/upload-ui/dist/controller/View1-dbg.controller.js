sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("uploadui.controller.View1", {
      apiUrl: "api/catalog/",

      onInit: function () {},
      onAfterItemAdded: function (oEvent) {
        var item = oEvent.getParameter("item");
        this._createEntity(item)
          .then((id) => {
            this._uploadContent(item, id);
          })
          .catch((err) => {
            console.log(err);
          });
      },

      onUploadCompleted: function () {
        var oUploadSet = this.byId("uploadSet");
        oUploadSet.removeAllIncompleteItems();
        oUploadSet.getBinding("items").refresh();
      },

      _createEntity: function (item) {
        var data = {
          mediaType: item.getMediaType(),
          fileName: item.getFileName(),
          size: item.getFileObject().size,
        };

        return new Promise((resolve, reject) => {
          var oBinding = this.getView().getModel().bindList("/Attachments");
          oBinding.attachCreateCompleted(
            function (oEvent) {
              if (!oEvent.getParameter("success")) {
                reject();
              } else {
                resolve(oEvent.getParameter("context").getPath());
              }
            }.bind(this)
          );
          oBinding.create(data);
        });

        // var settings = {
        //   url: `${this.apiUrl}/Attachments`,
        //   method: "POST",
        //   headers: {
        //     "Content-type": "application/json",
        //   },
        //   data: JSON.stringify(data),
        // };

        // return new Promise((resolve, reject) => {
        //   $.ajax(settings)
        //     .done((results, textStatus, request) => {
        //       resolve(results.ID);
        //     })
        //     .fail((err) => {
        //       reject(err);
        //     });
        // });
      },

      _uploadContent: function (item, id) {
        var serviceUrl = this.getView().getModel().sServiceUrl;
        var url = `${serviceUrl}${id}/content`;
        item.setUploadUrl(url);
        var oUploadSet = this.byId("uploadSet");
        oUploadSet.setHttpRequestMethod("PUT");
        oUploadSet.uploadItem(item);
      },

      formatThumbnailUrl: function (mediaType) {
        var iconUrl;
        switch (mediaType) {
          case "image/png":
            iconUrl = "sap-icon://card";
            break;
          case "text/plain":
            iconUrl = "sap-icon://document-text";
            break;
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            iconUrl = "sap-icon://excel-attachment";
            break;
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            iconUrl = "sap-icon://doc-attachment";
            break;
          case "application/pdf":
            iconUrl = "sap-icon://pdf-attachment";
            break;
          default:
            iconUrl = "sap-icon://attachment";
        }
        return iconUrl;
      },
    });
  }
);
