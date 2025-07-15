import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { WebComponent, WebComponentNode } from "./types"
import { v4 as uuidv4 } from "uuid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findNodeById(
  node: WebComponentNode,
  id: string
): WebComponentNode | null {
  if (node.id === id) {
    return node
  }
  for (const child of node.children) {
    const found = findNodeById(child, id)
    if (found) {
      return found
    }
  }
  return null
}

export function findParentById(
  node: WebComponentNode,
  id: string
): WebComponentNode | null {
  for (const child of node.children) {
    if (child.id === id) {
      return node
    }
    const foundParent = findParentById(child, id)
    if (foundParent) {
      return foundParent
    }
  }
  return null
}

export function updateNodeInTree(
  node: WebComponentNode,
  id: string,
  updateFn: (node: WebComponentNode) => WebComponentNode
): WebComponent {
  if (node.id === id) {
    return updateFn(node)
  }
  return {
    ...node,
    children: node.children.map((child) =>
      updateNodeInTree(child, id, updateFn)
    ),
  }
}

export function wrapNodeInTree(
  tree: WebComponent,
  elementId: string,
  newTag: string
): WebComponent | null {
  const parent = findParentById(tree, elementId)
  if (!parent) return null // Can't wrap the root

  const newParent: WebComponentNode = {
    id: uuidv4(),
    tag: newTag,
    attributes: {},
    styles: {},
    children: [],
  }

  const newChildren = parent.children.map((child) => {
    if (child.id === elementId) {
      newParent.children.push(child)
      return newParent
    }
    return child
  })

  return updateNodeInTree(tree, parent.id, (node) => ({
    ...node,
    children: newChildren,
  }))
}

export function unwrapNodeInTree(
  tree: WebComponent,
  elementId: string
): WebComponent | null {
  if (elementId === tree.id) return null // Can't unwrap root
  const nodeToUnwrap = findNodeById(tree, elementId)
  if (!nodeToUnwrap) return null

  const parent = findParentById(tree, elementId)
  if (!parent) return null

  const grandparent = findParentById(tree, parent.id)
  if (!grandparent) return null

  const parentIndex = grandparent.children.findIndex((c) => c.id === parent.id)
  if (parentIndex === -1) return null

  const newChildren = [...grandparent.children]
  const parentChildren = parent.children.map((child) => {
    if (child.id === elementId) {
      return { ...child }
    }
    return child
  })

  newChildren.splice(parentIndex, 1, ...parentChildren)

  return updateNodeInTree(tree, grandparent.id, (node) => ({
    ...node,
    children: newChildren,
  }))
}

function deepCopyAndAssignNewIds(node: WebComponentNode): WebComponentNode {
  const newNode: WebComponentNode = {
    ...node,
    id: uuidv4(),
    children: node.children.map((child) => deepCopyAndAssignNewIds(child)),
  }
  return newNode
}

export function copyNodeInTree(
  tree: WebComponent,
  elementId: string
): WebComponent | null {
  if (elementId === tree.id) {
    // Cannot copy the root node
    return tree
  }

  const parent = findParentById(tree, elementId)
  if (!parent) {
    return tree
  }

  const nodeToCopy = parent.children.find((child) => child.id === elementId)
  if (!nodeToCopy) {
    return tree
  }

  const copiedNode = deepCopyAndAssignNewIds(nodeToCopy)

  const nodeIndex = parent.children.findIndex((child) => child.id === elementId)

  const newChildren = [
    ...parent.children.slice(0, nodeIndex + 1),
    copiedNode,
    ...parent.children.slice(nodeIndex + 1),
  ]

  return updateNodeInTree(tree, parent.id, (node) => ({
    ...node,
    children: newChildren,
  }))
}

export function deleteNodeInTree(
  tree: WebComponent,
  elementId: string
): WebComponent | null {
  if (elementId === tree.id) {
    // Cannot delete the root node
    return tree
  }

  const parent = findParentById(tree, elementId)
  if (!parent) {
    return tree
  }

  const newChildren = parent.children.filter((child) => child.id !== elementId)

  return updateNodeInTree(tree, parent.id, (node) => ({
    ...node,
    children: newChildren,
  }))
}
