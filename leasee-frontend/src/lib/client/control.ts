
export function getAttributeInTree(el: HTMLElement, attribute: string) {
  while (el.parentElement !== null) {
    if (el.hasAttribute(attribute)) {
      return el.getAttribute(attribute);
    }
    el = el.parentElement;
  }
  return null;
}

export function getNumberAttributeInTree(el: HTMLElement, attribute: string) {
  let val = getAttributeInTree(el, attribute);
  if (val !== null) {
    return parseInt(val);
  }
  return val;
}


export function getElementsFromSelection(selection: Selection | null) {
  if (!selection || selection.rangeCount === 0 || selection.toString().length === 0) {
    return [ ];
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
  // Get wrapper just to get position of top row
  let currentNode: Node | null;
  let rootNode: HTMLElement | null;
  if (range.commonAncestorContainer instanceof HTMLElement) {
    rootNode = range.commonAncestorContainer;
  } else {
    rootNode = range.commonAncestorContainer.parentElement;
  }
  if (!rootNode) return [];
  if (getAttributeInTree(rootNode, "data-selectable") === null) {
    return [];
  }
  let selectedNodes: HTMLElement[] = []; 
  while (currentNode = nodeIterator.nextNode()) {
    if (currentNode && currentNode !== range.commonAncestorContainer) {
      if (currentNode instanceof HTMLElement) {
        selectedNodes.push(currentNode);
      }
    }
  }

  // Check if the selection is within a single element
  if (
    elements.length === 0 &&
    range.startContainer.parentNode === range.endContainer.parentNode) 
  {
    if (range.startContainer.parentNode instanceof HTMLElement) {
      selectedNodes.push(range.startContainer.parentNode);
    }
  }
  return selectedNodes;
}

export async function onClick(e: MouseEvent) {

}


export async function tryParseSelection(){
  let selection = document.getSelection();
  let elements = getElementsFromSelection(selection);
  if (elements.length === 0 || selection === null) {
    return;
  }
  
}



export async function onMouseUp(e: MouseEvent) {
}