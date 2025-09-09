sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function (Controller, JSONModel, Filter, FilterOperator, Sorter) {
	"use strict";
	var _oController = null;
	var _oService = null;
	_oService = {
		init: function (oBaseController) {
			_oController = oBaseController;
		},

		postProcessDeepEntity :function(oData1)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aPaths = [ "/DynTabSet" ];
				var fnSuccessCallback = function (oData) {
					resolve(oData);
					//	debugger;
				};
				var fnErrorCallback =  function (oError) {
					reject(oError);
					//this.oDataRequestFailed(oModel, oError);
					//debugger;
				};
				this.oDataBatch({
					aPaths: aPaths,
					sMethod: "POST",
					sBatchGroupId: "detail",
					numberOfRequests: aPaths.length,
					fnSuccessCallback:  fnSuccessCallback,
					fnErrorCallback: fnErrorCallback
				}, oModel,oData1);
			});
		},
		getOutputDeviceSet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "50000",
					$inlinecount: "allpages"
				};
				oModel.read("/OutputDevSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getShipToPartySet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "100000",
					$inlinecount: "allpages"
				};
				oModel.read("/ShipToSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getShippingPointSet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "50000",
					$inlinecount: "allpages"
				};
				oModel.read("/ShipPointSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getCSPSet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "50000",
					$inlinecount: "allpages"
				};
				oModel.read("/CSPSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getCountrySet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "300",
					$inlinecount: "allpages"
				};
				oModel.read("/CountrySet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getOutputType: function (aFilter) {		
			//debugger;	
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				//debugger;
				var aUrlParameters = {
					$top: "300",
				};
				oModel.read("/OutputTypeSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData.results);
					},
					error: function (oError) {
						reject(oError);
					}
				});
			});
		},
		getGetAccessSequence: function (aFilter) {		
			//debugger;	
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				//debugger;
				var aUrlParameters = {
					$top: "100"
				};
				oModel.read("/AccSeqSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData.results);
					},
					error: function (oError) {
						reject(oError);
					}
				});
			});
		},
		getLanguage: function (aFilter) {		
			//debugger;	
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				//debugger;
				var aUrlParameters = {
					$top: "300"
				};
				oModel.read("/LanguageSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData.results);
					},
					error: function (oError) {
						reject(oError);
					}
				});
			});
		},
		getASNSourceSet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "100",
					$inlinecount: "allpages"
				};
				oModel.read("/ASNSourceSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getPrintTimePointSet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "100",
					$inlinecount: "allpages"
				};
				oModel.read("/PrintTimePointSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getPrintTimeActionPPFSet :function(aFilter)
		{
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "100",
					$inlinecount: "allpages"
				};
				oModel.read("/PrintTimeActionPPFSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getASNPartnerTypeSet: function (aFilter) {
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "100",
					$inlinecount: "allpages"
				};
				oModel.read("/ASNPartnerTypeSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		getASNPartnerSet: function (aFilter) {
			return new Promise((resolve, reject) => {
				let oModel = _oController.getOwnerComponent().getModel("mainService");
				var aUrlParameters = {
					$top: "50000",
					$inlinecount: "allpages"
				};
				oModel.read("/ASNPartnerSet", {
					filters: aFilter,
					urlParameters: aUrlParameters,
					success: function (oData) {
						resolve(oData);
						//debugger;
					},
					error: function (oError) {
						reject(oError);
						//debugger;
					}
				});
			});
		},
		oDataRead: function (oModel, sPath, oUrlParams, fnSuccess, fnError, groupId) {
			var oSettings = {
				urlParameters: oUrlParams,
				success: fnSuccess,
				error: fnError,
				groupId: groupId
			};
			oModel.read(sPath, oSettings);
		},
		oDataCreate: function (oModel, sPath, oUrlParams, oData, oContext, fnSuccess, fnError) {
			var oSettings = {
				context: oContext,
				success: fnSuccess,
				error: fnError,
				urlParameters: oUrlParams
			};
			oModel.create(sPath, oData, oSettings);
		},
		oDataBatch: function (mParameters, oModel,oData) {
			//debugger;
			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}
			oModel.setDeferredBatchGroups([mParameters.sBatchGroupId]);
			var sPath;
			var oEntry = {
				batchGroupId: mParameters.sBatchGroupId
			};
			for (var i = 0; i < mParameters.numberOfRequests; i++) {
				if (mParameters.aUrlParameters) {
					oEntry.urlParameters = mParameters.aUrlParameters;
				}
				 if (mParameters.filters) {
				 	oEntry.filters = mParameters.filters;
				 }
				if (mParameters.aProperties) {
					oEntry.properties = mParameters.aProperties[i];
				}
				if (mParameters.sPath) {
					sPath = mParameters.sPath;
				} else if (mParameters.aPaths) {
					sPath = mParameters.aPaths[i];
				}
				if (!jQuery.sap.startsWith(sPath, "/")) {
					sPath = "/" + sPath;
				}
				if (mParameters.sMethod === "GET") {
					oModel.read(sPath, oEntry);
				}
				else if (mParameters.sMethod === "POST") {
					oModel.create(sPath, oData ,oEntry);
				}
			}
			oModel.submitChanges({
				batchGroupId: mParameters.sBatchGroupId,
				success: mParameters.fnSuccessCallback,
				error: mParameters.fnErrorCallback
			});

			
		},
		oDataRequestFailed: function (oModel, oError, fnError) {
			var sMessage, sDetails;
			if (oError.hasOwnProperty("customMessage")) {
				sMessage = oError.customMessage.message;
				sDetails = oError.customMessage.details;
			} else {
				if (oError.response && oError.response.statusCode === "0") {
					sMessage = this.getResourceBundle().getText("DataManager.connectionError");
				} else {
					sMessage = this.getResourceBundle().getText("DataManager.HTTPRequestFailed");
				}
				if (oError.response && oError.response.body !== "" && oError.response.statusCode === "400") {
					var oParsedError = JSON.parse(oError.response.body);
					sDetails = oParsedError.error.message.value;
				} else {
					sDetails = oError.response ? oError.response.body : null;
				}
			}
			var oParameters = {
				message: sMessage,
				responseText: sDetails
			};
			this.showLocalErrorMessage(oParameters, fnError);
			oModel.fireRequestFailed(oParameters);
		},
		getErrorMessage: function (oError) {
			var oMessage;
			if (oError.response && oError.response.body && oError.response.body !== "") {
				try {
					oMessage = JSON.parse(oError.response.body);
					return (oMessage.error.message.value ? oMessage.error.message.value : null);
				} catch (e) {
					return oError.response.body;
				}
			} else if (oError.responseText && oError.responseText !== "") {
				try {
					oMessage = JSON.parse(oError.responseText);
					return (oMessage.error.message.value ? oMessage.error.message.value : null);
				} catch (e) {
					return oError.responseText;
				}
			} else if (oError.getParameter("responseText") || oError.getParameter("response").body) {
				return oError.getParameter("responseText") ? oError.getParameter("responseText") : oError.getParameter("response").body;
			} else {
				return null;
			}
		},
		showLocalErrorMessage: function (oError, fnError) {

			this.showMessageBox( fnError);
		},
		showMessageBox: function ( fnError) {
			sap.m.MessageBox.show(fnError, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Error"
			}); 
		}
		
	}

	return _oService;

});