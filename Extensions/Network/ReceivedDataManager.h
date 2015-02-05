/**

GDevelop - Network Extension
Copyright (c) 2010-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#ifndef RECEIVEDDATAMANAGER_H
#define RECEIVEDDATAMANAGER_H
#include <map>
#include <string>

/**
 * Singleton where is stocked receveid data from other peers.
 */
class GD_EXTENSION_API ReceivedDataManager
{
    public:

    static ReceivedDataManager *Get()
    {
        if ( !_singleton )
        {
            _singleton = new ReceivedDataManager;
        }

        return ( static_cast<ReceivedDataManager*>( _singleton ) );
    }

    static void DestroySingleton()
    {
        if ( _singleton )
        {
            delete _singleton;
            _singleton = 0;
        }
    }

    std::map<std::string, double> values;
    std::map<std::string, std::string> strings;

    protected:
    private:

    ReceivedDataManager() {};
    ~ReceivedDataManager() {};

    static ReceivedDataManager *_singleton;
};

#endif // RECEIVEDDATAMANAGER_H

