sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "../controller/modules/Base",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "../custom/CusValueHelpDialog",
    "sap/m/Token",
    'sap/ui/core/library'
], function (JSONModel, Base, History, MessageToast, CusValueHelpDialog, Token, coreLibrary) {
    "use strict";
    var ValueState = coreLibrary.ValueState;
    return Base.extend("com.bosch.rb1m.tm.tmoutputcond.controller.ObjectDetail", {

            onInit: function () {
                Base.prototype.onInit.apply(this);
                this.oSemanticPage = this.byId("idObjectPage");
                this.oEditAction = this.byId("editAction");
                this.oDeleteAction = this.byId("deleteAction");
                this.showFooter(false);
                this.fnInitializeSettingsModel();
                this.oMultiInput1 = this.getView().byId("SHIPPING_POINT");
                this.oMultiInput1.setValue("");
                this.oMultiInput1.removeAllTokens();
                this.oMultiInput1.addValidator(function (args) { // debugger;
                    var text = args.text;
                    var text1 = args.text;
                    return new Token({key: text, text: text1}).data("range", {
                        "include": true,
                        "operation": sap.ui.model.FilterOperator.EQ,
                        "keyField": "SHIPPING_POINT",
                        "value1": text,
                        "value2": ""
                    });

                });

                this.oMultiInput2 = this.getView().byId("SHIP_TO_PARTY");
                this.oMultiInput2.setValue("");
                this.oMultiInput2.removeAllTokens();
                this.oMultiInput2.addValidator(function (args) {
                    var text = args.text;
                    var text1 = args.text;
                    return new Token({key: text, text: text1}).data("range", {
                        "include": true,
                        "operation": sap.ui.model.FilterOperator.EQ,
                        "keyField": "SHIP_TO_PARTY",
                        "value1": text,
                        "value2": ""
                    });
                });

                this.oMultiInput3 = this.getView().byId("CSP");
                this.oMultiInput3.setValue("");
                this.oMultiInput3.removeAllTokens();
                this.oMultiInput3.addValidator(function (args) {
                    var text = args.text;
                    var text1 = args.text;
                    return new Token({key: text, text: text1}).data("range", {
                        "include": true,
                        "operation": sap.ui.model.FilterOperator.EQ,
                        "keyField": "CSP",
                        "value1": text,
                        "value2": ""
                    });
                });

                this.oMultiInput4 = this.getView().byId("DEST_COUNTRY");
                this.oMultiInput4.setValue("");
                this.oMultiInput4.removeAllTokens();
                this.oMultiInput4.addValidator(function (args) {
                    if (args.suggestedToken) {
                        var text = args.suggestedToken.getKey();
                        var text1 = args.text;
                        return new Token({key: text, text: text1}).data("range", {
                            "include": true,
                            "operation": sap.ui.model.FilterOperator.EQ,
                            "keyField": "CountryCode",
                            "value1": text,
                            "value2": ""
                        });
                    }

                });
                this.oCbx_OutputDevice = this.getView().byId("OUTPUT_DEVICE");
                this.oCbx_PRINT_LANGUAGE = this.getView().byId("PRINT_LANGUAGE");
                this.oCbx_ASN_SOURCE = this.getView().byId("cb_ASN_SOURCE_2");
                this.oCbx_Print_Time = this.getView().byId("comb_PRINT_TIMEPOINT_1");
                this.oCbx_ASN_Function = this.getView().byId("comb_FUNCTION_ASN_2");
                this.oCbx_ASN_PARTNER = this.getView().byId("comb_PARTNER_2");
                this.oCbx_OutputDevice.setValueState(sap.ui.core.ValueState.None);
                this.oCbx_PRINT_LANGUAGE.setValueState(sap.ui.core.ValueState.None);
                this.oCbx_ASN_SOURCE.setValueState(sap.ui.core.ValueState.None);
                this.oCbx_Print_Time.setValueState(sap.ui.core.ValueState.None);
                this.oCbx_ASN_PARTNER.setValueState(sap.ui.core.ValueState.None);
                this.oCbx_ASN_Function.setValueState(sap.ui.core.ValueState.None);

                this.oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                this.oMultiInput2.setValueState(sap.ui.core.ValueState.None);
                this.oMultiInput3.setValueState(sap.ui.core.ValueState.None);
                this.oMultiInput4.setValueState(sap.ui.core.ValueState.None);

                this.getRouter().getRoute("objectDetail").attachMatched(this.onRouteMatched, this);
            },
            /* Settings Model */
            fnInitializeSettingsModel: function () { // debugger;
                var oSettingsModel = new JSONModel({
                    tableDescription: "",
                    languages: [],
                    seltablename: "",
                    seloutputtype: "",
                    RowsHeader: [],
                    RowsItems: [],
                    editEnable: false,
                    createEnable: false,
                    operationMode: "",
                    coEnable: true,
                    dynamicTableTitle: "",
                    bOnCreate: false,
                    bDataFound: false,
                    showFooter: false,
                    dynamicForm: [],
                    deepDynamicTable: {},
                    ModeChange: "",
                    oDataDeepPayload: {},
                    FieldsSetInlineCount: [],
                    ShipToPartySet: [],
                    upDateError: false,
                    isChanged: false
                });
                this.setModel(oSettingsModel, "objectModel");
                // comboBoxModel
                var ocomboBoxModel = new JSONModel({
                    ArchieveModeSet: [],
                    AfterReleaseSet: [],
                    PrintLanguageSet: [],
                    PrintTimePointSet: [],
                    ASNPartnerSet: [],
                    ASNPartnerTypeSet: [],
                    OutputDevSet: [],
                    OutputTypeSet: [],
                    CountrySet: [],
                    unDoDataItems: []
                });
                this.setModel(ocomboBoxModel, "comboBoxModel");
            },
            fnGetOutputType: function (aFilter) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), true);
                this.getService().getOutputType(aFilter).then(function (aData) {
                    this.getModel("comboBoxModel").setProperty("/OutputTypeSet", aData);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                }.bind(this));
            },
            onRouteMatched: function () {
                this.getService().getCountrySet().then(function (oData) {
                    this.getModel("comboBoxModel").setProperty("/CountrySet", oData.results);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                    if (this.getOwnerComponent().getModel("oDataDeepPayload")) {
                        this.getModel("objectModel").setProperty("/oDataDeepPayload", this.getOwnerComponent().getModel("oDataDeepPayload").getProperty("/oDataDeepPayload"));
                    } else {
                        this.onNavBack();
                        return;
                    }
                    var oData = this.getOwnerComponent().getModel("objectDetail").getProperty("/objectDetail");
                    if (oData) {
                        this.getModel("objectModel").setProperty("/deepDynamicTable", oData);
                        if (oData.mode == "C") {
                            this.getModel("objectModel").setProperty("/editEnable", true);
                            this.getModel("objectModel").setProperty("/operationMode", "C");
                            this.getModel("objectModel").setProperty("/ModeChange", "I");
                            this.getModel("objectModel").setProperty("/createEnable", true);
                            this.onEdit();

                        } else if (oData.mode == "R") {
                            this.getModel("objectModel").setProperty("/editEnable", false);
                            this.getModel("objectModel").setProperty("/operationMode", "R");
                            this.getModel("objectModel").setProperty("/ModeChange", "U");
                            this.getModel("objectModel").setProperty("/createEnable", false);
                            this.showFooter(false);
                            this.oEditAction.setVisible(true);
                            this.oDeleteAction.setVisible(true);
                        }
                        this.fnGetDataHeaderItem(oData);
                        this.getModel("objectModel").setProperty("/tableDescription", oData.tableDescription);
                    }
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));

            },

            fnGetDataHeaderItem: function (oData) {
                var objData = oData;
                let arrFieldsSet = [];
                var data = new Array();
                let i = 0;
                objData.header.forEach(oHeader => { // data = new Array();
                    i = i + 1;
                    var a = oHeader.HeaderName;
                    var c = "Col" + oHeader.HeaderIndex;
                    if (objData.mode == "R") {
                        data[a] = objData.rows[c];
                    } else if (objData.mode == "C") {
                        if (objData.rows[0]) {
                            data[a] = objData.rows[0][c]
                        } else {
                            data[a] = objData.rows[c];
                        }
                    }

                });
                arrFieldsSet.push(data);
                this.getModel("objectModel").setProperty("/dynamicForm", arrFieldsSet);
                if (arrFieldsSet[0]) {
                    if (arrFieldsSet[0]["SHIPPING_POINT"]) {
                        this.oMultiInput1 = this.getView().byId("SHIPPING_POINT");
                        this.oMultiInput1.setTokens([new Token(
                                {text: arrFieldsSet[0]["SHIPPING_POINT"], key: arrFieldsSet[0]["SHIPPING_POINT"]
                                }
                            )]);
                        if (arrFieldsSet[0]["SHIPPING_POINT"].length < 1) {
                            this.oMultiInput1.removeAllTokens();
                        }
                    } else {
                        this.oMultiInput1.removeAllTokens();
                    }

                    if (arrFieldsSet[0]["SHIP_TO_PARTY"]) {
                        this.oMultiInput2 = this.getView().byId("SHIP_TO_PARTY");
                        this.oMultiInput2.setTokens([new Token(
                                {text: arrFieldsSet[0]["SHIP_TO_PARTY"], key: arrFieldsSet[0]["SHIP_TO_PARTY"]
                                }
                            )]);
                        if (arrFieldsSet[0]["SHIP_TO_PARTY"].length < 1) {
                            this.oMultiInput2.removeAllTokens();
                        }
                    } else {
                        this.oMultiInput2.removeAllTokens();
                    }
                    if (arrFieldsSet[0]["CSP"]) {
                        this.oMultiInput3 = this.getView().byId("CSP");
                        this.oMultiInput3.setTokens([new Token(
                                {text: arrFieldsSet[0]["CSP"], key: arrFieldsSet[0]["CSP"]
                                }
                            )]);
                        if (arrFieldsSet[0]["CSP"].length < 1) {
                            this.oMultiInput3.removeAllTokens();
                        }
                    } else {
                        this.oMultiInput3.removeAllTokens();
                    }
                    if (arrFieldsSet[0]["DEST_COUNTRY"]) {
                        var objCountryData = this.getModel("comboBoxModel").getProperty("/CountrySet");
                        let _countryName = "";
                        // get Country name based on DEST_COUNTRY
                        for (let i = 0; i < objCountryData.length; i++) {
                            if (objCountryData[i]["CountryCode"] == arrFieldsSet[0]["DEST_COUNTRY"]) {
                                _countryName = objCountryData[i]["CountryName"];
                                break;
                            }
                        }
                        this.oMultiInput4 = this.getView().byId("DEST_COUNTRY");
                        this.oMultiInput4.setTokens([new Token(
                                {text: _countryName, key: arrFieldsSet[0]["DEST_COUNTRY"]
                                }
                            )]);
                        if (arrFieldsSet[0]["DEST_COUNTRY"].length < 1) {
                            this.oMultiInput4.removeAllTokens();
                        }
                    } else {
                        this.oMultiInput4.removeAllTokens();
                    }
                    // OUTPUT_TYPE
                    if (arrFieldsSet[0]["OUTPUT_TYPE"]) {
                        this.getModel("objectModel").setProperty("/seloutputtype", arrFieldsSet[0]["OUTPUT_TYPE"]);
                    }
                }
                this.getModel("objectModel").setProperty("/RowsHeader", objData.header);
                var items = objData.rows;
                this.getModel("objectModel").setProperty("/RowsItems", items);
                this.fnSetHideElements(objData.header);
                this.oCbx_OutputDevice.setValueState(sap.ui.core.ValueState.None);
                this.oCbx_PRINT_LANGUAGE.setValueState(sap.ui.core.ValueState.None);
            },
            fnSetHideElements: function (rowHeader) {
                var oCustomAttributesContainer = this.getView().byId("customAttributesFormContainer");
                var oFormElements = oCustomAttributesContainer.getFormElements();
                var seloutputType = this.getModel("objectModel").getProperty("/seloutputtype");
                let existField = false;
                oFormElements.forEach(element => {
                    var idInput = element.getFields(0)[0].getId();
                    existField = false;
                    rowHeader.forEach(oHeader => {
                        if (idInput.includes(oHeader.HeaderName)) {
                            existField = true;
                        }
                    });
                    var textBoxHide = element.getFields(0)[0];
                    if (textBoxHide.getId().includes("REL_AFTER_OUTPUT")) {
                        existField = false
                    }
                    if (seloutputType.includes("_ASN_")) {
                        if (textBoxHide.getId().includes("OUTPUT_DEVICE")) {
                            existField = false
                        } else if (textBoxHide.getId().includes("PRINT_TIMEPOINT")) {
                            existField = false
                        } else if (textBoxHide.getId().includes("NO_OF_COPIES")) {
                            existField = false
                        } else if (textBoxHide.getId().includes("REL_AFTER_OUTPUT")) {
                            existField = false
                        } else if (textBoxHide.getId().includes("PRINT_LANGUAGE")) {
                            existField = false
                        } else if (textBoxHide.getId().includes("ARCHIEVE")) {
                            existField = false
                        }
						//set mandatory for all ASN input fiels
						if (textBoxHide.getId().includes("FUNCTION")) {
							textBoxHide.setRequired( true );
                        }
                        if (textBoxHide.getId().includes("PARTNER")) {
							textBoxHide.setRequired( true );
                        }
                        if (textBoxHide.getId().includes("ASN_SOURCE")) {
							textBoxHide.setRequired( true );
                        }

                    } else {
                        if (textBoxHide.getId().includes("FUNCTION")) {
                            existField = false
                        }
                        if (textBoxHide.getId().includes("PARTNER")) {
                            existField = false
                        }
                        if (textBoxHide.getId().includes("ASN_SOURCE")) {
                            existField = false
                        }
                    }
                    if (existField == false) {
                        textBoxHide.setVisible(false);
                        element.setVisible(false);
                    } else {
                        textBoxHide.setVisible(true);
                        element.setVisible(true);
                    }
                });
            },
            fnSetReadOnlyForUpdate: function (rowHeader) { // debugger;
                var oCustomAttributesContainer = this.getView().byId("customAttributesFormContainer");
                var oFormElements = oCustomAttributesContainer.getFormElements();
                oFormElements.forEach(element => {
                    var idInput = element.getFields(0)[0].getId();
                    rowHeader.forEach(oHeader => {
                        if (idInput.includes(oHeader.HeaderName)) {
                            var textBox = element.getFields(0)[0];
                            if (oHeader.HeaderKey == true) {

                                textBox.setEditable(false);
                                return;
                            }
                        }
                    });
                });
            },
            onNavBack: function () {
                var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    var aParts = sPreviousHash.split("/");
                    var sWorkItemId = aParts[2];
                    var rSpecialCharacters = /[^a-zA-Z0-9-_. ]/g;
                    var bContainsSpecialCharacters = rSpecialCharacters.test(sWorkItemId);
                    if (bContainsSpecialCharacters) {
                        history.go(-2); // eslint-disable-line sap-no-history-manipulation
                    } else {
                        history.go(-1);
                    }
                } else {
                    history.go(-1);
                }
            },
            onExit: function () {
                this.setModel("objectModel", {});
                this.getOwnerComponent().setModel("oDataDeepPayload", {});
                // objectModel
                this.setModel("comboBoxModel", {});
                this.getModel("objectModel").setProperty("/isChanged", false);
            },
            onDelete: function () {
                var messText = this.getResourceBundle().getText("dialog.warning.confirmation.single.delete");
                sap.m.MessageBox.warning(messText, {
                    actions: [
                        sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            this.fnDeleteData();
                        } else {
                            return;
                        }
                    }.bind(this)
                });
            },
            fnDeleteData: function () {
                var deepDynamicTable = this.getModel("objectModel").getProperty("/deepDynamicTable");
                var oDataForm = this.getModel("objectModel").getProperty("/dynamicForm");
                var data1 = {};
                for (let i = 0; i < deepDynamicTable.header.length; i++) {
                    let ocolumn = deepDynamicTable.header[i];
                    var a = ocolumn.HeaderName;
                    var c = "Col" + ocolumn.HeaderIndex;
                    data1[c] = oDataForm[0][a];
                }

                var _payload_deep_rt = this.getModel("objectModel").getProperty("/oDataDeepPayload");
                _payload_deep_rt.Mode = "D";
                _payload_deep_rt.ItemsNav = [];
                _payload_deep_rt.ItemsNav.push(data1);
                if (_payload_deep_rt.ItemsNav.length > 0) {
                    this.setBusy(true);
                    this.getModel("objectModel").setProperty("/ModeChange", "D");
                    this.getService().postProcessDeepEntity(_payload_deep_rt).then(function (aData) { // debugger;
                        if (aData.hasOwnProperty("__batchResponses") && aData.__batchResponses.length > 0) {
                            for (var i = 0; i < aData.__batchResponses.length; i++) {
                                var oStatusResponse = aData.__batchResponses[i];
                                if (oStatusResponse.hasOwnProperty("__changeResponses")) {
                                    if (i === 0) {
                                        var ochangeResponse = oStatusResponse.__changeResponses[0];
                                        if (ochangeResponse.statusCode >= 200 && ochangeResponse.statusCode < 300) {
                                            if (ochangeResponse.headers["sap-message"]) {
                                                var b = JSON.parse(ochangeResponse.headers["sap-message"])
                                                var oMessage = b.message;
                                                if (b.severity != "success") {
                                                    this._fnHandleErrorExe(oMessage);
                                                } else {
                                                    this._fnHandleSuccessExe(oMessage);
                                                }
                                            } else {
                                                this._fnHandleSuccessExe(oMessage);
                                            }
                                        } else { // Error
                                            this.setBusy(false);
                                            this._fnHandleErrorExe(oMessage);
                                        }
                                    }
                                } else {
                                    this.setBusy(false);
                                    this._fnHandleErrorExe(oMessage);
                                }
                                break;
                            }
                        }
                    }.bind(this), function (oError) {
                        this.setBusy(false);
                        this._fnHandleErrorExe();
                    }.bind(this));
                }
            },
            onTokenUpdate: function (oEvent) {
                this.getModel("objectModel").setProperty("/isChanged", true);
            },
            /* Display details information on Information tab */
            fnDisplayCustomAttributesData: function (oData) {
                var iColumnIndex = this.isPhoneDevice() ? 0 : 1;
                var oCustomAttributesContainer = this.getView().byId("customAttributesFormContainer");
                var aElements = [];
                oCustomAttributesContainer.destroyFormElements();
                if (oData.header.length > 0 && oData.rows) {
                    for (var i = 0; i < oData.header.length; i++) {
                        var oFormElement = new sap.ui.layout.form.FormElement("", {});
                        oFormElement.setLayoutData(new sap.ui.layout.ResponsiveFlowLayoutData("", {
                            linebreak: true,
                            margin: false
                        }));

                        var oLabel = new sap.m.Label("", {text: oData.header[i].headerValue});
                        oLabel.setLayoutData(new sap.ui.layout.ResponsiveFlowLayoutData("", {
                            weight: 3,
                            minWidth: 192
                        }));
                        oFormElement.setLabel(oLabel);

                        var oText = new sap.m.Text("", {
                            text: oData.rows[i + iColumnIndex]
                        });
                        oText.setLayoutData(new sap.ui.layout.ResponsiveFlowLayoutData("", {weight: 5}));

                        oFormElement.addField(oText);
                        oCustomAttributesContainer.addFormElement(oFormElement);
                        aElements.push(oFormElement);
                    }
                }
            },
            showFooter: function (bShow) {
                this.oSemanticPage.setShowFooter(bShow);
            },
            onEdit: function () {
                this.getModel("objectModel").setProperty("/showFooter", true)
                this.getModel("objectModel").setProperty("/isChanged", false);
                if (this.getModel("objectModel").getProperty("/operationMode") == "C") {
                    this.getModel("objectModel").setProperty("/editEnable", true)
                    this.getModel("objectModel").setProperty("/createEnable", true);
                    if (this.getModel("objectModel").getProperty("/operationMode") == "C") {
                        if (this.getModel("objectModel").getProperty("/upDateError") == true) {
                            this.getModel("objectModel").setProperty("/ModeChange", "I");
                        }
                    }
                } else {
                    this.getModel("objectModel").setProperty("/createEnable", false);
                    var rowsHeader = this.getModel("objectModel").getProperty("/RowsHeader");
                    this.fnSetReadOnlyForUpdate(rowsHeader);
                    this.getModel("objectModel").setProperty("/editEnable", true)
                }

                this.showFooter(true);
                this.oEditAction.setVisible(false);
                this.oDeleteAction.setVisible(false);
                // Keep Original data before change. - unDoDataItems
                var oTableModel = this.getModel("objectModel").getProperty("/deepDynamicTable");
                const oDataForm = this.getModel("objectModel").getProperty("/dynamicForm");
                var aTokensShipPoint = this.oMultiInput1.getTokens();
                var aTokensShipTo = this.oMultiInput2.getTokens();
                var aTokensCsp = this.oMultiInput3.getTokens();
                var aTokenscountry = this.oMultiInput4.getTokens();
                if (oDataForm[0]) {
                    if (aTokensShipPoint[0]) {
                        oDataForm[0]["SHIPPING_POINT"] = aTokensShipPoint[0].getKey();
                    }
                    if (aTokensShipTo[0]) {
                        oDataForm[0]["SHIP_TO_PARTY"] = aTokensShipTo[0].getKey();
                    }
                    if (aTokensCsp[0]) {
                        oDataForm[0]["CSP"] = aTokensCsp[0].getKey();
                    }
                    if (aTokenscountry[0]) {
                        oDataForm[0]["DEST_COUNTRY"] = aTokenscountry[0].getKey();
                    }
                }
                if (oDataForm) {
                    var data1 = {};
                    data1 = {};
                    var aData = [];
                    for (let i = 0; i < oDataForm.length; i++) {
                        data1 = {};
                        oTableModel.header.forEach(ocolumn => {
                            var a = ocolumn.HeaderName;
                            var c = "Col" + ocolumn.HeaderIndex;
                            data1[c] = oDataForm[i][a];
                        });
                        aData.push(data1);
                    }
                    this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
                    this.getModel("comboBoxModel").setProperty("/unDoDataItems", aData);
                }

            },
            onSave: function () { // debugger;
                var deepDynamicTable = this.getModel("objectModel").getProperty("/deepDynamicTable");
                var oDataForm = this.getModel("objectModel").getProperty("/dynamicForm");
				var seloutputType = this.getModel("objectModel").getProperty("/seloutputtype");
                // update token values
                var flagCheck = true;
                if (this.oMultiInput1.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.ShippingPoint.Invalid");
                    this.oMultiInput1.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                if (this.oMultiInput2.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.ShipToParty.Invalid");
                    this.oMultiInput2.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }

                if (this.oMultiInput3.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.CSP.Invalid");
                    this.oMultiInput3.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }

                if (this.oMultiInput4.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.country.Invalid");
                    this.oMultiInput4.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                if (this.oCbx_OutputDevice.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.OutputDevice.Invalid");
                    this.oCbx_OutputDevice.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                if (this.oCbx_PRINT_LANGUAGE.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.print_language.Invalid");
                    this.oCbx_PRINT_LANGUAGE.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
    
                if (this.oCbx_Print_Time.getValueState() == "Error") {
                    flagCheck = false;
                    var _message = this.getResourceBundle().getText("dialog.error.print_timepoint.Invalid");
                    this.oCbx_Print_Time.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                if (seloutputType.includes("_ASN_"))
                {
                    if (this.oCbx_ASN_SOURCE.getValueState() == "Error") {
                        flagCheck = false;
                        var _message = this.getResourceBundle().getText("dialog.error.asn_source.Invalid");
                        this.oCbx_ASN_SOURCE.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }

                    if (this.oCbx_ASN_PARTNER.getValueState() == "Error") {
                        flagCheck = false;
                        var _message = this.getResourceBundle().getText("dialog.error.asn_partner.Invalid");
                        this.oCbx_ASN_PARTNER.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }
                    if (this.oCbx_ASN_Function.getValueState() == "Error") {
                        flagCheck = false;
                        var _message = this.getResourceBundle().getText("dialog.error.asn_function.Invalid");
                        this.oCbx_ASN_Function.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }
                }
                if (flagCheck == false) {
                    return;
                }
                var aTokensShipPoint = this.oMultiInput1.getTokens();
                var aTokensShipTo = this.oMultiInput2.getTokens();
                var aTokensCsp = this.oMultiInput3.getTokens();
                var aTokenscountry = this.oMultiInput4.getTokens();
                if (oDataForm[0]) {
                    if (aTokensShipPoint[0]) {
                        oDataForm[0]["SHIPPING_POINT"] = aTokensShipPoint[0].getKey();
                        // this.ValidateCheckShippingPoint(oDataForm[0]["SHIPPING_POINT"]);
                    } else {
                        oDataForm[0]["SHIPPING_POINT"] = "";
                    }
                    if (aTokensShipTo[0]) {
                        oDataForm[0]["SHIP_TO_PARTY"] = aTokensShipTo[0].getKey();
                    } else {
                        oDataForm[0]["SHIP_TO_PARTY"] = "";
                    }
                    if (aTokensCsp[0]) {
                        oDataForm[0]["CSP"] = aTokensCsp[0].getKey();
                    } else {
                        oDataForm[0]["CSP"] = "";
                    }
                    if (aTokenscountry[0]) {
                        oDataForm[0]["DEST_COUNTRY"] = aTokenscountry[0].getKey();
                    } else {
                        oDataForm[0]["DEST_COUNTRY"] = "";
                    }

                }
                let d = oDataForm[0];
                if (d["NO_OF_COPIES"]) {
                    let j = d["NO_OF_COPIES"];
                    if (j.length > 0) {
                        let h = parseInt(j);
                        if (h > 0) {
                            if (d["PRINT_TIMEPOINT"]) {
                                let g = d["PRINT_TIMEPOINT"];
                                if (g.length < 1) { // dialog.error.validation.save.print_timepoint
                                    flagCheck = true;
                                    let _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.Obj.print_timepoint");
                                    sap.m.MessageBox.show(_message, {
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: "Error"
                                    });
                                    return;
                                }
                            } else { // dialog.error.validation.save.print_timepoint
                                flagCheck = true;
                                let _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.Obj.print_timepoint");
                                sap.m.MessageBox.show(_message, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: "Error"
                                });
                                return;
                            }

                        }
                    } else {
                        this.getView().byId("NO_OF_COPIES").setValue("0")
                    }
                } else {
                    this.getView().byId("NO_OF_COPIES").setValue("0")
                }

                var data1 = {};
                let chkKeyValue = true;
				let chkRequired = false;
                for (let i = 0; i < deepDynamicTable.header.length; i++) {
                    let ocolumn = deepDynamicTable.header[i];
                    var a = ocolumn.HeaderName;
                    var c = "Col" + ocolumn.HeaderIndex;
					if (seloutputType.includes("_ASN_")){

						//set mandatory for all ASN input fiels
						if (a.includes("FUNCTION")) {
							chkRequired = true;
                        }
						else if (a.includes("PARTNER")) {
							chkRequired = true;
                        }
                        else if (a.includes("ASN_SOURCE")) {
							chkRequired = true;
                        }
						else{
							chkRequired = false;
						}

						if (oDataForm[0][a].length < 1 && chkRequired == true ) {
							chkKeyValue = false;
							let _message = this.getResourceBundle().getText("dialog.error.CheckMandatory.Invalid") + " " + ocolumn.HeaderValue;
							sap.m.MessageBox.show(_message, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error"
							});
							break;
						}
                        if (ocolumn.HeaderKey == true) {
							if (oDataForm[0][a].length < 1) {
								chkKeyValue = false;
								let _message = this.getResourceBundle().getText("dialog.error.CheckMandatory.Invalid") + " " + ocolumn.HeaderValue;
								sap.m.MessageBox.show(_message, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error"
								});
								break;
							}
						}
					}
					else{
						if (ocolumn.HeaderKey == true) {
							if (oDataForm[0][a].length < 1) {
								chkKeyValue = false;
								let _message = this.getResourceBundle().getText("dialog.error.CheckMandatory.Invalid") + " " + ocolumn.HeaderValue;
								sap.m.MessageBox.show(_message, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error"
								});
								break;
							}
						}
					}
                    data1[c] = oDataForm[0][a];
                }

                var _payload_deep_rt = this.getModel("objectModel").getProperty("/oDataDeepPayload");
                if (chkKeyValue == false) {
                    _payload_deep_rt.ItemsNav = [];
                    return;
                }

                _payload_deep_rt.Mode = this.getModel("objectModel").getProperty("/ModeChange");
                _payload_deep_rt.ItemsNav = [];
                _payload_deep_rt.ItemsNav.push(data1);
                if (_payload_deep_rt.ItemsNav.length > 0) {
                    this.setBusy(true);
                    this.getService().postProcessDeepEntity(_payload_deep_rt).then(function (aData) { // debugger;
                        if (aData.hasOwnProperty("__batchResponses") && aData.__batchResponses.length > 0) {
                            for (var i = 0; i < aData.__batchResponses.length; i++) {
                                var oStatusResponse = aData.__batchResponses[i];
                                if (oStatusResponse.hasOwnProperty("__changeResponses")) {
                                    if (i === 0) {
                                        var ochangeResponse = oStatusResponse.__changeResponses[0];
                                        if (ochangeResponse.statusCode >= 200 && ochangeResponse.statusCode < 300) {
                                            if (ochangeResponse.headers["sap-message"]) {
                                                var b = JSON.parse(ochangeResponse.headers["sap-message"])
                                                var oMessage = b.message;
                                                if (b.severity != "success") {
                                                    this._fnHandleErrorExe(oMessage);
                                                    if (this.getModel("objectModel").getProperty("/operationMode") == "C") {
                                                        this.getModel("objectModel").setProperty("/upDateError", true)
                                                    }
                                                } else {
                                                    this._fnHandleSuccessExe(oMessage);
                                                }
                                            } else {
                                                this._fnHandleSuccessExe(oMessage);
                                            }
                                        } else {
                                            // Error
                                            // this._fnHandleErrorExe();
                                            this.setBusy(false);
                                            this._fnHandleErrorExe(oMessage);
                                            if (this.getModel("objectModel").getProperty("/operationMode") == "C") {
                                                this.getModel("objectModel").setProperty("/upDateError", true)
                                            }
                                        }
                                    }
                                } else {
                                    this.setBusy(false);
                                    this._fnHandleErrorExe(oMessage);
                                    if (this.getModel("objectModel").getProperty("/operationMode") == "C") {
                                        this.getModel("objectModel").setProperty("/upDateError", true)
                                    }
                                }
                                break;
                            }

                        }
                    }.bind(this), function (oError) {
                        this.setBusy(false);
                        // this._fnHandleErrorExe();
                        this._fnHandleErrorExe();
                    }.bind(this));
                }
            },

            _fnHandleSuccessExe: function (_aMessage) {
                this.setBusy(false);
                var _message = "";
                if (_aMessage) {
                    _message = _aMessage;
                } else {
                    _message = this.getResourceBundle().getText("dialog.success.save.complete");
                }

                if (this.getModel("objectModel").getProperty("/ModeChange") == "D") {
                    _message = this.getResourceBundle().getText("dialog.success.delete.complete");
                }

                sap.m.MessageBox.show(_message, {
                    icon: sap.m.MessageBox.Icon.SUCCESS,
                    title: "Success"
                });
                this.getModel("objectModel").setProperty("/isChanged", false);
                var aItemData = this.getModel("objectModel").getProperty("/dynamicForm");
                var bIsMode = this.getModel("objectModel").getProperty("/ModeChange");;
                this.getModel("objectModel").setProperty("/showFooter", false)
                this.getModel("objectModel").setProperty("/editEnable", false)
                this.getModel("objectModel").setProperty("/createEnable", false);
                this.showFooter(false);
                this.oEditAction.setVisible(true);
                this.getOwnerComponent().getEventBus().publish("MainViewTable", "ItemChange", {
                    aItem: aItemData,
                    bIsMode: bIsMode
                });
                if (this.getModel("objectModel").getProperty("/ModeChange") == "D") {
                    this.getModel("objectModel").setProperty("/dynamicForm", []);
                    jQuery.sap.delayedCall(2500, this, function () {
                        this.onNavBack();
                    });
                }
                this.getView().getModel("objectModel").refresh(true);

            },
            _fnHandleErrorExe: function (_aMessage) { // MessageToast.show("Data cannot be saved!");
                this.setBusy(false);
                var _message = "";
                if (_aMessage) {
                    _message = _aMessage;
                } else {
                    _message = this.getResourceBundle().getText("dialog.error.save.failed");
                }
                sap.m.MessageBox.show(_message, {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error"
                });
            },
            onCancel: function () { // this.oDeleteAction.setVisible(true);
                var isChanged = this.getModel("objectModel").getProperty("/isChanged");
                var _mode = this.getModel("objectModel").getProperty("/operationMode")
                if (isChanged == true) {
                    sap.m.MessageBox.warning("Do you want to cancel? You might lose your data.", {
                        actions: [
                            sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL
                        ],
                        emphasizedAction: sap.m.MessageBox.Action.YES,
                        onClose: function (sAction) {
                            if (sAction === sap.m.MessageBox.Action.YES) {
                                this.getModel("objectModel").setProperty("/showFooter", false)
                                this.getModel("objectModel").setProperty("/editEnable", false)
                                this.getModel("objectModel").setProperty("/createEnable", false);
                                this.showFooter(false);
                                this.oEditAction.setVisible(true);
                                // Return Backdata for item table data.
                                var unDoDataItems = this.getModel("comboBoxModel").getProperty("/unDoDataItems");
                                if (unDoDataItems) {
                                    var oTableModel = this.getModel("objectModel").getProperty("/deepDynamicTable");
                                    let arrFieldsSet = [];
                                    var data = new Array();
                                    // debugger;
                                    for (let a = 0; a < unDoDataItems.length; a++) {
                                        let i = 0;
                                        data = new Array();
                                        oTableModel.header.forEach(oHeader => { // data = new Array();
                                            i = i + 1;
                                            let j = oHeader.HeaderName;
                                            let c = "Col" + oHeader.HeaderIndex;
                                            data[j] = unDoDataItems[a][c];
                                        });
                                        arrFieldsSet.push(data);
                                    }
                                    if (_mode != "C") {
                                        this.getModel("objectModel").setProperty("/dynamicForm", [])
                                        this.getModel("objectModel").setProperty("/dynamicForm", arrFieldsSet);
                                        this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
                                    } else {
                                        this.getModel("objectModel").setProperty("/dynamicForm", [])
                                        this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
                                        this.onNavBack();
                                    }
                                }

                            } else {
                                return;
                            }
                        }.bind(this)
                    });
                } else {
                    this.getModel("objectModel").setProperty("/showFooter", false)
                    this.getModel("objectModel").setProperty("/editEnable", false)
                    this.getModel("objectModel").setProperty("/createEnable", false);
                    this.showFooter(false);
                    this.oEditAction.setVisible(true);
                    this.oDeleteAction.setVisible(true);
                    if (_mode == "C") {
                        this.getModel("objectModel").setProperty("/dynamicForm", [])
                        this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
                        this.onNavBack();
                    }
                }
            },
            onBeforeRendering: function () { // this.fnGetCountrySet();
            },
            onAfterRendering: function (oEvent) {
                this.fnGetPrintLanguageSet();
                this.fngetASNSourceSet();
                this.fnGetOutputType();
                this.fnGetPrintTimePointSet();
                this.fnGetASNPartnerTypeSet();
            },
            fnGetASNPartnerTypeSet: function (aFilter) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
                this.getService().getASNPartnerTypeSet(aFilter).then(function (aData) { // debugger;
                    this.getModel("comboBoxModel").setProperty("/ASNPartnerTypeSet", aData.results);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));
            },
            fnGetCountrySet: function (aFilter) {
                this.getService().getCountrySet(aFilter).then(function (oData) {
                    this.getModel("comboBoxModel").setProperty("/CountrySet", oData.results);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));
            },
            fnGetPrintTimePointSet: function (aFilter) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
                this.getService().getPrintTimePointSet(aFilter).then(function (aData) { // debugger;
                    this.getModel("comboBoxModel").setProperty("/PrintTimePointSet", aData.results);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));
            },
            fngetASNSourceSet: function (aFilter) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
                this.getService().getASNSourceSet(aFilter).then(function (aData) { // debugger;
                    this.getModel("comboBoxModel").setProperty("/ASNSourceSet", aData.results);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));
            },

            fnGetOutputDeviceSet: function (aFilter) {
                this.setBusy(true);
                this.getService().getOutputDeviceSet(aFilter).then(function (aData) {
                    this.getModel("comboBoxModel").setProperty("/OutputDevSet", aData.results);
                    this.setBusy(false)
                }.bind(this), function (oError) {
                    this.setBusy(false)
                }.bind(this));
            },
            fnGetPrintLanguageSet: function (aFilter) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
                this.getService().getLanguage(aFilter).then(function (aData) { // debugger;
                    this.getModel("comboBoxModel").setProperty("/PrintLanguageSet", aData);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));
            },
            onValueHelpRequestAuto: function (oEvent) {
                let aFilter = [];
                var oID = oEvent.getParameters().id;
                let oControlname = oID.split("--")[2];
                this.oControl = this.byId(oControlname);
                let _entityName = oEvent.oSource.mProperties.name;
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
                let arrayFieldsLabel = [];
                let arrayColumns = [];
                this._oSourceFieldIDF4 = oEvent.getSource();
                switch (oControlname) {
                    case "SHIPPING_POINT":
                        var data = new Array();
                        data.Field1 = this.getResourceBundle().getText("shipping_point_txt")
                        data.Field2 = this.getResourceBundle().getText("description_txt")
                        arrayFieldsLabel.push(data);

                        data = new Array();
                        data.Field1 = "ShippingPoint"
                        data.Field2 = "Description"
                        arrayColumns.push(data);
                        var arrFieldsSet = [];
                        var _inlineCount = 0
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), true);
                        this.getService().getShippingPointSet(aFilter).then(function (oData) { // this.getModel("dataModel").setProperty("/ShippingPointSet", aData);
                            _inlineCount = oData.__count;
                            for (let i = 0; i < oData.results.length; i++) {
                                arrFieldsSet.push(oData.results[i]);
                            }
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                            this.onValueHelpPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("shipping_point_txt"), _entityName, _inlineCount);
                        }.bind(this), function (oError) {
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                        }.bind(this));
                        break;
                    case "SHIP_TO_PARTY":
                        // for testing purpose.
                        var data = new Array();
                        data.Field1 = this.getResourceBundle().getText("ship_to_party_txt")
                        data.Field2 = this.getResourceBundle().getText("description_txt")
                        arrayFieldsLabel.push(data);

                        data = new Array();
                        data.Field1 = "ShipToParty"
                        data.Field2 = "Description"
                        arrayColumns.push(data);

                        var _inlineCount = 0;
                        var arrFieldsSet = [];
                        var data = new Array();
                        this.getService().getShipToPartySet(aFilter).then(function (oData) { // this.getModel("dataModel").setProperty("/ShippingPointSet", aData);
                            _inlineCount = oData.__count;
                            for (let i = 0; i < oData.results.length; i++) {
                                arrFieldsSet.push(oData.results[i]);
                            }
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                            this.onValueHelpPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("ship_to_party_txt"), _entityName, _inlineCount);
                        }.bind(this), function (oError) {
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                        }.bind(this));

                        break;
                    case "CSP":
                        // for testing purpose.
                        var data = new Array();
                        data.Field1 = this.getResourceBundle().getText("csp_txt")
                        data.Field2 = this.getResourceBundle().getText("description_txt")
                        arrayFieldsLabel.push(data);

                        data = new Array();
                        data.Field1 = "Csp"
                        data.Field2 = "CspDescription"
                        arrayColumns.push(data);

                        var _inlineCount = 2;
                        var arrFieldsSet = [];
                        this.getService().getCSPSet(aFilter).then(function (oData) { // this.getModel("dataModel").setProperty("/ShippingPointSet", aData);
                            _inlineCount = oData.__count;
                            for (let i = 0; i < oData.results.length; i++) {
                                arrFieldsSet.push(oData.results[i]);
                            }
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                            this.onValueHelpPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("csp_txt"), _entityName, _inlineCount);
                        }.bind(this), function (oError) {
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                        }.bind(this));

                        break;
                    case "DEST_COUNTRY":
                        // for testing purpose.
                        var data = new Array();
                        data.Field1 = this.getResourceBundle().getText("country_txt")
                        data.Field2 = this.getResourceBundle().getText("country_name_txt")
                        arrayFieldsLabel.push(data);

                        data = new Array();
                        data.Field1 = "CountryCode"
                        data.Field2 = "CountryName"
                        arrayColumns.push(data);

                        var _inlineCount = 2;
                        var arrFieldsSet = [];

                        this.getService().getCountrySet(aFilter).then(function (oData) {
                            _inlineCount = oData.__count;
                            for (let i = 0; i < oData.results.length; i++) {
                                arrFieldsSet.push(oData.results[i]);
                            }
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                            this.onValueHelpPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("country_txt"), _entityName, _inlineCount);
                        }.bind(this), function (oError) {
                            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenForm"), false);
                        }.bind(this));
                        break;
                    default:
                        // code block
                }
            },

            onValueHelpPopup: async function (_oLabels, _oColumns, _oData1, oControl, _title, _entityName, _inlineCount) { // debugger;
                this.fnSetBusyIndicatorOnDetailControls(oControl, true)
                var _ColumnFields = CusValueHelpDialog.fnCreateBindingColumn(_oLabels, _oColumns, "objectModel>");
                let arrFieldsSet = CusValueHelpDialog.fnReGenerateOdataSetF4(_oLabels, _oColumns, _oData1, "/ShipToPartySet");
                this.getModel("objectModel").setProperty("/ShipToPartySet", []);
                this.getModel("objectModel").setProperty("/ShipToPartySet", arrFieldsSet);
                let arrCols = _oColumns[0];
                let dataService = this.getService();
                let _arrPrefliter = {};
                let _tblPrefliter = [];
                if (this._oSourceFieldIDF4.getValue()) {
                    let _f4Value = this._oSourceFieldIDF4.getValue();
                    if (_f4Value.length > 0) {
                        _arrPrefliter = {
                            path: arrCols["Field1"],
                            operator: sap.ui.model.FilterOperator.Contains,
                            values: [_f4Value]
                        };
                        _tblPrefliter.push(_arrPrefliter);
                    }
                }
                this._valueHelpDialog = await CusValueHelpDialog.createValueHelp({
                    title: _title,
                    model: this.getModel("objectModel"),
                    multiSelect: false,
                    keyField: arrCols["Field1"],
                    keyDescField: "",
                    basePath: "objectModel>/ShipToPartySet",
                    preFilters: _tblPrefliter,
                    columns: _ColumnFields,
                    modeQuery: 2,
                    oService: dataService,
                    entityName: _entityName,
                    labelDefinition: _oLabels,
                    columnDefiniton: _oColumns,
                    inlineCount: _inlineCount,
                    ok: function (selectedRow) {
                        let aTokens = [];
                        for (var i = 0; i < selectedRow.length; i++) {
                            if (selectedRow[i]) {
                                var oToken1 = new Token({key: selectedRow[i][arrCols["Field1"]], text: selectedRow[i][arrCols["Field1"]]});
                                if (arrCols["Field1"] == "CountryCode") {
                                    var text = selectedRow[i][arrCols["Field2"]];
                                    oToken1 = new Token({key: selectedRow[i][arrCols["Field1"]], text: text});
                                }
                                aTokens.push(oToken1);
                            }

                        }
                        this._oSourceFieldIDF4.setTokens(aTokens);
                        this._oSourceFieldIDF4.setValueState(sap.ui.core.ValueState.None);
                        this._oSourceFieldIDF4.setValue("");
                        this._oSourceFieldIDF4.fireSubmit();
                        this._valueHelpDialog.close();
                    }.bind(this),
                    beforeOpen: function (oEvent) {
                        this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
                    }.bind(this),
                    afterOpen: function (oEvent) {
                        this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                    }.bind(this),
                    afterClose: function (oEvent) {
                        this._valueHelpDialog.destroy()

                    }.bind(this)
                });
                this.getView().addDependent(this._valueHelpDialog);

                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                let aTokens = [];
                this._valueHelpDialog.setTokens(aTokens);
                this._valueHelpDialog.setTokens(this.oControl.getTokens());
                this._valueHelpDialog.update();
                this._valueHelpDialog.open();
            },

            handleChangeCbDevice: function (oEvent) {
                var oValidatedComboBox = oEvent.getSource(),
                    sSelectedKey = oValidatedComboBox.getSelectedKey(),
                    sValue = oValidatedComboBox.getValue();
                this.getModel("objectModel").setProperty("/isChanged", true);
                if (! sSelectedKey && sValue) {
                    oValidatedComboBox.setValueState(ValueState.Error);
                    if (oValidatedComboBox.sId.includes("PRINT_LANGUAGE")) {
                        oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.print_language"));
                    }
                    if (oValidatedComboBox.sId.includes("PRINT_TIMEPOINT")) {
                        oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.print_timepoint"));
                    }
                } else {
                    oValidatedComboBox.setValueState(ValueState.None);
                }
            },
            onCheckShippingPoint: function (oEvent) {

                var akeyvalue = oEvent.getSource().getValue();
                var aFilter = [];
                // debugger;
                if (akeyvalue.length < 1) {
                    return;
                }
                this.getModel("objectModel").setProperty("/isChanged", true);
                aFilter.push(
                    // Shipping point
                        new sap.ui.model.Filter("ShippingPoint", sap.ui.model.FilterOperator.EQ, akeyvalue)
                );
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIPPING_POINT"), true);
                this.getService().getShippingPointSet(aFilter).then(function (oData) {
                    if (oData.results.length > 0) {
                        this.oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                    } else {
                        this.oMultiInput1.setValueState("Error");
                        this.oMultiInput1.setShowValueStateMessage(true);
                        var _message = this.getResourceBundle().getText("dialog.error.ShippingPoint.Invalid");
                        this.oMultiInput1.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIPPING_POINT"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIPPING_POINT"), false);
                }.bind(this));
            },

            onCheckShipToParty: function (oEvent) {
                var akeyvalue = oEvent.getSource().getValue();
                var aFilter = [];
                // debugger;
                if (akeyvalue.length < 1) {
                    return;
                }
                this.getModel("objectModel").setProperty("/isChanged", true);
                aFilter.push(
                    // FreightOrderDocument
                        new sap.ui.model.Filter("ShipToParty", sap.ui.model.FilterOperator.EQ, akeyvalue)
                );
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIP_TO_PARTY"), true);
                this.getService().getShipToPartySet(aFilter).then(function (oData) {
                    if (oData.results.length > 0) {
                        this.oMultiInput2.setValueState(sap.ui.core.ValueState.None);
                    } else {
                        this.oMultiInput2.setValueState("Error");
                        this.oMultiInput2.setShowValueStateMessage(true);
                        var _message = this.getResourceBundle().getText("dialog.error.ShipToParty.Invalid");
                        this.oMultiInput2.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIP_TO_PARTY"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIP_TO_PARTY"), false);
                }.bind(this));

            },

            onCheckCsp: function (oEvent) {
                var akeyvalue = oEvent.getSource().getValue();
                var aFilter = [];
                // debugger;
                if (akeyvalue.length < 1) {
                    return;
                }
                this.getModel("objectModel").setProperty("/isChanged", true);
                aFilter.push(
                    // FreightOrderDocument
                        new sap.ui.model.Filter("Csp", sap.ui.model.FilterOperator.EQ, akeyvalue)
                );

                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("CSP"), true);
                this.getService().getCSPSet(aFilter).then(function (oData) {
                    if (oData.results.length > 0) {
                        this.oMultiInput3.setValueState(sap.ui.core.ValueState.None);
                    } else {
                        this.oMultiInput3.setValueState("Error");
                        this.oMultiInput3.setShowValueStateMessage(true);
                        var _message = this.getResourceBundle().getText("dialog.error.CSP.Invalid");
                        this.oMultiInput3.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("CSP"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("CSP"), false);
                }.bind(this));
            },

            onCheckCountry: function (oEvent) {
                var akeyvalue = oEvent.getSource().getValue();
                var aFilter = [];
                // debugger;
                if (akeyvalue.length < 1) {
                    return;
                }
                this.getModel("objectModel").setProperty("/isChanged", true);
                aFilter.push(
                    // FreightOrderDocument
                        new sap.ui.model.Filter("CountryCode", sap.ui.model.FilterOperator.EQ, akeyvalue)
                );
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("DEST_COUNTRY"), true);
                this.getService().getCountrySet(aFilter).then(function (oData) {
                    if (oData.results.length > 0) {
                        this.oMultiInput4.setValueState(sap.ui.core.ValueState.None);
                    } else {
                        this.oMultiInput4.setValueState("Error");
                        this.oMultiInput4.setShowValueStateMessage(true);
                        var _message = this.getResourceBundle().getText("dialog.error.country.Invalid");
                        this.oMultiInput4.setValueStateText(_message);
                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("DEST_COUNTRY"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("DEST_COUNTRY"), false);
                }.bind(this));
            },

            onInputChange: function (oEvt) { // debugger;
                if (oEvt.getParameter("escPressed")) {} else { // this._setUIChanges(true);
                    this.getModel("objectModel").setProperty("/isChanged", true);
                    var sPath = "/dynamicForm/0";
                    var oValidatedComboBox = oEvt.getSource().sId;
                    if (oEvt.getParameter("state")) {
                        if (oValidatedComboBox.includes("REL_AFTER_OUTPUT")) {
                            this.getModel("objectModel").setProperty(sPath + "/REL_AFTER_OUTPUT", "X");
                        } else if (oValidatedComboBox.includes("ARCHIEVE")) {
                            this.getModel("objectModel").setProperty(sPath + "/ARCHIEVE", "Y");
                        }
                    } else { // this.getModel("objectModel").getProperty("/dynamicForm/0/REL_AFTER_OUTPUT")
                        if (oValidatedComboBox.includes("REL_AFTER_OUTPUT")) {
                            this.getModel("objectModel").setProperty(sPath + "/REL_AFTER_OUTPUT", "");
                        } else if (oValidatedComboBox.includes("ARCHIEVE")) {
                            this.getModel("objectModel").setProperty(sPath + "/ARCHIEVE", "N");
                        }
                    }
                    if (oValidatedComboBox.includes("OUTPUT_DEVICE")) {

                        this.onCheckOutputDevice(oEvt);
                    }
                    else if(oValidatedComboBox.includes("PARTNER_2")){
                        this.onCheckPartnerAsn(oEvt);
                    }
                    if (oValidatedComboBox.includes("NO_OF_COPIES")) {
                        if (oEvt.getSource().getValue() == "") {
                            this.getModel("objectModel").setProperty(sPath + "/NO_OF_COPIES", "0");
                            oEvt.getSource().setValue("");
                        } else {
                            this.getModel("objectModel").setProperty(sPath + "/NO_OF_COPIES", oEvt.getSource().getValue());
                        }
                    }
                }
            },
            onShippingPointChange: function (oEvent) {
                // debugger;
                // multiInputFOs
                var sCurrTextValue = oEvent.getSource().getValue();
                let aFilter = [];
                this.getModel("objectModel").setProperty("/isChanged", true);
                if (sCurrTextValue.length == 0) {
                    this.oMultiInput1.setValueState(sap.ui.core.ValueState.SUCCESS);
                    this.oMultiInput1.setValueStateText("");
                }
                if (sCurrTextValue.length >= 1) {
                    sCurrTextValue = sCurrTextValue.trim();
                    let aFilter = [];
                    aFilter.push(
                        // Shipping point
                            new sap.ui.model.Filter("ShippingPoint", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
                    );
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIPPING_POINT"), true);
                    this.getService().getShippingPointSet(aFilter).then(function (oData) {
                        if (oData.results.length > 0) {
                            this.oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                        } else {
                            this.oMultiInput1.setValueState("Error");
                            this.oMultiInput1.setShowValueStateMessage(true);
                            var _message = this.getResourceBundle().getText("dialog.error.ShippingPoint.Invalid");
                            this.oMultiInput1.setValueStateText(_message);
                            sap.m.MessageBox.show(_message, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error"
                            });
                        }
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIPPING_POINT"), false);
                    }.bind(this), function (oError) {
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIPPING_POINT"), false);
                    }.bind(this));
                }
            },
            onShipToPartyChange: function (oEvent) {
                // debugger;
                // multiInputFOs
                var sCurrTextValue = oEvent.getSource().getValue();
                let aFilter = [];
                this.getModel("objectModel").setProperty("/isChanged", true);
                if (sCurrTextValue.length == 0) {
                    this.oMultiInput2.setValueState(sap.ui.core.ValueState.None);
                }
                if (sCurrTextValue.length >= 1) {
                    sCurrTextValue = sCurrTextValue.trim();
                    let aFilter = [];

                    aFilter.push(
                        // Shipping point
                            new sap.ui.model.Filter("ShipToParty", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
                    );
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIP_TO_PARTY"), true);
                    this.getService().getShipToPartySet(aFilter).then(function (oData) {
                        if (oData.results.length > 0) {
                            this.oMultiInput2.setValueState(sap.ui.core.ValueState.None);
                        } else {
                            this.oMultiInput2.setValueState("Error");
                            this.oMultiInput2.setShowValueStateMessage(true);
                            var _message = this.getResourceBundle().getText("dialog.error.ShipToParty.Invalid");
                            this.oMultiInput2.setValueStateText(_message);
                            sap.m.MessageBox.show(_message, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error"
                            });
                        }
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIP_TO_PARTY"), false);
                    }.bind(this), function (oError) {
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("SHIP_TO_PARTY"), false);
                    }.bind(this));
                }
            },
            onCheckOutputDevice: function (oEvt) {
                var sSelectedKey = oEvt.getSource().getValue();
                var oID = oEvt.getParameters().id;
                let oControlname = oID.split("--")[2];
                this.oControl = this.byId(oControlname);
                var aFilter = {};
                var aFilters = [];
                aFilter = new sap.ui.model.Filter({path: "Outputdevice", operator: sap.ui.model.FilterOperator.EQ, value1: sSelectedKey});
                if (sSelectedKey.length<= 0){
				this.oControl.setValueState(sap.ui.core.ValueState.None);
				return;
			}
			this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
			aFilters.push(aFilter);
			this.getService().getOutputDeviceSet(aFilters).then(
				function (oData) {    
					 if(oData.results.length> 0) {
                    this.oControl.setValueState(sap.ui.core.ValueState.None);
                } else {
                    this.oControl.setValueState(sap.ui.core.ValueState.Error);
                    this.oControl.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.OutputDevice"));
                }
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
            }.bind(this),
            function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
                this.oControl.setValueState(sap.ui.core.ValueState.Error);
            }.bind(this)
        );
    },
    onCheckPartnerAsn : function (oEvt) {
        var sSelectedKey = oEvt.getSource().getValue();
        var oID = oEvt.getParameters().id;
        let oControlname = oID.split("--")[2];
        this.oControl = this.byId(oControlname);
        this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
        var aFilter = {};
        var aFilters = [];
        aFilter = new sap.ui.model.Filter({path: "PartnerNumber", operator: sap.ui.model.FilterOperator.EQ, value1: sSelectedKey});
        aFilters.push(aFilter);
        this.getService().getASNPartnerSet(aFilters).then(function (oData) {
            if (oData.results.length > 0) {
                this.oControl.setValueState(sap.ui.core.ValueState.None);
            } else {
                this.oControl.setValueState(sap.ui.core.ValueState.Error);
                this.oControl.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.partner_asn"));
            }
            this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
        }.bind(this), function (oError) {
            this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
            this.oControl.setValueState(sap.ui.core.ValueState.Error);
        }.bind(this));
    },
    onValueHelpRequest_Table : function (oEvent) {
        let aFilter = [];
        var oID = oEvent.getParameters().id;
        let oControlname = oID.split("--")[2];
        this.oControl = this.byId(oControlname);
        let _entityName = oEvent.oSource.mProperties.name;
        this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
        let arrayFieldsLabel = [];
        let arrayColumns = [];
        this._oSourceFieldIDF4 = oEvent.getSource();
        // var idx = oEvent.getSource().getParent().getBindingContextPath().slice(-1);
        var data = new Array();
        var arrFieldsSet = [];
        var _inlineCount = 0;
        if (oControlname.includes(("OUTPUT_DEVICE"))) {
            data.Field1 = this.getResourceBundle().getText("out_device_txt")
            data.Field2 = this.getResourceBundle().getText("description_txt")
            arrayFieldsLabel.push(data);

            data = new Array();
            data.Field1 = "Outputdevice"
            data.Field2 = "Description"
            arrayColumns.push(data);

            this.getService().getOutputDeviceSet(aFilter).then(function (oData) {
                _inlineCount = oData.__count;
                for (let i = 0; i < oData.results.length; i++) {
                    arrFieldsSet.push(oData.results[i]);
                }
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                this.onValueHelpInputPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("out_device_txt"), "Output_Device", _inlineCount);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
            }.bind(this));
        } else if (oControlname.includes(("comb_PARTNER_2"))) {
            _entityName = "ASNPartner"
            data.Field1 = this.getResourceBundle().getText("PartnerNumber_txt")
            data.Field2 = this.getResourceBundle().getText("PartnerType_txt")
            arrayFieldsLabel.push(data);

            data = new Array();
            data.Field1 = "PartnerNumber"
            data.Field2 = "PartnerType"
            arrayColumns.push(data);
            this.getService().getASNPartnerSet(aFilter).then(function (oData) {
                _inlineCount = oData.__count;
                for (let i = 0; i < oData.results.length; i++) {
                    arrFieldsSet.push(oData.results[i]);
                }
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                this.onValueHelpInputPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("partner_txt"), _entityName, _inlineCount);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
            }.bind(this));
        }
    },
    onValueHelpInputPopup : async function (_oLabels, _oColumns, _oData1, oControl, _title, _entityName, _inlineCount) { // debugger;
        this.fnSetBusyIndicatorOnDetailControls(oControl, true)
        var _ColumnFields = CusValueHelpDialog.fnCreateBindingColumn(_oLabels, _oColumns, "objectModel>");
        let arrFieldsSet = CusValueHelpDialog.fnReGenerateOdataSetF4(_oLabels, _oColumns, _oData1, "/ShipToPartySet");
        this.getModel("objectModel").setProperty("/ShipToPartySet", []);
        this.getModel("objectModel").setProperty("/ShipToPartySet", arrFieldsSet);
        let arrCols = _oColumns[0];
        let dataService = this.getService();
        let _arrPrefliter = {};
        let _tblPrefliter = [];
        if (this._oSourceFieldIDF4.getValue()) {
            let _f4Value = this._oSourceFieldIDF4.getValue();
            if (_f4Value.length > 0) {
                _arrPrefliter = {
                    path: arrCols["Field1"],
                    operator: sap.ui.model.FilterOperator.Contains,
                    values: [_f4Value]
                };
                _tblPrefliter.push(_arrPrefliter);
            }
        }
        this._valueHelpDialog = await CusValueHelpDialog.createValueHelp({
            title: _title,
            model: this.getModel("objectModel"),
            multiSelect: false,
            keyField: arrCols["Field1"],
            keyDescField: "",
            basePath: "objectModel>/ShipToPartySet",
            preFilters: _tblPrefliter,
            columns: _ColumnFields,
            modeQuery: 2,
            oService: dataService,
            entityName: _entityName,
            labelDefinition: _oLabels,
            columnDefiniton: _oColumns,
            inlineCount: _inlineCount,
            ok: function (selectedRow) {
                let aTokens = [];
                for (var i = 0; i < selectedRow.length; i++) {
                    if (selectedRow[i]) {
                        var keyValue = selectedRow[i][arrCols["Field1"]];
                        this._oSourceFieldIDF4.setValue(keyValue);
                        this._oSourceFieldIDF4.fireSubmit();
                    }
                    break;
                }
                this._valueHelpDialog.close();
            }.bind(this),
            beforeOpen: function (oEvent) {
                this.fnSetBusyIndicatorOnDetailControls(oControl, true)

            }.bind(this),
            afterOpen: function (oEvent) {
                this.fnSetBusyIndicatorOnDetailControls(oControl, false)
            }.bind(this),
            afterClose: function (oEvent) {
                this._valueHelpDialog.destroy()
            }.bind(this),
            cancel: function (oEvent) {
                this._valueHelpDialog.close()
            }.bind(this)
        });
        this.getView().addDependent(this._valueHelpDialog);
        this.fnSetBusyIndicatorOnDetailControls(oControl, false)
        var sKeyFieldName = "Field1";
        this._valueHelpDialog.setKey(sKeyFieldName);
        this._valueHelpDialog.update();
        this._valueHelpDialog.open();
    },
    onCspChange : function (oEvent) {
        // debugger;
        // multiInputFOs
        var sCurrTextValue = oEvent.getSource().getValue();
        let aFilter = [];
        this.getModel("objectModel").setProperty("/isChanged", true);
        if (sCurrTextValue.length == 0) {
            this.oMultiInput3.setValueState(sap.ui.core.ValueState.None);
        }
        if (sCurrTextValue.length >= 1) {
            sCurrTextValue = sCurrTextValue.trim();
            let aFilter = [];

            aFilter.push(
                // Shipping point
                    new sap.ui.model.Filter("Csp", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
            );
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("CSP"), true);
            this.getService().getCSPSet(aFilter).then(function (oData) {
                if (oData.results.length > 0) {
                    this.oMultiInput3.setValueState(sap.ui.core.ValueState.None);
                } else {
                    this.oMultiInput3.setValueState("Error");
                    this.oMultiInput3.setShowValueStateMessage(true);
                    var _message = this.getResourceBundle().getText("dialog.error.CSP.Invalid");
                    this.oMultiInput3.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("CSP"), false);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("CSP"), false);
            }.bind(this));
        }
    },
    onCountryChange : function (oEvent) {
        // debugger;
        // multiInputFOs
        var sCurrTextValue = oEvent.getSource().getValue();
        let aFilter = [];
        this.getModel("objectModel").setProperty("/isChanged", true);
        if (sCurrTextValue.length == 0) {
            this.oMultiInput4.setValueState(sap.ui.core.ValueState.None);
        }
        if (sCurrTextValue.length >= 1) {
            sCurrTextValue = sCurrTextValue.trim();
            let aFilter = [];

            aFilter.push(
                // Shipping point
                    new sap.ui.model.Filter("CountryCode", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
            );
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("DEST_COUNTRY"), true);
            this.getService().getCountrySet(aFilter).then(function (oData) {
                if (oData.results.length > 0) {
                    this.oMultiInput4.setValueState(sap.ui.core.ValueState.None);
                } else {
                    this.oMultiInput4.setValueState("Error");
                    this.oMultiInput4.setShowValueStateMessage(true);
                    var _message = this.getResourceBundle().getText("dialog.error.Country.Invalid");
                    this.oMultiInput4.setValueStateText(_message);
                    sap.m.MessageBox.show(_message, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("DEST_COUNTRY"), false);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("DEST_COUNTRY"), false);
            }.bind(this));
        }
    }
});});
