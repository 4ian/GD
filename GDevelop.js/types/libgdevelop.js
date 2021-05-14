// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class libGDevelop {
  getPointer(gdEmscriptenObject): number;
  castObject<T>(gdEmscriptenObject, Class<T>): T;
  compare(gdEmscriptenObject, gdEmscriptenObject): boolean;

  getTypeOfObject(globalObjectsContainer: gdObjectsContainer, objectsContainer: gdObjectsContainer, objectName: string, searchInGroups: boolean): string;
  getTypeOfBehavior(globalObjectsContainer: gdObjectsContainer, objectsContainer: gdObjectsContainer, objectName: string, searchInGroups: boolean): string;
  getBehaviorsOfObject(globalObjectsContainer: gdObjectsContainer, objectsContainer: gdObjectsContainer, objectName: string, searchInGroups: boolean): gdVectorString;

  removeFromVectorParameterMetadata(gdVectorParameterMetadata, index: number): void;
  swapInVectorParameterMetadata(gdVectorParameterMetadata, oldIndex: number, newIndex: number): void;

  asStandardEvent(gdBaseEvent): gdStandardEvent;
  asRepeatEvent(gdBaseEvent): gdRepeatEvent;
  asWhileEvent(gdBaseEvent): gdWhileEvent;
  asForEachEvent(gdBaseEvent): gdForEachEvent;
  asForEachChildVariableEvent(gdBaseEvent): gdForEachChildVariableEvent;
  asCommentEvent(gdBaseEvent): gdCommentEvent;
  asGroupEvent(gdBaseEvent): gdGroupEvent;
  asLinkEvent(gdBaseEvent): gdLinkEvent;
  asJsCodeEvent(gdBaseEvent): gdJsCodeEvent;
  asPlatform(gdPlatform): gdPlatform;

  asSpriteObject(gdObject): gdSpriteObject;
  asTiledSpriteObject(gdObject): gdTiledSpriteObject;
  asPanelSpriteObject(gdObject): gdPanelSpriteObject;
  asTextObject(gdObject): gdTextObject;
  asShapePainterObject(gdObject): gdShapePainterObject;
  asAdMobObject(gdObject): gdAdMobObject;
  asTextEntryObject(gdObject): gdTextEntryObject;
  asParticleEmitterObject(gdObject): gdParticleEmitterObject;
  asObjectJsImplementation(gdObject): gdObjectJsImplementation;

  asImageResource(gdResource): gdImageResource;

  VectorString: Class<gdVectorString>;
  VectorPlatformExtension: Class<gdVectorPlatformExtension>;
  VectorDependencyMetadata: Class<gdVectorDependencyMetadata>;
  VectorVariable: Class<gdVectorVariable>;
  MapStringString: Class<gdMapStringString>;
  MapStringBoolean: Class<gdMapStringBoolean>;
  MapStringDouble: Class<gdMapStringDouble>;
  MapStringVariable: Class<gdMapStringVariable>;
  MapStringExpressionMetadata: Class<gdMapStringExpressionMetadata>;
  MapStringInstructionMetadata: Class<gdMapStringInstructionMetadata>;
  MapStringEventMetadata: Class<gdMapStringEventMetadata>;
  MapExtensionProperties: Class<gdMapExtensionProperties>;
  SetString: Class<gdSetString>;
  ProjectHelper: Class<gdProjectHelper>;
  VersionWrapper: Class<gdVersionWrapper>;
  Platform: Class<gdPlatform>;
  JsPlatform: Class<gdJsPlatform>;
  PairStringVariable: Class<gdPairStringVariable>;
  Variable_Type: Class<Variable_Type>;
  Variable: Class<gdVariable>;
  VariablesContainer: Class<gdVariablesContainer>;
  ObjectGroup: Class<gdObjectGroup>;
  ObjectGroupsContainer: Class<gdObjectGroupsContainer>;
  PlatformSpecificAssets: Class<gdPlatformSpecificAssets>;
  LoadingScreen: Class<gdLoadingScreen>;
  ObjectsContainer: Class<gdObjectsContainer>;
  Project: Class<gdProject>;
  ExtensionProperties: Class<gdExtensionProperties>;
  Behavior: Class<gdBehavior>;
  BehaviorJsImplementation: Class<gdBehaviorJsImplementation>;
  BehaviorContent: Class<gdBehaviorContent>;
  BehaviorsSharedData: Class<gdBehaviorsSharedData>;
  BehaviorSharedDataJsImplementation: Class<gdBehaviorSharedDataJsImplementation>;
  gdObject: Class<gdObject>;
  UniquePtrObject: Class<gdUniquePtrObject>;
  ObjectJsImplementation: Class<gdObjectJsImplementation>;
  Layout: Class<gdLayout>;
  ExternalEvents: Class<gdExternalEvents>;
  ExternalLayout: Class<gdExternalLayout>;
  Effect: Class<gdEffect>;
  EffectsContainer: Class<gdEffectsContainer>;
  Layer: Class<gdLayer>;
  PropertyDescriptor: Class<gdPropertyDescriptor>;
  NamedPropertyDescriptor: Class<gdNamedPropertyDescriptor>;
  MapStringPropertyDescriptor: Class<gdMapStringPropertyDescriptor>;
  MapStringSerializerValue: Class<gdMapStringSerializerValue>;
  VectorPairStringSharedPtrSerializerElement: Class<gdVectorPairStringSharedPtrSerializerElement>;
  Resource: Class<gdResource>;
  ResourcesManager: Class<gdResourcesManager>;
  ImageResource: Class<gdImageResource>;
  AudioResource: Class<gdAudioResource>;
  FontResource: Class<gdFontResource>;
  BitmapFontResource: Class<gdBitmapFontResource>;
  VideoResource: Class<gdVideoResource>;
  JsonResource: Class<gdJsonResource>;
  InitialInstance: Class<gdInitialInstance>;
  InitialInstancesContainer: Class<gdInitialInstancesContainer>;
  HighestZOrderFinder: Class<gdHighestZOrderFinder>;
  InitialInstanceFunctor: Class<gdInitialInstanceFunctor>;
  InitialInstanceJSFunctorWrapper: Class<gdInitialInstanceJSFunctorWrapper>;
  InitialInstanceJSFunctor: Class<gdInitialInstanceJSFunctor>;
  SerializerValue: Class<gdSerializerValue>;
  SerializerElement: Class<gdSerializerElement>;
  SharedPtrSerializerElement: Class<gdSharedPtrSerializerElement>;
  Serializer: Class<gdSerializer>;
  InstructionsList: Class<gdInstructionsList>;
  Instruction: Class<gdInstruction>;
  VectorPairStringTextFormatting: Class<gdVectorPairStringTextFormatting>;
  TextFormatting: Class<gdTextFormatting>;
  InstructionSentenceFormatter: Class<gdInstructionSentenceFormatter>;
  ExtraInformation: Class<gdExtraInformation>;
  ExpressionCodeGenerationInformation: Class<gdExpressionCodeGenerationInformation>;
  InstructionMetadata: Class<gdInstructionMetadata>;
  ExpressionMetadata: Class<gdExpressionMetadata>;
  MultipleInstructionMetadata: Class<gdMultipleInstructionMetadata>;
  DependencyMetadata: Class<gdDependencyMetadata>;
  ParameterMetadata: Class<gdParameterMetadata>;
  VectorParameterMetadata: Class<gdVectorParameterMetadata>;
  ParameterMetadataTools: Class<gdParameterMetadataTools>;
  EventsFunctionTools: Class<gdEventsFunctionTools>;
  ObjectMetadata: Class<gdObjectMetadata>;
  BehaviorMetadata: Class<gdBehaviorMetadata>;
  EffectMetadata: Class<gdEffectMetadata>;
  EventMetadata: Class<gdEventMetadata>;
  PlatformExtension: Class<gdPlatformExtension>;
  EventsList: Class<gdEventsList>;
  BaseEvent: Class<gdBaseEvent>;
  StandardEvent: Class<gdStandardEvent>;
  RepeatEvent: Class<gdRepeatEvent>;
  WhileEvent: Class<gdWhileEvent>;
  ForEachEvent: Class<gdForEachEvent>;
  ForEachChildVariableEvent: Class<gdForEachChildVariableEvent>;
  CommentEvent: Class<gdCommentEvent>;
  GroupEvent: Class<gdGroupEvent>;
  LinkEvent: Class<gdLinkEvent>;
  EventsRemover: Class<gdEventsRemover>;
  EventsListUnfolder: Class<gdEventsListUnfolder>;
  EventsSearchResult: Class<gdEventsSearchResult>;
  VectorEventsSearchResult: Class<gdVectorEventsSearchResult>;
  EventsRefactorer: Class<gdEventsRefactorer>;
  WholeProjectRefactorer: Class<gdWholeProjectRefactorer>;
  UsedExtensionsFinder: Class<gdUsedExtensionsFinder>;
  ExtensionAndBehaviorMetadata: Class<gdExtensionAndBehaviorMetadata>;
  ExtensionAndObjectMetadata: Class<gdExtensionAndObjectMetadata>;
  ExtensionAndEffectMetadata: Class<gdExtensionAndEffectMetadata>;
  ExtensionAndInstructionMetadata: Class<gdExtensionAndInstructionMetadata>;
  ExtensionAndExpressionMetadata: Class<gdExtensionAndExpressionMetadata>;
  MetadataProvider: Class<gdMetadataProvider>;
  ExpressionParserDiagnostic: Class<gdExpressionParserDiagnostic>;
  VectorExpressionParserDiagnostic: Class<gdVectorExpressionParserDiagnostic>;
  ExpressionParser2NodeWorker: Class<gdExpressionParser2NodeWorker>;
  ExpressionValidator: Class<gdExpressionValidator>;
  ExpressionCompletionDescription_CompletionKind: Class<ExpressionCompletionDescription_CompletionKind>;
  ExpressionCompletionDescription: Class<gdExpressionCompletionDescription>;
  VectorExpressionCompletionDescription: Class<gdVectorExpressionCompletionDescription>;
  ExpressionCompletionFinder: Class<gdExpressionCompletionFinder>;
  ExpressionNode: Class<gdExpressionNode>;
  UniquePtrExpressionNode: Class<gdUniquePtrExpressionNode>;
  ExpressionParser2: Class<gdExpressionParser2>;
  EventsFunction_FunctionType: Class<EventsFunction_FunctionType>;
  EventsFunction: Class<gdEventsFunction>;
  EventsFunctionsContainer: Class<gdEventsFunctionsContainer>;
  EventsBasedBehavior: Class<gdEventsBasedBehavior>;
  EventsBasedBehaviorsList: Class<gdEventsBasedBehaviorsList>;
  NamedPropertyDescriptorsList: Class<gdNamedPropertyDescriptorsList>;
  EventsFunctionsExtension: Class<gdEventsFunctionsExtension>;
  AbstractFileSystem: Class<gdAbstractFileSystem>;
  AbstractFileSystemJS: Class<gdAbstractFileSystemJS>;
  ProjectResourcesAdder: Class<gdProjectResourcesAdder>;
  ArbitraryEventsWorker: Class<gdArbitraryEventsWorker>;
  EventsParametersLister: Class<gdEventsParametersLister>;
  EventsTypesLister: Class<gdEventsTypesLister>;
  InstructionsTypeRenamer: Class<gdInstructionsTypeRenamer>;
  EventsContext: Class<gdEventsContext>;
  EventsContextAnalyzer: Class<gdEventsContextAnalyzer>;
  ArbitraryResourceWorker: Class<gdArbitraryResourceWorker>;
  ArbitraryResourceWorkerJS: Class<gdArbitraryResourceWorkerJS>;
  ResourcesMergingHelper: Class<gdResourcesMergingHelper>;
  ResourcesRenamer: Class<gdResourcesRenamer>;
  ProjectResourcesCopier: Class<gdProjectResourcesCopier>;
  ResourcesInUseHelper: Class<gdResourcesInUseHelper>;
  LayoutEditorCanvasOptions: Class<gdLayoutEditorCanvasOptions>;
  Point: Class<gdPoint>;
  VectorPoint: Class<gdVectorPoint>;
  Polygon2d: Class<gdPolygon2d>;
  VectorPolygon2d: Class<gdVectorPolygon2d>;
  Sprite: Class<gdSprite>;
  Direction: Class<gdDirection>;
  Animation: Class<gdAnimation>;
  SpriteObject: Class<gdSpriteObject>;
  Vector2f: Class<gdVector2f>;
  VectorVector2f: Class<gdVectorVector2f>;
  TextObject: Class<gdTextObject>;
  TiledSpriteObject: Class<gdTiledSpriteObject>;
  PanelSpriteObject: Class<gdPanelSpriteObject>;
  ShapePainterObject: Class<gdShapePainterObject>;
  TextEntryObject: Class<gdTextEntryObject>;
  ParticleEmitterObject_RendererType: Class<ParticleEmitterObject_RendererType>;
  ParticleEmitterObject: Class<gdParticleEmitterObject>;
  LayoutCodeGenerator: Class<gdLayoutCodeGenerator>;
  BehaviorCodeGenerator: Class<gdBehaviorCodeGenerator>;
  EventsFunctionsExtensionCodeGenerator: Class<gdEventsFunctionsExtensionCodeGenerator>;
  PreviewExportOptions: Class<gdPreviewExportOptions>;
  Exporter: Class<gdExporter>;
  JsCodeEvent: Class<gdJsCodeEvent>;
};