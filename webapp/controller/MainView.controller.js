sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "../controller/modules/Base",
    "../custom/CusValueHelpDialog",
    "sap/m/Token",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageToast",
    'sap/ui/core/library',
    'com/bosch/rb1m/tm/tmoutputcond/util/Formatter',
    'sap/ui/model/Sorter',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller'
],
/**
         * @param {typeof sap.ui.core.mvc.Controller} Controller
         */
    function (JSONModel, Base, CusValueHelpDialog, Token, Spreadsheet, MessageToast, coreLibrary, Formatter, Sorter, Fragment) {
    "use strict";
    var ValueState = coreLibrary.ValueState;
    return Base.extend("com.bosch.rb1m.tm.tmoutputcond.controller.MainView", {
        formatter: Formatter,
        onInit: function () {
            Base.prototype.onInit.apply(this);
            this.oFilterBar = this.getView().byId("filterbar");
            this.oSemanticPage = this.byId("dynamicPageId");
            this.oEditAction = this.byId("_IDBtnEdit");
            this.oDeleteAction = this.byId("_IDBtnDelete");
            this.oCreateAction = this.byId("_IDBtnCreate");
            this.showFooter(false);
            this.fnInitializeSettingsModel();
            this.fnGetOutputType();
            var that = this;
            // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
            this._mViewSettingsDialogs = {};
            this._mDialogs = {};
            this.oMultiInput1 = this.getView().byId("_IDMultiInputShippingPoint");
            this.oMultiInput1.setValue("");
            this.oMultiInput1.removeAllTokens();
            this.oMultiInput1.addValidator(function (args) { // debugger;
                var text = args.text;
                var text1 = "*" + args.text + "*";
                return new Token({key: text, text: text1}).data("range", {
                    "include": true,
                    "operation": sap.ui.model.FilterOperator.Contains,
                    "keyField": "SHIPPING_POINT",
                    "value1": text,
                    "value2": ""
                });

            });

            this.oMultiInput2 = this.getView().byId("_IDMultiInputShiptoParty");
            this.oMultiInput2.setValue("");
            this.oMultiInput2.removeAllTokens();
            this.oMultiInput2.addValidator(function (args) {
                var text = args.text;
                var text1 = "*" + args.text + "*";
                return new Token({key: text, text: text1}).data("range", {
                    "include": true,
                    "operation": sap.ui.model.FilterOperator.Contains,
                    "keyField": "SHIP_TO_PARTY",
                    "value1": text,
                    "value2": ""
                });
            });

            this.oMultiInput3 = this.getView().byId("_IDMultiInputCSP");
            this.oMultiInput3.setValue("");
            this.oMultiInput3.removeAllTokens();
            this.oMultiInput3.addValidator(function (args) {
                var text = args.text;
                var text1 = "*" + args.text + "*";
                return new Token({key: text, text: text1}).data("range", {
                    "include": true,
                    "operation": sap.ui.model.FilterOperator.Contains,
                    "keyField": "CSP",
                    "value1": text,
                    "value2": ""
                });
            });

            this.oMultiInput4 = this.getView().byId("_IDMultiInputDEST_COUNTRY");
            this.oMultiInput4.setValue("");
            this.oMultiInput4.removeAllTokens();
            this.oMultiInput4.addValidator(function (args) {
                if (args.suggestedToken) {
                    var text = args.suggestedToken.getKey();
                    var text1 = "*" + args.text + "(" + text + ")" + "*";
                    return new Token({key: text, text: text1}).data("range", {
                        "include": true,
                        "operation": sap.ui.model.FilterOperator.Contains,
                        "keyField": "CountryCode",
                        "value1": text,
                        "value2": ""
                    });
                }
            });

            this.getOwnerComponent().getEventBus().subscribe("MainViewTable", "ItemChange", function (sChannel, sEvent, oData) {
                var aToUpdateItem = oData.aItem;
                var bIsMode = oData.bIsMode;
                that.fnHandleChangeItem(aToUpdateItem, bIsMode);
                // debugger;
            })
        },
        /* Settings Model */
        fnInitializeSettingsModel: function () {
            var oSettingsModel = new JSONModel({
                AccessSequenceSet: [],
                OutputTypeSet: [],
                languages: [],
                seltablename: "",
                RowsHeader: [],
                RowsItems: [],
                seloutputtype: "",
                outputTypeDescription: "",
                editEnable: false,
                operationMode: "",
                coEnable: true,
                dynamicTableTitle: "",
                bOnCreate: false,
                bDataSelected: false,
                bDataUpload: false,
                bDataFound: false,
                showFooter: false,
                filt_shippingpoint: false,
                filt_shiptoparty: false,
                filt_csp: false,
                filt_country: false,
                FieldsSetInlineCount: [],
                ShipToPartySet: [],
                dynamicTableData: [],
                itemTableDataSet: [],
                tableDescription: "",
                ShipPointSO: [],
                ShipToSO: [],
                CSPSO: [],
                CountrySO: [],
                itemsChanged: [],
                ModeChange: "",
                currSortKey: "",
                checkOutputDevice: true,
                checkPrintLanguage: true,
                checkASNSource: true,
                checkPrintTime: true,
                checkloading_list: true,
                checkASNFunction: true,
                checkASNPartner: true,
                itemsChangedError: []
            });

            this.setModel(oSettingsModel, "dataModel");
            // comboBoxModel
            var ocomboBoxModel = new JSONModel({
                ArchieveModeSet: [],
                AfterReleaseSet: [],
                PrintLanguageSet: [],
                ASNSourceSet: [],
                PrintTimePointSet: [],
                LoadingListPrintSet:[],
                PrintTimeActionPPFSet: [],
                ASNPartnerSet: [],
                ASNPartnerTypeSet: [],
                OutputDevSet: [],
                CountrySet: [],
                unDoDataItems: []
            });
            this.setModel(ocomboBoxModel, "comboBoxModel");
        },
        fnHandleChangeItem: function (aToUpdateItem, bIsMode) { // debugger;
            var oTableModel = this.getModel("dataModel").getProperty("/dynamicTableData")
            var rowHeader = oTableModel.HeaderNav.results;
            var aTableItems = this.getModel("dataModel").getProperty("/itemTableDataSet");
            var aKeyDataUpdate = {};
            var aKeyDataCurrent = {};
            let isExisted = false;
            for (var i = 0; i < aToUpdateItem.length; i++) {
                rowHeader.forEach(oHeader => {
                    if (oHeader.HeaderKey == true) {
                        aKeyDataUpdate[oHeader.HeaderName] = aToUpdateItem[i][oHeader.HeaderName];
                    }
                });

                // for(var a = 0; a < aTableItems.length; a ++ ){
                aTableItems.forEach((oAItem, oIndex) => {
                    rowHeader.forEach(oHeader => {
                        if (oHeader.HeaderKey == true) {
                            aKeyDataCurrent[oHeader.HeaderName] = aTableItems[oIndex][oHeader.HeaderName];
                        }
                    });
                    if (bIsMode == "U") {
                        var b = this.fnCheckArrDuplicates(aKeyDataCurrent, aKeyDataUpdate);
                        // debugger;
                        if (b == true) { // update data

                            aTableItems[oIndex] = aToUpdateItem[i];
                            this.getModel("dataModel").setProperty("/itemTableDataSet", aTableItems);
                            // break;
                        }
                    } else if (bIsMode == "I") {
                        var c = this.fnCheckArrDuplicates(aKeyDataCurrent, aKeyDataUpdate);
                        // debugger;
                        if (c == true) { // insert data
                            isExisted = true;

                            // break;
                        }
                    } else if (bIsMode == "D") {
                        var c = this.fnCheckArrDuplicates(aKeyDataCurrent, aKeyDataUpdate);
                        // debugger;
                        if (c == true) { // insert data
                            aTableItems.splice(oIndex, 1)
                            // break;
                        }
                    }

                })

            }
            if (bIsMode == "I") {
                if (isExisted == false) {
                    if (aToUpdateItem[0]) {
                        aTableItems.push(aToUpdateItem[0]);
                    }
                    this.getModel("dataModel").setProperty("/itemTableDataSet", aTableItems);
                    var oTable = this.getView().byId("dynamicTable");
                    var aItems = oTable.getItems();
                    if (aItems.length > 0) {
                        aItems.forEach(oItem => {
                            oTable.setSelectedItem(oItem, false)
                        });
                    }
                }
            } else if (bIsMode == "D") {
                this.getModel("dataModel").setProperty("/itemTableDataSet", aTableItems)
                // oTable.setSelectedItem(aItems[i],true);
                var oTable = this.getView().byId("dynamicTable");
                var aItems = oTable.getItems();
                if (aItems.length > 0) {
                    aItems.forEach(oItem => {
                        oTable.setSelectedItem(oItem, false)
                    });
                    this.getView().byId("_IDBtnDelete").setEnabled(false);
                    this.getView().byId("_IDBtnCreate").setEnabled(true);
                    this.getView().byId("_IDBtnEdit").setEnabled(true);
                    this.getModel("dataModel").setProperty("/ModeChange", "");
                }
            }
        },
        fnCheckArrDuplicates: function (array_a, array_b) {
            let a = false;
            if (JSON.stringify(array_a) === JSON.stringify(array_b)) {
                a = true;
            }
            return a;
        },
        onItemPress: function (oEvent) {
            if (this.oEditAction.getVisible() == false) {
                return;
            }
            var oTableModel = this.getModel("dataModel").getProperty("/dynamicTableData")
            var oSelectedItem = oEvent.getParameter("listItem");
            var idx = oSelectedItem.getBindingContextPath().split("/")[2];
            var itemTable = this.getModel("dataModel").getProperty("/itemTableDataSet");
            if (idx !== -1) {
                var data = oTableModel;
                var oRouter = this.getOwnerComponent().getRouter();
                var oCurrentRowData = {
                    tableDescription: this.getModel("dataModel").getProperty("/tableDescription"),
                    header: data.HeaderNav.results,
                    rows: {},
                    mode: "R"
                };
                let i = 0;
                var data1 = {};

                data1 = {};
                data.HeaderNav.results.forEach(ocolumn => {
                    i = i + 1;
                    var a = ocolumn.HeaderName;
                    var c = "Col" + ocolumn.HeaderIndex;
                    data1[c] = itemTable[idx][a];

                });

                oCurrentRowData.rows = data1;
                this.getModel("dataModel").setProperty("/ModeChange", "");
                var oModelObjectDetail = new JSONModel({objectDetail: oCurrentRowData});
                this.getOwnerComponent().setModel(oModelObjectDetail, "objectDetail");
                var _payload_deep_rt = this.fnBuildDeepentity();
                _payload_deep_rt.HeaderNav = data.HeaderNav.results;
                var oDataDeepPayload = new JSONModel({oDataDeepPayload: _payload_deep_rt});
                this.getOwnerComponent().setModel(oDataDeepPayload, "oDataDeepPayload");
                oRouter.navTo("objectDetail");
            }

        },
        onAfterRendering: function (oEvent) {

            this.fnGetPrintLanguageSet();
            this.fngetASNSourceSet();
            this.fnGetPrintTimePointSet();
            this.fnGetLoadingListPrintSet();
            this.fnGetCountrySet();
            this.fnGetPrintTimeActionPPFSet();
            this.fnGetASNPartnerTypeSet();
            this.fnSetDefaultValue(this.getModel("objDefaultShippingPoint"));
        },
         fnGetLoadingListPrintSet: function (aFilter) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
                this.getService().getLoadingListPrintSet(aFilter).then(function (aData) { // debugger;
                    this.getModel("comboBoxModel").setProperty("/LoadingListPrintSet", aData.results);
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                }.bind(this));
            },
        fnSetDefaultValue: function (a) {
            if (a) {
                if (a.length > 0) {
                    let aTokens = [];
                    var oToken1 = new Token({key: a, text: a});
                    aTokens.push(oToken1);
                    this.oMultiInput1.setTokens(aTokens);
                }
            }
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
        fnGetPrintTimeActionPPFSet: function (aFilter) {
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
            this.getService().getPrintTimeActionPPFSet(aFilter).then(function (aData) { // debugger;
                this.getModel("comboBoxModel").setProperty("/PrintTimeActionPPFSet", aData.results);
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
        fnGetPrintLanguageSet: function (aFilter) {
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
            this.getService().getLanguage(aFilter).then(function (aData) { // debugger;
                this.getModel("comboBoxModel").setProperty("/PrintLanguageSet", aData);
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this));
        },
        fnGetOutputDeviceSet: function (aFilter) {
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
            this.getService().getOutputDeviceSet(aFilter).then(function (aData) {
                this.getModel("comboBoxModel").setProperty("/OutputDevSet", aData.results);
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this));
        },
        fnGetOutputType: function (aFilter) {
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
            this.getService().getOutputType(aFilter).then(function (aData) {
                this.getModel("dataModel").setProperty("/OutputTypeSet", aData);
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this));
        },
        fnGetAccessSequence: function (aFilters) {
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
            this.getService().getGetAccessSequence(aFilters).then(function (aData) {
                this.getModel("dataModel").setProperty("/AccessSequenceSet", aData);
                this.getModel("dataModel").setProperty("/seltablename", "");
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this), function (oError) {
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
            }.bind(this));
        },
        fnCheckGoQueryPara: function () {
            var a = true,
                b = "";
            var seltablename = this.getModel("dataModel").getProperty("/seltablename");
            var seloutputtype = this.getModel("dataModel").getProperty("/seloutputtype");
            var tokensShippingPoint = this.fnGetTokensShippinPoint();
            if (seloutputtype.length < 1) {
                a = false;
                b = this.getModel("i18n").getProperty("seloutputType");
            } else if (seltablename.length < 1) {
                a = false;
                b = this.getModel("i18n").getProperty("selaccessSequence");

            } else if (tokensShippingPoint.length < 1) {
                a = false;
                b = this.getModel("i18n").getProperty("seltokensShippingPoint");
            }
            if (a == false) {
                sap.m.MessageBox.show(b, {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error"
                })
            }
            return a;
        },
        fnCheckGoQueryDeepStructurePara: function () {
            var a = true,
                b = "";
            var seloutputtype = this.getModel("dataModel").getProperty("/seloutputtype");
            if (seloutputtype.length < 1) {
                a = false;
                b = this.getModel("i18n").getProperty("seloutputType");
            }
            if (a == false) {
                sap.m.MessageBox.show(b, {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error"
                })
            }
            return a;
        },
        onGetQueryDeepStructure: function (oEvent) {
            this.getModel("dataModel").setProperty("/itemTableDataSet", []);
            this.getModel("dataModel").setProperty("/itemsChanged", [])
            this.getModel("dataModel").setProperty("/itemsChangedError", []);
            var checkFlag = this.fnCheckGoQueryDeepStructurePara();
            if (checkFlag == false) {
                return;
            }
            this.fnGetFilterDeepStructure();
            var _payload_deep_rt = this.fnBuildDeepentity();
            _payload_deep_rt.Mode = "H";
            // var _jSonObj =  JSON.stringify(_payload_deep_rt);
            var deepDynamicTable = {};
            // debugger;
            this.setBusy(true);
            this.getService().postProcessDeepEntity(_payload_deep_rt).then(function (aData) { // debugger;
                this.setBusy(false);
                if (aData.hasOwnProperty("__batchResponses") && aData.__batchResponses.length > 0) {
                    for (var i = 0; i < aData.__batchResponses.length; i++) {
                        var oStatusResponse = aData.__batchResponses[i];
                        if (oStatusResponse.hasOwnProperty("__changeResponses")) {
                            if (i === 0) {
                                var ochangeResponse = oStatusResponse.__changeResponses[0];
                                if (ochangeResponse.statusCode >= 200 && ochangeResponse.statusCode < 300) {
                                    deepDynamicTable = ochangeResponse.data;
                                    this.getModel("dataModel").setProperty("/dynamicTableData", deepDynamicTable);
                                    // if Data found
                                    this.getModel("dataModel").setProperty("/bDataFound", true);
                                    this.getModel("dataModel").setProperty("/bOnCreate", true);
                                    // this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("dynamicTable"), true);
                                    this.fnBuildItemsTableData(deepDynamicTable);
                                } else {
                                    // Error
                                    // this._fnHandleErrorExe();
                                    this.setBusy(false);
                                }
                            }
                        } else {
                            this.setBusy(false);
                            // this._fnHandleErrorExe();
                        }
                        break;
                    }

                }
            }.bind(this), function (oError) {
                this.setBusy(false);
                // this._fnHandleErrorExe();

            }.bind(this));
        },
        onSearchGo: function (oEvent) {
            this.getModel("dataModel").setProperty("/itemTableDataSet", []);
            this.getModel("dataModel").setProperty("/itemsChanged", [])
            this.getModel("dataModel").setProperty("/itemsChangedError", []);
            var checkFlag = this.fnCheckGoQueryPara();
            if (checkFlag == false) {
                return;
            }
            this.fnGetFilterVaules(oEvent);
            var _payload_deep_rt = this.fnBuildDeepentity();
            // var _jSonObj =  JSON.stringify(_payload_deep_rt);
            var deepDynamicTable = {};
            // debugger;
            this.setBusy(true);
            this.getService().postProcessDeepEntity(_payload_deep_rt).then(function (aData) { // debugger;
                this.setBusy(false);
                if (aData.hasOwnProperty("__batchResponses") && aData.__batchResponses.length > 0) {
                    for (var i = 0; i < aData.__batchResponses.length; i++) {
                        var oStatusResponse = aData.__batchResponses[i];
                        if (oStatusResponse.hasOwnProperty("__changeResponses")) {
                            if (i === 0) {
                                var ochangeResponse = oStatusResponse.__changeResponses[0];
                                if (ochangeResponse.statusCode >= 200 && ochangeResponse.statusCode < 300) {
                                    deepDynamicTable = ochangeResponse.data;
                                    this.getModel("dataModel").setProperty("/dynamicTableData", deepDynamicTable);
                                    // if Data found
                                    this.getModel("dataModel").setProperty("/bDataFound", true);
                                    this.getModel("dataModel").setProperty("/bOnCreate", true);
                                    // this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("dynamicTable"), true);
                                    this.fnBuildItemsTableData(deepDynamicTable);

                                    if (ochangeResponse.headers["sap-message"]) {
                                        var b = JSON.parse(ochangeResponse.headers["sap-message"])
                                        var oMessage = b.message;
                                        if (b.severity != "success") {

                                            this._fnHandleErrorExe(oMessage);
                                        }
                                    }

                                } else {
                                    // Error
                                    // this._fnHandleErrorExe();
                                    this.setBusy(false);
                                }
                            }
                        } else {
                            this.setBusy(false);
                            // this._fnHandleErrorExe();
                        }
                        break;
                    }

                }
            }.bind(this), function (oError) {
                this.setBusy(false);
                // this._fnHandleErrorExe();

            }.bind(this));
        },
        fnBuildDeepentity: function () { // Call expand query for dynamic table.
            var _payload_deep_rt = {
                OutputType: "",
                TableName: "",
                Title: "",
                Mode: "R",
                HeaderNav: [],
                ItemsNav: [],
                ShipPointSONav: [],
                ShipToSONav: [],
                CSPSONav: [],
                CountrySONav: []
            };
            _payload_deep_rt.OutputType = this.getModel("dataModel").getProperty("/seloutputtype");
            _payload_deep_rt.TableName = this.getModel("dataModel").getProperty("/seltablename");
            var ShipToSONav = this.getModel("dataModel").getProperty("/ShipToSO");
            if (ShipToSONav.length > 0) {
                ShipToSONav.forEach(oShipToSONav => {
                    _payload_deep_rt.ShipToSONav.push(oShipToSONav);
                });
            }
            var ShipPointSONav = this.getModel("dataModel").getProperty("/ShipPointSO");
            if (ShipPointSONav.length > 0) {
                ShipPointSONav.forEach(oShipPointSONav => {
                    _payload_deep_rt.ShipPointSONav.push(oShipPointSONav);
                });

            }

            var CSPSONav = this.getModel("dataModel").getProperty("/CSPSO");
            if (CSPSONav.length > 0) {
                CSPSONav.forEach(oCSPSONav => {
                    _payload_deep_rt.CSPSONav.push(oCSPSONav);
                });

            }

            var CountrySONav = this.getModel("dataModel").getProperty("/CountrySO");
            if (CountrySONav.length > 0) {
                CountrySONav.forEach(oCountrySONav => {
                    _payload_deep_rt.CountrySONav.push(oCountrySONav);
                });

            }
            return _payload_deep_rt;
        },
        fnGetFilterVaules: function (oEvent) {
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = [];
            var checkFlag = this.fnCheckGoQueryPara();
            this.getModel("dataModel").setProperty("/ShipPointSO", []);
            this.getModel("dataModel").setProperty("/ShipToSO", []);
            this.getModel("dataModel").setProperty("/CSPSO", []);
            this.getModel("dataModel").setProperty("/CountrySO", []);
            if (checkFlag == true) { // this.getModel("dataModel").setProperty("/bDataUpload",true);
                var sSelectedKey = this.getModel("dataModel").getProperty("/seltablename");
                let aTokens = [];
                for (var b = 0; b < aSelectionSet.length; b++) {
                    let oControl = aSelectionSet[b];
                    let aFilter = {};
                    switch (oControl.mProperties.name) {
                        case "OutputType": aFilter = new sap.ui.model.Filter({path: oControl.getName(), operator: sap.ui.model.FilterOperator.EQ, value1: oControl.getSelectedKey()});
                            aFilters.push(aFilter);
                            break;
                        case "TableName": aFilter = new sap.ui.model.Filter({path: oControl.getName(), operator: sap.ui.model.FilterOperator.EQ, value1: oControl.getSelectedKey()});
                            aFilters.push(aFilter);
                            break;
                        case "SHIPPING_POINT": aTokens = oControl.getTokens();
                            var modelShipPointSO = this.getModel("dataModel").getProperty("/ShipPointSO");
                            for (let i = 0; i < aTokens.length; i++) {
                                let oToken = aTokens[i];
                                // arrFilter = new Array();
                                if (oToken.data("range")) {
                                    let oRange = oToken.data("range");
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "CP",
                                        "Low": "*" + oRange.value1 + "*",
                                        "High": ""
                                    };

                                } else {
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "EQ",
                                        "Low": oToken.getKey(),
                                        "High": ""
                                    };
                                } modelShipPointSO.push(_oRow1);
                            }
                            this.getModel("dataModel").setProperty("/ShipPointSO", modelShipPointSO);
                            break;
                        case "SHIP_TO_PARTY":
                            if (sSelectedKey != "/RB1M/TM_ACCESS1") {
                                break;
                            }
                            aTokens = oControl.getTokens();
                            var modelShipToSO = this.getModel("dataModel").getProperty("/ShipToSO");
                            for (let i = 0; i < aTokens.length; i++) {
                                let oToken = aTokens[i];
                                // arrFilter = new Array();
                                if (oToken.data("range")) {
                                    let oRange = oToken.data("range");
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "CP",
                                        "Low": "*" + oRange.value1 + "*",
                                        "High": ""
                                    };

                                } else {
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "EQ",
                                        "Low": oToken.getKey(),
                                        "High": ""
                                    };
                                } modelShipToSO.push(_oRow1);
                            }
                            this.getModel("dataModel").setProperty("/ShipToSO", modelShipToSO);
                            break;
                        case "CSP":
                            if (sSelectedKey != "/RB1M/TM_ACCESS2") {
                                break;
                            }
                            var modelCSPSO = this.getModel("dataModel").getProperty("/CSPSO");
                            aTokens = oControl.getTokens();
                            for (let i = 0; i < aTokens.length; i++) {
                                let oToken = aTokens[i];
                                // arrFilter = new Array();
                                if (oToken.data("range")) {
                                    let oRange = oToken.data("range");
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "CP",
                                        "Low": "*" + oRange.value1 + "*",
                                        "High": ""
                                    };

                                } else {
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "EQ",
                                        "Low": oToken.getKey(),
                                        "High": ""
                                    };
                                } modelCSPSO.push(_oRow1);
                            }

                            this.getModel("dataModel").setProperty("/CSPSO", modelCSPSO);
                            break;
                        case "DEST_COUNTRY":
                            if (sSelectedKey != "/RB1M/TM_ACCESS4") {
                                break;
                            }
                            var modelCountrySO = this.getModel("dataModel").getProperty("/CountrySO");
                            aTokens = oControl.getTokens();
                            for (let i = 0; i < aTokens.length; i++) {
                                let oToken = aTokens[i];
                                // arrFilter = new Array();
                                if (oToken.data("range")) {
                                    let oRange = oToken.data("range");
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": "CP",
                                        "Low": "*" + oRange.value1 + "*",
                                        "High": ""
                                    };

                                } else {
                                    var _oRow1 = {
                                        "OutputType": this.getModel("dataModel").getProperty("/seloutputtype"),
                                        "TableName": this.getModel("dataModel").getProperty("/seltablename"),
                                        "Sign": "I",
                                        "Opti": sap.ui.model.FilterOperator.EQ,
                                        "Low": oToken.getKey(),
                                        "High": ""
                                    };
                                } modelCountrySO.push(_oRow1);
                            }

                            this.getModel("dataModel").setProperty("/CountrySO", modelCountrySO);
                            break;
                    }
                }
            }

        },
        fnGetFilterDeepStructure: function () {
            var aSelectionSet = [];
            aSelectionSet.push(this.getView().byId("_IDMultiInputShippingPoint"));
            aSelectionSet.push(this.getView().byId("_IDMultiInputShiptoParty"));
            aSelectionSet.push(this.getView().byId("_IDMultiInputCSP"));
            aSelectionSet.push(this.getView().byId("_IDMultiInputDEST_COUNTRY"));
            var aFilters = [];
            var checkFlag = this.fnCheckGoQueryDeepStructurePara();
            this.getModel("dataModel").setProperty("/ShipPointSO", []);
            this.getModel("dataModel").setProperty("/ShipToSO", []);
            this.getModel("dataModel").setProperty("/CSPSO", []);
            this.getModel("dataModel").setProperty("/CountrySO", []);
            if (checkFlag == true) { // this.getModel("dataModel").setProperty("/bDataUpload",true);
                var sSelectedKey = this.getModel("dataModel").getProperty("/seltablename");
                let aTokens = [];
                for (var b = 0; b < aSelectionSet.length; b++) {
                    let oControl = aSelectionSet[b];
                    let aFilter = {};
                    switch (oControl.mProperties.name) {
                        case "OutputType": aFilter = new sap.ui.model.Filter({path: oControl.getName(), operator: sap.ui.model.FilterOperator.EQ, value1: oControl.getSelectedKey()});
                            aFilters.push(aFilter);
                            break;
                        case "TableName": aFilter = new sap.ui.model.Filter({path: oControl.getName(), operator: sap.ui.model.FilterOperator.EQ, value1: oControl.getSelectedKey()});
                            aFilters.push(aFilter);
                            break;
                    }
                }
            }

        },
        fnBuildItemsTableData: function (oData) {

            var headerData = oData.HeaderNav.results;
            var itemsData = oData.ItemsNav.results;
            this.getModel("dataModel").setProperty("/dynamicTableTitle", oData.Title);
            let arrFieldsSet = [];
            var data = new Array();
            // debugger;
            for (let a = 0; a < itemsData.length; a++) {
                let i = 0;
                data = new Array();
                headerData.forEach(oHeader => { // data = new Array();
                    i = i + 1;
                    let j = oHeader.HeaderName;
                    let c = "Col" + oHeader.HeaderIndex;
                    data[j] = itemsData[a][c];
                });
                arrFieldsSet.push(data);
            }

            this.getModel("dataModel").setProperty("/itemTableDataSet", arrFieldsSet);
            // Process clear marked flag
            var oTable = this.getView().byId("dynamicTable");
            var aItems = oTable.getItems();
            if (aItems.length > 0) {
                aItems.forEach(oItem => {
                    oTable.setSelectedItem(oItem, false)
                });
            }
            // process hide columns
            this.fnHideColumns(headerData);
            // perform sort default.
            var aSorters = [],
                oBinding = oTable.getBinding("items");
            var sPath = "SHIPPING_POINT";
            var bDescending = false;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
        },
        fnHideColumns: function (headerData) { // debugger;
            var oDynamicTable = this.getView().byId("dynamicTable");
            var aColumns = oDynamicTable.getColumns();
            var selectOutput = this.getModel("dataModel").getProperty("/seloutputtype");
            aColumns.forEach(oColumn => {
                var isExisted = false;
                headerData.forEach(oHeader => {
                    var sId = oColumn.sId;
                    if (sId.includes(oHeader.HeaderName)) {
                        isExisted = true;
                        if (oHeader.HeaderName == "REL_AFTER_OUTPUT") {
                            isExisted = false
                        }
                        if (selectOutput.includes("_ASN_")) {
                            switch (oHeader.HeaderName) {
                                case "OUTPUT_DEVICE":
                                    // code block
                                    isExisted = false
                                    break;
                                case "PRINT_TIMEPOINT":
                                    // code block
                                    isExisted = false
                                    break;
                                case "NO_OF_COPIES":
                                    // code block
                                    isExisted = false
                                    break;
                                case "REL_AFTER_OUTPUT":
                                    // code block
                                    isExisted = false
                                    break;
                                case "PRINT_LANGUAGE":
                                    // code block
                                    isExisted = false
                                    break;
                                case "ARCHIEVE":
                                    // code block
                                    isExisted = false
                                    break;
                                case "LOADING_LIST_PRINT":
                                    // code block
                                    isExisted = false
                                    break;       
                                default:
                                    // code block
                            }
                        }
                        else if( selectOutput.includes("_FO_")){
                              switch (oHeader.HeaderName) {
                                case "FUNCTION":
                                    // code block
                                    isExisted = false
                                    break;
                                case "PARTNER":
                                    // code block
                                    isExisted = false
                                    break;
                                case "ASN_SOURCE":
                                    // code block
                                    isExisted = false
                                    break;
                                case "PRINT_TIMEPOINT":
                                    // code block
                                    isExisted = false
                                    break;    
                                case "ARCHIEVE":
                                      isExisted = false
                                    break;      
                                default:
                                    // code block
                            }
                        }
                         else {
                            switch (oHeader.HeaderName) {
                                case "FUNCTION":
                                    // code block
                                    isExisted = false
                                    break;
                                case "PARTNER":
                                    // code block
                                    isExisted = false
                                    break;
                                case "ASN_SOURCE":
                                    // code block
                                    isExisted = false
                                    break;
                                case "LOADING_LIST_PRINT":
                                    // code block
                                    isExisted = false
                                    break;    
                                default:
                                    // code block
                            }
                        }
                    }
                });
                if (isExisted == false) {
                    oColumn.setVisible(false);
                } else {
                    oColumn.setVisible(true);
                }
            });

        },

        onAccessSequenceChange: function (oEvent) {
            this.setBusy(true);
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey();
            this.getModel("dataModel").setProperty("/itemTableDataSet", []);
            this.getModel("dataModel").setProperty("/itemsChanged", [])
            this.getModel("dataModel").setProperty("/itemsChangedError", []);
            this.getModel("dataModel").setProperty("/bOnCreate", false);
            this.getModel("dataModel").setProperty("/bDataFound", false);
            this.fnSetDefaultValue(this.getModel("objDefaultShippingPoint"));
            // hanlde visible/invisible for combobox ShiptoParty,ShippingPoint,CSP and country
            switch (sSelectedKey) {
                case "/RB1M/TM_ACCESS1":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", true)
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.oMultiInput3.removeAllTokens();
                    this.getModel("dataModel").setProperty("/filt_country", false)
                    this.oMultiInput4.removeAllTokens();
                    this.getModel("dataModel").setProperty("/tableDescription", oValidatedComboBox.getValue())

                    break;
                case "/RB1M/TM_ACCESS2":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.oMultiInput2.removeAllTokens();
                    this.getModel("dataModel").setProperty("/filt_csp", true)
                    this.getModel("dataModel").setProperty("/filt_country", false)
                    this.oMultiInput4.removeAllTokens();
                    this.getModel("dataModel").setProperty("/tableDescription", oValidatedComboBox.getValue())
                    break;
                case "/RB1M/TM_ACCESS3":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.oMultiInput2.removeAllTokens();
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.oMultiInput3.removeAllTokens();
                    this.getModel("dataModel").setProperty("/filt_country", false)
                    this.oMultiInput4.removeAllTokens();
                    this.getModel("dataModel").setProperty("/tableDescription", oValidatedComboBox.getValue())
                    break;
                case "/RB1M/TM_ACCESS4":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.oMultiInput2.removeAllTokens();
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.oMultiInput3.removeAllTokens();
                    this.getModel("dataModel").setProperty("/filt_country", true)

                    this.getModel("dataModel").setProperty("/tableDescription", oValidatedComboBox.getValue());
                    break;
                default:
                    // code block
            }
            this.onGetQueryDeepStructure();
        },
        fnHideAllOtherCombobox: function () {
            let sSelectedKey = this.getModel("dataModel").getProperty("/seltablename");
            switch (sSelectedKey) {
                case "/RB1M/TM_ACCESS1":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", true)
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.getModel("dataModel").setProperty("/filt_country", false)
                    break;
                case "/RB1M/TM_ACCESS2":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.getModel("dataModel").setProperty("/filt_csp", true)
                    this.getModel("dataModel").setProperty("/filt_country", false)
                    break;
                case "/RB1M/TM_ACCESS3":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.getModel("dataModel").setProperty("/filt_country", false)
                    break;
                case "/RB1M/TM_ACCESS4":
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", true)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.getModel("dataModel").setProperty("/filt_country", true)
                    break;
                default:
                    // code block
                    this.getModel("dataModel").setProperty("/filt_shippingpoint", false)
                    this.getModel("dataModel").setProperty("/filt_shiptoparty", false)
                    this.getModel("dataModel").setProperty("/filt_csp", false)
                    this.getModel("dataModel").setProperty("/filt_country", false)
            }

            var oMultiInputShipto = this.getView().byId("_IDMultiInputShiptoParty");
            var oMultiInputShippoint = this.getView().byId("_IDMultiInputShippingPoint");
            var oMultiInputCsp = this.getView().byId("_IDMultiInputCSP");
            var oMultiInputCountry = this.getView().byId("_IDMultiInputDEST_COUNTRY");
            oMultiInputShipto.removeAllTokens();
            oMultiInputShippoint.removeAllTokens();
            oMultiInputCsp.removeAllTokens();
            oMultiInputCountry.removeAllTokens();

        },
        fnGetTokensShippinPoint: function () {
            var oMultiInputShippoint = this.getView().byId("_IDMultiInputShippingPoint");
            return oMultiInputShippoint.getTokens();
        },
        onOutputTypeChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();
            this.getModel("dataModel").setProperty("/itemTableDataSet", []);
            this.getModel("dataModel").setProperty("/itemsChanged", [])
            this.getModel("dataModel").setProperty("/itemsChangedError", []);
            var aFilters = [];
            let aFilter = {};
            if (sSelectedKey.length > 0) { // this.fnResetDynamicTableComponent("dynamicTable");
                this.getModel("dataModel").setProperty("/seltablename", "");
                this.getModel("dataModel").setProperty("/outputTypeDescription", sValue);
                this.getModel("dataModel").setProperty("/bOnCreate", false);
                this.getModel("dataModel").setProperty("/bDataFound", false);
                this.fnHideAllOtherCombobox();

                aFilter = new sap.ui.model.Filter({path: oValidatedComboBox.getName(), operator: sap.ui.model.FilterOperator.EQ, value1: sSelectedKey});
                aFilters.push(aFilter);
                this.fnGetAccessSequence(aFilters);
                this.fnSetDefaultValue(this.getModel("objDefaultShippingPoint"));
            }
        },   
        fnOnDynamicTableUpdated: function (e) { // var oDataModel = this.getModel("dataModel").getData();
            var sTotal = " (" + e.getParameter("total") + ")";
            var sTitle = this.getResourceBundle().getText("headerrecords") + sTotal;
            this.getView().byId("dynamicTableTitle").setText(sTitle);
            this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("dynamicTable"), false);
        },
        onCreate: function () {
            var aTableData = this.getModel("dataModel").getProperty("/dynamicTableData");
            var oTableModel = new JSONModel({columns: aTableData.HeaderNav.results, rows: aTableData.ItemsNav.results});
            var oRouter = this.getOwnerComponent().getRouter();
            var data = oTableModel.getData();
            var oCurrentRowData = {
                tableDescription: this.getModel("dataModel").getProperty("/tableDescription"),
                header: data.columns,
                rows: [],
                mode: "C"
            };
            var oTable = this.getView().byId("dynamicTable");
            var aItems = oTable.getSelectedItems();
            var data1 = new Array();
            var selectOutput = this.getModel("dataModel").getProperty("/seloutputtype");
            if (aItems.length == 0) {
                let i = 0;
                data.columns.forEach(ocolumn => {
                    i = i + 1;
                    var a = ocolumn.HeaderName;
                    var c = "Col" + ocolumn.HeaderIndex;
                    if (i == 1) {
                        data1[c] = this.getModel("dataModel").getProperty("/seloutputtype");
                    } else {
                        if (a == "ARCHIEVE") {
                            data1[c] = "Y";
                            if (selectOutput.includes("_ASN_") || selectOutput.includes("_FO_") ) {
                                data1[c] = "";
                            }
                            
                        } else if (a == "REL_AFTER_OUTPUT") {
                            data1[c] = "X";
                            if (selectOutput.includes("_ASN_")) {
                                data1[c] = "";
                            }
                        } else if (a == "PRINT_TIMEPOINT") {
                            data1[c] = "";
                            // get default Print time based on Output type
                            var objCountryData = this.getModel("comboBoxModel").getProperty("/PrintTimeActionPPFSet");
                            for (let i = 0; i < objCountryData.length; i++) {
                                if (objCountryData[i]["OutputType"] == this.getModel("dataModel").getProperty("/seloutputtype")) {
                                    data1[c] = objCountryData[i]["PrintTime"];
                                    break;
                                }
                            }

                        } else {
                            data1[c] = "";
                        }
                    }

                });
                oCurrentRowData.rows.push(data1);
            } else {
                var itemTable = this.getModel("dataModel").getProperty("/itemTableDataSet");
                var odata = aTableData;
                oCurrentRowData = {
                    tableDescription: this.getModel("dataModel").getProperty("/tableDescription"),
                    header: odata.HeaderNav.results,
                    rows: {},
                    mode: "C"
                };
                let i = 0;
                data1 = {};
                var indx = 0;
                for (let a = 0; a < aItems.length; a++) {
                    indx = aItems[a].getBindingContextPath().split("/")[2];
                    break;
                }
                odata.HeaderNav.results.forEach(ocolumn => {
                    i = i + 1;
                    var a = ocolumn.HeaderName;
                    var c = "Col" + ocolumn.HeaderIndex;
                    if (a == "REL_AFTER_OUTPUT") {
                        data1[c] = "X";
                    } else {
                        data1[c] = itemTable[indx][a];
                    }

                });

                oCurrentRowData.rows = data1;
            }

            var oModelObjectDetail = new JSONModel({objectDetail: oCurrentRowData});
            this.getOwnerComponent().setModel(oModelObjectDetail, "objectDetail");
            var _payload_deep_rt = this.fnBuildDeepentity();
            _payload_deep_rt.HeaderNav = data.columns;
            this.getModel("dataModel").setProperty("/ModeChange", "");
            var oDataDeepPayload = new JSONModel({oDataDeepPayload: _payload_deep_rt});
            this.getOwnerComponent().setModel(oDataDeepPayload, "oDataDeepPayload");
            oRouter.navTo("objectDetail");

        },
        onCheckOutputDevice: function (oEvt) {
            var idx = oEvt.getSource().getParent().getBindingContextPath().split("/")[2];
            var sPath = oEvt.getSource().getParent().getBindingContextPath();
            var sSelectedKey = oEvt.getSource().getValue();
            var oID = oEvt.getParameters().id;
            let oControlname = oID.split("--")[2];
            this.oControl = this.byId(oControlname);
            var b = new Array();
            var aFilter = {};
            var aFilters = [];
            aFilter = new sap.ui.model.Filter({path: "Outputdevice", operator: sap.ui.model.FilterOperator.EQ, value1: sSelectedKey});
            aFilters.push(aFilter);
            if (sSelectedKey.length >= 1) {
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
                this.getService().getOutputDeviceSet(aFilters).then(function (oData) {

                    if (oData.results.length > 0) {
                        this.oControl.setValueState(sap.ui.core.ValueState.None);
                        this.getModel("dataModel").setProperty("/checkOutputDevice", true);
                        var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                        b.index = idx;
                        b.isErrOutputDevice = false;
                        b.isErrPrtLanguage = false;
                        let flagCheck = false;
                        let i = 0;
                        a.forEach(item => {
                            if (item.index == b.index) {
                                flagCheck = true;
                                b.isErrPrtLanguage = a[i]["isErrPrtLanguage"];
                                a[i] = b;
                            }
                            i = i + 1;
                        });
                        if (flagCheck == false) {
                            a.push(b);
                        }
                        if (a.length < 1) {
                            a.push(b);
                        }

                        this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    } else {
                        this.oControl.setValueState(sap.ui.core.ValueState.Error);
                        this.getModel("dataModel").setProperty("/checkOutputDevice", false);
                        var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                        b.index = idx;
                        b.isErrOutputDevice = true;
                        b.isErrPrtLanguage = false;
                        let flagCheck = false;
                        let i = 0;
                        a.forEach(item => {
                            if (item.index == b.index) {
                                flagCheck = true;
                                b.isErrPrtLanguage = a[i]["isErrPrtLanguage"];
                                a[i] = b;
                            }
                            i = i + 1;
                        });
                        if (flagCheck == false) {
                            a.push(b);
                        }
                        if (a.length < 1) {
                            a.push(b);
                        }

                        this.getModel("dataModel").setProperty("/itemsChangedError", a);
                        this.oControl.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.OutputDevice"));
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
                    this.oControl.setValueState(sap.ui.core.ValueState.Error);
                }.bind(this));
            } else {
                this.oControl.setValueState(sap.ui.core.ValueState.None);
                this.getModel("dataModel").setProperty("/checkOutputDevice", true);
                var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                b.index = idx;
                b.isErrOutputDevice = false;
                b.isErrPrtLanguage = false;
                let flagCheck = false;
                let i = 0;
                a.forEach(item => {
                    if (item.index == b.index) {
                        flagCheck = true;
                        b.isErrPrtLanguage = a[i]["isErrPrtLanguage"];
                        a[i] = b;
                    }
                    i = i + 1;
                });
                if (flagCheck == false) {
                    a.push(b);
                }
                if (a.length < 1) {
                    a.push(b);
                }

                this.getModel("dataModel").setProperty("/itemsChangedError", a);
            }

        },
        onCheckPartnerAsn: function (oEvt) {
            var idx = oEvt.getSource().getParent().getBindingContextPath().split("/")[2];
            var sPath = oEvt.getSource().getParent().getBindingContextPath();
            var sSelectedKey = oEvt.getSource().getValue();
            var oID = oEvt.getParameters().id;
            let oControlname = oID.split("--")[2];
            this.oControl = this.byId(oControlname);

            var aFilter = {};
            var aFilters = [];
            aFilter = new sap.ui.model.Filter({path: "PartnerNumber", operator: sap.ui.model.FilterOperator.EQ, value1: sSelectedKey});
            aFilters.push(aFilter);
            if (sSelectedKey.length >= 1) {
                this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
                this.getService().getASNPartnerSet(aFilters).then(function (oData) {
                    var b = new Array();
                    if (oData.results.length > 0) {
                        this.oControl.setValueState(sap.ui.core.ValueState.None);
                        this.getModel("dataModel").setProperty("/checkASNPartner", true);
                        var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                        b.index = idx;
                        b.isErrPrtLanguage = false;
                        b.isErrOutputDevice = false;
                        b.isErrASNSource = false;
                        b.isErrPrintTime = false;
                        b.isErrASNFunction = false;
                        b.isErrASNPartner = false;
                        let flagCheck = false;
                        let i = 0;
                        a.forEach(item => {
                            if (item.index == b.index) {
                                flagCheck = true;
                                b.isErrPrtLanguage = a[i]["isErrPrtLanguage"];
                                b.isErrOutputDevice = a[i]["isErrOutputDevice"];
                                b.isErrASNSource = a[i]["isErrASNSource"];
                                b.isErrPrintTime = a[i]["isErrPrintTime"];
                                a[i] = b;
                            }
                            i = i + 1;
                        });
                        if (flagCheck == false) {
                            a.push(b);
                        }
                        if (a.length < 1) {
                            a.push(b);
                        }

                        this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    } else {
                        this.oControl.setValueState(sap.ui.core.ValueState.Error);
                        this.getModel("dataModel").setProperty("/checkASNPartner", false);
                        var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                        b.index = idx;
                        b.isErrPrtLanguage = false;
                        b.isErrOutputDevice = false;
                        b.isErrASNSource = false;
                        b.isErrPrintTime = false;
                        b.isErrASNFunction = false;
                        b.isErrASNPartner = true;
                        let flagCheck = false;
                        let i = 0;
                        a.forEach(item => {
                            if (item.index == b.index) {
                                flagCheck = true;
                                b.isErrPrtLanguage = a[i]["isErrPrtLanguage"];
                                b.isErrOutputDevice = a[i]["isErrOutputDevice"];
                                b.isErrASNSource = a[i]["isErrASNSource"];
                                b.isErrPrintTime = a[i]["isErrPrintTime"];
                                a[i] = b;
                            }
                            i = i + 1;
                        });
                        if (flagCheck == false) {
                            a.push(b);
                        }
                        if (a.length < 1) {
                            a.push(b);
                        }

                        this.getModel("dataModel").setProperty("/itemsChangedError", a);
                        this.oControl.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.partner_asn"));
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
                    this.oControl.setValueState(sap.ui.core.ValueState.Error);
                }.bind(this));
            }

        },
        onInputChange: function (oEvt) { // debugger;
            if (oEvt.getParameter("escPressed")) {} else { // this._setUIChanges(true);
                if (oEvt.getSource().getParent().getBindingContextPath()) {
                    var idx = oEvt.getSource().getParent().getBindingContextPath().split("/")[2];
                    var sPath = oEvt.getSource().getParent().getBindingContextPath();
                    var oValidatedComboBox = oEvt.getSource().sId;
                    if (idx !== -1) {
                        if (oEvt.getParameter("state")) {
                            if (oValidatedComboBox.includes("REL_AFTER_OUTPUT")) {
                                this.getModel("dataModel").setProperty(sPath + "/REL_AFTER_OUTPUT", "X");
                            }
                            /*   else if(oValidatedComboBox.includes("PRINT_IMMEDIATELY")){
                                        this.getModel("dataModel").setProperty(sPath + "/PRINT_IMMEDIATELY", "X");
                                    } */ else if (oValidatedComboBox.includes("ARCHIEVE")) {
                                this.getModel("dataModel").setProperty(sPath + "/ARCHIEVE", "Y");
                            }

                        } else {
                            if (oValidatedComboBox.includes("REL_AFTER_OUTPUT")) {
                                this.getModel("dataModel").setProperty(sPath + "/REL_AFTER_OUTPUT", "");
                            }
                            /*          else if(oValidatedComboBox.includes("PRINT_IMMEDIATELY")){
                                        this.getModel("dataModel").setProperty(sPath + "/PRINT_IMMEDIATELY", "");
                                    } */ else if (oValidatedComboBox.includes("ARCHIEVE")) {
                                this.getModel("dataModel").setProperty(sPath + "/ARCHIEVE", "N");
                            }
                        }
                        if (oValidatedComboBox.includes("NO_OF_COPIES")) {
                            if (oEvt.getSource().getValue() == "") {
                                this.getModel("dataModel").setProperty(sPath + "/NO_OF_COPIES", "0");
                                oEvt.getSource().setValue("");
                            } else {
                                this.getModel("dataModel").setProperty(sPath + "/NO_OF_COPIES", oEvt.getSource().getValue());
                            }
                        }
                        var a = this.getModel("dataModel").getProperty("/itemsChanged");
                        var b = new Array();
                        b.index = idx;
                        let flagCheck = false;
                        a.forEach(item => {
                            if (item.index == b.index) {
                                flagCheck = true;
                            }
                        });
                        if (flagCheck == false) {
                            a.push(b);
                        }
                        if (a.length < 1) {
                            a.push(b);
                        }

                        this.getModel("dataModel").setProperty("/itemsChanged", a);
                    }
                    // debugger;

                    if (oValidatedComboBox.includes("OUTPUT_DEVICE")) {

                        this.onCheckOutputDevice(oEvt);
                    }
                    else if(oValidatedComboBox.includes("PARTNER_ASN")){
                        this.onCheckPartnerAsn(oEvt);
                    }
                }
            }
        },
        handleChangeCbDevice: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (! sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                if (oValidatedComboBox.sId.includes("PRINT_LANGUAGE")) {
                    this.getModel("dataModel").setProperty("/checkPrintLanguage", false);

                    oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.print_language"));

                }
                if (oValidatedComboBox.sId.includes("PRINT_TIMEPOINT")) {
                    this.getModel("dataModel").setProperty("/checkPrintTime", false);

                    oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.print_timepoint"));

                }
                 if (oValidatedComboBox.sId.includes("LOADING_LIST_PRINT")) {
                    this.getModel("dataModel").setProperty("/checkloading_list", false);

                    oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.loading_list_prt"));

                }
                if (oValidatedComboBox.sId.includes("_FUNCTION_ASN")) {
                    this.getModel("dataModel").setProperty("/checkASNFunction", false);

                    oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.function_asn"));

                }
                if (oValidatedComboBox.sId.includes("OUTPUT_DEVICE")) {
                    this.getModel("dataModel").setProperty("/checkOutputDevice", false);
                    oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.OutputDevice"));
                }
                if (oValidatedComboBox.sId.includes("ASN_SOURCE")) {
                    this.getModel("dataModel").setProperty("/checkASNSource", false);

                    oValidatedComboBox.setValueStateText(this.getModel("i18n").getProperty("dialog.error.validation.asn_source"));

                }

            } else {

                if (oValidatedComboBox.sId.includes("PRINT_LANGUAGE")) {
                    this.getModel("dataModel").setProperty("/checkPrintLanguage", true);

                }
                if (oValidatedComboBox.sId.includes("ASN_SOURCE")) {
                    this.getModel("dataModel").setProperty("/checkASNSource", true);
                }
                if (oValidatedComboBox.sId.includes("PRINT_TIMEPOINT")) {
                    this.getModel("dataModel").setProperty("/checkPrintTime", true);

                }
                if (oValidatedComboBox.sId.includes("LOADING_LIST_PRINT")) {
                    this.getModel("dataModel").setProperty("/checkloading_list", true);

                }
                if (oValidatedComboBox.sId.includes("ASN_SOURCE")) {
                    this.getModel("dataModel").setProperty("/checkASNSource", true);
                }
                if (oValidatedComboBox.sId.includes("OUTPUT_DEVICE")) {
                    this.getModel("dataModel").setProperty("/checkOutputDevice", true);
                }
                oValidatedComboBox.setValueState(ValueState.None);
            }
            if (oValidatedComboBox.sId.includes("PRINT_LANGUAGE") || oValidatedComboBox.sId.includes("ASN_SOURCE") || oValidatedComboBox.sId.includes("PRINT_TIMEPOINT")) {
                var a = this.getModel("dataModel").getProperty("/itemsChanged");
                var b = new Array();
                let idx = oEvt.getSource().getParent().getBindingContextPath().split("/")[2];
                b.index = idx;
                let flagCheck = false;
                a.forEach(item => {
                    if (item.index == b.index) {
                        flagCheck = true;
                    }
                });
                if (flagCheck == false) {
                    a.push(b);
                }
                if (a.length < 1) {
                    a.push(b);
                }

                this.getModel("dataModel").setProperty("/itemsChanged", a);
            }
        },
        onEdit: function () {
            this.getModel("dataModel").setProperty("/itemsChanged", []);
            this.getModel("dataModel").setProperty("/itemsChangedError", []);
            this.getModel("dataModel").setProperty("/showFooter", true)
            this.getModel("dataModel").setProperty("/editEnable", true)
            this.showFooter(true);
            this.oEditAction.setVisible(false);
            this.oCreateAction.setVisible(false);
            // Keep Original data before change. - unDoDataItems
            const itemTableDataOrg = this.getModel("dataModel").getProperty("/itemTableDataSet");
            var oTableModel = this.getModel("dataModel").getProperty("/dynamicTableData")
            if (itemTableDataOrg) {

                var data1 = {};
                data1 = {};
                var aData = [];
                for (let i = 0; i < itemTableDataOrg.length; i++) {
                    data1 = {};
                    oTableModel.HeaderNav.results.forEach(ocolumn => {
                        var a = ocolumn.HeaderName;
                        var c = "Col" + ocolumn.HeaderIndex;
                        data1[c] = itemTableDataOrg[i][a];
                    });
                    aData.push(data1);
                }
                this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
                this.getModel("comboBoxModel").setProperty("/unDoDataItems", aData);
            }

        },
        showFooter: function (bShow) {
            this.oSemanticPage.setShowFooter(bShow);
        },
        onSave: function () { // debugger;
            var k = this.getModel("dataModel").getProperty("/itemsChangedError");
           // var seloutputtype = this.getModel("dataModel").getProperty("/seloutputtype");
            let flagCheck = false;
            let _message = "";
            if (k.length > 0) {
                for (let a = 0; a < k.length; a++) {
                    flagCheck = false;
                    if (k[a]["isErrOutputDevice"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.OutputDevice");
                    }
                    if (k[a]["isErrPrtLanguage"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.print_language");
                    }
                    if (k[a]["isErrASNSource"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.asn_source");
                    }
                    if (k[a]["isErrPrintTime"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.print_timepoint");
                    }
                    if (k[a]["isErrLoadingListPrint"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.loading_list_prt");
                    }
                    if (k[a]["isErrASNFunction"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.function_asn");
                    }
                    if (k[a]["isErrASNPartner"] == true) {
                        flagCheck = true;
                        _message = this.getResourceBundle().getText("dialog.error.validation.partner_asn");
                    }
                    if (flagCheck == true) {

                        sap.m.MessageBox.show(_message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                        break;
                    }
                };

                if (flagCheck == true) {
                    return;
                }
            }
            var deepDynamicTable = this.getModel("dataModel").getProperty("/dynamicTableData");
            var aTableItems = this.getModel("dataModel").getProperty("/itemTableDataSet");
            var aItemChangedIndx = this.getModel("dataModel").getProperty("/itemsChanged");
            var aItemChangedData = [];
            var _payload_deep_rt = this.fnBuildDeepentity();
            var seloutputtype = this.getModel("dataModel").getProperty("/seloutputtype");
            if (aItemChangedIndx.length > 0) {
                for (let j = 0; j < aItemChangedIndx.length; j++) {
                    var d = aTableItems[aItemChangedIndx[j]["index"]];
                    if (d) { // check if Print Time“ mandatory if “Number of messages” it GT zero
                        if (seloutputtype.includes("_ASN_")) {
                           // check mandatory for all input fields
                           if (!d["FUNCTION"]) {
                            let j = d["FUNCTION"];
                            if (j.length < 1) {
                                flagCheck = true;
                                let _message = this.getResourceBundle().getText("dialog.error.validation.function_asn") ;
                                sap.m.MessageBox.show(_message, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: "Error"
                                });
                                aItemChangedData = [];
							    break;
                            }
                           }   
                           if (!d["PARTNER"]) {
                            let j = d["PARTNER"];
                            if (j.length < 1) {
                                flagCheck = true;
                                let _message = this.getResourceBundle().getText("dialog.error.validation.partner_asn");
                                sap.m.MessageBox.show(_message, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: "Error"
                                });
                                aItemChangedData = [];
							    break;
                            }
                           }
                           if (!d["ASN_SOURCE"]) {
                            let j = d["ASN_SOURCE"];
                            if (j.length < 1) {
                                flagCheck = true;
                                let _message = this.getResourceBundle().getText("dialog.error.validation.asn_source");
                                sap.m.MessageBox.show(_message, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: "Error"
                                });
                                aItemChangedData = [];
							    break;
                            }
                        } 
                        }
                        else if( seloutputtype.includes("_FO_")){
                            if(d["LOADING_LIST_PRINT"])
                             {
                            //      if (d["NO_OF_COPIES"]) {
                            //         let l1 = d["NO_OF_COPIES"];
                            //         if(l1.length > 0){
                            //              let h1 = parseInt(l1);

                            //         }
                            //      }

                             }
                            else{
                                 flagCheck = true;
                                 let  _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.Obj.loadinglist");
                                 sap.m.MessageBox.show(_message, {
                                                    icon: sap.m.MessageBox.Icon.ERROR,
                                                    title: "Error"
                                                });
                                aItemChangedData = [];
                                break;
                            }
                        }
                        else {
                            if (d["NO_OF_COPIES"]) {
                                let j = d["NO_OF_COPIES"];
                                if (j.length > 0) {
                                    let h = parseInt(j);
                                    if (h > 0) {
                                        let k = "";
                                        if( seloutputtype.includes("_FO_")){                   
                                            k = d["LOADING_LIST_PRINT"];
                                        }   
                                        else{
                                            k = d["PRINT_TIMEPOINT"];
                                        }
                                        if (k) {
                                            let g = k;
                                            let _message = "";
                                            if( seloutputtype.includes("_FO_")){
                                                // g = d["LOADINGLISTPRINT"];
                                                _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.Obj.loadinglist");
                                            }
                                            else{
                                            // g = d["PRINT_TIMEPOINT"];
                                                _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.Obj.print_timepoint");
                                            }
                                            if (g.length < 1) { // dialog.error.validation.save.print_timepoint
                                                flagCheck = true;
                                                let _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.print_timepoint");
                                                sap.m.MessageBox.show(_message, {
                                                    icon: sap.m.MessageBox.Icon.ERROR,
                                                    title: "Error"
                                                });
                                                aItemChangedData = [];
                                                break;
                                            }
                                        } else { // dialog.error.validation.save.print_timepoint
                                            flagCheck = true;
                                            let _message = this.getResourceBundle().getText("dialog.error.validation.BeforeSave.print_timepoint");
                                            sap.m.MessageBox.show(_message, {
                                                icon: sap.m.MessageBox.Icon.ERROR,
                                                title: "Error"
                                            });
                                            aItemChangedData = [];
                                            break;
                                        }

                                    }
                                }
                            }
                        }
                     aItemChangedData.push(d);
                    }
                }
            }
            if (flagCheck == true) {
                return;
            }
            this.getModel("dataModel").setProperty("/showFooter", false)
            this.getModel("dataModel").setProperty("/editEnable", false)
            this.oCreateAction.setVisible(true);
            this.showFooter(false);
            this.oEditAction.setVisible(true);
            let i = 0;
            for (let k = 0; k < aItemChangedData.length; k++) {
                var data1 = {};

                deepDynamicTable.HeaderNav.results.forEach(ocolumn => {
                    i = i + 1;
                    var c = "Col" + ocolumn.HeaderIndex;
                    data1[c] = aItemChangedData[k][ocolumn.HeaderName];

                });

                _payload_deep_rt.ItemsNav.push(data1);

            }
            _payload_deep_rt.HeaderNav = deepDynamicTable.HeaderNav.results;
            _payload_deep_rt.Mode = "U";

            if (_payload_deep_rt.ItemsNav.length > 0) {
                this.setBusy(true);
                this.getService().postProcessDeepEntity(_payload_deep_rt).then(function (aData) { // debugger;
                    this.setBusy(false);
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
                                                this.getModel("dataModel").setProperty("/itemsChangedError", []);
                                            }
                                        } else {
                                            this._fnHandleSuccessExe(oMessage);
                                        }
                                    } else { // Error
                                        this._fnHandleErrorExe();
                                        this.setBusy(false);
                                    }
                                }
                            } else {
                                this._fnHandleErrorExe();
                                this.setBusy(false);
                            }
                            break;
                        }

                    }
                }.bind(this), function (oError) {
                    this.setBusy(false);
                    this._fnHandleErrorExe();

                }.bind(this));
            } else {
                MessageToast.show(this.getResourceBundle().getText("dialog.infor.nodata.change"));
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

            sap.m.MessageBox.show(_message, {
                icon: sap.m.MessageBox.Icon.SUCCESS,
                title: "Success"
            });
            this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
            if (this.getModel("dataModel").getProperty("/ModeChange") == "D") {
                var aItemData = this.getModel("dataModel").getProperty("/aItemDeletedData");
                this.getOwnerComponent().getEventBus().publish("MainViewTable", "ItemChange", {
                    aItem: aItemData,
                    bIsMode: this.getModel("dataModel").getProperty("/ModeChange")
                });
            }
            this.getView().byId("dynamicTable").getModel("dataModel").refresh(true)
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
        onCancel: function () {

            var aItemschange = this.getModel("dataModel").getProperty("/itemsChanged");
            if (aItemschange.length > 0) {
                sap.m.MessageBox.warning(this.getResourceBundle().getText("dialog.warning.Cancelation.confirmation"), {
                    actions: [
                        sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.YES) {
                            this.getModel("dataModel").setProperty("/showFooter", false)
                            this.getModel("dataModel").setProperty("/editEnable", false)
                            this.showFooter(false);
                            this.oEditAction.setVisible(true);
                            this.oCreateAction.setVisible(true);

                            // Return Backdata for item table data.

                            var unDoDataItems = this.getModel("comboBoxModel").getProperty("/unDoDataItems");
                            if (unDoDataItems) {
                                var oTableModel = this.getModel("dataModel").getProperty("/dynamicTableData")
                                let arrFieldsSet = [];
                                var data = new Array();
                                // debugger;
                                for (let a = 0; a < unDoDataItems.length; a++) {
                                    let i = 0;
                                    data = new Array();
                                    oTableModel.HeaderNav.results.forEach(oHeader => { // data = new Array();
                                        i = i + 1;
                                        let j = oHeader.HeaderName;
                                        let c = "Col" + oHeader.HeaderIndex;
                                        data[j] = unDoDataItems[a][c];
                                    });
                                    arrFieldsSet.push(data);
                                }

                                this.getModel("dataModel").setProperty("/itemTableDataSet", [])
                                this.getModel("dataModel").setProperty("/itemTableDataSet", arrFieldsSet);
                                this.getModel("comboBoxModel").setProperty("/unDoDataItems", []);
                            }

                        } else {
                            return;
                        }
                    }.bind(this)
                });
            } else {
                this.getModel("dataModel").setProperty("/showFooter", false)
                this.getModel("dataModel").setProperty("/editEnable", false)
                this.showFooter(false);
                this.oEditAction.setVisible(true);
                this.oCreateAction.setVisible(true);
            }

        },
        onDelete: function () { // debugger;
            var oTable = this.getView().byId("dynamicTable");
            var aItems = oTable.getSelectedItems();
            let countItem = aItems.length;
            var messText = this.getResourceBundle().getText("dialog.warning.confirmation.delete");
            let newMessage = messText.replace("&1", countItem);
            sap.m.MessageBox.warning(newMessage, {
                actions: [
                    sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL
                ],
                emphasizedAction: sap.m.MessageBox.Action.YES,
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.YES) {
                        this.fnDeleteItemsData();
                    } else {
                        return;
                    }
                }.bind(this)
            });
        },
        fnDeleteItemsData: function () {
            var oTable = this.getView().byId("dynamicTable");
            var aItems = oTable.getSelectedItems();
            if (aItems.length < 1) {
                return;
            }
            var _payload_deep_rt = this.fnBuildDeepentity();
            var aItemsDeleted = [];
            for (let a = 0; a < aItems.length; a++) {
                var indx = aItems[a].getBindingContextPath().split("/")[2];
                var oItemDel = {};
                oItemDel.Index = indx;
                aItemsDeleted.push(oItemDel);
            }

            var aTableItems = this.getModel("dataModel").getProperty("/itemTableDataSet")
            var deepDynamicTable = this.getModel("dataModel").getProperty("/dynamicTableData");
            var aItemChangedData = [];
            if (aItemsDeleted.length > 0) {
                this.getModel("dataModel").setProperty("/ModeChange", "D");
                for (let j = 0; j < aItemsDeleted.length; j++) {
                    var d = aTableItems[aItemsDeleted[j]["Index"]];
                    if (d) {
                        aItemChangedData.push(d);
                    }
                }
            }
            let i = 0;
            // var data1 = {};
            for (let k = 0; k < aItemChangedData.length; k++) {
                var data1 = {};

                deepDynamicTable.HeaderNav.results.forEach(ocolumn => {
                    i = i + 1;
                    // var a = ocolumn.HeaderName;
                    var c = "Col" + ocolumn.HeaderIndex;
                    data1[c] = aItemChangedData[k][ocolumn.HeaderName];

                });

                // let obj = Object.assign({}, aItemChangedData[k]);
                _payload_deep_rt.ItemsNav.push(data1);

            }
            _payload_deep_rt.HeaderNav = deepDynamicTable.HeaderNav.results;
            _payload_deep_rt.Mode = "D";

            if (_payload_deep_rt.ItemsNav.length > 0) { // aItemDeletedData
                this.getModel("dataModel").setProperty("/aItemDeletedData", aItemChangedData);
                this.setBusy(true);
                this.getService().postProcessDeepEntity(_payload_deep_rt).then(function (aData) { // debugger;
                    this.setBusy(false);
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
                                        this._fnHandleErrorExe();
                                        this.setBusy(false);
                                    }
                                }
                            } else {
                                this._fnHandleErrorExe();
                                this.setBusy(false);
                            }
                            break;
                        }
                    }
                }.bind(this), function (oError) {
                    this.setBusy(false);
                    this._fnHandleErrorExe();

                }.bind(this));
            } else {
                MessageToast.show(this.getResourceBundle().getText("dialog.error.no_selection.delete"));
            }
        },
        createColumnConfig: function () {
            var aTableData = this.getModel("dataModel").getProperty("/dynamicTableData");
            var e = [];
            aTableData.HeaderNav.results.forEach(function (t) {
                e.push({label: t.HeaderValue, property: t.HeaderName})
            });
            return e;
        },
        onExit: function () {
            this.setModel("dataModel", {});
            this.getOwnerComponent().setModel("oDataDeepPayload", {});
            // objectModel
            this.setModel("comboBoxModel", {});
        },
        onExport: function () {
            const oTable = this.byId("dynamicTable");
            const oBinding = oTable.getBinding("items");
            const aCols = this.createColumnConfig();
            const oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: oBinding
            };
            const oSheet = new Spreadsheet(oSettings);

            oSheet.build().then(function () {
                MessageToast.show("Spreadsheet export has finished");
            }). finally(function () {
                oSheet.destroy();
            });
        },
        onValueHelpRequest_Table: function (oEvent) {
            let aFilter = [];
            var oID = oEvent.getParameters().id;
            let oControlname = oID.split("--")[2];
            this.oControl = this.byId(oControlname);
            let _entityName = oEvent.oSource.mProperties.name;
            this.fnSetBusyIndicatorOnDetailControls(this.oControl, true)
            let arrayFieldsLabel = [];
            let arrayColumns = [];
            this._oSourceFieldIDF4 = oEvent.getSource();
            var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
            var data = new Array();
            var arrFieldsSet = [];
            var _inlineCount = 0
            if (oControlname.includes(("comb_OUTPUT_DEVICE"))) {
                _entityName = "Output_Device"
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
                    this.onValueHelpInputPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("out_device_txt"), _entityName, _inlineCount, idx);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
                }.bind(this));
            } else if (oControlname.includes(("comb_PRINT_LANGUAGE"))) {
                _entityName = "Print_Language"
                data.Field1 = "Language"
                data.Field2 = "Description"
                arrayFieldsLabel.push(data);

                data = new Array();
                data.Field1 = "Spras"
                data.Field2 = "Sptxt"
                arrayColumns.push(data);
                this.getService().getLanguage(aFilter).then(function (oData) {
                    _inlineCount = oData.__count;
                    for (let i = 0; i < oData.length; i++) {
                        arrFieldsSet.push(oData[i]);
                    }
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false)
                    this.onValueHelpInputPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, "Language", _entityName, _inlineCount, idx);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
                }.bind(this));
            } else if (oControlname.includes(("comb_PARTNER_ASN"))) {
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
                    this.onValueHelpInputPopup(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("partner_txt"), _entityName, _inlineCount, idx);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.oControl, false);
                }.bind(this));
            }
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
                case "_IDMultiInputShippingPoint":

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
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), true);
                    this.getService().getShippingPointSet(aFilter).then(function (oData) {
                        _inlineCount = oData.__count;
                        for (let i = 0; i < oData.results.length; i++) {
                            arrFieldsSet.push(oData.results[i]);
                        }
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                        this.onValueHelpPopupAuto(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("shipping_point_txt"), _entityName, _inlineCount);
                    }.bind(this), function (oError) {
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                    }.bind(this));
                    break;
                case "_IDMultiInputShiptoParty":
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
                    this.getService().getShipToPartySet(aFilter).then(function (oData) {
                        _inlineCount = oData.__count;
                        for (let i = 0; i < oData.results.length; i++) {

                            arrFieldsSet.push(oData.results[i]);
                        }
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                        this.onValueHelpPopupAuto(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("ship_to_party_txt"), _entityName, _inlineCount);
                    }.bind(this), function (oError) {
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                    }.bind(this));

                    break;
                case "_IDMultiInputCSP":
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
                    this.getService().getCSPSet(aFilter).then(function (oData) {
                        _inlineCount = oData.__count;
                        for (let i = 0; i < oData.results.length; i++) {
                            arrFieldsSet.push(oData.results[i]);
                        }
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                        this.onValueHelpPopupAuto(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("csp_txt"), _entityName, _inlineCount);
                    }.bind(this), function (oError) {
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                    }.bind(this));

                    break;
                case "_IDMultiInputDEST_COUNTRY":
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
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                        this.onValueHelpPopupAuto(arrayFieldsLabel, arrayColumns, arrFieldsSet, this.oControl, this.getResourceBundle().getText("country_txt"), _entityName, _inlineCount);
                    }.bind(this), function (oError) {
                        this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDGenDynamicPageHeader"), false);
                    }.bind(this));
                    break;
                default:
                    // code block
            }
        },

        onValueHelpPopupAuto: async function (_oLabels, _oColumns, _oData1, oControl, _title, _entityName, _inlineCount) { // debugger;
            this.fnSetBusyIndicatorOnDetailControls(oControl, true)
            var _ColumnFields = CusValueHelpDialog.fnCreateBindingColumn(_oLabels, _oColumns);
            let arrFieldsSet = CusValueHelpDialog.fnReGenerateOdataSetF4(_oLabels, _oColumns, _oData1, "/ShipToPartySet");
            this.getModel("dataModel").setProperty("/ShipToPartySet", []);
            this.getModel("dataModel").setProperty("/ShipToPartySet", arrFieldsSet);
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
                model: this.getModel("dataModel"),
                multiSelect: true,
                keyField: arrCols["Field1"],
                keyDescField: "",
                basePath: "dataModel>/ShipToPartySet",
                preFilters: _tblPrefliter,
                columns: _ColumnFields,
                modeQuery: 2,
                oService: dataService,
                entityName: _entityName,
                labelDefinition: _oLabels,
                columnDefiniton: _oColumns,
                inlineCount: _inlineCount,
                oControlF4Id: this._oSourceFieldIDF4,
                oContext: this,
                ok: function (selectedRow) {
                    let aTokens = [];
                    for (var i = 0; i < selectedRow.length; i++) {
                        if (selectedRow[i]) {
                            var oToken1 = new Token({key: selectedRow[i][arrCols["Field1"]], text: selectedRow[i][arrCols["Field1"]]});
                            if (arrCols["Field1"] == "CountryCode") {
                                var text = selectedRow[i][arrCols["Field2"]] + "(" + selectedRow[i][arrCols["Field1"]] + ")";
                                oToken1 = new Token({key: selectedRow[i][arrCols["Field1"]], text: text});
                            }
                            aTokens.push(oToken1);
                        }
                    }
                    this._oSourceFieldIDF4.setValue("");
                    this._oSourceFieldIDF4.setTokens(aTokens);
                    this._oSourceFieldIDF4.setValueState(sap.ui.core.ValueState.None);
                    this._oSourceFieldIDF4.fireSubmit();
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
            let aTokens = [];
            this._valueHelpDialog.setTokens(aTokens);
            this._valueHelpDialog.setTokens(oControl.getTokens());
            this._valueHelpDialog.update();
            this._valueHelpDialog.open();
        },

        onValueHelpInputPopup: async function (_oLabels, _oColumns, _oData1, oControl, _title, _entityName, _inlineCount, indx) { // debugger;
            this.fnSetBusyIndicatorOnDetailControls(oControl, true)
            var _ColumnFields = CusValueHelpDialog.fnCreateBindingColumn(_oLabels, _oColumns);
            let arrFieldsSet = CusValueHelpDialog.fnReGenerateOdataSetF4(_oLabels, _oColumns, _oData1, "/ShipToPartySet");
            this.getModel("dataModel").setProperty("/ShipToPartySet", []);
            this.getModel("dataModel").setProperty("/ShipToPartySet", arrFieldsSet);
            let arrCols = _oColumns[0];
            let dataService = this.getService();
            this._index = indx;
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
                model: this.getModel("dataModel"),
                multiSelect: false,
                keyField: arrCols["Field1"],
                keyDescField: "",
                basePath: "dataModel>/ShipToPartySet",
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
                            this._oSourceFieldIDF4.setValueState(sap.ui.core.ValueState.None);
                            this._oSourceFieldIDF4.fireSubmit();
                            var a = this.getModel("dataModel").getProperty("/itemsChanged");
                            var b = new Array();
                            b.index = this._index;
                            let flagCheck = false;
                            a.forEach(item => {
                                if (item.index == b.index) {
                                    flagCheck = true;
                                }
                            });
                            if (flagCheck == false) {
                                a.push(b);
                            }
                            if (a.length < 1) {
                                a.push(b);
                            }
                            this.getModel("dataModel").setProperty("/itemsChanged", a);
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
        onRowSelectionChange: function (oEvent) {
            if (oEvent.getSource().getSelectedItems().length == 1) {
                this.getView().byId("_IDBtnDelete").setEnabled(true);
                this.getModel("dataModel").setProperty("/bOnCreate", true);
                this.getView().byId("_IDBtnCreate").setEnabled(true);
                this.getView().byId("_IDBtnEdit").setEnabled(true);
            } else if (oEvent.getSource().getSelectedItems().length > 1) {
                this.getView().byId("_IDBtnDelete").setEnabled(true);
                this.getModel("dataModel").setProperty("/bOnCreate", false);
                this.getView().byId("_IDBtnCreate").setEnabled(false);
                this.getView().byId("_IDBtnEdit").setEnabled(false);
            } else {
                this.getView().byId("_IDBtnDelete").setEnabled(false);
                this.getModel("dataModel").setProperty("/bOnCreate", true);
                this.getView().byId("_IDBtnCreate").setEnabled(true);
                this.getView().byId("_IDBtnEdit").setEnabled(true);
            }
        },
        onShippingPointChange: function (oEvent) {
            // debugger;
            // multiInputFOs
            var sCurrTextValue = oEvent.getSource().getValue();
            let aFilter = [];
            if (sCurrTextValue.length >= 4) {
                sCurrTextValue = sCurrTextValue.trim();
                let aFilter = [];

                aFilter.push(
                    // Shipping point
                        new sap.ui.model.Filter("ShippingPoint", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
                );

                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputShippingPoint"), true);
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
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputShippingPoint"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputShippingPoint"), false);
                }.bind(this));
            }
        },
        onShipToPartyChange: function (oEvent) {
            // debugger;
            // multiInputFOs
            var sCurrTextValue = oEvent.getSource().getValue();
            let aFilter = [];
            if (sCurrTextValue.length >= 10) {
                sCurrTextValue = sCurrTextValue.trim();
                let aFilter = [];

                aFilter.push(
                    // Shipping point
                        new sap.ui.model.Filter("ShipToParty", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
                );
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputShiptoParty"), true);
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
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputShiptoParty"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputShiptoParty"), false);
                }.bind(this));

            }
        },
        onCspChange: function (oEvent) {
            // debugger;
            // multiInputFOs
            var sCurrTextValue = oEvent.getSource().getValue();
            let aFilter = [];
            if (sCurrTextValue.length >= 3) {
                sCurrTextValue = sCurrTextValue.trim();
                let aFilter = [];

                aFilter.push(
                    // Shipping point
                        new sap.ui.model.Filter("Csp", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
                );
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputCSP"), true);
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
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputCSP"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputCSP"), false);
                }.bind(this));
            }
        },
        onCountryChange: function (oEvent) {
            // debugger;
            // multiInputFOs
            var sCurrTextValue = oEvent.getSource().getValue();
            let aFilter = [];
            if (sCurrTextValue.length >= 2) {
                sCurrTextValue = sCurrTextValue.trim();
                let aFilter = [];

                aFilter.push(
                    // Shipping point
                        new sap.ui.model.Filter("CountryCode", sap.ui.model.FilterOperator.EQ, sCurrTextValue)
                );
                this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputDEST_COUNTRY"), true);
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
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputDEST_COUNTRY"), false);
                }.bind(this), function (oError) {
                    this.fnSetBusyIndicatorOnDetailControls(this.getView().byId("_IDMultiInputDEST_COUNTRY"), false);
                }.bind(this));
            }
        },
        handleChangeCbDevice: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();
            var b = new Array();
            if (! sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);

                if (oValidatedComboBox.sId.includes("cboutputtype")) {
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.outputtype"));
                }
                if (oValidatedComboBox.sId.includes("cbaccesssequence")) {
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.accessSequence"));
                }
                if (oValidatedComboBox.sId.includes("PRINT_LANGUAGE")) {
                    this.getModel("dataModel").setProperty("/checkPrintLanguage", false);
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = true;
                    b.isErrOutputDevice = false;
                    b.isErrPrintTime = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            b.isErrOutputDevice = a[i]["isErrOutputDevice"];
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }
                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.print_language"));
                }
                if (oValidatedComboBox.sId.includes("ASN_SOURCE")) {
                    this.getModel("dataModel").setProperty("/checkASNSource", false);
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = true;
                    b.isErrPrintTime = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.asn_source"));
                }
                if (oValidatedComboBox.sId.includes("PRINT_TIMEPOINT")) {
                    this.getModel("dataModel").setProperty("/checkPrintTime", false);
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    b.isErrPrintTime = true;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.print_timepoint"));
                }

                if (oValidatedComboBox.sId.includes("LOADING_LIST_PRINT")) {
                    this.getModel("dataModel").setProperty("/checkloading_list", false);
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    b.isErrPrintTime = true;
                    b.isErrLoadingListPrint = true;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.loading_list_prt"));
                }
                if (oValidatedComboBox.sId.includes("_FUNCTION_ASN")) {
                    this.getModel("dataModel").setProperty("/checkASNFunction", false);
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    b.isErrPrintTime = false;
                    b.isErrASNFunction = true;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("dialog.error.validation.function_asn"));
                }
            } else {
                if (oValidatedComboBox.sId.includes("ASN_SOURCE")) {
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];

                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    this.getModel("dataModel").setProperty("/checkASNSource", true);
                }
                if (oValidatedComboBox.sId.includes("PRINT_TIMEPOINT")) {
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];

                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    b.isErrPrintTime = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    this.getModel("dataModel").setProperty("/checkPrintTime", true);
                }
                if (oValidatedComboBox.sId.includes("LOADING_LIST_PRINT")) {
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];

                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    b.isErrPrintTime = false;
                    b.isErrLoadingListPrint = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    this.getModel("dataModel").setProperty("/checkloading_list", true);

                }
                if (oValidatedComboBox.sId.includes("_FUNCTION_ASN")) {
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];

                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    b.isErrASNSource = false;
                    b.isErrPrintTime = false;
                    b.isErrASNFunction = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    this.getModel("dataModel").setProperty("/checkASNFunction", true);
                }
                if (oValidatedComboBox.sId.includes("PRINT_LANGUAGE")) {
                    var idx = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];

                    var a = this.getModel("dataModel").getProperty("/itemsChangedError");
                    b.index = idx;
                    b.isErrPrtLanguage = false;
                    b.isErrOutputDevice = false;
                    let flagCheck = false;
                    let i = 0;
                    a.forEach(item => {

                        if (item.index == b.index) {
                            flagCheck = true;
                            b.isErrOutputDevice = a[i]["isErrOutputDevice"];
                            a[i] = b;
                        }
                        i = i + 1;
                    });
                    if (flagCheck == false) {
                        a.push(b);
                    }
                    if (a.length < 1) {
                        a.push(b);
                    }

                    this.getModel("dataModel").setProperty("/itemsChangedError", a);
                    this.getModel("dataModel").setProperty("/checkPrintLanguage", true);
                }
                oValidatedComboBox.setValueState(ValueState.None);
            }
        },
        handleSortDialogConfirm: function (oEvent) {
            var oTable = this.byId("dynamicTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];

            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));

            // apply the selected sort and group settings
            this.getModel("dataModel").setProperty("/currSortKey", sPath);
            oBinding.sort(aSorters);
        },
        handleSortButtonPressed: function () {
            this._openDialog("SortDialog", "sort", this._presetSettingsItems);
        },
        _presetSortsInit: function (oDialog, oThis) { // debugger;
            oDialog = oThis.byId("_IDGenViewSettingsDialog");
            let oDialogParent = oDialog.getParent(),
                oTable = oDialogParent.byId("dynamicTable"),
                oColumns = oTable.getColumns();
            var deepDynamicTable = oThis.getModel("dataModel").getProperty("/dynamicTableData");
            let headerData = deepDynamicTable.HeaderNav.results;
            var oItem = {};
            var aSortItem = oDialog.getSortItems();
            if (aSortItem.length > 0) {
                oDialog.destroySortItems();
            }
            // Loop every column of the table
            oColumns.forEach(column => {
                var isExisted = false;
                headerData.forEach(oHeader => {
                    var sId = column.sId;
                    if (sId.includes(oHeader.HeaderName, 0)) {
                        isExisted = true;
                        let a = this.getModel("dataModel").getProperty("/currSortKey");
                        if (a.length > 0) {
                            if (a == oHeader.HeaderName) {
                                oItem = new sap.m.ViewSettingsItem({key: oHeader.HeaderName, text: column.getAggregation("header").getProperty("text"), selected: true});
                            } else {
                                oItem = new sap.m.ViewSettingsItem({key: oHeader.HeaderName, text: column.getAggregation("header").getProperty("text"), selected: false});
                            }
                        } else {
                            if (oHeader.HeaderName == "SHIPPING_POINT") {
                                oItem = new sap.m.ViewSettingsItem({key: oHeader.HeaderName, text: column.getAggregation("header").getProperty("text"), selected: true});

                                this.getModel("dataModel").setProperty("/currSortKey", oHeader.HeaderName);
                            } else {
                                oItem = new sap.m.ViewSettingsItem({key: oHeader.HeaderName, text: column.getAggregation("header").getProperty("text"), selected: false});
                            }
                        }
                    }
                });
                if (isExisted == true) {
                    if (oItem) {
                        var selectOutput = this.getModel("dataModel").getProperty("/seloutputtype");
                        if (selectOutput.includes("_ASN_")) {
                            var _key = oItem.getProperty("key");
                            if (_key == "FUNCTION" || _key == "OUTPUT_TYPE" || _key == "SHIPPING_POINT" || _key == "SHIP_TO_PARTY" || _key == "OUTPUT_DEVICE" || _key == "CSP" || _key == "DEST_COUNTRY" || _key == "PARTNER" || _key == "ASN_SOURCE") {
                                oDialog.addSortItem(oItem);
                            }

                        } else {
                            oDialog.addSortItem(oItem);
                        }

                    }
                }
            })
        },
        // View Setting Dialog opener SortDialog
        _openDialog: function (sName, sPage, fInit) {
            var oView = this.getView();
            var oThis = this;

            // creates requested dialog if not yet created
            if (!this._mDialogs[sName]) {
                this.getModel("dataModel").setProperty("/currSortKey", "");
                this._mDialogs[sName] = Fragment.load({
                    id: oView.getId(),
                    name: "com.bosch.rb1m.tm.tmoutputcond.view." + sName,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    if (fInit) {
                        fInit(oDialog, oThis);
                    }
                    return oDialog;
                });
            } else {
                this._presetSettingsItems(this._mDialogs[sName], this);
            }
            this._mDialogs[sName].then(function (oDialog) { // opens the requested dialog
                oDialog.open(sPage);
            });
        },
        _presetSettingsItems: function (oDialog, oThis) {
            oThis._presetSortsInit(oDialog, oThis);
        }
    });
});
