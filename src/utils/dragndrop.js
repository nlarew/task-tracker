// import React, { useState, useEffect, useRef } from "react";
// import { motion, useMotionValue, Transition, ResolveLayoutTransition } from "framer-motion";
// import { clamp, distance } from "@popmotion/popcorn";
// import move from "array-move";


// type DraggableSetPosition = (i: number, offset: Position) => void;
// type DraggableMoveItem = (i: number, dragOffset: number) => void;

// export function useDraggableList<T>(items: Array<T>): [Array<T>, DraggableStateControls] {
//   const [list, setList] = useState(items);
//   useEffect(() => {
//     setList(items);
//   }, [items]);

//   // We need to collect an array of height and position data for all of this component's
//   // `Item` children, so we can later us that in calculations to decide when a dragging
//   // `Item` should swap places with its siblings.
//   const positions = useRef<Position[]>([]).current;
//   const setPosition: DraggableSetPosition = (i: number, offset: Position) =>
//     (positions[i] = offset);

//   // Find the ideal index for a dragging item based on its position in the array, and its
//   // current drag offset. If it's different to its current index, we swap this item with that
//   // sibling.
//   const moveItem: DraggableMoveItem = (i: number, dragOffset: number) => {
//     const targetIndex = findIndex(i, dragOffset, positions);
//     if (targetIndex !== i) setList(move(list, i, targetIndex));
//   };

//   return [list, { setPosition, moveItem }];
// }

// interface DraggableStateControls {
//   setPosition: DraggableSetPosition;
//   moveItem: DraggableMoveItem;
// }
// interface DraggableConfig {
//   whileHover: {};
//   whileTap: {};
//   drag: boolean | "y" | "x";
//   dragConstraints: {};
//   dragElastic: number;
//   onDrag: (event: any, info: { point: any }) => void;
//   onDragStart: (event: any, info: { point: any }) => void;
//   onDragEnd: (event: any, info: { point: any }) => void;
//   positionTransition: (e: { delta: any }) => Transition | boolean | ResolveLayoutTransition ;
// }
// interface DraggableProps extends DraggableStateControls, DraggableConfig {
//   index: number;
// }

// type ElementPosition = {
//   offsetHeight: number;
//   offsetTop: number;
// }

// export const Draggable: React.FC<DraggableProps> = ({
//   index,
//   setPosition,
//   moveItem,
//   children,
//   ...config
// }) => {
//   const [isDragging, setIsDragging] = useState(false);

//   // We'll use a `ref` to access the DOM element that the `motion.div` produces.
//   // This will allow us to measure its height and position, which will be useful to
//   // decide when a dragging element should switch places with its siblings.
//   const ref = useRef<ElementPosition>();

//   // By manually creating a reference to `dragOriginY` we can manipulate this value
//   // if the user is dragging this DOM element while the drag gesture is active to
//   // compensate for any movement as the items are re-positioned.
//   const dragOriginY = useMotionValue(0);
//   const dragOriginX = useMotionValue(0);

//   // Update the measured position of the item so we can calculate when we should rearrange.
//   useEffect(() => {
//     const { current } = ref
//     setPosition(index, {
//       height: current?.offsetHeight || 0,
//       top: current?.offsetTop || 0,
//     });
//   });

//   const defaultConfig: DraggableConfig = {
//     whileHover: { scale: 1.03 },
//     whileTap: { scale: 1.12 },
//     drag: "y",
//     dragConstraints: { top: 0, bottom: 0 },
//     dragElastic: 1,
//     onDrag: (e, { point }) => moveItem(index, point.y),
//     onDragStart: () => setIsDragging(true),
//     onDragEnd: () => setIsDragging(false),
//     positionTransition: ({ delta }) => {
//       if (isDragging) {
//         // If we're dragging, we want to "undo" the items movement within the list
//         // by manipulating its dragOriginY. This will keep the item under the cursor,
//         // even though it's jumping around the DOM.
//         dragOriginY.set(dragOriginY.get() + delta.y);
//         dragOriginY.set(dragOriginX.get() + delta.x);
//       }

//       // If `positionTransition` is a function and returns `false`, it's telling
//       // Motion not to animate from its old position into its new one. If we're
//       // dragging, we don't want any animation to occur.
//       return !isDragging;
//     },
//   };
//   const draggableMotionProps: DraggableConfig = { ...defaultConfig, ...config }
//   return (
//     <motion.div
//       ref={ref}
//       initial={false}
//       // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
//       animate={isDragging ? onTop : flat}
//       dragOriginY={dragOriginY}
//       dragOriginX={dragOriginX}
//       {...draggableMotionProps}
//     >
//       {children}
//     </motion.div>
//   );
// };

// // Spring configs
// const onTop = { zIndex: 1 };
// const flat = {
//   zIndex: 0,
//   transition: { delay: 0.3 },
// };

// // find-index.ts
// export interface Position {
//   top: number;
//   height: number;
// }

// // Prevent rapid reverse swapping
// const buffer = 5;

// export const findIndex = (
//   i: number,
//   yOffset: number,
//   positions: Position[]
// ) => {
//   let target = i;
//   const { top, height } = positions[i];
//   const bottom = top + height;

//   // If moving down
//   if (yOffset > 0) {
//     const nextItem = positions[i + 1];
//     if (nextItem === undefined) return i;

//     const swapOffset =
//       distance(bottom, nextItem.top + nextItem.height / 2) + buffer;
//     if (yOffset > swapOffset) target = i + 1;

//     // If moving up
//   } else if (yOffset < 0) {
//     const prevItem = positions[i - 1];
//     if (prevItem === undefined) return i;

//     const prevBottom = prevItem.top + prevItem.height;
//     const swapOffset = distance(top, prevBottom - prevItem.height / 2) + buffer;
//     if (yOffset < -swapOffset) target = i - 1;
//   }

//   return clamp(0, positions.length, target);
// };
