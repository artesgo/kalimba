// export function playback(node) {
//     let y;
//     function handlePlay(_y: number) {
// 		y = y;
// 		node.dispatchEvent(new CustomEvent('playstart', {
// 			detail: { y }
// 		}));
//     }

//     function handlePause(_y: number) {
// 		y = y;
// 		node.dispatchEvent(new CustomEvent('playpause', {
// 			detail: { y }
//         }));
//     }

//     function handleStop(_y: number) {
// 		y = y;
// 		node.dispatchEvent(new CustomEvent('playstop', {
// 			detail: { y }
// 		}));
//     }

// 	return {
// 		destroy() {
// 			node.removeEventListener('mousedown', handleMousedown);
// 		}
// 	};
// }