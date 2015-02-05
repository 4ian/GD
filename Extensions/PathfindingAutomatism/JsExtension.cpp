/**

GDevelop - Pathfinding Automatism Extension
Copyright (c) 2010-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/
#if defined(GD_IDE_ONLY)
#include "GDCore/PlatformDefinition/PlatformExtension.h"
#include "GDCore/Tools/Localization.h"
#include "GDCore/Tools/Version.h"
#include <boost/version.hpp>
#include <iostream>
#include <wx/intl.h>

/**
 * \brief This class declares information about the JS extension.
 */
class JsExtension : public gd::PlatformExtension
{
public:

    /**
     * \brief Constructor of an extension declares everything the extension contains: objects, actions, conditions and expressions.
     */
    JsExtension()
    {
        SetExtensionInformation("PathfindingAutomatism",
                              _("Pathfinding automatism"),
                              _("Compute paths for objects avoiding obstacles."),
                              "Florian Rival",
                              "Open source (MIT License)");
        CloneExtension("GDevelop C++ platform", "PathfindingAutomatism");

        GetAutomatismMetadata("PathfindingAutomatism::PathfindingAutomatism")
            .SetIncludeFile("PathfindingAutomatism/pathfindingruntimeautomatism.js")
            .AddIncludeFile("PathfindingAutomatism/pathfindingobstacleruntimeautomatism.js");

        {

            std::map<std::string, gd::InstructionMetadata > & autActions = GetAllActionsForAutomatism("PathfindingAutomatism::PathfindingAutomatism");
            std::map<std::string, gd::InstructionMetadata > & autConditions = GetAllConditionsForAutomatism("PathfindingAutomatism::PathfindingAutomatism");
            std::map<std::string, gd::ExpressionMetadata > & autExpressions = GetAllExpressionsForAutomatism("PathfindingAutomatism::PathfindingAutomatism");

            autConditions["PathfindingAutomatism::PathFound"].codeExtraInformation.SetFunctionName("pathFound");
            autActions["PathfindingAutomatism::SetDestination"].codeExtraInformation.SetFunctionName("moveTo");
            autConditions["PathfindingAutomatism::DestinationReached"].codeExtraInformation.SetFunctionName("destinationReached");
            autActions["PathfindingAutomatism::CellWidth"].codeExtraInformation.SetFunctionName("setCellWidth").SetAssociatedGetter("getCellWidth");
            autConditions["PathfindingAutomatism::CellWidth"].codeExtraInformation.SetFunctionName("getCellWidth");
            autActions["PathfindingAutomatism::CellHeight"].codeExtraInformation.SetFunctionName("setCellHeight").SetAssociatedGetter("getCellHeight");
            autConditions["PathfindingAutomatism::CellHeight"].codeExtraInformation.SetFunctionName("getCellHeight");
            autActions["PathfindingAutomatism::Acceleration"].codeExtraInformation.SetFunctionName("setAcceleration").SetAssociatedGetter("getAcceleration");
            autConditions["PathfindingAutomatism::Acceleration"].codeExtraInformation.SetFunctionName("getAcceleration");
            autActions["PathfindingAutomatism::MaxSpeed"].codeExtraInformation.SetFunctionName("setMaxSpeed").SetAssociatedGetter("getMaxSpeed");
            autConditions["PathfindingAutomatism::MaxSpeed"].codeExtraInformation.SetFunctionName("getMaxSpeed");
            autActions["PathfindingAutomatism::Speed"].codeExtraInformation.SetFunctionName("setSpeed").SetAssociatedGetter("getSpeed");
            autConditions["PathfindingAutomatism::Speed"].codeExtraInformation.SetFunctionName("getSpeed");
            autActions["PathfindingAutomatism::AngularMaxSpeed"].codeExtraInformation.SetFunctionName("setAngularMaxSpeed").SetAssociatedGetter("getAngularMaxSpeed");
            autConditions["PathfindingAutomatism::AngularMaxSpeed"].codeExtraInformation.SetFunctionName("getAngularMaxSpeed");
            autActions["PathfindingAutomatism::AngleOffset"].codeExtraInformation.SetFunctionName("setAngleOffset").SetAssociatedGetter("getAngleOffset");
            autConditions["PathfindingAutomatism::AngleOffset"].codeExtraInformation.SetFunctionName("getAngleOffset");
            autActions["PathfindingAutomatism::ExtraBorder"].codeExtraInformation.SetFunctionName("setExtraBorder").SetAssociatedGetter("getExtraBorder");
            autConditions["PathfindingAutomatism::ExtraBorder"].codeExtraInformation.SetFunctionName("getExtraBorder");

            autActions["PathfindingAutomatism::AllowDiagonals"].codeExtraInformation.SetFunctionName("allowDiagonals");
            autConditions["PathfindingAutomatism::DiagonalsAllowed"].codeExtraInformation.SetFunctionName("diagonalsAllowed");
            autActions["PathfindingAutomatism::RotateObject"].codeExtraInformation.SetFunctionName("setRotateObject");
            autConditions["PathfindingAutomatism::ObjectRotated"].codeExtraInformation.SetFunctionName("isObjectRotated");

            autExpressions["GetNodeX"].codeExtraInformation.SetFunctionName("getNodeX");
            autExpressions["GetNodeY"].codeExtraInformation.SetFunctionName("getNodeY");
            autExpressions["NextNodeIndex"].codeExtraInformation.SetFunctionName("getNextNodeIndex");
            autExpressions["NodeCount"].codeExtraInformation.SetFunctionName("getNodeCount");
            autExpressions["NextNodeX"].codeExtraInformation.SetFunctionName("getNextNodeX");
            autExpressions["NextNodeY"].codeExtraInformation.SetFunctionName("getNextNodeY");
            autExpressions["LastNodeX"].codeExtraInformation.SetFunctionName("getLastNodeX");
            autExpressions["LastNodeY"].codeExtraInformation.SetFunctionName("getLastNodeY");
            autExpressions["DestinationX"].codeExtraInformation.SetFunctionName("getDestinationX");
            autExpressions["DestinationY"].codeExtraInformation.SetFunctionName("getDestinationY");

            autExpressions["Acceleration"].codeExtraInformation.SetFunctionName("getAcceleration");
            autExpressions["MaxSpeed"].codeExtraInformation.SetFunctionName("getMaxSpeed");
            autExpressions["Speed"].codeExtraInformation.SetFunctionName("getSpeed");
            autExpressions["AngularMaxSpeed"].codeExtraInformation.SetFunctionName("getAngularMaxSpeed");
            autExpressions["AngleOffset"].codeExtraInformation.SetFunctionName("getAngleOffset");
            autExpressions["ExtraBorder"].codeExtraInformation.SetFunctionName("getExtraBorder");
            autExpressions["CellWidth"].codeExtraInformation.SetFunctionName("getCellWidth");
            autExpressions["CellHeight"].codeExtraInformation.SetFunctionName("getCellHeight");
        }

        GetAutomatismMetadata("PathfindingAutomatism::PathfindingObstacleAutomatism")
            .SetIncludeFile("PathfindingAutomatism/pathfindingruntimeautomatism.js")
            .AddIncludeFile("PathfindingAutomatism/pathfindingobstacleruntimeautomatism.js");

        {
            std::map<std::string, gd::InstructionMetadata > & autActions = GetAllActionsForAutomatism("PathfindingAutomatism::PathfindingObstacleAutomatism");
            std::map<std::string, gd::InstructionMetadata > & autConditions = GetAllConditionsForAutomatism("PathfindingAutomatism::PathfindingObstacleAutomatism");
            std::map<std::string, gd::ExpressionMetadata > & autExpressions = GetAllExpressionsForAutomatism("PathfindingAutomatism::PathfindingObstacleAutomatism");

            autActions["PathfindingObstacleAutomatism::Cost"].codeExtraInformation.SetFunctionName("setCost").SetAssociatedGetter("getCost");
            autConditions["PathfindingObstacleAutomatism::Cost"].codeExtraInformation.SetFunctionName("getCost");
            autActions["PathfindingObstacleAutomatism::SetImpassable"].codeExtraInformation.SetFunctionName("setImpassable");
            autConditions["PathfindingObstacleAutomatism::IsImpassable"].codeExtraInformation.SetFunctionName("isImpassable");

            autExpressions["Cost"].codeExtraInformation.SetFunctionName("getCost");
        }

        StripUnimplementedInstructionsAndExpressions();
    };
};

/**
 * Used by GDevelop to create the extension class
 * -- Do not need to be modified. --
 */
extern "C" gd::PlatformExtension * GD_EXTENSION_API CreateGDJSExtension() {
    return new JsExtension;
}
#endif
