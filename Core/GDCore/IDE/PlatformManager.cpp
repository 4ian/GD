/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#include "PlatformManager.h"
#include "GDCore/PlatformDefinition/Platform.h"

namespace gd
{

PlatformManager *PlatformManager::_singleton = NULL;

PlatformManager::PlatformManager()
{
}

PlatformManager::~PlatformManager()
{
}

bool PlatformManager::AddPlatform(boost::shared_ptr<gd::Platform> newPlatform)
{
    for (unsigned int i = 0;i<platformsLoaded.size();++i)
    {
        if ( platformsLoaded[i]->GetName() == newPlatform->GetName() )
            return false;
    }

    platformsLoaded.push_back(newPlatform);
    return true;
}

gd::Platform* PlatformManager::GetPlatform(const std::string & platformName) const
{
    for (unsigned int i = 0;i<platformsLoaded.size();++i)
    {
        if ( platformsLoaded[i]->GetName() == platformName )
            return platformsLoaded[i].get();
    }

    return NULL;
}

void PlatformManager::NotifyPlatformIDEInitialized() const
{
    for (unsigned int i = 0;i<platformsLoaded.size();++i)
    {
        if ( platformsLoaded[i] != boost::shared_ptr<gd::Platform>() )
            platformsLoaded[i]->OnIDEInitialized();
    }
}

}
