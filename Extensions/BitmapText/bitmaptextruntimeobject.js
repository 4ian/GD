/**
 * @typedef {Object} BitmapTextObjectDataType Base parameters for {@link gdjs.BitmapTextRuntimeObject}
 * @property {Object} content The base parameters of the BitmapText
 * @property {number} content.opacity The opacity of the BitmapText
 * @property {string} content.text Content of the text
 * @property {string} content.fontColor The color of the font of the text
 * @property {string} content.fontResourceName The font of the text
 * @property {number} content.fontSize The size of the font of the text
 * @property {boolean} content.wordWrap Activate word wrap if set to true
 * @property {('left'|'center'|'right')} content.align Alignment of the text: "left", "center" or "right"
 *
 * @typedef {ObjectData & BitmapTextObjectDataType} BitmapTextObjectData
 */

/**
 * Displays a text using a "Bitmap Font", which is more performant than a traditional text,
 * with the disadvantage of being less flexible (a font must be generated in memory for each font, font
 * size and color) and only supports ASCII characters.
 *
 * @memberof gdjs
 * @class BitmapTextRuntimeObject
 * @extends RuntimeObject
 * @param {gdjs.RuntimeScene} runtimeScene The {@link gdjs.RuntimeScene} the object belongs to
 * @param {BitmapTextObjectData} objectData The object data used to initialize the object
 */
gdjs.BitmapTextRuntimeObject = function (runtimeScene, objectData) {
  gdjs.RuntimeObject.call(this, runtimeScene, objectData);

  /** @type {number} */
  this._opacity = objectData.content.opacity;
  /** @type {string} */
  this._text = objectData.content.text;
  /** @type {number[]} color in format [r, g, b], where each component is in the range [0, 255] */
  this._fontColor = gdjs.hexToRGBColor(
    objectData.content.fontColor
  );
  /** @type {string} */
  this._fontResourceName = objectData.content.fontResourceName;
  /** @type {number} */
  this._fontSize = objectData.content.fontSize;
  /** @type {boolean} */
  this._wordWrap = objectData.content.wordWrap;
  /** @type {number} */
  this._wrappingWidth = 0;
  /** @type {string} */
  this._align = objectData.content.align;

  if (this._renderer)
    gdjs.BitmapTextRuntimeObjectRenderer.call(
      this._renderer,
      this,
      runtimeScene
    );
  else
    this._renderer = new gdjs.BitmapTextRuntimeObjectRenderer(
      this,
      runtimeScene
    );

  // *ALWAYS* call `this.onCreated()` at the very end of your object constructor.
  this.onCreated();
};

gdjs.BitmapTextRuntimeObject.prototype = Object.create(
  gdjs.RuntimeObject.prototype
);
gdjs.registerObject('BitmapText::BitmapTextObject', gdjs.BitmapTextRuntimeObject);

gdjs.BitmapTextRuntimeObject.prototype.getRendererObject = function () {
  return this._renderer.getRendererObject();
};

/**
 * @param {BitmapTextObjectDataType} oldObjectData
 * @param {BitmapTextObjectDataType} newObjectData
 */
gdjs.BitmapTextRuntimeObject.prototype.updateFromObjectData = function (
  oldObjectData,
  newObjectData
) {
  if (oldObjectData.content.opacity !== newObjectData.content.opacity) {
    this.setOpacity(newObjectData.content.opacity);
  }
  if (oldObjectData.content.text !== newObjectData.content.text) {
    this.setText(newObjectData.content.text);
  }
  if (oldObjectData.content.fontColor !== newObjectData.content.fontColor) {
    this._fontColor = gdjs.hexToRGBColor(
      newObjectData.content.fontColor
    );
    this._renderer.updateColor();
  }
  if (
    oldObjectData.content.fontResourceName !==
    newObjectData.content.fontResourceName
  ) {
    this.setFontFamily(newObjectData.content.fontResourceName);
  }
  if (oldObjectData.content.fontSize !== newObjectData.content.fontSize) {
    this.setFontSize(newObjectData.content.fontSize);
  }
  if (oldObjectData.content.wordWrap !== newObjectData.content.wordWrap) {
    this.setWordWrap(newObjectData.content.wordWrap);
  }
  if (oldObjectData.content.align !== newObjectData.content.align) {
    this.setAlignment(newObjectData.content.align);
  }

  return true;
};

/**
 * Initialize the extra parameters that could be set for an instance.
 * @private
 */
gdjs.BitmapTextRuntimeObject.prototype.extraInitializationFromInitialInstance = function (
  initialInstanceData
) {
  if (initialInstanceData.customSize) {
    this.setWrappingWidth(initialInstanceData.width);
  }
};

gdjs.BitmapTextRuntimeObject.prototype.onDestroyFromScene = function (
  runtimeScene
) {
  gdjs.RuntimeObject.prototype.onDestroyFromScene.call(this, runtimeScene);
  this._renderer.onDestroy();
};

/**
 * Set the text to display.
 */
gdjs.BitmapTextRuntimeObject.prototype.setText = function (text) {
  this._text = text;
  this._renderer.updateTextContent();
};

/**
 * Get the text displayed by the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.getText = function () {
  return this._text;
};

gdjs.BitmapTextRuntimeObject.prototype.setColor = function (rgbColorString) {
  const splitValue = rgbColorString.split(';');
  if (splitValue.length !== 3) return;

  this._fontColor[0] = parseInt(splitValue[0], 10);
  this._fontColor[1] = parseInt(splitValue[1], 10);
  this._fontColor[2] = parseInt(splitValue[2], 10);
  this._renderer.updateColor();
};

gdjs.BitmapTextRuntimeObject.prototype.getColor = function () {
  return (
    this._fontColor[0] + ';' + this._fontColor[1] + ';' + this._fontColor[2]
  );
};

gdjs.BitmapTextRuntimeObject.prototype.setFontSize = function (fontSize) {
  this._fontSize = fontSize;
  this._renderer.updateFontSize();
};

gdjs.BitmapTextRuntimeObject.prototype.getFontSize = function () {
  return this._fontSize;
};

gdjs.BitmapTextRuntimeObject.prototype.setFontResourceName = function (
  fontResourceName
) {
  this._fontResourceName = fontResourceName;
  this._renderer.updateFont();
};

gdjs.BitmapTextRuntimeObject.prototype.getFontResourceName = function () {
  return this._fontResourceName;
};

gdjs.BitmapTextRuntimeObject.prototype.setAlignment = function (align) {
  this._align = align;
  this._renderer.updateAlignment();
};

gdjs.BitmapTextRuntimeObject.prototype.getAlignment = function () {
  return this._align;
};

/**
 * Set object position on X axis.
 * @param {number} x The new position X of the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.setX = function (x) {
  gdjs.RuntimeObject.prototype.setX.call(this, x);
  this._renderer.updatePosition();
};

/**
 * Set object position on Y axis.
 * @param {number} y The new position Y of the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.setY = function (y) {
  gdjs.RuntimeObject.prototype.setY.call(this, y);
  this._renderer.updatePosition();
};

/**
 * Set the angle of the object.
 * @param {number} angle The new angle of the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.setAngle = function (angle) {
  gdjs.RuntimeObject.prototype.setAngle.call(this, angle);
  this._renderer.updateAngle();
};

/**
 * Set object opacity.
 * @param {number} opacity The new opacity of the object (0-255).
 */
gdjs.BitmapTextRuntimeObject.prototype.setOpacity = function (opacity) {
  this._opacity = opacity;
  this._renderer.updateOpacity();
};

/**
 * Get object opacity.
 */
gdjs.BitmapTextRuntimeObject.prototype.getOpacity = function () {
  return this._opacity;
};

/**
 * Set the width.
 * @param {number} width The new width in pixels.
 */
gdjs.BitmapTextRuntimeObject.prototype.setWrappingWidth = function (width) {
  this._wrappingWidth = width;
  this._renderer.updateWrappingWidth();
};

/**
 * Get the wrapping width of the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.getWrappingWidth = function () {
  return this._wrappingWidth;
};

gdjs.BitmapTextRuntimeObject.prototype.setWordWrap = function (wordWrap) {
  this._wordWrap = wordWrap;
  this._renderer.updateWrappingWidth();
};

gdjs.BitmapTextRuntimeObject.prototype.getWordWrap = function (wordWrap) {
  return this._wordWrap;
};

/**
 * Get the width of the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.getWidth = function () {
  return this._renderer.getWidth();
};

/**
 * Get the height of the object.
 */
gdjs.BitmapTextRuntimeObject.prototype.getHeight = function () {
  return this._renderer.getHeight();
};
