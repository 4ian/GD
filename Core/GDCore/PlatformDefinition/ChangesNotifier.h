/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#ifndef GDCORE_CHANGESNOTIFIER_H
#define GDCORE_CHANGESNOTIFIER_H
#include <string>
#include <vector>
#include <iostream>
namespace gd { class Project; }
namespace gd { class Layout; }
namespace gd { class ExternalLayout; }
namespace gd { class Object; }
namespace gd { class Automatism; }
namespace gd { class ExternalEvents; }

namespace gd
{

/**
 * \brief Allows implementations to do specific work when some changes have been made in the IDE.
 *
 * For example, the C++ Platform triggers events recompilation when some changes are made.
 *
 * \ingroup IDE
 */
class ChangesNotifier
{
public:
    ChangesNotifier() {};
    virtual ~ChangesNotifier() {};

    /** \name Layouts
     * Members functions called by the IDE so as to notify changes have been made
     */
    ///@{

    /**
     * \brief Called when a layout was added to a project
     * \param project Related project
     * \param layout Layout
     */
    virtual void OnLayoutAdded(gd::Project & project, gd::Layout & layout) const {};

    /**
     * \brief Called when a layout was renamed
     * \param project Related project
     * \param layout Layout
     * \param oldName Old name of the layout
     */
    virtual void OnLayoutRenamed(gd::Project & project, gd::Layout & layout, const std::string & oldName) const {};

    /**
     * \brief Called when a layout was removed from a project
     * \param project Related project
     * \param deletedLayout Name of the removed layout
     */
    virtual void OnLayoutDeleted(gd::Project & project, const std::string deletedLayout) const {};

    /**
     * \brief Called when (layout or global) variables were modified
     * \param project Related project
     * \param layout Layout owning the variables, if applicable
     */
    virtual void OnVariablesModified(gd::Project & project, gd::Layout * layout = NULL) const {};

    ///@}

    /** \name External Layouts
     * Members functions called by the IDE so as to notify changes have been made
     */
    ///@{

    /**
     * \brief Called when an external layout was added to a project
     * \param project Related project
     * \param layout External layout
     */
    virtual void OnExternalLayoutAdded(gd::Project & project, gd::ExternalLayout & layout) const {};

    /**
     * \brief Called when an external layout was renamed
     * \param project Related project
     * \param layout External layout
     * \param oldName Old name of the external layout
     */
    virtual void OnExternalLayoutRenamed(gd::Project & project, gd::ExternalLayout & layout, const std::string & oldName) const {};

    /**
     * \brief Called when an external layout was removed from a project
     * \param project Related project
     * \param deletedLayout Name of the removed external layout
     */
    virtual void OnExternalLayoutDeleted(gd::Project & project, const std::string deletedLayout) const {};

    ///@}

    /** \name External events
     * Members functions called by the IDE so as to notify changes have been made
     */
    ///@{

    /**
     * \brief Called when external events were added to a project
     * \param project Related project
     * \param events External events
     */
    virtual void OnExternalEventsAdded(gd::Project & project, gd::ExternalEvents & events) const {};

    /**
     * \brief Called when external events were renamed
     * \param project Related project
     * \param events External events
     * \param oldName Old name of the external events
     */
    virtual void OnExternalEventsRenamed(gd::Project & project, gd::ExternalEvents & events, const std::string & oldName) const {};

    /**
     * \brief Called when external events were removed from a project
     * \param project Related project
     * \param deletedLayout Name of the removed external events
     */
    virtual void OnExternalEventsDeleted(gd::Project & project, const std::string deletedLayout) const {};

    ///@}

    /** \name Events
     * Members functions called by the IDE so as to notify changes have been made
     */
    ///@{

    /**
     * \brief Called when the events of a layout have been modified.
     * \param project Related project
     * \param layout Layout
     * \param indirectChange true if the changes have been made "indirectly" by modifying for example some external events used by a layout
     * \param sourceOfTheIndirectChange if indirectChange == true, contains the name of the external events which trigger the change.
     */
    virtual void OnEventsModified(gd::Project & project, gd::Layout & layout, bool indirectChange = false, std::string sourceOfTheIndirectChange = "") const {};

    /**
     * \brief Called when some external events have been modified.
     * \param project Related project
     * \param events External events
     * \param indirectChange true if the changes have been made "indirectly" by modifying for example some external events used by a layout
     * \param sourceOfTheIndirectChange if indirectChange == true, contains the name of the external events which trigger the change.
     */
    virtual void OnEventsModified(gd::Project & project, gd::ExternalEvents & events, bool indirectChange = false, std::string sourceOfTheIndirectChange = "") const {};
    ///@}

    /** \name Objects and automatisms notifications
     * Members functions called by the IDE so as to notify changes have been made
     */
    ///@{

    /**
     * \brief Called when an object has been edited
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Object
     */
    virtual void OnObjectEdited(gd::Project & project, gd::Layout * layout, gd::Object & object) const {};

    /**
     * \brief Called when an object has been edited
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Object
     */
    virtual void OnObjectAdded(gd::Project & project, gd::Layout * layout, gd::Object & object) const {};

    /**
     * \brief Called when an object has been renamed
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Object
     * \param oldName Object old name
     */
    virtual void OnObjectRenamed(gd::Project & project, gd::Layout * layout, gd::Object & object, const std::string & oldName) const {};

    /**
     * \brief Called when one or more objects have been deleted
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param objectName The name of the object removed
     */
    virtual void OnObjectsDeleted(gd::Project & project, gd::Layout * layout, const std::vector<std::string> & deletedObjects) const {};

    /**
     * \brief Called when an object's variables have been changed
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Object
     */
    virtual void OnObjectVariablesChanged(gd::Project & project, gd::Layout * layout, gd::Object & object) const {};

    /**
     * \brief Called when an automatism have been edited
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Related object
     * \param automatism Automatism
     */
    virtual void OnAutomatismEdited(gd::Project & project, gd::Layout * layout, gd::Object & object, gd::Automatism & automatism) const {};

    /**
     * \brief Called when an automatism have been added
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Related object
     * \param automatism Automatism
     */
    virtual void OnAutomatismAdded(gd::Project & project, gd::Layout * layout, gd::Object & object, gd::Automatism & automatism) const {};

    /**
     * \brief Called when an automatism have been renamed
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Related object
     * \param automatism Automatism
     * \param oldName Automatism old name
     */
    virtual void OnAutomatismRenamed(gd::Project & project, gd::Layout * layout, gd::Object & object, gd::Automatism & automatism, const std::string & oldName) const {};

    /**
     * \brief Called when an automatism have been deleted
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param object Related object
     * \param automatismName The name of the automatism removed
     */
    virtual void OnAutomatismDeleted(gd::Project & project, gd::Layout * layout, gd::Object & object, const std::string & automatismName) const {};

    /**
     * \brief Called when a group have been added
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param groupName The name of the group added
     */
    virtual void OnObjectGroupAdded(gd::Project & project, gd::Layout * layout, const std::string & groupName) const {};

    /**
     * \brief Called when a group has been edited
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param groupName The name of the group modified
     */
    virtual void OnObjectGroupEdited(gd::Project & project, gd::Layout * layout, const std::string & groupName) const {};

    /**
     * \brief Called when a group have been renamed
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param groupName The name of the group modified
     * \param oldName Group's old name
     */
    virtual void OnObjectGroupRenamed(gd::Project & project, gd::Layout * layout, const std::string & groupName, const std::string & oldName) const {};

    /**
     * \brief Called when a group have been deleted
     * \param project Related project
     * \param layout Related layout ( can be NULL )
     * \param groupName The name of the group removed
     */
    virtual void OnObjectGroupDeleted(gd::Project & project, gd::Layout * layout, const std::string & groupName) const {};

    /**
     * \brief Called when a resource have been added/removed/modified
     * \param project Related project
     * \param automatismName The name of the resource which have been modified
     */
    virtual void OnResourceModified(gd::Project & project, const std::string & resourceName) const {};

    ///@}
};

}

#endif // GDCORE_CHANGESNOTIFIER_H
