import HighlightActions from "$lib/components/HighlightActions.svelte";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { Highlight } from "./models/highlight";



export function getPageLayout(
  page: PDFPageProxy,
  width: number,
  height: number,
  upscale: number = 1.25) 
{
  const devicePixelRatio = upscale * (window.devicePixelRatio || 1);
  let docViewport = page.getViewport({ scale: 1.0 });
  // Change scale based on $viewport and doc viewport
  let sx = width / docViewport.width;
  let sy = height / docViewport.height;
  let scale = Math.min(sx, sy);
  
  let viewport = page.getViewport({
    scale: scale * devicePixelRatio
  })
  return {viewport, scale};
}

export function getElementsFromSelection(selection: Selection, resourceId: string, pageIdx: number) {
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  let range = selection.getRangeAt(0);
  let elements: any[] = [];
  let nodeIterator = document.createNodeIterator(
    range.commonAncestorContainer,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: function(node) {
        return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );
  
  const highlight = new Highlight({
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    text: selection.toString(),
    resourceId,
    pageIdx
  })


  const addElement = (element: HTMLElement) => {
    let idx = getChildIndex(element);
    if (idx === -1) return;
    highlight.rowIdxs.push(idx);
    elements.push(element)
  }
  // Get wrapper just to get position of top row
  let topRow = range.startContainer.parentElement as HTMLElement;
  let currentNode: Node | null;
  while (currentNode = nodeIterator.nextNode()) {
    if (currentNode && currentNode !== range.commonAncestorContainer) {
      if (currentNode instanceof HTMLElement) {
        addElement(currentNode);
      }
    }
  }

  // Check if the selection is within a single element
  if (elements.length === 0 && range.startContainer.parentNode === range.endContainer.parentNode) {
    if (range.startContainer.parentNode instanceof HTMLElement) {
      addElement(range.startContainer.parentNode)
    }
  }
  const container = document.createElement('div');
  const rect = topRow.getBoundingClientRect();
  let offset = range.startOffset / topRow.textContent!.length;
  offset = offset * rect.width;
  document.body.appendChild(container);
  const actionsEl = new HighlightActions({
    target: container,
    props: {
      highlight,
    }
  });
  actionsEl.$on("destroy", (e) => {
    actionsEl.$destroy();
  })
  container.style.position = "absolute";
  container.style.left = `${rect.left + offset}px`;
  container.style.top = `${rect.top}px`;
  return actionsEl;
}

export function createFloatingContainer(anchor: HTMLElement){
  const container = document.createElement('div');
  const rect = anchor.getBoundingClientRect();
  document.body.appendChild(container);
  container.style.position = "absolute";
  container.style.left = `${rect.left}px`;
  container.style.top = `${rect.top}px`;
  return container;
}



function getChildIndex(element: HTMLElement): number {
  if (!element.dataset.childIdx) return -1;
  return parseInt(element.dataset.childIdx, 10);
}


