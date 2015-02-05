/*
 * GDevelop Core
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */

#ifndef GDCORE_VARIABLESCONTAINER_H
#define GDCORE_VARIABLESCONTAINER_H
#include <string>
#include <vector>
#include "GDCore/PlatformDefinition/Variable.h"
namespace gd { class SerializerElement; }
class TiXmlElement;

namespace gd
{

/**
 * \brief Class defining a container for gd::Variable.
 *
 * \see gd::Variable
 * \see gd::Project
 * \see gd::Layout
 * \see gd::Object
 *
 * \ingroup PlatformDefinition
 */
class GD_CORE_API VariablesContainer
{
public:
    VariablesContainer();
    virtual ~VariablesContainer() {};

    /** \name Variables management
     * Members functions related to variables management.
     */
    ///@{

    /**
     * \brief Return true if the specified variable is in the container
     */
    bool Has(const std::string & name) const;

    /**
     * \brief Return a reference to the variable called \a name.
     */
    Variable & Get(const std::string & name);

    /**
     * \brief Return a reference to the variable called \a name.
     */
    const Variable & Get(const std::string & name) const;

    /**
     * \brief Return a pair containing the name and the variable at position \index in the container.
     *
     * \note If index is invalid, an empty variable is returned.
     */
    std::pair<std::string, gd::Variable> & Get(unsigned int index);

    /**
     * \brief Return a pair containing the name and the variable at position \index in the container.
     *
     * \note If index is invalid, an empty variable is returned.
     */
    const std::pair<std::string, gd::Variable> & Get(unsigned int index) const;

    /**
     * Must add a new variable constructed from the variable passed as parameter.
     * \note No pointer or reference must be kept on the variable passed as parameter.
     * \param variable The variable that must be copied and inserted into the container
     * \param position Insertion position. If the position is invalid, the variable is inserted at the end of the variable list.
     * \return Reference to the newly added variable
     */
    Variable & Insert(const std::string & name, const Variable & variable, unsigned int position);

    /**
     * \brief Return the number of variables.
     */
    unsigned int Count() const { return variables.size(); };

    #if defined(GD_IDE_ONLY)
    /**
     * \brief return the position of the variable called "name" in the variable list
     */
    unsigned int GetPosition(const std::string & name) const;

    /**
     * \brief Add a new empty variable at the specified position in the container.
     * \param name The new variable name
     * \param position Insertion position. If the position is invalid, the variable is inserted at the end of the variable list.
     * \return Reference to the newly added variable
     */
    Variable & InsertNew(const std::string & name, unsigned int position = -1);

    /**
     * \brief Remove the specified variable from the container.
     */
    void Remove(const std::string & name);

    /**
     * \brief Rename a variable
     */
    void Rename(const std::string & oldName, const std::string & newName);

    /**
     * \brief Swap the position of the specified variables.
     */
    void Swap(unsigned int firstVariableIndex, unsigned int secondVariableIndex);
    #endif

    /**
     * \brief Clear all variables of the container.
     */
    inline void Clear() { variables.clear(); }
    ///@}

    /** \name Saving and loading
     * Members functions related to saving and loading the object.
     */
    ///@{
    #if defined(GD_IDE_ONLY)
    /**
     * \brief Serialize variable container.
     */
    void SerializeTo(SerializerElement & element) const;
    #endif

    /**
     * \brief Unserialize the variable container.
     */
    void UnserializeFrom(const SerializerElement & element);
    ///@}

private:

    std::vector < std::pair<std::string, gd::Variable> > variables;
    static std::pair<std::string, Variable> badVariable;
};

}

#endif // GDCORE_VARIABLESCONTAINER_H
