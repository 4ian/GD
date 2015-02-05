/*
 * GDevelop C++ Platform
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#ifndef KEYBOARDTOOLS_H
#define KEYBOARDTOOLS_H
#include <map>
#include <string>
class RuntimeScene;

bool IsKeyPressed(RuntimeScene & scene, std::string key);
bool AnyKeyIsPressed(RuntimeScene & scene);
std::string LastPressedKey(RuntimeScene & scene);
const std::map<std::string, int> & GetKeyNameToSfKeyMap();
const std::map<int, std::string> & GetSfKeyToKeyNameMap();

#endif // KEYBOARDTOOLS_H
