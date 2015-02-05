/**

GDevelop - DestroyOutside Automatism Extension
Copyright (c) 2014-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#include <boost/shared_ptr.hpp>
#include <iostream>
#include <SFML/Graphics.hpp>
#include "DestroyOutsideAutomatism.h"
#include "GDCpp/Scene.h"
#include "GDCpp/RuntimeLayer.h"
#include "GDCpp/Serialization/SerializerElement.h"
#include "GDCpp/XmlMacros.h"
#include "GDCpp/RuntimeScene.h"
#include "GDCpp/RuntimeObject.h"
#include "GDCpp/CommonTools.h"

DestroyOutsideAutomatism::DestroyOutsideAutomatism() :
    extraBorder(0)
{
}

void DestroyOutsideAutomatism::DoStepPostEvents(RuntimeScene & scene)
{
    bool erase = true;
    const RuntimeLayer & theLayer = scene.GetRuntimeLayer(object->GetLayer());
    float objCenterX = object->GetDrawableX()+object->GetCenterX();
    float objCenterY = object->GetDrawableY()+object->GetCenterY();
    for (unsigned int cameraIndex = 0;cameraIndex < theLayer.GetCameraCount();++cameraIndex)
    {
        const RuntimeCamera & theCamera = theLayer.GetCamera(cameraIndex);

        float boundingCircleRadius = sqrt(object->GetWidth()*object->GetWidth()+object->GetHeight()*object->GetHeight())/2.0;
        if (   objCenterX+boundingCircleRadius+extraBorder < theCamera.GetViewCenter().x-theCamera.GetWidth()/2.0
            || objCenterX-boundingCircleRadius-extraBorder > theCamera.GetViewCenter().x+theCamera.GetWidth()/2.0
            || objCenterY+boundingCircleRadius+extraBorder < theCamera.GetViewCenter().y-theCamera.GetHeight()/2.0
            || objCenterY-boundingCircleRadius-extraBorder > theCamera.GetViewCenter().y+theCamera.GetHeight()/2.0)
        {
            //Ok we are outside the camera area.
        }
        else
        {
            //The object can be viewed by the camera.
            erase = false;
            break;
        }
    }

    if ( erase ) object->DeleteFromScene(scene);
}

#if defined(GD_IDE_ONLY)
void DestroyOutsideAutomatism::SerializeTo(gd::SerializerElement & element) const
{
    element.SetAttribute("extraBorder", extraBorder);
}
#endif

void DestroyOutsideAutomatism::UnserializeFrom(const gd::SerializerElement & element)
{
    extraBorder = element.GetDoubleAttribute("extraBorder");
}
