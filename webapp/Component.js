sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/bosch/rb1m/tm/tmoutputcond/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.bosch.rb1m.tm.tmoutputcond.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
            // get setting default values
            this.oComponentData = this.getComponentData().startupParameters;
            if(this.oComponentData){
                if(this.oComponentData.ShippingPoint)
                {
                    if(this.oComponentData.ShippingPoint[0]){
                        this.setModel(this.oComponentData.ShippingPoint[0], "objDefaultShippingPoint");  
                    }  
                }          
            }
        }
    });
});