/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */

#ifndef BEHAVIORSSHAREDDATA_H
#define BEHAVIORSSHAREDDATA_H

#include <map>
#include <memory>
#include "GDCore/String.h"
class BehaviorsRuntimeSharedData;
namespace gd {
class SerializerElement;
}
namespace gd {
class PropertyDescriptor;
}
namespace gd {
class Project;
}
namespace gd {
class Layout;
}

namespace gd {

/**
 * \brief Base class for defining data shared by behaviors having the same type
 * and name.
 *
 * Behaviors can use shared data, as if they were extending the gd::Layout
 * class.
 *
 * \note GD C++ Platform extensions writers : Inherit from this class, and
 * redefine Clone and CreateRuntimeSharedDatas.
 *
 * \ingroup GameEngine
 */
class GD_CORE_API BehaviorsSharedData {
 public:
  BehaviorsSharedData(){};
  virtual ~BehaviorsSharedData();
  virtual std::shared_ptr<gd::BehaviorsSharedData> Clone() const {
    return std::shared_ptr<gd::BehaviorsSharedData>(
        new BehaviorsSharedData(*this));
  }

  /**
   * \brief Change the name identifying the behavior.
   */
  void SetName(gd::String name_) { name = name_; };

  /**
   * \brief Return the name identifying the behavior
   */
  gd::String GetName() { return name; }

  /**
   * \brief Return the name identifying the type of the behavior
   */
  gd::String GetTypeName() { return type; }

  /**
   * \brief Change name identifying the type of the behavior.
   */
  virtual void SetTypeName(const gd::String& type_) { type = type_; };

#if defined(GD_IDE_ONLY)

  /**
   * \brief Called when the IDE wants to know about the properties of the shared
   data.
   *
   * Usage example:
   \code
      std::map<gd::String, gd::PropertyDescriptor> properties;
      properties[_("Initial speed")].SetValue(gd::String::From(initialSpeed));

      return properties;
   \endcode
   *
   * \return a std::map with properties names as key.
   * \see gd::PropertyDescriptor
   */
  virtual std::map<gd::String, gd::PropertyDescriptor> GetProperties(
      gd::Project& project) const;

  /**
   * \brief Called when the IDE wants to update a property of the shared data
   *
   * \return false if the new value cannot be set
   * \see gd::InitialInstance
   */
  virtual bool UpdateProperty(const gd::String& name,
                              const gd::String& value,
                              gd::Project& project) {
    return false;
  };

  /**
   * \brief Serialize behaviors shared data.
   */
  virtual void SerializeTo(SerializerElement& element) const {};
#endif

  /**
   * \brief Unserialize the behaviors shared data.
   */
  virtual void UnserializeFrom(const SerializerElement& element){};

  // TODO : GD C++ Platform specific code :
  /**
   * Create Runtime equivalent of the shared datas.
   * Derived class have to redefine this so as to create an appropriate
   * object containing runtime shared datas.
   */
  virtual std::shared_ptr<BehaviorsRuntimeSharedData>
  CreateRuntimeSharedDatas() {
    return std::shared_ptr<BehaviorsRuntimeSharedData>();
  }

 private:
  gd::String name;  ///< A layout can have some behaviors with the same type,
                    ///< but with different names.
  gd::String type;  ///< The type indicate of which type is the behavior.
};

}  // namespace gd

#endif  // BEHAVIORSSHAREDDATA_H
