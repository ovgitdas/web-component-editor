import { WebComponent, WebComponentNode } from "@/lib/types"
import React from "react"

interface MiddlePanelProps {
  component: WebComponent
  selectedId: string | null
  onSelect: (id: string) => void
}

function RenderNode({
  node,
  selectedId,
  onSelect,
}: {
  node: WebComponentNode
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { tag, children, attributes, styles, id } = node

  const isSelected = selectedId === id
  const { textContent, ...otherAttrs } = attributes

  const elementStyles: React.CSSProperties = {
    ...styles,
    outline: isSelected ? "2px solid #6366F1" : "none",
    outlineOffset: "2px",
  }

  return React.createElement(
    tag,
    {
      "data-id": id,
      style: elementStyles,
      ...otherAttrs,
    },
    textContent ||
      (children && children.length > 0
        ? children.map((child) => (
            <RenderNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        : null)
  )
}

export default function MiddlePanel({
  component,
  selectedId,
  onSelect,
}: MiddlePanelProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    let target = e.target as HTMLElement
    while (target && !target.dataset.id) {
      target = target.parentElement as HTMLElement
    }
    if (target && target.dataset.id) {
      onSelect(target.dataset.id)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
      <div
        className="w-full h-full border border-gray-700 rounded-lg overflow-auto"
        onClick={handleClick}
      >
        <RenderNode
          node={component}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}
