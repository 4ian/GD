/**

GDevelop - Light Extension
Copyright (c) 2010-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#ifndef SCENELIGHTOBSTACLEPHYSICSDATAS_H
#define SCENELIGHTOBSTACLEPHYSICSDATAS_H

#include "GDCpp/AutomatismsSharedData.h"
#include "RuntimeSceneLightObstacleDatas.h"

/**
 * \brief Data common to all light obstacles automatisms of a scene.
 */
class GD_EXTENSION_API SceneLightObstacleDatas : public gd::AutomatismsSharedData
{
public:
    SceneLightObstacleDatas() {};
    virtual ~SceneLightObstacleDatas() {};
    virtual boost::shared_ptr<gd::AutomatismsSharedData> Clone() const { return boost::shared_ptr<gd::AutomatismsSharedData>(new SceneLightObstacleDatas(*this));}

    virtual boost::shared_ptr<AutomatismsRuntimeSharedData> CreateRuntimeSharedDatas()
    {
        return boost::shared_ptr<AutomatismsRuntimeSharedData>(new RuntimeSceneLightObstacleDatas(*this));
    }

    #if defined(GD_IDE_ONLY)
    virtual void SerializeTo(gd::SerializerElement & element) const;
    #endif

    virtual void UnserializeFrom(const gd::SerializerElement & element);
};

#endif // SCENELIGHTOBSTACLEPHYSICSDATAS_H

