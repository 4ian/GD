/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#if !defined(EMSCRIPTEN)
#include "ProjectFileWriter.h"
#include <fstream>
#include "GDCore/Tools/Localization.h"
#include "GDCore/Tools/FileStream.h"
#include "GDCore/Serialization/Serializer.h"
#include "GDCore/Serialization/Splitter.h"
#include "GDCore/Project/Project.h"
#include "GDCore/IDE/wxTools/RecursiveMkDir.h"
#include "GDCore/Tools/Log.h"
#include "GDCore/Tools/XmlLoader.h"
#include "GDCore/String.h"

#include "GDCore/TinyXml/tinyxml2.h"
#include <SFML/System.hpp>
#if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI)
#include <wx/wx.h>
#include <wx/stdpaths.h>
#include <wx/filename.h>
#endif

#if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI)
namespace {

gd::String MakeFileNameSafe(gd::String str)
{
    static const gd::String allowedCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-";

    std::size_t i = 0;
    for( auto it = str.begin(); it != str.end(); ++it )
    {
        char32_t character = *it;
        if (allowedCharacters.find(character) == gd::String::npos)
        {
            //Replace the character by an underscore and its unicode codepoint (in base 10)
            auto it2 = it; ++it2;
            str.replace(it, it2, "_"+gd::String::From(character));

            //The iterator it may have been invalidated:
            //re-assign it with a new iterator pointing to the same position.
            it = str.begin();
            std::advance(it, i);
        }

        ++i;
    }

    return str;
}

}
#endif


namespace gd
{

#if defined(GD_IDE_ONLY)

bool ProjectFileWriter::SaveToFile(const gd::Project & project, const gd::String & filename, bool forceSingleFile)
{
    //Serialize the whole project
    gd::SerializerElement rootElement;
    project.SerializeTo(rootElement);

    #if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI)
    if (project.IsFolderProject() && !forceSingleFile) //Optionally split the project
    {
        wxString projectPath = wxFileName::FileName(filename).GetPath();
        gd::Splitter splitter;
        auto splitElements = splitter.Split(rootElement, {
            "/layouts/layout",
            "/externalEvents/externalEvents",
            "/externalLayouts/externalLayout",
        });
        for (auto & element : splitElements)
        {
            //Create a partial XML document
            tinyxml2::XMLDocument doc;
            doc.LinkEndChild(doc.NewDeclaration());

            tinyxml2::XMLElement * root = doc.NewElement("projectPartial");
            doc.LinkEndChild(root);
            gd::Serializer::ToXML(element.element, root);

            //And write the element in it
            gd::String filename = projectPath + element.path + "-" + MakeFileNameSafe(element.name);
            gd::RecursiveMkDir::MkDir(wxFileName::FileName(filename).GetPath());
            if ( !gd::SaveXmlToFile( doc, filename ) )
            {
                gd::LogError( _( "Unable to save file ") + filename + _("!\nCheck that the drive has enough free space, is not write-protected and that you have read/write permissions." ) );
                return false;
            }
        }
    }
    #endif

    //Create the main XML document
    tinyxml2::XMLDocument doc;
    doc.LinkEndChild(doc.NewDeclaration());

    tinyxml2::XMLElement * root = doc.NewElement( "project" );
    doc.LinkEndChild(root);
    gd::Serializer::ToXML(rootElement, root);

    //Write XML to file
    if ( !gd::SaveXmlToFile( doc, filename ) )
    {
        gd::LogError( _( "Unable to save file ") + filename + _("!\nCheck that the drive has enough free space, is not write-protected and that you have read/write permissions." ) );
        return false;
    }

    return true;
}

bool ProjectFileWriter::SaveToJSONFile(const gd::Project & project, const gd::String & filename)
{
    //Serialize the whole project
    gd::SerializerElement rootElement;
    project.SerializeTo(rootElement);

    //Write JSON to file
    gd::String str = gd::Serializer::ToJSON(rootElement);
    gd::FileStream ofs(filename, std::ios_base::out);
    if (!ofs.is_open())
    {
        gd::LogError( _( "Unable to save file ")+ filename + _("!\nCheck that the drive has enough free space, is not write-protected and that you have read/write permissions." ) );
        return false;
    }

    ofs << str;
    ofs.close();
    return true;
}

bool ProjectFileWriter::LoadFromJSONFile(gd::Project & project, const gd::String & filename)
{
    gd::FileStream ifs(filename, std::ios_base::in);
    if (!ifs.is_open())
    {
        gd::String error = _( "Unable to open the file.") + _("Make sure the file exists and that you have the right to open the file.");
        gd::LogError(error);
        return false;
    }

    project.SetProjectFile(filename);
    project.SetDirty(false);

    std::string str((std::istreambuf_iterator<char>(ifs)), std::istreambuf_iterator<char>());
    gd::SerializerElement rootElement = gd::Serializer::FromJSON(str);
    project.UnserializeFrom(rootElement);

    return true;
}
#endif

bool ProjectFileWriter::LoadFromFile(gd::Project & project, const gd::String & filename)
{
    //Load the XML document structure
    tinyxml2::XMLDocument doc;
    if ( !gd::LoadXmlFromFile( doc, filename ) )
    {
        gd::String errorTinyXmlDesc = doc.GetErrorStr1() ? gd::String(doc.GetErrorStr1()) : gd::String();
        gd::String error = _( "Error while loading :" ) + "\n" + errorTinyXmlDesc + "\n\n" +_("Make sure the file exists and that you have the right to open the file.");

        gd::LogError( error );
        return false;
    }

    #if defined(GD_IDE_ONLY)
    project.SetProjectFile(filename);
    project.SetDirty(false);
    #endif

    tinyxml2::XMLHandle hdl( &doc );
    gd::SerializerElement rootElement;

    ConvertANSIXMLFile(hdl, doc, filename);

    //Load the root element
    tinyxml2::XMLElement * rootXmlElement = hdl.FirstChildElement("project").ToElement();
    //Compatibility with GD <= 3.3
    if (!rootXmlElement) rootXmlElement = hdl.FirstChildElement("Project").ToElement();
    if (!rootXmlElement) rootXmlElement = hdl.FirstChildElement("Game").ToElement();
    //End of compatibility code
    gd::Serializer::FromXML(rootElement, rootXmlElement);

    //Unsplit the project
    #if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI)
    wxString projectPath = wxFileName::FileName(filename).GetPath();
    gd::Splitter splitter;
    splitter.Unsplit(rootElement, [&projectPath](gd::String path, gd::String name) {
        tinyxml2::XMLDocument doc;
        gd::SerializerElement rootElement;

        gd::String filename = projectPath + path + "-" + MakeFileNameSafe(name);
        if( !gd::LoadXmlFromFile( doc, filename ) )
        {
            gd::String errorTinyXmlDesc = doc.GetErrorStr1() ? gd::String(doc.GetErrorStr1()) : gd::String();
            gd::String error = _( "Error while loading :" ) + "\n" + errorTinyXmlDesc + "\n\n" +_("Make sure the file exists and that you have the right to open the file.");

            gd::LogError(error);
            return rootElement;
        }

        tinyxml2::XMLHandle hdl( &doc );
        gd::Serializer::FromXML(rootElement, hdl.FirstChildElement().ToElement());
        return rootElement;
    });
    #endif

    //Unserialize the whole project
    project.UnserializeFrom(rootElement);

    return true;
}

void ProjectFileWriter::ConvertANSIXMLFile(tinyxml2::XMLHandle & hdl, tinyxml2::XMLDocument & doc, const gd::String & filename)
{
    //COMPATIBILITY CODE WITH ANSI GDEVELOP ( <= 3.6.83 )
    #if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI) //There should not be any problem with encoding in compiled games

    //Try to determine if the project
    //was saved on Linux and is already in UTF8 or on Windows and still in the locale encoding.
    bool isNotInUTF8 = false;
    gd::FileStream docStream;
    docStream.open(filename, std::ios::in);

    while( !docStream.eof() )
    {
        std::string docLine;
        std::getline(docStream, docLine);

        if( !gd::String::FromUTF8(docLine).IsValid() )
        {
            //The file contains an invalid character,
            //the file has been saved by the legacy ANSI Windows version of GDevelop
            // -> stop reading the file and start converting from the locale to UTF8
            isNotInUTF8 = true;
            break;
        }
    }

    docStream.close();

    //If the file is not encoded in UTF8, encode it
    if(isNotInUTF8)
    {
        std::cout << "The project file is not encoded in UTF8, conversion started... ";

        //Create a temporary file
        #if defined(WINDOWS)
        //Convert using the current locale
        wxString tmpFileName = wxFileName::CreateTempFileName("");
        gd::FileStream outStream;
        docStream.open(filename, std::ios::in);

        outStream.open(tmpFileName, std::ios::out | std::ios::trunc);

        while( !docStream.eof() )
        {
            std::string docLine;
            std::string convLine;

            std::getline(docStream, docLine);
            sf::Utf8::fromAnsi(docLine.begin(), docLine.end(), std::back_inserter(convLine));

            outStream << convLine << '\n';
        }

        outStream.close();
        docStream.close();

        #else
        //Convert using iconv command tool
        wxString tmpFileName = wxStandardPaths::Get().GetUserConfigDir() + "/gdevelop_converted_project";
        gd::String iconvCall = gd::String("iconv -f LATIN1 -t UTF-8 \"") + filename.ToLocale() + "\" ";
        #if defined(MACOS)
        iconvCall += "> \"" + tmpFileName + "\"";
        #else
        iconvCall += "-o \"" + tmpFileName + "\"";
        #endif

        std::cout << "Executing " << iconvCall  << std::endl;
        system(iconvCall.c_str());
        #endif

        //Reload the converted file, forcing UTF8 encoding as the XML header is false (still written ISO-8859-1)
        LoadXmlFromFile(doc, tmpFileName);

        std::cout << "Finished." << std::endl;
        gd::LogMessage(_("Your project has been upgraded to be used with GDevelop 4.\nIf you save it, you won't be able to open it with an older version: please do a backup of your project file if you want to go back to GDevelop 3."));
    }
    #endif
    //END OF COMPATIBILITY CODE
}

}

#endif
