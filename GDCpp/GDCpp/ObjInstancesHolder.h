#ifndef OBJINSTANCESHOLDER_H
#define OBJINSTANCESHOLDER_H

#include <string>
#include <vector>
#include <map>
#include <boost/shared_ptr.hpp>
#include <boost/unordered_map.hpp>
class RuntimeObject;

typedef std::vector < boost::shared_ptr<RuntimeObject> > RuntimeObjList;
typedef boost::shared_ptr<RuntimeObject> RuntimeObjSPtr;

/**
 * \brief Contains lists of objects classified by the name of the objects.
 *
 * \see RuntimeScene
 * \ingroup GameEngine
 */
class GD_API ObjInstancesHolder
{
public:
    /**
     * \brief Default constructor
     */
    ObjInstancesHolder() {};

    /**
     * \brief Copy constructor
     * \note All objects contained inside the container copied are also copied.
     * The new container is fully independent from the original one.
     */
    ObjInstancesHolder(const ObjInstancesHolder & other);

    /**
     * \brief Assignment operator
     * \note All objects contained inside the container copied are also copied.
     * The new container is fully independent from the original one.
     */
    ObjInstancesHolder & operator=(const ObjInstancesHolder & other);

    /**
     * \brief Add a new object to the lists.
     * \note The object is then hold in the container and you can
     * forget the shared pointer to it.
     */
    void AddObject(const RuntimeObjSPtr & object);

    /**
     * \brief Get all objects with the specified name
     */
    inline const RuntimeObjList & GetObjects(const std::string & name)
    {
        return objectsInstances[name];
    }

    /**
     * \brief Get a "raw pointers" list to objects with the specified name
     */
    std::vector<RuntimeObject*> GetObjectsRawPointers(const std::string & name);

    /**
     * \brief Get a list of all objects contained.
     */
    inline RuntimeObjList GetAllObjects()
    {
        RuntimeObjList objList;

        for (boost::unordered_map<std::string, RuntimeObjList>::iterator it = objectsInstances.begin() ; it != objectsInstances.end(); ++it )
            copy(it->second.begin(), it->second.end(), back_inserter(objList));

        return objList;
    }

    /**
     * \brief Remove an object
     *
     * \warning During the game, do not directly remove an object using this function, but make its name empty instead. Example:
     * \code
     * myObject->SetName(""); //The scene will take care of deleting the object
     * scene.objectsInstances.ObjectNameHasChanged(myObject);
     * \endcode
     */
    inline void RemoveObject(const RuntimeObjSPtr & object)
    {
        for (boost::unordered_map<std::string, RuntimeObjList>::iterator it = objectsInstances.begin() ; it != objectsInstances.end(); ++it )
        {
            RuntimeObjList & associatedList = it->second;
            associatedList.erase(std::remove(associatedList.begin(), associatedList.end(), object), associatedList.end());
        }
        for (boost::unordered_map<std::string, std::vector<RuntimeObject*> >::iterator it = objectsRawPointersInstances.begin() ; it != objectsRawPointersInstances.end(); ++it )
        {
            std::vector<RuntimeObject*> & associatedList = it->second;
            associatedList.erase(std::remove(associatedList.begin(), associatedList.end(), object.get()), associatedList.end());
        }
    }

    /**
     * \brief Remove an entire list of object with a given name
     */
    inline void RemoveObjects(const std::string & name)
    {
        objectsInstances[name].clear();
        objectsRawPointersInstances[name].clear();
    }

    /**
     * \brief To be called when an object has changed its name.
     */
    void ObjectNameHasChanged(RuntimeObject * object);

    /**
     * \brief Clear the container.
     * \note All objects contained inside are destroyed.
     */
    inline void Clear()
    {
        objectsInstances.clear();
        objectsRawPointersInstances.clear();
    }

private:
    void Init(const ObjInstancesHolder & other);

    boost::unordered_map<std::string, RuntimeObjList > objectsInstances; ///< The list of all objects, classified by name
    boost::unordered_map<std::string, std::vector<RuntimeObject*> > objectsRawPointersInstances; ///< Clones of the objectsInstances lists, but with raw pointers instead.
};

#endif // OBJINSTANCESHOLDER_H
