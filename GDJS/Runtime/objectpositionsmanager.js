// @ts-check

/**
 * Represents the coordinates, AABB and hitboxes of an object.
 *
 * @typedef {Object} ObjectPosition
 * @property {ObjectWithCoordinatesInterface} object
 * @property {number} objectId
 * @property {number} objectNameId
 * @property {number} x
 * @property {number} y
 * @property {number} centerX
 * @property {number} centerY
 * @property {gdjs.Polygon[]} hitboxes
 * @property {AABB} aabb
 */

/**
 * Represents the updates to do to coordinates, AABB and hitboxes of an object.
 *
 * @typedef {Object} ObjectPositionCoordinatesUpdate
 * @property {number} objectId
 * @property {number} x
 * @property {number} y
 */

/**
 * The interface for an object with coordinates that can be
 * used in a gdjs.ObjectPositionsManager.
 *
 * This interface is there for easing testing. In practice,
 * we use gdjs.RuntimeObject (which satisfies this interface)
 * in the game engine.
 *
 * @typedef ObjectWithCoordinatesInterface
 * @property {number} id
 * @property {() => number} getNameId
 * @property {() => number} getX
 * @property {() => number} getY
 * @property {() => number} getDrawableX
 * @property {() => number} getDrawableY
 * @property {() => number} getCenterX
 * @property {() => number} getCenterY
 * @property {() => gdjs.Polygon[]} getHitBoxes
 * @property {() => AABB} getAABB
 * @property {(number) => void} setX
 * @property {(number) => void} setY
 */

/**
 * Keep reference to object positions without storing them in a spatial data structure.
 * This provides no optimization when searching for objects in an area (though there is still
 * a basic AABB overlap test), but calls to `load`/`remove` are faster than with a spatial
 * data structure.
 *
 * @class
 */
gdjs.ListObjectPositionsContainer = function() {
  /**
   * A reference to the map containing all ObjectPositions.
   * @type {Object.<number, ObjectPosition>}
   */
  this._objectPositions = {};
};

/**
 * Search an area and returns the list of {@link ObjectPosition}.
 * Only object positions with ids in the `objectIdsSet` will be returned.
 *
 * @param {{minX: number, minY: number, maxX: number, maxY: number}} searchArea
 * @param {ObjectIdsSet} objectIdsSet
 * @returns {ObjectPosition[]}
 */
gdjs.ListObjectPositionsContainer.prototype.search = function(
  searchArea,
  objectIdsSet
) {
  /** @type {Array<ObjectPosition>} */
  var result = [];
  for (var objectId in objectIdsSet.items) {
    var objectPosition = this._objectPositions[objectId];

    // It is not guaranteed that the objectIdsSet contains ids
    // that are stored in this gdjs.ListObjectPositionsContainer!
    if (!objectPosition) continue;

    // Even if there is no spatial data structure being used,
    // do a quick AABB overlap check.
    if (
      objectPosition.aabb.max[0] < searchArea.minX ||
      objectPosition.aabb.max[1] < searchArea.minY ||
      objectPosition.aabb.min[0] > searchArea.maxX ||
      objectPosition.aabb.min[1] > searchArea.maxY
    ) {
      // AABB are not overlapping, discard this object position.
    } else {
      result.push(objectPosition);
    }
  }

  return result;
};

/**
 * Add a list of {@link ObjectPosition} to the container.
 * @param {ObjectPosition[]} objectPositions
 */
gdjs.ListObjectPositionsContainer.prototype.load = function(objectPositions) {
  for(var i = 0;i<objectPositions.length;i++) {
    var objectPosition = objectPositions[i];
    this._objectPositions[objectPosition.objectId] = objectPosition;
  }
};

/**
 * Remove an {@link ObjectPosition} from the container.
 * @param {ObjectPosition} objectPosition
 */
gdjs.ListObjectPositionsContainer.prototype.remove = function(
  objectPosition
) {
  delete this._objectPositions[objectPosition.objectId];
};

/**
 * Store object positions in a RTree, allowing for a fast `search` in exchange for
 * a more complex `load`/`remove`.
 * @class
 */
gdjs.RTreeObjectPositionsContainer = function() {
  // TODO: update RBush to avoid using eval-like Function.
  // @ts-ignore - rbush is not typed
  this._rbush = new rbush(9, [
    '.aabb.min[0]',
    '.aabb.min[1]',
    '.aabb.max[0]',
    '.aabb.max[1]',
  ]);
};

/**
 * Search an area and returns the list of {@link ObjectPosition}.
 * Only object positions with ids in the `objectIdsSet` will be returned.
 *
 * @param {{minX: number, minY: number, maxX: number, maxY: number}} searchArea The area to search
 * @param {ObjectIdsSet} objectIdsSet The ids of objects to filter the results with.
 * @returns {ObjectPosition[]}
 */
gdjs.RTreeObjectPositionsContainer.prototype.search = function(
  searchArea,
  objectIdsSet
) {
  /** @type {ObjectPosition[]} */
  var objectPositions = this._rbush.search(searchArea);

  // Filter the RBush results to keep only the object from the set. This is important
  // because the RBush will return *all* object positions corresponding to the search.
  var filteredObjectPositions = [];
  for (var i = 0; i < objectPositions.length; ++i) {
    var objectPosition = objectPositions[i];
    if (objectIdsSet.items[objectPosition.objectId]) {
      filteredObjectPositions.push(objectPosition);
    }
  }

  return filteredObjectPositions;
};

/**
 * Add a list of {@link ObjectPosition} to the container.
 * @param {ObjectPosition[]} objectPositions
 */
gdjs.RTreeObjectPositionsContainer.prototype.load = function(objectPositions) {
  this._rbush.load(objectPositions);
};

/**
 * Remove an {@link ObjectPosition} from the container.
 * @param {ObjectPosition} objectPosition
 */
gdjs.RTreeObjectPositionsContainer.prototype.remove = function(objectPosition) {
  this._rbush.remove(objectPosition);
};

/**
 * Store the coordinates, AABB and hitboxes of objects of a scene, and
 * allow to query objects near a position/near another object, detect
 * collisions and separate colliding objects.
 *
 * Internally, object positions are stored into a spatial data structure.
 * This allow for fast queries/collision handling of objects.
 *
 * @class gdjs.ObjectPositionsManager
 */
gdjs.ObjectPositionsManager = function() {
  /** @type {Object.<number, ObjectWithCoordinatesInterface>} */
  this._dirtyCoordinatesObjects = {};

  /** @type {Object.<number, ObjectWithCoordinatesInterface>} */
  this._dirtyObjects = {};

  /** @type {Object.<number, boolean>} */
  this._removedObjectIdsSet = {};

  this._objectPositionsContainers = {};

  /**
   * A map containing all ObjectPosition handled by the manager (i.e:
   * all the objects of the scene), keyed by their object id.
   * @type {Object.<number, ObjectPosition>}
   */
  this._allObjectPositions = {};

  /** @type {?gdjs.Profiler} */
  this._profiler = null;
};

gdjs.ObjectPositionsManager._statics = {
  /**
   * A map containing all `ObjectPosition`s to be re-insert in the spatial data structure
   * just after being removed in `update`. They are keyed by `objectNameId`, so that
   * they can all be inserted at once (bulk insertion).
   *
   * Storing this is an *optimization* to avoid deleting and re-creating this object during
   * every call to `update` (avoid creating garbage).
   * Don't use this outside of `update`.
   *
   * @type Object.<string, ObjectPosition[]>
   */
  bulkObjectPositionUpdates: {},
};

/**
 * Set the profiler used to report counters of this ObjectPositionsManager.
 * @param {?gdjs.Profiler} profiler The profiler to use, or null to use none.
 */
gdjs.ObjectPositionsManager.prototype.setProfiler = function(profiler) {
  this._profiler = profiler;
};

/**
 * Tool function to move an ObjectPosition, and update the associated object coordinates.
 *
 * @param {ObjectPosition} objectPosition
 * @param {number} deltaX The delta to apply on X axis
 * @param {number} deltaY The delta to apply on Y axis
 */
gdjs.ObjectPositionsManager._moveObjectPosition = function(
  objectPosition,
  deltaX,
  deltaY
) {
  objectPosition.x += deltaX;
  objectPosition.y += deltaY;
  objectPosition.centerX += deltaX;
  objectPosition.centerY += deltaY;
  objectPosition.aabb.min[0] += deltaX;
  objectPosition.aabb.min[1] += deltaY;
  objectPosition.aabb.max[0] += deltaX;
  objectPosition.aabb.max[1] += deltaY;
  for (var i = 0; i < objectPosition.hitboxes.length; i++) {
    objectPosition.hitboxes[i].move(deltaX, deltaY);
  }

  // Update the object represented by this position. Note that this will potentially
  // mark the object as being "dirty" (see `markObjectAsDirty`), which is sub-optimal
  // but ok.
  objectPosition.object.setX(objectPosition.x);
  objectPosition.object.setY(objectPosition.y);
};

gdjs.ObjectPositionsManager.prototype.getCounters = function() {
  return {
    objectPositionContainersCount: Object.keys(this._objectPositionsContainers)
      .length,
    allObjectPositionsCount: Object.keys(this._allObjectPositions).length,
  };
};

/**
 * Get the spatial data structure handling objects with the given name identifier.
 * @param {number | string} nameId The name identifier of the objects.
 */
gdjs.ObjectPositionsManager.prototype._getObjectPositionsContainer = function(
  nameId
) {
  var objectPositionsContainer = this._objectPositionsContainers[nameId];
  if (objectPositionsContainer) return objectPositionsContainer;

  // TODO: make this configurable
  // return (this._objectPositionsContainers[
  //   nameId
  // ] = new gdjs.ListObjectPositionsContainer());

  return (this._objectPositionsContainers[
    nameId
  ] = new gdjs.RTreeObjectPositionsContainer());
};

// Object tracking methods:

/**
 * Mark an object as created, so that the ObjectPositionsManager know that
 * the associated coordinates/AABB/hitboxes must be updated.
 * @param {ObjectWithCoordinatesInterface} object
 */
gdjs.ObjectPositionsManager.prototype.markObjectAsCreated = function(object) {
  // If the object was waiting in the "removed set", to be deleted from the spatial data structure,
  // remove it from the "removed set".
  delete this._removedObjectIdsSet[object.id];
  this._dirtyObjects[object.id] = object;
};

/**
 * Mark an object as removed. It should be removed from the spatial data structure and its
 * position/AABB/hitboxes removed from memory.
 * @param {ObjectWithCoordinatesInterface} object
 */
gdjs.ObjectPositionsManager.prototype.markObjectAsRemoved = function(object) {
  this._removedObjectIdsSet[object.id] = true;
};

/**
 * Mark an object as dirty, after it has moved, AABB or hitboxes were changed.
 * @param {ObjectWithCoordinatesInterface} object
 */
gdjs.ObjectPositionsManager.prototype.markObjectAsDirty = function(object) {
  this._dirtyObjects[object.id] = object;
};

/**
 * Create an ObjectPosition from an ObjectWithCoordinatesInterface.
 * Only used internally or for tests.
 *
 * @param {ObjectWithCoordinatesInterface} object
 * @returns {ObjectPosition}
 */
gdjs.ObjectPositionsManager.objectWithCoordinatesToObjectPosition = function(
  object
) {
  return {
    object: object,
    objectId: object.id,
    objectNameId: object.getNameId(),
    x: object.getX(),
    y: object.getY(),
    centerX: object.getDrawableX() + object.getCenterX(),
    centerY: object.getDrawableY() + object.getCenterY(),
    hitboxes: object.getHitBoxes(),
    aabb: object.getAABB(),
  };
};

/**
 * Update the ObjectPositionsManager with the latest changes on objects.
 * This will query the objects for their coordinates, AABB and hitboxes
 * if they have been marked as dirty - and update them in the spatial data structure.
 * This will also remove objects marked as removed (unless an object with the same id
 * has been recreated, in which case the spatial data structure will update it).
 */
gdjs.ObjectPositionsManager.prototype.update = function() {
  if (this._profiler) {
    var startTime = performance.now();
  }

  // "Update" all objects that have been moved by removing them
  // and adding them again immediately after in the spatial data structure.
  for (var objectId in this._dirtyObjects) {
    var objectPosition = this._allObjectPositions[objectId];
    if (objectPosition) {
      this._getObjectPositionsContainer(objectPosition.objectNameId).remove(
        objectPosition
      );
    }
  }

  // Prepare the batched "update" insertions.
  var bulkObjectPositionUpdates =
    gdjs.ObjectPositionsManager._statics.bulkObjectPositionUpdates;
  for (var key in bulkObjectPositionUpdates) {
    // Clear the updates (we avoid recreating a temporary object).
    bulkObjectPositionUpdates[key].length = 0;
  }

  for (var objectId in this._dirtyObjects) {
    var object = this._dirtyObjects[objectId];

    // Note that it's possible for the objectNameId to have changed
    // (in case of object deletion and creation of another one with a same id)
    var objectPosition = (this._allObjectPositions[
      objectId
    ] = gdjs.ObjectPositionsManager.objectWithCoordinatesToObjectPosition(
      object
    ));

    // Don't use `insert`. Instead, batch the updates, doing
    // all of them at once using `load` (see later).
    var objectNameId = object.getNameId();
    bulkObjectPositionUpdates[objectNameId] =
      bulkObjectPositionUpdates[objectNameId] || [];
    bulkObjectPositionUpdates[objectNameId].push(objectPosition);
  }

  // Use "load" instead of multiple `insert`s, as bulk insertion leads
  // to better insertion and query performance (internally if the number
  // of objects loaded is too small, it will go back to multiple `insert`s)
  for (var key in bulkObjectPositionUpdates) {
    this._getObjectPositionsContainer(key).load(bulkObjectPositionUpdates[key]);
  }

  // Clear the set of dirty objects.
  for (var objectId in this._dirtyObjects) {
    delete this._dirtyObjects[objectId];
  }

  // Handle removed objects *after* handling dirty objects.
  // This is because an object can be marked for deletion, then moved
  // before the end of the frame.
  for (var objectId in this._removedObjectIdsSet) {
    var objectPosition = this._allObjectPositions[objectId];
    if (objectPosition) {
      this._getObjectPositionsContainer(objectPosition.objectNameId).remove(
        objectPosition
      );
    }

    delete this._allObjectPositions[objectId];
    delete this._removedObjectIdsSet[objectId];
  }

  if (this._profiler) {
    var endTime = performance.now();
    this._profiler.incrementCallCounter('ObjectPositionsManager.update');
    this._profiler.addTime(
      'ObjectPositionsManager.update',
      endTime - startTime
    );
  }
};

// Query methods:

/**
 * Returns a set containing all the name identifiers corresponding to the object
 * passed (as a set of object ids).
 * @param {ObjectIdsSet} objectIdsSet The set of object identifiers
 * @returns {Object.<number, boolean>} The set of name identifiers
 */
gdjs.ObjectPositionsManager.prototype._getAllObjectNameIds = function(
  objectIdsSet
) {
  /** @type {Object.<number, boolean>} */
  var objectNameIdsSet = {};

  for (var objectId in objectIdsSet.items) {
    var objectPosition = this._allObjectPositions[objectId];

    // Some IDs can be missing in the map of all object positions
    // (e.g: a deleted object that is still manipulated by GDevelop events).
    // Ignore these IDs.
    if (objectPosition) {
      objectNameIdsSet[objectPosition.objectNameId] = true;
    }
  }

  return objectNameIdsSet;
};

/**
 * Tool function to get squared distance between the centers of two ObjectPositions
 *
 * @param {ObjectPosition} objectPosition1
 * @param {ObjectPosition} objectPosition2
 */
gdjs.ObjectPositionsManager._getObjectPositionsSquaredDistance = function(
  objectPosition1,
  objectPosition2
) {
  return (
    (objectPosition2.centerX - objectPosition1.centerX) *
      (objectPosition2.centerX - objectPosition1.centerX) +
    (objectPosition2.centerY - objectPosition1.centerY) *
      (objectPosition2.centerY - objectPosition1.centerY)
  );
};

/**
 * @param {ObjectIdsSet} object1IdsSet
 * @param {ObjectIdsSet} object2IdsSet
 * @param {number} distance
 * @param {boolean} inverted
 */
gdjs.ObjectPositionsManager.prototype.distanceTest = function(
  object1IdsSet,
  object2IdsSet,
  distance,
  inverted
) {
  this.update();

  var squaredDistance = distance * distance;
  var isTrue = false;
  var pickedObject1IdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();
  var pickedObject2IdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();

  // Get the set of all objectNameIds for the second list, to know in which
  // RBush we have to search them.
  var object2NameIdsSet = this._getAllObjectNameIds(object2IdsSet);

  for (var object1Id in object1IdsSet.items) {
    var atLeastOneObject = false;

    var object1Position = this._allObjectPositions[object1Id];

    // Some IDs can be missing in the map of all object positions
    // (e.g: a deleted object that is still manipulated by GDevelop events).
    // Ignore these IDs.
    if (!object1Position) continue;

    var searchArea = {
      minX: object1Position.aabb.min[0] - distance,
      minY: object1Position.aabb.min[1] - distance,
      maxX: object1Position.aabb.max[0] + distance,
      maxY: object1Position.aabb.max[1] + distance,
    };

    for (var object2NameId in object2NameIdsSet) {
      /** @type ObjectPosition[] */
      var nearbyObjectPositions = this._getObjectPositionsContainer(
        object2NameId
      ).search(searchArea, object2IdsSet);

      for (var j = 0; j < nearbyObjectPositions.length; ++j) {
        var object2Position = nearbyObjectPositions[j];

        // It's possible that we're testing distance between lists containing the same objects
        if (object2Position.objectId === object1Position.objectId) continue;

        if (
          gdjs.ObjectPositionsManager._getObjectPositionsSquaredDistance(
            object1Position,
            object2Position
          ) < squaredDistance
        ) {
          if (!inverted) {
            isTrue = true;

            pickedObject2IdsSet.items[object2Position.objectId] = true;
            pickedObject1IdsSet.items[object1Id] = true;
          }

          atLeastOneObject = true;
        }
      }
    }

    if (!atLeastOneObject && inverted) {
      // This is the case when, for example, the object is *not* overlapping *any* other object.
      isTrue = true;
      pickedObject1IdsSet.items[object1Id] = true;
      // In case of inverted === true, objects from the second list are not picked.
    }
  }

  // Replace object ids sets by the picked ids
  gdjs.ObjectPositionsManager._replaceObjectIdsSetByAnother(
    object1IdsSet,
    pickedObject1IdsSet
  );
  if (!inverted) {
    gdjs.ObjectPositionsManager._replaceObjectIdsSetByAnother(
      object2IdsSet,
      pickedObject2IdsSet
    );
  }

  return isTrue;
};

/**
 * Test if there is a collision between any of the two hitboxes (any polygon from the first
 * touching any polygon of the second).
 *
 * @param {gdjs.Polygon[]} hitBoxes1
 * @param {gdjs.Polygon[]} hitBoxes2
 * @param {boolean} ignoreTouchingEdges If true, polygons are not considered in collision if only their edges are touching.
 */
gdjs.ObjectPositionsManager.prototype._checkHitboxesCollision = function(
  hitBoxes1,
  hitBoxes2,
  ignoreTouchingEdges
) {
  for (var k = 0, lenBoxes1 = hitBoxes1.length; k < lenBoxes1; ++k) {
    for (var l = 0, lenBoxes2 = hitBoxes2.length; l < lenBoxes2; ++l) {
      if (
        gdjs.Polygon.collisionTest(
          hitBoxes1[k],
          hitBoxes2[l],
          ignoreTouchingEdges
        ).collision
      ) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Check collisions between the specified set of objects, filtering both sets to only
 * keep the object ids that are actually in collision with a member of the other set.
 *
 * If `inverted` is true, only the first set is filtered with the object ids that are NOT
 * in collision with any object of the second set.
 *
 * @param {ObjectIdsSet} object1IdsSet
 * @param {ObjectIdsSet} object2IdsSet
 * @param {boolean} inverted
 * @param {boolean} ignoreTouchingEdges If true, polygons are not considered in collision if only their edges are touching.
 */
gdjs.ObjectPositionsManager.prototype.collisionTest = function(
  object1IdsSet,
  object2IdsSet,
  inverted,
  ignoreTouchingEdges
) {
  this.update();

  var isTrue = false;
  var pickedObject1IdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();
  var pickedObject2IdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();

  // Get the set of all objectNameIds for the second list, to know in which
  // RBush we have to search them.
  var object2NameIdsSet = this._getAllObjectNameIds(object2IdsSet);

  for (var object1Id in object1IdsSet.items) {
    var atLeastOneObject = false;

    var object1Position = this._allObjectPositions[object1Id];

    // Some IDs can be missing in the map of all object positions
    // (e.g: a deleted object that is still manipulated by GDevelop events).
    // Ignore these IDs.
    if (!object1Position) continue;

    var searchArea = {
      minX: object1Position.aabb.min[0],
      minY: object1Position.aabb.min[1],
      maxX: object1Position.aabb.max[0],
      maxY: object1Position.aabb.max[1],
    };

    for (var object2NameId in object2NameIdsSet) {
      /** @type ObjectPosition[] */
      // TODO: don't do it for each object1Id!!
      var nearbyObjectPositions = this._getObjectPositionsContainer(
        object2NameId
      ).search(searchArea, object2IdsSet);

      for (var j = 0; j < nearbyObjectPositions.length; ++j) {
        var object2Position = nearbyObjectPositions[j];

        // It's possible that we're testing collision between lists containing the same objects
        if (object2Position.objectId === object1Position.objectId) continue;

        var hitBoxes1 = object1Position.hitboxes;
        var hitBoxes2 = object2Position.hitboxes;

        if (
          this._checkHitboxesCollision(
            hitBoxes1,
            hitBoxes2,
            ignoreTouchingEdges
          )
        ) {
          if (!inverted) {
            isTrue = true;

            pickedObject2IdsSet.items[object2Position.objectId] = true;
            pickedObject1IdsSet.items[object1Id] = true;
          }

          atLeastOneObject = true;
        }
      }
    }

    if (!atLeastOneObject && inverted) {
      // This is the case when, for example, the object is *not* overlapping *any* other object.
      isTrue = true;
      pickedObject1IdsSet.items[object1Id] = true;
      // In case of inverted === true, objects from the second list are not picked.
    }
  }

  // Replace object ids sets by the picked ids
  gdjs.ObjectPositionsManager._replaceObjectIdsSetByAnother(
    object1IdsSet,
    pickedObject1IdsSet
  );
  if (!inverted) {
    gdjs.ObjectPositionsManager._replaceObjectIdsSetByAnother(
      object2IdsSet,
      pickedObject2IdsSet
    );
  }

  return isTrue;
};

/**
 * Test if there are collisions between any of the two hitboxes (any polygon from the first
 * touching any polygon of the second), and if so update the `moveCoordinates` array with
 * the delta that should be applied to hitboxes to be separated.
 *
 * @param {gdjs.Polygon[]} hitBoxes
 * @param {gdjs.Polygon[]} otherHitBoxes
 * @param {boolean} ignoreTouchingEdges If true, polygons are not considered in collision if only their edges are touching.
 */
gdjs.ObjectPositionsManager._separateHitboxes = function(
  hitBoxes,
  otherHitBoxes,
  ignoreTouchingEdges,
  moveCoordinates
) {
  var moved = false;

  for (var k = 0, lenk = hitBoxes.length; k < lenk; ++k) {
    for (var l = 0, lenl = otherHitBoxes.length; l < lenl; ++l) {
      var result = gdjs.Polygon.collisionTest(
        hitBoxes[k],
        otherHitBoxes[l],
        ignoreTouchingEdges
      );
      if (result.collision) {
        moveCoordinates[0] += result.move_axis[0];
        moveCoordinates[1] += result.move_axis[1];
        moved = true;
      }
    }
  }

  return moved;
};

/**
 * Separate the specified sets of objects.
 *
 * @param {ObjectIdsSet} object1IdsSet
 * @param {ObjectIdsSet} object2IdsSet
 * @param {boolean} ignoreTouchingEdges If true, polygons are not considered in collision if only their edges are touching.
 */
gdjs.ObjectPositionsManager.prototype.separateObjects = function(
  object1IdsSet,
  object2IdsSet,
  ignoreTouchingEdges
) {
  this.update();

  var isTrue = false;

  // Get the set of all objectNameIds for the second list, to know in which
  // RBush we have to search them.
  var object2NameIdsSet = this._getAllObjectNameIds(object2IdsSet);

  /** @type ObjectPositionCoordinatesUpdate[] */
  var objectPositionUpdates = [];

  for (var object1Id in object1IdsSet.items) {
    var moved = false;
    var moveCoordinates = [0, 0];

    var object1Position = this._allObjectPositions[object1Id];

    // Some IDs can be missing in the map of all object positions
    // (e.g: a deleted object that is still manipulated by GDevelop events).
    // Ignore these IDs.
    if (!object1Position) continue;

    var searchArea = {
      minX: object1Position.aabb.min[0],
      minY: object1Position.aabb.min[1],
      maxX: object1Position.aabb.max[0],
      maxY: object1Position.aabb.max[1],
    };

    for (var object2NameId in object2NameIdsSet) {
      /** @type ObjectPosition[] */
      var nearbyObjectPositions = this._getObjectPositionsContainer(
        object2NameId
      ).search(searchArea, object2IdsSet);

      for (var j = 0; j < nearbyObjectPositions.length; ++j) {
        var object2Position = nearbyObjectPositions[j];

        // It's possible that we're testing collision between lists containing the same objects
        if (object2Position.objectId === object1Position.objectId) continue;

        moved =
          gdjs.ObjectPositionsManager._separateHitboxes(
            object1Position.hitboxes,
            object2Position.hitboxes,
            ignoreTouchingEdges,
            moveCoordinates
          ) || moved;
      }
    }

    if (moved) {
      objectPositionUpdates.push({
        objectId: object1Position.objectId,
        x: moveCoordinates[0],
        y: moveCoordinates[1],
      });
    }
  }

  // Apply all new positions at once after all collisions are handled.
  for (var i = 0; i < objectPositionUpdates.length; i++) {
    var objectPositionUpdate = objectPositionUpdates[i];
    var object1Position = this._allObjectPositions[
      objectPositionUpdate.objectId
    ];

    // Some IDs can be missing in the map of all object positions
    // (e.g: a deleted object that is still manipulated by GDevelop events).
    // Ignore these IDs.
    if (object1Position) {
      gdjs.ObjectPositionsManager._moveObjectPosition(
        object1Position,
        objectPositionUpdate.x,
        objectPositionUpdate.y
      );
    }
  }
};

/**
 * Test if the point is inside of the polygons of the hitboxes.
 *
 * @param {gdjs.Polygon[]} hitBoxes
 * @param {number} x X position of the point
 * @param {number} y Y position of the point
 */
gdjs.ObjectPositionsManager._isPointInsideHitboxes = function(hitBoxes, x, y) {
  for (var k = 0, lenk = hitBoxes.length; k < lenk; ++k) {
    if (gdjs.Polygon.isPointInside(hitBoxes[k], x, y)) return true;
  }

  return false;
};

/**
 * Check which of the specified objects are containing one of the specified points inside their hitboxes
 * (or inside their AABB is `accurate` is set to false).
 *
 * If `inverted` is true, the objects which are NOT containing ANY point will be picked.
 *
 * @param {ObjectIdsSet} objectIdsSet The set of object ids to filter
 * @param {number[][]} points Array of point positions (X as first element, Y as second element)
 * @param {boolean} accurate If true, use the hitboxes to check if a point is inside an object
 * @param {boolean} inverted If true, filter to keep only the objects not containing any of the points inside them.
 */
gdjs.ObjectPositionsManager.prototype.pointsTest = function(
  objectIdsSet,
  points,
  accurate,
  inverted
) {
  this.update();

  var isAnyObjectContainingAnyPoint = false;
  var pickedObjectIdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();

  // Get the set of all objectNameIds for the list, to know in which
  // RBush we have to search them.
  var objectNameIdsSet = this._getAllObjectNameIds(objectIdsSet);

  for (var objectNameId in objectNameIdsSet) {
    // Check all points for all object positions
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var searchArea = {
        minX: point[0],
        minY: point[1],
        maxX: point[0],
        maxY: point[1],
      };

      /** @type ObjectPosition[] */
      var nearbyObjectPositions = this._getObjectPositionsContainer(
        objectNameId
      ).search(searchArea, objectIdsSet);

      for (var j = 0; j < nearbyObjectPositions.length; ++j) {
        var objectPosition = nearbyObjectPositions[j];

        var isOnObject =
          !accurate ||
          gdjs.ObjectPositionsManager._isPointInsideHitboxes(
            objectPosition.hitboxes,
            point[0],
            point[1]
          );

        if (isOnObject) {
          if (!inverted) isAnyObjectContainingAnyPoint = true;
          pickedObjectIdsSet.items[objectPosition.objectId] = true;
        }
      }
    }
  }

  if (inverted) {
    // If inverted, remove all object ids that are colliding with a point
    gdjs.ObjectPositionsManager._removeIdsFromObjectIdsSet(
      objectIdsSet,
      pickedObjectIdsSet
    );

    // Return true if there is at least one object not colliding with any point
    return !gdjs.ObjectPositionsManager._isObjectIdsSetEmpty(objectIdsSet);
  } else {
    // Replace object ids sets by the picked ids and return the result
    gdjs.ObjectPositionsManager._replaceObjectIdsSetByAnother(
      objectIdsSet,
      pickedObjectIdsSet
    );
    return isAnyObjectContainingAnyPoint;
  }
};

/**
 * Do an intersection test between hitboxes and a ray.
 *
 * @param {gdjs.Polygon[]} hitBoxes Hitboxes to intersect the ray with
 * @param {number} x X position of the ray starting point
 * @param {number} y Y position of the ray starting point
 * @param {number} endX X position of the ray ending point
 * @param {number} endY Y position of the ray ending point
 * @param {number} maxSqDist Maximum squared distance for the ray intersection (should be the squared distance between start and end points).
 * @param {boolean} inverted true to find the position that is the farthest one intersecting with the ray, false to find the closest.
 * @returns {PolygonRaycastTestResult} The result of the raycasting with the hitboxes.
 */
gdjs.ObjectPositionsManager._raycastAgainstHitboxes = function(
  hitBoxes,
  x,
  y,
  endX,
  endY,
  maxSqDist,
  inverted
) {
  var result = gdjs.ObjectPositionsManager._raycastAgainstHitboxes._result;
  result.collision = false;

  var testSqDist = inverted ? 0 : maxSqDist;

  for (var i = 0; i < hitBoxes.length; i++) {
    var res = gdjs.Polygon.raycastTest(hitBoxes[i], x, y, endX, endY);
    if (res.collision) {
      if (!inverted && res.closeSqDist < testSqDist) {
        testSqDist = res.closeSqDist;
        gdjs.Polygon.raycastTest.copyResultTo(res, result);
      } else if (
        inverted &&
        res.farSqDist > testSqDist &&
        res.farSqDist <= maxSqDist
      ) {
        testSqDist = res.farSqDist;
        gdjs.Polygon.raycastTest.copyResultTo(res, result);
      }
    }
  }

  return result;
};

/** @type PolygonRaycastTestResult */
gdjs.ObjectPositionsManager._raycastAgainstHitboxes._result = {
  collision: false,
  closeX: 0,
  closeY: 0,
  closeSqDist: 0,
  farX: 0,
  farY: 0,
  farSqDist: 0,
};

/**
 * Cast a ray from the start position until the end position.
 *
 * Filter the set of objects to only keep the closest (or farthest, if `inverted` is true)
 * object position, intersecting with the ray, to the starting point.
 * The intersection position of this closest (or farthest) point is stored in `intersectionCoordinates`.
 *
 * @param {ObjectIdsSet} objectIdsSet The set of object ids to intersect the ray with
 * @param {number} x X position of the ray starting point
 * @param {number} y Y position of the ray starting point
 * @param {number} endX X position of the ray ending point
 * @param {number} endY Y position of the ray ending point
 * @param {number[]} intersectionCoordinates The two-elements array where to store the intersection X and Y position
 * @param {boolean} inverted true to find the object that is the farthest one intersecting with the ray, false to find the closest.
 * @returns {boolean} true if an intersection was found (in which case `objectIdsSet` is filtered and `intersectionCoordinates` updated).
 */
gdjs.ObjectPositionsManager.prototype.raycastTest = function(
  objectIdsSet,
  x,
  y,
  endX,
  endY,
  intersectionCoordinates,
  inverted
) {
  this.update();

  /** @type {?number} */
  var matchObjectId = null;
  var maxSqDist = (endX - x) * (endX - x) + (endY - y) * (endY - y);
  var testSqDist = inverted ? 0 : maxSqDist;
  var searchArea = {
    minX: x < endX ? x : endX,
    minY: y < endY ? y : endY,
    maxX: x > endX ? x : endX,
    maxY: y > endY ? y : endY,
  };

  // Get the set of all objectNameIds for the list, to know in which
  // RBush we have to search them.
  var objectNameIdsSet = this._getAllObjectNameIds(objectIdsSet);

  for (var objectNameId in objectNameIdsSet) {
    /** @type ObjectPosition[] */
    var nearbyObjectPositions = this._getObjectPositionsContainer(
      objectNameId
    ).search(searchArea, objectIdsSet);

    for (var j = 0; j < nearbyObjectPositions.length; ++j) {
      var objectPosition = nearbyObjectPositions[j];

      var result = gdjs.ObjectPositionsManager._raycastAgainstHitboxes(
        objectPosition.hitboxes,
        x,
        y,
        endX,
        endY,
        maxSqDist,
        inverted
      );

      if (result.collision) {
        if (!inverted && result.closeSqDist <= testSqDist) {
          testSqDist = result.closeSqDist;
          matchObjectId = objectPosition.objectId;
          intersectionCoordinates[0] = result.closeX;
          intersectionCoordinates[1] = result.closeY;
        } else if (inverted && result.farSqDist >= testSqDist) {
          testSqDist = result.farSqDist;
          matchObjectId = objectPosition.objectId;
          intersectionCoordinates[0] = result.farX;
          intersectionCoordinates[1] = result.farY;
        }
      }
    }
  }

  gdjs.ObjectPositionsManager._clearObjectIdsSet(objectIdsSet);
  if (matchObjectId == null) return false;

  objectIdsSet.items[matchObjectId] = true;
  return true;
};

// Sets utilities:

/**
 * @typedef {Object} ObjectIdsSet
 * @property {Object.<number, boolean>} items
 */

/**
 * Create a new set of object ids.
 *
 * @returns {ObjectIdsSet} A new set.
 */
gdjs.ObjectPositionsManager.makeNewObjectIdsSet = function() {
  return { items: {} };
};

/**
 * Check if the given set is empty.
 *
 * @param {ObjectIdsSet} objectIdsSet The set to check
 */
gdjs.ObjectPositionsManager._isObjectIdsSetEmpty = function(objectIdsSet) {
  // Avoid using Object.keys, we don't care about listing all the elements of the set.
  for (var anyObjectId in objectIdsSet.items) return false;
  return true;
};

/**
 * Clear the set.
 *
 * @param {ObjectIdsSet} objectIdsSet
 */
gdjs.ObjectPositionsManager._clearObjectIdsSet = function(objectIdsSet) {
  // This sends the old set items to the garbage collector, but is much
  // much faster than iterating on all properties and deleting them.
  objectIdsSet.items = {};
};

/**
 * Replace the content of the first set by the second set, making them pointing to the
 * same content in memory. You should discard the second set after.
 *
 * If you modify one of the set, the other one will be changed to! You should
 * discard the second set and not reused it.
 *
 * @param {ObjectIdsSet} objectIdsSet
 * @param {ObjectIdsSet} objectIdsSet2
 */
gdjs.ObjectPositionsManager._replaceObjectIdsSetByAnother = function(
  objectIdsSet,
  objectIdsSet2
) {
  objectIdsSet.items = objectIdsSet2.items;
};

/**
 * Delete any element of the first set that is in the second one.
 *
 * For performance concerns, the second set is assumed to be smaller than the first one (this will
 * work whatever the case, but will be more performant if the second set is smaller).
 *
 * This is actually guaranteed because we only use this function to remove ids from the first set
 * using the second set which was populated while iterating on the first.
 *
 * @param {ObjectIdsSet} objectIdsSet
 * @param {ObjectIdsSet} objectIdsSet2
 */
gdjs.ObjectPositionsManager._removeIdsFromObjectIdsSet = function(
  objectIdsSet,
  objectIdsSet2
) {
  for (var objectId in objectIdsSet2.items) {
    if (objectIdsSet.items[objectId]) {
      delete objectIdsSet.items[objectId];
    }
  }
};

/**
 * Generate a new set of object ids from the lists of objects passed. Useful
 * as gdjs.ObjectPositionsManager only deals with ids for genericity.
 *
 * @param {Hashtable} objectsLists The lists of objects
 * @returns {ObjectIdsSet} A set containing the object ids
 */
gdjs.ObjectPositionsManager.objectsListsToObjectIdsSet = function(
  objectsLists
) {
  /** @type ObjectIdsSet */
  var objectIdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();

  for (var key in objectsLists.items) {
    var list = objectsLists.items[key];
    for (var i = 0; i < list.length; ++i) {
      objectIdsSet.items[list[i].id] = true;
    }
  }

  return objectIdsSet;
};

/**
 * Generate a new set of object ids from the array of object ids.
 *
 * @param {number[]} ids The ids
 * @returns {ObjectIdsSet} A set containing the object ids
 */
gdjs.ObjectPositionsManager.idsArrayToObjectIdsSet = function(ids) {
  /** @type ObjectIdsSet */
  var objectIdsSet = gdjs.ObjectPositionsManager.makeNewObjectIdsSet();

  for (var i = 0; i < ids.length; ++i) {
    objectIdsSet.items[ids[i]] = true;
  }

  return objectIdsSet;
};

/**
 * Remove from the lists of objects any object that is not in the set of object ids.
 * Useful as gdjs.ObjectPositionsManager only deals with ids for genericity, but events
 * are using lists of objects.
 *
 * @param {Hashtable} objectsLists The lists of objects
 * @param {ObjectIdsSet} objectIdsSet A set containing the object ids to keep
 */
gdjs.ObjectPositionsManager.keepOnlyObjectsFromObjectIdsSet = function(
  objectsLists,
  objectIdsSet
) {
  for (var key in objectsLists.items) {
    var list = objectsLists.items[key];
    var finalSize = 0;

    for (var i = 0; i < list.length; ++i) {
      var obj = list[i];
      if (objectIdsSet.items[obj.id]) {
        list[finalSize] = obj;
        finalSize++;
      }
    }

    list.length = finalSize;
  }
};

/**
 * Remove from the lists of objects any object that is not in the sets of object ids, grouped
 * by arbitrary key that are not considered.
 * Useful as gdjs.ObjectPositionsManager only deals with ids for genericity, but events
 * are using lists of objects.
 *
 * @param {Hashtable} objectsLists The lists of objects
 * @param {Object.<string, ObjectIdsSet>} groupedObjectIdsSets A set containing the object ids to keep
 */
gdjs.ObjectPositionsManager.keepOnlyObjectsFromGroupedObjectIdsSets = function(
  objectsLists,
  groupedObjectIdsSets
) {
  for (var key in objectsLists.items) {
    var list = objectsLists.items[key];
    var finalSize = 0;

    for (var i = 0; i < list.length; ++i) {
      var obj = list[i];

      for (var setKey in groupedObjectIdsSets) {
        if (groupedObjectIdsSets[setKey].items[obj.id]) {
          list[finalSize] = obj;
          finalSize++;
          break;
        }
      }
    }

    list.length = finalSize;
  }
};
