"use client"

import { useState } from "react"
import LeftPanel from "@/components/LeftPanel"
import MiddlePanel from "@/components/MiddlePanel"
import RightPanel from "@/components/RightPanel"
import { WebComponent, WebComponentNode } from "@/lib/types"
import {
  findNodeById,
  updateNodeInTree,
  wrapNodeInTree,
  unwrapNodeInTree,
  copyNodeInTree,
} from "../lib/utils"

// Initial state for the web component
const initialComponent: WebComponent = {
  id: "root",
  tag: "div",
  children: [
    {
      id: "1",
      tag: "div",
      children: [
        {
          id: "2",
          tag: "h1",
          children: [],
          attributes: {
            textContent: "Welcome to the Editor",
          },
          styles: {
            color: "#FFFFFF",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            padding: "1rem",
          },
        },
        {
          id: "3",
          tag: "p",
          children: [],
          attributes: {
            textContent:
              "Select an element on the left to start editing its styles.",
          },
          styles: {
            color: "#A0AEC0",
            textAlign: "center",
            marginTop: "0.5rem",
          },
        },
      ],
      attributes: {},
      styles: {
        padding: "2rem",
        backgroundColor: "rgba(31, 41, 55, 1)",
        borderRadius: "0.5rem",
        margin: "2rem",
      },
    },
    {
      id: "4",
      tag: "div",
      children: [
        {
          id: "5",
          tag: "button",
          children: [],
          attributes: {
            textContent: "Click Me!",
          },
          styles: {
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
          },
        },
      ],
      attributes: {},
      styles: {
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
      },
    },
  ],
  attributes: {},
  styles: {
    fontFamily: "sans-serif",
    backgroundColor: "#111827",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}

export default function Home() {
  const [componentTree, setComponentTree] =
    useState<WebComponent>(initialComponent)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  )

  const selectedNode = selectedElementId
    ? findNodeById(componentTree, selectedElementId)
    : null

  const handleStyleChange = (
    elementId: string,
    newStyles: React.CSSProperties
  ) => {
    const newTree = updateNodeInTree(componentTree, elementId, (node) => ({
      ...node,
      styles: { ...node.styles, ...newStyles },
    }))
    setComponentTree(newTree)
  }

  const handleAttributeChange = (
    elementId: string,
    newAttributes: { [key: string]: string }
  ) => {
    const newTree = updateNodeInTree(componentTree, elementId, (node) => ({
      ...node,
      attributes: { ...node.attributes, ...newAttributes },
    }))
    setComponentTree(newTree)
  }

  const handleWrapElement = (elementId: string, newTag: string) => {
    const newTree = wrapNodeInTree(componentTree, elementId, newTag)
    if (newTree) {
      setComponentTree(newTree)
    }
  }

  const handleUnwrapElement = (elementId: string) => {
    const newTree = unwrapNodeInTree(componentTree, elementId)
    if (newTree) {
      setComponentTree(newTree)
      setSelectedElementId(newTree.id) // Select the root if the unwrapped element's parent was the root
    }
  }

  const handleCopyElement = (elementId: string) => {
    const newTree = copyNodeInTree(componentTree, elementId)
    if (newTree) {
      setComponentTree(newTree)
    }
  }

  return (
    <main className="flex h-screen bg-gray-900 text-white">
      <LeftPanel
        component={componentTree}
        selectedId={selectedElementId}
        onSelect={setSelectedElementId}
      />
      <MiddlePanel
        component={componentTree}
        selectedId={selectedElementId}
        onSelect={setSelectedElementId}
      />
      <RightPanel
        selectedNode={selectedNode}
        onStyleChange={handleStyleChange}
        onAttributeChange={handleAttributeChange}
        onWrap={handleWrapElement}
        onUnwrap={handleUnwrapElement}
        onCopy={handleCopyElement}
      />
    </main>
  )
}
