/**

GDevelop - Draggable Automatism Extension
Copyright (c) 2014-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#include "GDCpp/ExtensionBase.h"
#include "GDCore/Tools/Version.h"
#include "DraggableAutomatism.h"


void DeclareDraggableAutomatismExtension(gd::PlatformExtension & extension)
{
    extension.SetExtensionInformation("DraggableAutomatism",
                              _("Draggable Automatism"),
                              _("Automatism allowing to move objects with the mouse"),
                              "Florian Rival",
                              "Open source (MIT License)");

    gd::AutomatismMetadata & aut = extension.AddAutomatism("Draggable",
          _("Draggable object"),
          _("Draggable"),
          _("Allows objects to be moved using the mouse."),
          "",
          "CppPlatform/Extensions/draggableicon.png",
          "DraggableAutomatism",
          std::shared_ptr<gd::Automatism>(new DraggableAutomatism),
          std::shared_ptr<gd::AutomatismsSharedData>());

    #if defined(GD_IDE_ONLY)
    aut.SetIncludeFile("DraggableAutomatism/DraggableAutomatism.h");

    aut.AddCondition("Dragged",
                   _("Being dragged"),
                   _("Check if the object is being dragged"),
                   _("_PARAM0_ is being dragged"),
                   "",
                   "CppPlatform/Extensions/draggableicon24.png",
                   "CppPlatform/Extensions/draggableicon16.png")
        .AddParameter("object", _("Object"))
        .AddParameter("automatism", _("Automatism"), "Draggable", false)
        .SetFunctionName("IsDragged").SetIncludeFile("DraggableAutomatism/DraggableAutomatism.h");
    #endif

}

/**
 * \brief This class declares information about the extension.
 */
class Extension : public ExtensionBase
{
public:

    /**
     * Constructor of an extension declares everything the extension contains: objects, actions, conditions and expressions.
     */
    Extension()
    {
        DeclareDraggableAutomatismExtension(*this);
        GD_COMPLETE_EXTENSION_COMPILATION_INFORMATION();
    };
};

#if !defined(EMSCRIPTEN)
/**
 * Used by GDevelop to create the extension class
 * -- Do not need to be modified. --
 */
extern "C" ExtensionBase * GD_EXTENSION_API CreateGDExtension() {
    return new Extension;
}
#endif
