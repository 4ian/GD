/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#ifndef RESOURCESMERGINGHELPER_H
#define RESOURCESMERGINGHELPER_H

#include <string>
#include <vector>
#include <map>
#include <memory>
#include "GDCore/IDE/ArbitraryResourceWorker.h"
namespace gd { class AbstractFileSystem; }

namespace gd
{

/**
 * \brief ResourcesMergingHelper is used (mainly during compilation) so
 * as to inventory resources and change their filenames
 *
 * \see ArbitraryResourceWorker
 *
 * \ingroup IDE
 */
class GD_CORE_API ResourcesMergingHelper : public ArbitraryResourceWorker
{
public:
    ResourcesMergingHelper(gd::AbstractFileSystem & fileSystem) : ArbitraryResourceWorker(), preserveDirectoriesStructure(false), preserveAbsoluteFilenames(false), fs(fileSystem) {};
    virtual ~ResourcesMergingHelper() {};

    /**
     * \brief Set the directory used as base directory: All resources filename are relative to this directory.
     * (usually, it is the project directory).
     */
    void SetBaseDirectory(const std::string & baseDirectory);

    /**
     * \brief Set if the directories structure, starting from the base directory, must be preserved.
     * For compilation in GD C++ Platform, all resources must be in a single folder, so that the directories structure is not preserved.
     */
    void PreserveDirectoriesStructure(bool preserveDirectoriesStructure_ = true) {preserveDirectoriesStructure = preserveDirectoriesStructure_;};

    /**
     * \brief Set if the absolute filenames must be preserved.
     */
    void PreserveAbsoluteFilenames(bool preserveAbsoluteFilenames_ = true) {preserveAbsoluteFilenames = preserveAbsoluteFilenames_;};

    /**
     * \brief Return a map containing the resources old absolute filename as key, and the resources new filenames as value.
     * The new filenames are relative to the Base Directory.
     */
    std::map<std::string, std::string> & GetAllResourcesOldAndNewFilename() { return resourcesNewFilename; };

    /**
     * Resources merging helper collects all resources filenames and update these filenames.
     */
    virtual void ExposeFile(std::string & resource);

    virtual void ExposeImage(std::string & imageName) {};
    virtual void ExposeShader(std::string & shaderName) {};

protected:
    std::map<std::string, std::string> resourcesNewFilename;
    std::string baseDirectory;
    bool preserveDirectoriesStructure; ///< If set to true, the directory structure, starting from baseDirectory, will be preserved in filenames.
    bool preserveAbsoluteFilenames; ///< If set to true, the filenames which are absolute ( C:\MyFile.png ) will not be transformed into their filenames ( MyFile.png ).
    gd::AbstractFileSystem & fs; ///< The gd::AbstractFileSystem used to manipulate files.
};

}

#endif // RESOURCESMERGINGHELPER_H
