/**

GDevelop - Timed Event Extension
Copyright (c) 2011-2013 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#ifndef TIMEDEVENTMANAGER_H
#define TIMEDEVENTMANAGER_H
#include <map>
#include <string>
#include "GDCpp/Runtime/ManualTimer.h"
#include "GDCpp/Runtime/RuntimeScene.h"

class TimedEventsManager {
 public:
  TimedEventsManager(){};
  virtual ~TimedEventsManager(){};

  std::map<gd::String, ManualTimer> timedEvents;

  static std::map<RuntimeScene*, TimedEventsManager>
      managers;  // List of managers associated with scenes.
};

#endif  // TIMEDEVENTMANAGER_H
