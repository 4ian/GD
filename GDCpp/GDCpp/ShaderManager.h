/*
 * GDevelop C++ Platform
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#ifndef SHADERMANAGER_H
#define SHADERMANAGER_H
#include <map>
#include <string>
#include <memory>

#include <SFML/Graphics.hpp>
namespace gd { class Project; }

/**
 * \brief Still work in progress class to manage shaders
 *
 * \todo Unfinished class.
 *
 * \ingroup GameEngine
 */
class ShaderManager
{
public:
    ShaderManager();
    virtual ~ShaderManager() {};
    void SetGame(gd::Project * game_) { game = game_; }

    std::shared_ptr<sf::Shader> GetSFMLShader(const std::vector<std::string> & shaders);

private:
    mutable std::map < std::vector<std::string>, std::weak_ptr<sf::Shader> > alreadyLoadedShader;

    gd::Project * game;
};

#endif // SHADERMANAGER_H
