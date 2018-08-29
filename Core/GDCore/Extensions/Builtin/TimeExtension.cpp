/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "AllBuiltinExtensions.h"
#include "GDCore/Tools/Localization.h"

using namespace std;
namespace gd {

void GD_CORE_API BuiltinExtensionsImplementer::ImplementsTimeExtension(
    gd::PlatformExtension& extension) {
  extension
      .SetExtensionInformation("BuiltinTime",
                               _("Time"),
                               _("Built-in extension providing actions and "
                                 "conditions related to time."),
                               "Florian Rival",
                               "Open source (MIT License)")
      .SetExtensionHelpPath("/all-features/timers");

#if defined(GD_IDE_ONLY)

  extension
      .AddCondition("Timer",
                    _("Value of a scene timer"),
                    _("Test the elapsed time of a scene timer."),
                    _("The timer _PARAM2_ is greater than _PARAM1_ seconds"),
                    _("Timers and time"),
                    "res/conditions/timer24.png",
                    "res/conditions/timer.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("expression", _("Time in seconds"))
      .AddParameter("string", _("Timer's name"));

  extension
      .AddCondition("TimeScale",
                    _("Time scale"),
                    _("Test the time scale."),
                    _("The time scale is _PARAM1__PARAM2_"),
                    _("Timers and time"),
                    "res/conditions/time24.png",
                    "res/conditions/time.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("relationalOperator", _("Sign of the test"))
      .AddParameter("expression", _("Value to test"))
      .MarkAsAdvanced()
      .SetManipulatedType("number");

  extension
      .AddCondition("TimerPaused",
                    _("Scene timer paused"),
                    _("Test if the specified scene timer is paused."),
                    _("The timer _PARAM1_ is paused"),
                    _("Timers and time"),
                    "res/conditions/timerPaused24.png",
                    "res/conditions/timerPaused.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Timer's name"))
      .MarkAsAdvanced();

  extension
      .AddAction("ResetTimer",
                 _("Start (or reset) a scene timer"),
                 _("Reset the specified scene timer, if the timer doesn't exist "
                   "it's created and started."),
                 _("Reset the timer _PARAM1_"),
                 _("Timers and time"),
                 "res/actions/timer24.png",
                 "res/actions/timer.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Timer's name"));

  extension
      .AddAction("PauseTimer",
                 _("Pause a scene timer"),
                 _("Pause a scene timer."),
                 _("Pause timer _PARAM1_"),
                 _("Timers and time"),
                 "res/actions/pauseTimer24.png",
                 "res/actions/pauseTimer.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Timer's name"))
      .MarkAsAdvanced();

  extension
      .AddAction("UnPauseTimer",
                 _("Unpause a scene timer"),
                 _("Unpause a scene timer."),
                 _("Unpause timer _PARAM1_"),
                 _("Timers and time"),
                 "res/actions/unPauseTimer24.png",
                 "res/actions/unPauseTimer.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Timer's name"))
      .MarkAsAdvanced();

  extension
      .AddAction("RemoveTimer",
                 _("Delete a scene timer"),
                 _("Delete a scene timer from memory."),
                 _("Delete timer _PARAM1_ from memory"),
                 _("Timers and time"),
                 "res/actions/timer24.png",
                 "res/actions/timer.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Timer's name"))
      .MarkAsAdvanced();

  extension
      .AddAction("ChangeTimeScale",
                 _("Change time scale"),
                 _("Change the time scale of the game."),
                 _("Set time scale to _PARAM1_"),
                 _("Timers and time"),
                 "res/actions/time24.png",
                 "res/actions/time.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("expression",
                    _("Scale (1: Default, 2: 2x faster, 0.5: 2x slower...)"));

  extension
      .AddExpression("TimeDelta",
                     _("Time elapsed since the last image"),
                     _("Time elapsed since the last image"),
                     _("Time"),
                     "res/actions/time.png")
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("TempsFrame",
                     _("Time elapsed since the last image"),
                     _("Time elapsed since the last image"),
                     _("Time"),
                     "res/actions/time.png")
      .SetHidden()
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("ElapsedTime",
                     _("Time elapsed since the last image"),
                     _("Time elapsed since the last image"),
                     _("Time"),
                     "res/actions/time.png")
      .SetHidden()
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("TimerElapsedTime",
                     _("Scene timer value"),
                     _("Value of a scene timer"),
                     _("Time"),
                     "res/actions/time.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("string", _("Timer's name"));

  extension
      .AddExpression("TimeFromStart",
                     _("Time elapsed since the beginning of the scene"),
                     _("Time elapsed since the beginning of the scene"),
                     _("Time"),
                     "res/actions/time.png")
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("TempsDebut",
                     _("Time elapsed since the beginning of the scene"),
                     _("Time elapsed since the beginning of the scene"),
                     _("Time"),
                     "res/actions/time.png")
      .SetHidden()
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("TimeScale",
                     _("Time scale"),
                     _("Time scale"),
                     _("Time"),
                     "res/actions/time.png")
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("TimeScale",
                     _("Time scale"),
                     _("Time scale"),
                     _("Time"),
                     "res/actions/time.png")
      .SetHidden()
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddExpression("Time",
                     _("Current time"),
                     _("Current time"),
                     _("Time"),
                     "res/actions/time.png")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter(
          "",
          _("Hour : hour\nMinutes : min\nSeconds : sec\nDay of the month : "
            "mday\nMonths since January : mon\nYear since 1900 : year\nDays "
            "since sunday :wday\nDays since January 1st : yday"));

#endif
}

}  // namespace gd
