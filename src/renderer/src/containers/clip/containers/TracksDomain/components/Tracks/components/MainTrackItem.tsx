// import clipStore from '@renderer/src/stores/clipStore'
// import { DRAGGING_PREVIEW_CELL_ID, EDragType, TRACK_HEIGHT } from '@renderer/src/utils/dragUtils'
// import CellItem from './CellItem'
// import { useDrop } from 'react-dnd'
// import { useMemo } from 'react'

// interface IMainTrackItemProps {
//   trackId: string
// }

// const MainTrackItem = ({ trackId }: IMainTrackItemProps) => {
//   const trackData = clipStore((state) => state.tracks[0])
//   const cells = clipStore((state) => state.cells)
//   const trackCells = useMemo(
//     () => trackData && trackData.cellIds.map((cellId) => cells[cellId]),
//     [trackData, cells]
//   )

//   const [{ isOverCurrent, clientOffset, sourceClientOffset, itemType }, dropper] = useDrop(() => ({
//     accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
//     collect: (monitor) => ({
//       isOverCurrent: monitor.isOver({ shallow: true }),
//       clientOffset: monitor.getClientOffset(),
//       sourceClientOffset: monitor.getSourceClientOffset(),
//       itemType: monitor.getItemType()
//     })
//   }))

//   const trackSortedCells = useMemo(() => {
//     const cells = (trackCells || []).slice()
//     if (isOverCurrent) {
//       const left = itemType === EDragType.CELL_ITEM ? sourceClientOffset?.x : clientOffset?.x
//       cells.push({ width: 200, cellId: DRAGGING_PREVIEW_CELL_ID, left: left || 0, trackId: '' })
//     }
//     return cells.sort((a, b) => a.left - b.left)
//   }, [isOverCurrent, trackCells, itemType, sourceClientOffset, clientOffset])

//   return (
//     <div
//       ref={dropper}
//       data-track-id={trackId}
//       data-type={EDragType.TRACK_ITEM}
//       data-index={0}
//       style={{ height: TRACK_HEIGHT }}
//       className="w-full bg-blue-500 rounded-[6px] flex"
//     >
//       {trackSortedCells.map((cell) => (
//         <CellItem
//           key={cell.cellId}
//           cellId={cell.cellId}
//           style={{ position: 'static' }}
//           inMainTrack={true}
//           propsCellData={cell}
//         />
//       ))}
//     </div>
//   )
// }

// export default MainTrackItem
