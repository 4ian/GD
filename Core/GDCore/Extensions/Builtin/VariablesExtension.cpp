/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "AllBuiltinExtensions.h"
#include "GDCore/Tools/Localization.h"

using namespace std;
namespace gd {

void GD_CORE_API BuiltinExtensionsImplementer::ImplementsVariablesExtension(
    gd::PlatformExtension& extension) {
  extension
      .SetExtensionInformation(
          "BuiltinVariables",
          _("Variable features"),
          _("Built-in extension allowing to manipulate variables"),
          "Florian Rival",
          "Open source (MIT License)")
      .SetExtensionHelpPath("/all-features/variables");

#if defined(GD_IDE_ONLY)
  extension
      .AddCondition("VarScene",
                    _("Value of a scene variable"),
                    _("Compare the value of a scene variable."),
                    _("Scene variable _PARAM0_ is _PARAM1__PARAM2_"),
                    _("Variables"),
                    "res/conditions/var24.png",
                    "res/conditions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .AddParameter("relationalOperator", _("Sign of the test"))
      .AddParameter("expression", _("Value to compare"))
      .SetManipulatedType("number");

  extension
      .AddCondition("VarSceneTxt",
                    _("Text of a scene variable"),
                    _("Compare the text of a scene variable."),
                    _("The text of scene variable _PARAM0_ is _PARAM1__PARAM2_"),
                    _("Variables"),
                    "res/conditions/var24.png",
                    "res/conditions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .AddParameter("relationalOperator", _("Sign of the test"))
      .AddParameter("string", _("Text to compare"))
      .SetManipulatedType("string");

  extension
      .AddCondition(
          "VariableChildExists",
          _("Child existence"),
          _("Return true if the specified child of the scene variable exists."),
          _("Child _PARAM1_ of scene variable _PARAM0_ exists"),
          _("Variables/Structures"),
          "res/conditions/var24.png",
          "res/conditions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .AddParameter("string", _("Name of the child"))
      .MarkAsAdvanced();

  extension
      .AddCondition("GlobalVariableChildExists",
                    _("Child existence"),
                    _("Return true if the specified child of the global "
                      "variable exists."),
                    _("Child _PARAM1_ of global variable _PARAM0_ exists"),
                    _("Variables/Global variables/Structures"),
                    "res/conditions/var24.png",
                    "res/conditions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .AddParameter("string", _("Name of the child"))
      .MarkAsAdvanced();

  extension
      .AddCondition("VarSceneDef",
                    _("Test if a scene variable is defined"),
                    _("Test if the scene variable exists."),
                    _("Scene variable _PARAM0_ is defined"),
                    _("Variables"),
                    "res/conditions/var24.png",
                    "res/conditions/var.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Variable"))
      .SetHidden();

  extension
      .AddCondition("VarGlobal",
                    _("Value of a global variable"),
                    _("Compare the value of a global variable."),
                    _("Global variable _PARAM0_ is _PARAM1__PARAM2_"),
                    _("Variables/Global variables"),
                    "res/conditions/var24.png",
                    "res/conditions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .AddParameter("relationalOperator", _("Sign of the test"))
      .AddParameter("expression", _("Value to compare"))
      .MarkAsAdvanced()
      .SetManipulatedType("number");

  extension
      .AddCondition(
          "VarGlobalTxt",
          _("Text of a global variable"),
          _("Compare the text of a global variable."),
          _("The text of the global variable _PARAM0_ is _PARAM1__PARAM2_"),
          _("Variables/Global variables"),
          "res/conditions/var24.png",
          "res/conditions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .AddParameter("relationalOperator", _("Sign of the test"))
      .AddParameter("string", _("Text to compare"))
      .MarkAsAdvanced()
      .SetManipulatedType("string");

  extension
      .AddCondition("VarGlobalDef",
                    _("Test if a global variable is defined"),
                    _("Test if a global variable exists"),
                    _("Global variable _PARAM0_ is defined"),
                    _("Variables/Global variables"),
                    "res/conditions/var24.png",
                    "res/conditions/var.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Variable"))
      .MarkAsAdvanced()
      .SetHidden();

  extension
      .AddAction("ModVarScene",
                 _("Value of a scene variable"),
                 _("Modify the value of a scene variable."),
                 _("Do _PARAM1__PARAM2_ to scene variable _PARAM0_"),
                 _("Variables"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .AddParameter("operator", _("Modification's sign"))
      .AddParameter("expression", _("Value"))
      .SetManipulatedType("number");

  extension
      .AddAction("ModVarSceneTxt",
                 _("String of a scene variable"),
                 _("Modify the text of a scene variable."),
                 _("Do _PARAM1__PARAM2_ to the text of scene variable _PARAM0_"),
                 _("Variables"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .AddParameter("operator", _("Modification's sign"))
      .AddParameter("string", _("Text"))
      .SetManipulatedType("string");

  extension
      .AddAction("ModVarGlobal",
                 _("Value of a global variable"),
                 _("Modify the value of a global variable"),
                 _("Do _PARAM1__PARAM2_ to global variable _PARAM0_"),
                 _("Variables/Global variables"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .AddParameter("operator", _("Modification's sign"))
      .AddParameter("expression", _("Value"))
      .MarkAsAdvanced()
      .SetManipulatedType("number");

  extension
      .AddAction(
          "ModVarGlobalTxt",
          _("String of a global variable"),
          _("Modify the text of a global variable."),
          _("Do _PARAM1__PARAM2_ to the text of global variable _PARAM0_"),
          _("Variables/Global variables"),
          "res/actions/var24.png",
          "res/actions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .AddParameter("operator", _("Modification's sign"))
      .AddParameter("string", _("Text"))
      .MarkAsAdvanced()
      .SetManipulatedType("string");

  extension
      .AddAction("VariableRemoveChild",
                 _("Remove a child"),
                 _("Remove a child from a scene variable."),
                 _("Remove child _PARAM1_ from scene variable _PARAM0_"),
                 _("Variables/Structure"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .AddParameter("string", _("Child's name"))
      .MarkAsAdvanced();

  extension
      .AddAction("GlobalVariableRemoveChild",
                 _("Remove a child"),
                 _("Remove a child from a global variable."),
                 _("Remove child _PARAM1_ from global variable _PARAM0_"),
                 _("Variables/Global variables/Structure"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .AddParameter("string", _("Child's name"))
      .MarkAsAdvanced();

  extension
      .AddAction("VariableClearChildren",
                 _("Clear scene variable"),
                 _("Remove all the children from the scene variable."),
                 _("Clear children from scene variable _PARAM0_"),
                 _("Variables/Structure"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"))
      .MarkAsAdvanced();

  extension
      .AddAction("GlobalVariableClearChildren",
                 _("Clear global variable"),
                 _("Remove all the children from the global variable."),
                 _("Clear children from global variable _PARAM0_"),
                 _("Variables/Global variables/Structure"),
                 "res/actions/var24.png",
                 "res/actions/var.png")
      .AddParameter("globalvar", _("Variable"))
      .MarkAsAdvanced();

  extension
      .AddExpression("GlobalVariableChildCount",
                     _("Number of children of a global variable"),
                     _("Get the number of children of a global variable"),
                     _("Variables"),
                     "res/actions/var.png")
      .AddParameter("globalvar", _("Variable"));

  extension
      .AddExpression("VariableChildCount",
                     _("Number of children of a scene variable"),
                     _("Get the number of children of a scene variable"),
                     _("Variables"),
                     "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"));

  extension
      .AddExpression("Variable",
                     _("Value of a scene variable"),
                     _("Value of a scene variable"),
                     _("Variables"),
                     "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"));

  extension
      .AddStrExpression("VariableString",
                        _("Text of a scene variable"),
                        _("Text of a scene variable"),
                        _("Variables"),
                        "res/actions/var.png")
      .AddParameter("scenevar", _("Variable"));

  extension
      .AddExpression("GlobalVariable",
                     _("Value of a global variable"),
                     _("Value of a global variable"),
                     _("Variables"),
                     "res/actions/var.png")
      .AddParameter("globalvar", _("Name of the global variable"));

  extension
      .AddStrExpression("GlobalVariableString",
                        _("Text of a global variable"),
                        _("Text of a global variable"),
                        _("Variables"),
                        "res/actions/var.png")
      .AddParameter("globalvar", _("Variable"));
#endif
}

}  // namespace gd
