/**
 * This is a declaration of an extension for GDevelop 5.
 * 
 * ℹ️ Run `node import-GDJS-Runtime.js` (in newIDE/app/scripts) if you make any change
 * to this extension file or to any other *.js file that you reference inside.
 * 
 * The file must be named "JsExtension.js", otherwise GDevelop won't load it. 
 * ⚠️ If you make a change and the extension is not loaded, open the developer console
 * and search for any errors.
 * 
 * More information on https://github.com/4ian/GD/blob/master/newIDE/README-extensions.md
 */
module.exports = {
  createExtension: function(t, gd) {
    const extension = new gd.PlatformExtension();
    extension.setExtensionInformation(
      "DeviceSensors",
      t("Device sensors"),
      t(
        "Allow the game to access the sensors of a mobile device."
      ),
      "Matthias Meike",
      "Open source (MIT License)"
    );

    extension
      .addCondition(
        "OrientationSensorActive",
        t("Sensor active"),
        t(
          "The condition is true if the device orientation sensor is currently active"
        ),
        t("Orientation sensor is active"),
        t("Sensors/Orientation"),
        "JsPlatform/Extensions/orientation_active24.png",
        "JsPlatform/Extensions/orientation_active32.png"
      )
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.isActive");

      extension
      .addCondition(
        "OrientationAlpha",
        t("Compare the value of orientation alpha"),
        t(
          "Compare the value of orientation alpha. (Range: 0 to 360°)"
        ),
        t("Orientation alpha is _PARAM0__PARAM1_"),
        t("Sensors/Orientation"),
        "JsPlatform/Extensions/orientation_alpha24.png",
        "JsPlatform/Extensions/orientation_alpha32.png"
      )
      .addParameter("relationalOperator", t("Sign of the test"))
      .addParameter("expression", t("Value"))
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationAlpha");

      extension
      .addCondition(
        "OrientationBeta",
        t("Compare the value of orientation beta"),
        t(
          "Compare the value of orientation beta. (Range: -180 to 180°)"
        ),
        t("Orientation beta is _PARAM0__PARAM1_"),
        t("Sensors/Orientation"),
        "JsPlatform/Extensions/orientation_beta24.png",
        "JsPlatform/Extensions/orientation_beta32.png"
      )
      .addParameter("relationalOperator", t("Sign of the test"))
      .addParameter("expression", t("Value"))
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationBeta");

      extension
      .addCondition(
        "OrientationGamma",
        t("Compare the value of orientation gamma"),
        t(
          "Compare the value of orientation gamma. (Range: -90 to 90°)"
        ),
        t("Orientation gamma is _PARAM0__PARAM1_"),
        t("Sensors/Orientation"),
        "JsPlatform/Extensions/orientation_gamma24.png",
        "JsPlatform/Extensions/orientation_gamma32.png"
      )
      .addParameter("relationalOperator", t("Sign of the test"))
      .addParameter("expression", t("Value"))
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationGamma");

    extension
      .addAction(
        "ActivateOrientationListener",
        t("Activate orientation sensor"),
        t("Activate the orientation sensor. (remember to turn it off again)"),
        t("Activate the orientation sensor."),
        t("Sensors/Orientation"),
        "JsPlatform/Extensions/orientation_active24.png",
        "JsPlatform/Extensions/orientation_active32.png"
      )
        .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.activateOrientationSensor");

    extension
      .addAction(
        "DeactivateOrientationListener",
        t("Deactivate orientation sensor"),
        t("Deactivate the orientation sensor."),
        t("Deactivate the orientation sensor."),
        t("Sensors/Orientation"),
        "JsPlatform/Extensions/orientation_inactive24.png",
        "JsPlatform/Extensions/orientation_inactive32.png"
      )
        .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.deactivateOrientationSensor");

    extension
      .addExpression(
        "OrientationActive",
        t("Sensor Active"),
        t("The expression is true if the device orientation sensor is currently active"),
        t("Sensors/Orientation")
      )
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.isActive");

    extension
      .addExpression(
        "OrientationAbsolute",
        t("Is Absolute"),
        t("Get if the devices orientation is absolute and not relative"),
        t("Sensors/Orientation")
      )
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationAbsolute");

    extension
      .addExpression(
        "OrientationAlpha",
        t("Alpha value"),
        t("Get the devices orientation Alpha (compass)"),
        t("Sensors/Orientation")
      )
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationAlpha");

    extension
      .addExpression(
        "OrientationBeta",
        t("Beta value"),
        t("Get the devices orientation Beta"),
        t("Sensors/Orientation")
      )
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationBeta");

    extension
      .addExpression(
        "OrientationGamma",
        t("Gamma value"),
        t("Get the devices orientation Gamma value"),
        t("Sensors/Orientation")
      )
      .getCodeExtraInformation()
      .setIncludeFile(
        "Extensions/DeviceSensors/devicesensortools.js"
      )
      .setFunctionName("gdjs.evtTools.devicesensors.orientation.getOrientationGamma");

    return extension;
  },
  runExtensionSanityTests: function(extension) { return []; },
};
