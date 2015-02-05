/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#include "ProjectResourcesAdder.h"
#include "GDCore/PlatformDefinition/Project.h"
#include "GDCore/IDE/ImagesUsedInventorizer.h"
#include "GDCore/CommonTools.h"
#include "GDCore/Tools/Log.h"
#include "GDCore/Tools/Localization.h"

using namespace std;

namespace gd
{

bool ProjectResourcesAdder::AddAllMissingImages(gd::Project & project)
{
    gd::ImagesUsedInventorizer inventorizer;
    project.ExposeResources(inventorizer);
    std::set<std::string> & allImages = inventorizer.GetAllUsedImages();

    ResourcesManager & resourcesManager = project.GetResourcesManager();
    for (std::set<std::string>::const_iterator it = allImages.begin(); it != allImages.end(); ++it)
    {
        if (!resourcesManager.HasResource(*it))
        {
            std::cout << "Adding missing resource \""<<*it<<"\"to the project.";
            resourcesManager.AddResource(*it, /*filename=*/*it); //Note that AddResource add a image resource by default.
        }
    }

    return true;
}

std::vector<std::string> ProjectResourcesAdder::GetAllUselessResources(gd::Project & project)
{
    std::vector<std::string> unusedResources;

    //Search for used images
    gd::ImagesUsedInventorizer inventorizer;
    project.ExposeResources(inventorizer);
    std::set<std::string> & usedImages = inventorizer.GetAllUsedImages();

    //Search all images resources not used
    std::vector<std::string> resources = project.GetResourcesManager().GetAllResourcesList();
    for (unsigned int i = 0;i < resources.size();i++)
    {
        if (project.GetResourcesManager().GetResource(resources[i]).GetKind() != "image")
            continue;

        if (usedImages.find(resources[i]) == usedImages.end())
            unusedResources.push_back(resources[i]);
    }

    return unusedResources;
}

void ProjectResourcesAdder::RemoveAllUselessResources(gd::Project & project)
{
    std::vector<std::string> unusedResources = GetAllUselessResources(project);

    for(unsigned int i = 0;i < unusedResources.size();++i) {
        project.GetResourcesManager().RemoveResource(unusedResources[i]);
    }
}

}
