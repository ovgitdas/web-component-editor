import { WebComponentNode } from "../lib/types"
import { ChevronRightIcon } from "./ui/Icons"
import { useState } from "react"

interface LeftPanelProps {
  component: WebComponentNode
  selectedId: string | null
  onSelect: (id: string) => void
}

function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
}: {
  node: WebComponentNode
  level: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(node.id)
  }

  const isSelected = selectedId === node.id

  return (
    <div>
      <div
        onClick={handleSelect}
        className={`flex items-center space-x-2 py-1 px-2 rounded-md cursor-pointer hover:bg-gray-600 ${
          isSelected ? "bg-indigo-600" : ""
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        {hasChildren && (
          <ChevronRightIcon
            onClick={handleToggle}
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        )}
        {!hasChildren && <div className="h-4 w-4" />}
        <span className="font-mono text-sm">{`<${node.tag}>`}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeftPanel({
  component,
  selectedId,
  onSelect,
}: LeftPanelProps) {
  return (
    <div className="w-64 bg-gray-800 p-4 border-r border-gray-700 flex flex-col overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-200">Component Tree</h2>
      <div className="flex-grow">
        <TreeNode
          node={component}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}
