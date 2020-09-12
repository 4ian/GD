// @flow
/**
 * This is a declaration of an extension for GDevelop 5.
 *
 * ℹ️ Changes in this file are watched and automatically imported if the editor
 * is running. You can also manually run `node import-GDJS-Runtime.js` (in newIDE/app/scripts).
 *
 * The file must be named "JsExtension.js", otherwise GDevelop won't load it.
 * ⚠️ If you make a change and the extension is not loaded, open the developer console
 * and search for any errors.
 *
 * More information on https://github.com/4ian/GDevelop/blob/master/newIDE/README-extensions.md
 */

/*::
// Import types to allow Flow to do static type checking on this file.
// Extensions declaration are typed using Flow (like the editor), but the files
// for the game engine are checked with TypeScript annotations.
import { type ObjectsRenderingService, type ObjectsEditorService } from '../JsExtensionTypes.flow.js'
*/

module.exports = {
  createExtension: function (
    _ /*: (string) => string */,
    gd /*: libGDevelop */
  ) {
    const extension = new gd.PlatformExtension();
    extension
      .setExtensionInformation(
        'BitmapText',
        _('Bitmap Text Object'),
        _('Displays a text as a bitmap image.'),
        'Aurélien Vivet',
        'Open source (MIT License)'
      )
      .setExtensionHelpPath('/objects/bitmaptext');

    const bitmapTextObject = new gd.ObjectJsImplementation();
    // $FlowExpectedError
    bitmapTextObject.updateProperty = function (
      objectContent,
      propertyName,
      newValue
    ) {
      if (propertyName in objectContent) {
        if (typeof objectContent[propertyName] === 'boolean')
          objectContent[propertyName] = newValue === '1';
        else if (typeof objectContent[propertyName] === 'number')
          objectContent[propertyName] = parseFloat(newValue);
        else objectContent[propertyName] = newValue;
        return true;
      }

      return false;
    };
    // $FlowExpectedError
    bitmapTextObject.getProperties = function (objectContent) {
      const objectProperties = new gd.MapStringPropertyDescriptor();

      objectProperties
        .getOrCreate('text')
        .setValue(objectContent.text)
        .setType('textarea')
        .setLabel(_('Text'));

      objectProperties
        .getOrCreate('opacity')
        .setValue(objectContent.opacity.toString())
        .setType('number')
        .setLabel(_('Opacity (0-255)'));

      objectProperties
        .getOrCreate('align')
        .setValue(objectContent.align)
        .setType('choice')
        .addExtraInfo('left')
        .addExtraInfo('center')
        .addExtraInfo('right')
        .setLabel(_('Alignment, when multiple lines are displayed'));

      objectProperties
        .getOrCreate('fontResourceName')
        .setValue(objectContent.fontResourceName)
        .setType('resource')
        .addExtraInfo('font')
        .setLabel(_('Font'));

      objectProperties
        .getOrCreate('fontSize')
        .setValue(objectContent.fontSize.toString())
        .setType('number')
        .setLabel(_('Font Size'));

      objectProperties
        .getOrCreate('fontColor')
        .setValue(objectContent.fontColor)
        .setType('color')
        .setLabel(_('Font Color'));

      objectProperties
        .getOrCreate('wordWrap')
        .setValue(objectContent.wordWrap ? 'true' : 'false')
        .setType('boolean')
        .setLabel(_('Word wrapping'));

      objectProperties
        .getOrCreate('specialChars')
        .setValue(objectContent.specialChars)
        .setType('string')
        .setLabel(_('Special chars to include'));

      return objectProperties;
    };
    bitmapTextObject.setRawJSONContent(
      JSON.stringify({
        text: 'This is a text displayed with a Bitmap Text object.',
        opacity: 255,
        fontSize: 20,
        fontColor: '#000000',
        fontResourceName: '',
        align: 'left',
        wordWrap: true,
        specialChars: '',
      })
    );

    // $FlowExpectedError
    bitmapTextObject.updateInitialInstanceProperty = function (
      objectContent,
      instance,
      propertyName,
      newValue,
      project,
      layout
    ) {
      return false;
    };
    // $FlowExpectedError
    bitmapTextObject.getInitialInstanceProperties = function (
      content,
      instance,
      project,
      layout
    ) {
      var instanceProperties = new gd.MapStringPropertyDescriptor();
      return instanceProperties;
    };

    const object = extension
      .addObject(
        'BitmapTextObject',
        _('BitmapText'),
        _(
          'Displays a text using a "Bitmap Font", which is more performant than a traditional text but also less flexible (only alphanumerical characters are supported).'
        ),
        'JsPlatform/Extensions/bitmapfont32.png',
        bitmapTextObject
      )
      .setIncludeFile('Extensions/BitmapText/bitmaptextruntimeobject.js')
      .addIncludeFile(
        'Extensions/BitmapText/bitmaptextruntimeobject-pixi-renderer.js'
      );

    object
      .addCondition(
        'GetText',
        _('Compare the text'),
        _('Compare the text of the Bitmap text object.'),
        _('the text'),
        '',
        'res/conditions/text24.png',
        'res/conditions/text.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('getText');

    object
      .addCondition(
        'GetOpacity',
        _('Opacity'),
        _(
          'Compare the opacity of the Bitmap text object, between 0 (fully transparent) to 255 (opaque).'
        ),
        _('the opacity'),
        '',
        'res/conditions/opacity24.png',
        'res/conditions/opacity.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getOpacity');

    object
      .addCondition(
        'GetFontSize',
        _('Font size'),
        _('Compare the font size of the Bitmap text object.'),
        _('the font size'),
        '',
        'res/conditions/characterSize24.png',
        'res/conditions/characterSize.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getFontSize');

    object
      .addCondition(
        'GetFont',
        _('Font'),
        _(
          'Compare the name of the font resource used for the Bitmap text object.'
        ),
        _('the font'),
        _('Style'),
        'res/conditions/font24.png',
        'res/conditions/font.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('getFontResourceName');

    object
      .addCondition(
        'GetAlignment',
        _('Alignment'),
        _('Compare the alignment of the Bitmap text object.'),
        _('the alignment'),
        _('Style'),
        'res/actions/textAlign24.png',
        'res/actions/textAlign.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('getAlignment');

    object
      .addCondition(
        'GetWordWrap',
        _('Wrapping'),
        _('Check if word wrap is enabled.'),
        _('_PARAM0_ word wrapping is activated'),
        _('Style'),
        'res/conditions/wordWrap24.png',
        'res/conditions/wordWrap.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .getCodeExtraInformation()
      .setFunctionName('getWordWrap');

    object
      .addCondition(
        'GetWrappingWidth',
        _('Wrapping width'),
        _(
          'Compare the width, in pixels, after which the text is wrapped on next line.'
        ),
        _('the wrapping width'),
        _('Style'),
        'res/actions/wordWrap24.png',
        'res/actions/wordWrap.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardRelationalOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('getWrappingWidth');

    object
      .addAction(
        'SetText',
        _('Text'),
        _('Modify the text of a Bitmap text object.'),
        _('the Bitmap text'),
        '',
        'res/actions/text24.png',
        'res/actions/text.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('string')
      .getCodeExtraInformation()
      .setFunctionName('setText')
      .setGetter('getText');

    object
      .addAction(
        'SetColor',
        _('Color'),
        _('Change the color of the text.'),
        _('Change color of _PARAM0_ to _PARAM1_'),
        _('Style'),
        'res/actions/color24.png',
        'res/actions/color.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter('color', _('Color'), '', false)
      .setDefaultValue('0;0;0')
      .getCodeExtraInformation()
      .setFunctionName('setColor');

    object
      .addAction(
        'SetOpacity',
        _('Opacity'),
        _('Modify the opacity of a Bitmap text object.'),
        _('the opacity'),
        '',
        'res/actions/opacity24.png',
        'res/actions/opacity.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('setOpacity')
      .setGetter('getOpacity');

    object
      .addAction(
        'SetFontSize',
        _('Font size'),
        _('Modify the font size of a Bitmap text object.'),
        _('the font size'),
        '',
        'res/actions/font24.png',
        'res/actions/font.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('setFontSize')
      .setGetter('getFontSize');

    object
      .addAction(
        'SetFontResourceName',
        _('Font'),
        _('Change the font used by the Bitmap text object.'),
        _('Set the font of _PARAM0_ to _PARAM1_'),
        _('Style'),
        'res/actions/font24.png',
        'res/actions/font.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter('font', _('Font resource'), '', false)
      .getCodeExtraInformation()
      .setFunctionName('setFontResourceName');

    object
      .addAction(
        'SetAlignment',
        _('Alignment'),
        _('Change the alignment of a Bitmap text object.'),
        _('Set alignement of _PARAM0_ to _PARAM1_'),
        _('Style'),
        'res/actions/textAlign24.png',
        'res/actions/textAlign.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter(
        'stringWithSelector',
        _('Alignment'),
        '["left", "center", "right"]',
        false
      )
      .getCodeExtraInformation()
      .setFunctionName('setAlignment');

    object
      .addAction(
        'SetWordWrap',
        _('Word wrap'),
        _('Modify the word wrap of a Bitmap text object.'),
        _('Set word wrapping of _PARAM0_: _PARAM1_'),
        _('Style'),
        'res/actions/wordWrap24.png',
        'res/actions/wordWrap.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .addParameter('yesorno', _('Activate word wrap'), '', false)
      .getCodeExtraInformation()
      .setFunctionName('setWordWrap');

    object
      .addAction(
        'SetWrappingWidth',
        _('Wrapping width'),
        _(
          'Change the width, in pixels, after which the text is wrapped on next line.'
        ),
        _('the wrapping width'),
        _('Style'),
        'res/actions/scaleWidth24.png',
        'res/actions/scaleWidth.png'
      )
      .addParameter('object', _('Bitmap text'), 'BitmapTextObject', false)
      .useStandardOperatorParameters('number')
      .getCodeExtraInformation()
      .setFunctionName('setWrappingWidth')
      .setGetter('getWrappingWidth');

    return extension;
  },

  /**
   * You can optionally add sanity tests that will check the basic working
   * of your extension behaviors/objects by instanciating behaviors/objects
   * and setting the property to a given value.
   *
   * If you don't have any tests, you can simply return an empty array.
   *
   * But it is recommended to create tests for the behaviors/objects properties you created
   * to avoid mistakes.
   */
  runExtensionSanityTests: function (
    gd /*: libGDevelop */,
    extension /*: gdPlatformExtension*/
  ) {
    return [];
  },
  /**
   * Register editors for objects.
   *
   * ℹ️ Run `node import-GDJS-Runtime.js` (in newIDE/app/scripts) if you make any change.
   */
  registerEditorConfigurations: function (
    objectsEditorService /*: ObjectsEditorService */
  ) {
    objectsEditorService.registerEditorConfiguration(
      'BitmapText::BitmapTextObject',
      objectsEditorService.getDefaultObjectJsImplementationPropertiesEditor({
        helpPagePath: '/objects/bitmaptext',
      })
    );
  },
  /**
   * Register renderers for instance of objects on the scene editor.
   *
   * ℹ️ Run `node import-GDJS-Runtime.js` (in newIDE/app/scripts) if you make any change.
   */
  registerInstanceRenderers: function (
    objectsRenderingService /*: ObjectsRenderingService */
  ) {
    const RenderedInstance = objectsRenderingService.RenderedInstance;
    const PIXI = objectsRenderingService.PIXI;

    /**
     * Renderer for instances of BitmapText inside the IDE.
     *
     * @extends RenderedBitmapTextInstance
     * @class RenderedBitmapTextInstance
     * @constructor
     */
    function RenderedBitmapTextInstance(
      project,
      layout,
      instance,
      associatedObject,
      pixiContainer,
      pixiResourcesLoader
    ) {
      RenderedInstance.call(
        this,
        project,
        layout,
        instance,
        associatedObject,
        pixiContainer,
        pixiResourcesLoader
      );

      // Set up and load a default font. It will then be replaced by another
      // font (see `update` method) so we go ahead with some defaults:
      this._bitmapFontStyle = new PIXI.TextStyle();
      this._bitmapFontStyle.fontFamily = 'Arial';
      this._bitmapFontStyle.fontSize = 20;
      this._bitmapFontStyle.wordWrap = false;
      this._bitmapFontStyle.fill = '#ffffff';
      this._bitmapFontStyle.specialChars= '';

      // We'll track changes of the font to trigger the loading of the new font.
      this._currentFontResourceName = '';

      const fontName = this._ensureFontAvailableAndGetFontName();
      this._pixiObject = new PIXI.BitmapText('', {
        fontName,
      });
      this._pixiObject.anchor.x = 0.5;
      this._pixiObject.anchor.y = 0.5;
      this._pixiContainer.addChild(this._pixiObject);
      this.update();
    }
    RenderedBitmapTextInstance.prototype = Object.create(
      RenderedInstance.prototype
    );

    /**
     * Return the path to the thumbnail of the specified object.
     */
    RenderedBitmapTextInstance.getThumbnail = function (
      project,
      resourcesLoader,
      object
    ) {
      return 'JsPlatform/Extensions/bitmapfont24.png';
    };

    /**
     * Generate the PIXI.BitmapFont for the object according to `this._bitmapFontStyle`.
     * You must ensure that *the font family is already loaded* before calling this.
     */
    RenderedBitmapTextInstance.prototype._ensureFontAvailableAndGetFontName = function () {
      const slugFontName =
        this._bitmapFontStyle.fontFamily +
        '-' +
        this._bitmapFontStyle.fontSize +
        '-' +
        this._bitmapFontStyle.fill +
        '-' +
        this._bitmapFontStyle.specialChars +
        '-bitmapFont';

      // Load the font if it's not available yet.
      if (!PIXI.BitmapFont.available[slugFontName]) {
        console.info('Generating font "' + slugFontName + '" for BitmapText.');
        PIXI.BitmapFont.from(slugFontName, this._bitmapFontStyle, {
          chars: [[' ', '~'], this._bitmapFontStyle.specialChars],
        });
      }

      // TODO: find a way to unload the BitmapFont that are not used anymore, otherwise
      // we risk filling up the memory with useless BitmapFont - especially when the user
      // plays with the color/size.

      return slugFontName;
    };

    /**
     * This is called to update the PIXI object on the scene editor
     */
    RenderedBitmapTextInstance.prototype.update = function () {
      const properties = this._associatedObject.getProperties();

      // Update the rendered text properties (note: Pixi is only
      // applying changes if there were changed).
      const rawText = properties.get('text').getValue();
      this._pixiObject.text = rawText;

      const opacity = properties.get('opacity').getValue();
      this._pixiObject.alpha = opacity / 255;

      const align = properties.get('align').getValue();
      this._pixiObject.align = align;

      // The next properties implies that a new font texture will be generated
      // when they change.
      const fontColor = properties.get('fontColor').getValue();
      this._bitmapFontStyle.fill = fontColor;

      const fontSize = Number(properties.get('fontSize').getValue()) || 1;
      this._bitmapFontStyle.fontSize = fontSize;
      this._pixiObject.fontSize = fontSize; // We also need to update the BitmapText fontSize

      // Track the changes in font to load the new requested font.
      const fontResourceName = properties.get('fontResourceName').getValue();
      if (this._currentFontResourceName !== fontResourceName) {
        this._currentFontResourceName = fontResourceName;

        this._pixiResourcesLoader
          .loadFontFamily(this._project, fontResourceName)
          .then((fontFamily) => {
            // Once the font is loaded, we can use the given fontFamily.
            this._bitmapFontStyle.fontFamily = fontFamily;

            // Next update will pick up the fontFamily change and update the text.
          })
          .catch((err) => {
            // Ignore errors
            console.warn(
              'Unable to load font family for RenderedBitmapTextInstance',
              err
            );
          });
      }

      // Set up the wrapping width if enabled.
      const wordWrap = properties.get('wordWrap').getValue() === 'true';
      if (wordWrap && this._instance.hasCustomSize()) {
        this._pixiObject.maxWidth = this._instance.getCustomWidth();
        this._pixiObject.dirty = true;
      } else {
        this._pixiObject.maxWidth = 0;
        this._pixiObject.dirty = true;
      }

      // Set up the characters wanted by the user for the generation of the bitmapFont.
      const specialChars = properties.get('specialChars').getValue();
      this._bitmapFontStyle.specialChars = specialChars;

      // Assign the font name (that will change if fontFamily, fontSize or color were
      // changed).
      this._pixiObject.fontName = this._ensureFontAvailableAndGetFontName();

      // Note: use `textWidth` as `width` seems unreliable.
      this._pixiObject.position.x =
        this._instance.getX() + this._pixiObject.textWidth / 2;
      this._pixiObject.position.y =
        this._instance.getY() + this._pixiObject.height / 2;
      this._pixiObject.rotation = RenderedInstance.toRad(
        this._instance.getAngle()
      );
    };

    /**
     * Return the width of the instance, when it's not resized.
     */
    RenderedBitmapTextInstance.prototype.getDefaultWidth = function () {
      return this._pixiObject.width;
    };

    /**
     * Return the height of the instance, when it's not resized.
     */
    RenderedBitmapTextInstance.prototype.getDefaultHeight = function () {
      return this._pixiObject.height;
    };

    objectsRenderingService.registerInstanceRenderer(
      'BitmapText::BitmapTextObject',
      RenderedBitmapTextInstance
    );
  },
};
