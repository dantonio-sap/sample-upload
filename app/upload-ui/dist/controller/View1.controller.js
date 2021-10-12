sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("uploadui.controller.View1",{apiUrl:"api/catalog/",onInit:function(){},onAfterItemAdded:function(e){var t=e.getParameter("item");this._createEntity(t).then(e=>{this._uploadContent(t,e)}).catch(e=>{console.log(e)})},onUploadCompleted:function(){var e=this.byId("uploadSet");e.removeAllIncompleteItems();e.getBinding("items").refresh()},_createEntity:function(e){var t={mediaType:e.getMediaType(),fileName:e.getFileName(),size:e.getFileObject().size};var a={url:`${this.apiUrl}/Attachments`,method:"POST",headers:{"Content-type":"application/json"},data:JSON.stringify(t)};return new Promise((e,t)=>{$.ajax(a).done((t,a,n)=>{e(t.ID)}).fail(e=>{t(e)})})},_uploadContent:function(e,t){var a=`${this.apiUrl}/Attachments(${t})/content`;e.setUploadUrl(a);var n=this.byId("uploadSet");n.setHttpRequestMethod("PUT");n.uploadItem(e)},formatThumbnailUrl:function(e){var t;switch(e){case"image/png":t="sap-icon://card";break;case"text/plain":t="sap-icon://document-text";break;case"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":t="sap-icon://excel-attachment";break;case"application/vnd.openxmlformats-officedocument.wordprocessingml.document":t="sap-icon://doc-attachment";break;case"application/pdf":t="sap-icon://pdf-attachment";break;default:t="sap-icon://attachment"}return t}})});