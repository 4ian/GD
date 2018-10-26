/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#ifndef GDCORE_WHOLEPROJECTREFACTORER_H
#define GDCORE_WHOLEPROJECTREFACTORER_H
#include <vector>
namespace gd {
class Project;
class Layout;
class String;
class EventsFunctionsExtension;
class ArbitraryEventsWorker;
}  // namespace gd

namespace gd {

/**
 * \brief Tool functions to do refactoring on the whole project after
 * changes like deletion or renaming of an object.
 *
 * \TODO Ideally ObjectRenamedInLayout, ObjectRemovedInLayout,
 * GlobalObjectRenamed, GlobalObjectRemoved would be implemented using
 * ExposeProjectEvents.
 **/
class GD_CORE_API WholeProjectRefactorer {
 public:
  /**
   * \brief Call the specified worker on all events of the project (layout,
   * external events, events functions...)
   *
   * This should be the preferred way to traverse all the events of a project.
   */
  static void ExposeProjectEvents(gd::Project& project,
                                  gd::ArbitraryEventsWorker& worker);

  /**
   * \brief Refactor the project after an events function extension is renamed
   */
  static void RenameEventsFunctionsExtension(
      gd::Project& project,
      const gd::EventsFunctionsExtension& eventsFunctionsExtension,
      const gd::String& oldName,
      const gd::String& newName);

  /**
   * \brief Refactor the project after an events function is renamed
   */
  static void RenameEventsFunction(
      gd::Project& project,
      const gd::EventsFunctionsExtension& eventsFunctionsExtension,
      const gd::String& oldFunctionName,
      const gd::String& newFunctionName);

  /**
   * \brief Refactor the project after an object is renamed in a layout
   *
   * This will update the layout, all external layouts associated with it
   * and all external events used by the layout.
   */
  static void ObjectRenamedInLayout(gd::Project& project,
                                    gd::Layout& layout,
                                    const gd::String& oldName,
                                    const gd::String& newName);

  /**
   * \brief Refactor the project after an object is removed in a layout
   *
   * This will update the layout, all external layouts associated with it
   * and all external events used by the layout.
   */
  static void ObjectRemovedInLayout(gd::Project& project,
                                    gd::Layout& layout,
                                    const gd::String& objectName,
                                    bool removeEventsAndGroups = true);

  /**
   * \brief Refactor the project after a global object is renamed.
   *
   * This will update all the layouts, all external layouts associated with them
   * and all external events used by the layouts.
   */
  static void GlobalObjectRenamed(gd::Project& project,
                                  const gd::String& oldName,
                                  const gd::String& newName);

  /**
   * \brief Refactor the project after a global object is removed.
   *
   * This will update all the layouts, all external layouts associated with them
   * and all external events used by the layouts.
   */
  static void GlobalObjectRemoved(gd::Project& project,
                                  const gd::String& objectName,
                                  bool removeEventsAndGroups = true);

  virtual ~WholeProjectRefactorer(){};

 private:
  static std::vector<gd::String> GetAssociatedExternalLayouts(
      gd::Project& project, gd::Layout& layout);

  WholeProjectRefactorer(){};
};

}  // namespace gd

#endif  // GDCORE_WHOLEPROJECTREFACTORER_H
