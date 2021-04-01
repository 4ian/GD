// @flow
import * as React from 'react';
import { mapVector } from '../../../../Utils/MapFor';
import useForceUpdate from '../../../../Utils/UseForceUpdate';

const styles = {
  container: {
    position: 'relative',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  vertexCircle: {
    cursor: 'move',
  },
};

type Props = {|
  polygons: gdVectorPolygon2d,
  isDefaultBoundingBox: boolean,
  imageWidth: number,
  imageHeight: number,
  imageZoomFactor: number,
  onPolygonsUpdated: () => void,
|};

const CollisionMasksPreview = (props: Props) => {
  const svgRef = React.useRef<React.ElementRef<'svg'> | null>(null);
  const [draggedVertex, setDraggedVertex] = React.useState<gdVector2f | null>(
    null
  );

  const {
    polygons,
    imageZoomFactor,
    imageHeight,
    imageWidth,
    isDefaultBoundingBox,
  } = props;

  const forceUpdate = useForceUpdate();

  const onStartDragVertex = (vertex: gdVector2f) => {
    if (draggedVertex) return;
    setDraggedVertex(vertex);
  };

  const onEndDragVertex = () => {
    const draggingWasDone = !!draggedVertex;
    if (draggingWasDone) props.onPolygonsUpdated();
    setDraggedVertex(null);
  };

  /**
   * Move a vertex with the mouse. A similar dragging implementation is done in
   * PointsPreview (but with div and img elements).
   *
   * TODO: This could be optimized by avoiding the forceUpdate (not sure if worth it though).
   */
  const onPointerMove = (event: any) => {
    if (!draggedVertex || !svgRef.current) return;

    // $FlowExpectedError Flow doesn't have SVG typings yet (@facebook/flow#4551)
    const pointOnScreen = svgRef.current.createSVGPoint();
    pointOnScreen.x = event.clientX;
    pointOnScreen.y = event.clientY;
    // $FlowExpectedError Flow doesn't have SVG typings yet (@facebook/flow#4551)
    const screenToSvgMatrix = svgRef.current.getScreenCTM().inverse();
    const pointOnSvg = pointOnScreen.matrixTransform(screenToSvgMatrix);

    draggedVertex.set_x(pointOnSvg.x / imageZoomFactor);
    draggedVertex.set_y(pointOnSvg.y / imageZoomFactor);
    forceUpdate();
  };

  const renderBoundingBox = () => {
    return (
      <polygon
        fill="rgba(255,0,0,0.2)"
        stroke="rgba(255,0,0,0.5)"
        strokeWidth={1}
        fillRule="evenodd"
        points={`0,0 ${imageWidth * imageZoomFactor},0 ${imageWidth *
          imageZoomFactor},${imageHeight * imageZoomFactor} 0,${imageHeight *
          imageZoomFactor}`}
      />
    );
  };

  const renderPolygons = () => {
    return (
      <React.Fragment>
        {mapVector(polygons, (polygon, i) => {
          const vertices = polygon.getVertices();
          return (
            <polygon
              key={`polygon-${i}`}
              fill="rgba(255,0,0,0.2)"
              stroke="rgba(255,0,0,0.5)"
              strokeWidth={1}
              fillRule="evenodd"
              points={mapVector(
                vertices,
                (vertex, j) =>
                  `${vertex.get_x() * imageZoomFactor},${vertex.get_y() *
                    imageZoomFactor}`
              ).join(' ')}
            />
          );
        })}
        {mapVector(polygons, (polygon, i) => {
          const vertices = polygon.getVertices();
          return mapVector(vertices, (vertex, j) => (
            <circle
              onPointerDown={() => onStartDragVertex(vertex)}
              key={`polygon-${i}-vertex-${j}`}
              fill="rgba(255,0,0,0.75)"
              strokeWidth={1}
              cx={vertex.get_x() * imageZoomFactor}
              cy={vertex.get_y() * imageZoomFactor}
              r={5}
              style={styles.vertexCircle}
            />
          ));
        })}
      </React.Fragment>
    );
  };

  return (
    <svg
      onPointerMove={onPointerMove}
      onPointerUp={onEndDragVertex}
      width={imageWidth * imageZoomFactor}
      height={imageHeight * imageZoomFactor}
      style={styles.svg}
      ref={svgRef}
    >
      {isDefaultBoundingBox && renderBoundingBox()}
      {!isDefaultBoundingBox && renderPolygons()}
    </svg>
  );
};

export default CollisionMasksPreview;
