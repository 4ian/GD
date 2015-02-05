/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */

#ifndef GDCORE_OBJECTGROUP_H
#define GDCORE_OBJECTGROUP_H
#include <vector>
#include <string>
#include <utility>
namespace gd { class SerializerElement; }

namespace gd
{

/**
 * \brief Represents an object group.
 *
 * Objects groups do not really contains objects : They are just used in events, so as to create events which can be applied to several objects.
 *
 * \see gd::GroupHasTheSameName
 * \ingroup PlatformDefinition
 */
class GD_CORE_API ObjectGroup
{
public:

    ObjectGroup() {};
    virtual ~ObjectGroup() {};

    /**
     * \brief Return true if an object is found inside the ObjectGroup.
     */
    bool Find(const std::string & name) const;

    /**
     * \brief Add an object name to the group.
     */
    void AddObject(const std::string & name);

    /**
     * \brief Remove an object name from the group
     */
    void RemoveObject(const std::string & name);

    /** \brief Get group name
     */
    inline const std::string & GetName() const { return name; };

    /** \brief Change group name
     */
    inline void SetName(const std::string & name_) {name = name_;};

    /**
     * \brief Get a vector with objects names.
     */
    inline const std::vector < std::string > & GetAllObjectsNames() const
    {
        return memberObjects;
    }

    /**
     * \brief Serialize instances container.
     */
    static void SerializeTo(const std::vector < gd::ObjectGroup > & list, SerializerElement & element);

    /**
     * \brief Unserialize the instances container.
     */
    static void UnserializeFrom(std::vector < gd::ObjectGroup > & list, const SerializerElement & element);

private:
    std::vector < std::string > memberObjects;
    std::string name; ///< Group name
};

/**
 * \brief Functor to easily find an object group with a specific name.
 *
 * Usage example:
 * \code
 * vector< gd::ObjectGroup >::const_iterator myGroup = find_if(layout.GetObjectGroups().begin(), layout.GetObjectGroups().end(), bind2nd(gd::GroupHasTheSameName(), "myGroup"));
 * if ( myGroup != layout.GetObjectGroups().end() )
 * {
 *     //...
 * }
 * \endcode
 *
 * \see gd::ObjectGroup
 */
struct GroupHasTheSameName : public std::binary_function<ObjectGroup, std::string, bool>
{
    bool operator ()( const ObjectGroup & group, const std::string & name ) const
    {
        return group.GetName() == name;
    }
};

}

#endif // GDCORE_OBJECTGROUP_H
