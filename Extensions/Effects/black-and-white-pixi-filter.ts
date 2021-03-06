namespace gdjs {
  import PIXI = GlobalPIXIModule.PIXI;
  gdjs.PixiFiltersTools.registerFilterCreator('BlackAndWhite', {
    makePIXIFilter: function (layer, effectData) {
      const colorMatrix = new PIXI.filters.ColorMatrixFilter();
      colorMatrix.blackAndWhite(false);
      return colorMatrix;
    },
    update: function (filter, layer) {},
    updateDoubleParameter: function (filter, parameterName, value) {
      // @ts-ignore - unsure why PIXI.filters is not recognised.
      const colorMatrix = (filter as unknown) as PIXI.filters.ColorMatrixFilter;
      if (parameterName !== 'opacity') {
        return;
      }
      colorMatrix.alpha = gdjs.PixiFiltersTools.clampValue(value, 0, 1);
    },
    updateStringParameter: function (filter, parameterName, value) {},
    updateBooleanParameter: function (filter, parameterName, value) {},
  });
}
