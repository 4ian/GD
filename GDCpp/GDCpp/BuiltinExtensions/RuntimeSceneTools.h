#ifndef RUNTIMESCENETOOLS_H
#define RUNTIMESCENETOOLS_H

#include <string>
#include <vector>
#include <map>
class RuntimeScene;
namespace gd { class Variable; }
class RuntimeObject;

/**
 * Only used internally by GD events generated code.
 */
std::string GD_API GetSceneName(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
bool GD_API LayerVisible(RuntimeScene & scene, const std::string & layer);

/**
 * Only used internally by GD events generated code.
 */
void GD_API ShowLayer(RuntimeScene & scene, const std::string & layer);

/**
 * Only used internally by GD events generated code.
 */
void GD_API HideLayer(RuntimeScene & scene, const std::string & layer);

/**
 * Only used internally by GD events generated code.
 */
void GD_API StopGame(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
void GD_API ChangeScene(RuntimeScene & scene, std::string newSceneName);

/**
 * Only used internally by GD events generated code.
 */
bool GD_API SceneJustBegins(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
void GD_API MoveObjects(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
void GD_API DisableInputWhenFocusIsLost(RuntimeScene & scene, bool disable);

/**
 * Only used internally by GD events generated code.
 */
void GD_API CreateObjectOnScene(RuntimeScene & scene, std::map <std::string, std::vector<RuntimeObject*> *> pickedObjectLists, float positionX, float positionY, const std::string & layer);

/**
 * Only used internally by GD events generated code.
 */
void GD_API CreateObjectFromGroupOnScene(RuntimeScene & scene, std::map <std::string, std::vector<RuntimeObject*> *> pickedObjectLists, const std::string & objectWanted, float positionX, float positionY, const std::string & layer);

/**
 * Only used internally by GD events generated code.
 *
 * \return true ( always )
 */
bool GD_API PickAllObjects(RuntimeScene & scene, std::map <std::string, std::vector<RuntimeObject*> *> pickedObjectLists);

/**
 * Only used internally by GD events generated code.
 *
 * \return true if an object was picked, false otherwise
 */
bool GD_API PickRandomObject(RuntimeScene & scene, std::map <std::string, std::vector<RuntimeObject*> *> pickedObjectLists);

/**
 * Only used internally by GD events generated code.
 *
 * \return true if an object was picked, false otherwise
 */
bool GD_API PickNearestObject(std::map <std::string, std::vector<RuntimeObject*> *> pickedObjectLists, double x, double y, bool inverted);

/**
 * Only used internally by GD events generated code.
 */
void GD_API ChangeSceneBackground(RuntimeScene & scene, std::string newColor);

/**
 * Only used internally by GD events generated code.
 */
bool GD_API SceneVariableExists(RuntimeScene & scene, const gd::Variable & variable);
/**
 * Only used internally by GD events generated code.
 */
bool GD_API GlobalVariableExists(RuntimeScene & scene, const gd::Variable & variable);

/**
 * Only used internally by GD events generated code.
 */
bool GD_API VariableChildExists(const gd::Variable & variable, const std::string & childName);

/**
 * Only used internally by GD events generated code.
 */
void GD_API VariableRemoveChild(gd::Variable & variable, const std::string & childName);

/**
 * Only used internally by GD events generated code.
 */
gd::Variable & GD_API ReturnVariable(gd::Variable & variable);

/**
 * Only used internally by GD events generated code.
 */
double GD_API GetVariableValue(const gd::Variable & variable);

/**
 * Only used internally by GD events generated code.
 */
const std::string& GD_API GetVariableString(const gd::Variable & variable);

/**
 * Only used internally by GD events generated code.
 */
void GD_API SetFullScreen(RuntimeScene & scene, bool fullscreen, bool);

/**
 * Only used internally by GD events generated code.
 */
void GD_API SetWindowSize(RuntimeScene & scene, int width, int height, bool useTheNewSizeForCameraDefaultSize);

/**
 * Only used internally by GD events generated code.
 */
void GD_API SetWindowIcon(RuntimeScene & scene, const std::string & imageName);

/**
 * Only used internally by GD events generated code.
 */
void GD_API SetWindowTitle(RuntimeScene & scene, const std::string & newName);

/**
 * Only used internally by GD events generated code.
 */
const std::string & GD_API GetWindowTitle(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
unsigned int GD_API GetSceneWindowWidth(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
unsigned int GD_API GetSceneWindowHeight(RuntimeScene & scene);

/**
 * Only used internally by GD events generated code.
 */
unsigned int GD_API GetScreenWidth();

/**
 * Only used internally by GD events generated code.
 */
unsigned int GD_API GetScreenHeight();

/**
 * Only used internally by GD events generated code.
 */
unsigned int GD_API GetScreenColorDepth();

/**
 * Only used internally by GD events generated code.
 */
void GD_API DisplayLegacyTextOnScene(RuntimeScene & scene, const std::string & str, float x, float y, const std::string & color, float characterSize, const std::string & fontName, const std::string & layer);

#if defined(GD_IDE_ONLY)
/**
 * \brief Called so as to warn the developer about a while event doing a large number of iterations.
 *
 * Displays a warning and offer a chance to stop the preview.
 * Only used internally by GD events generated code and only available for the IDE.
 *
 * \return true if scene must be stopped ( scene.running was set to false )
 */
bool GD_API WarnAboutInfiniteLoop(RuntimeScene & scene);

#endif

#endif // RUNTIMESCENETOOLS_H
