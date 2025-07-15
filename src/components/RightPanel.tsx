"use client"
import { WebComponentNode } from "../lib/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { CopyIcon, TrashIcon, UnwrapIcon, WrapIcon } from "./ui/Icons"
import { Button } from "./ui/Button"
import ColorPicker from "./ColorPicker"

interface RightPanelProps {
  selectedNode: WebComponentNode | null
  onStyleChange: (elementId: string, newStyles: React.CSSProperties) => void
  onAttributeChange: (
    elementId: string,
    newAttributes: { [key: string]: string }
  ) => void
  onWrap: (elementId: string, newTag: string) => void
  onUnwrap: (elementId: string) => void
  onCopy: (elementId: string) => void
  onDelete: (elementId: string) => void
}

const cssGroups = {
  Layout: [
    "display",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
    "padding",
    "margin",
  ],
  Sizing: ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight"],
  Typography: [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "color",
    "textAlign",
    "lineHeight",
    "letterSpacing",
  ],
  Background: ["backgroundColor", "backgroundImage"],
  Borders: [
    "border",
    "borderRadius",
    "borderColor",
    "borderWidth",
    "borderStyle",
  ],
  Effects: ["boxShadow", "opacity", "transform"],
}

export default function RightPanel({
  selectedNode,
  onStyleChange,
  onAttributeChange,
  onWrap,
  onUnwrap,
  onCopy,
  onDelete,
}: RightPanelProps) {
  const handleInputChange = (
    prop: keyof React.CSSProperties,
    value: string
  ) => {
    if (selectedNode) {
      onStyleChange(selectedNode.id, { [prop]: value })
    }
  }

  const handleAttributeInputChange = (prop: string, value: string) => {
    if (selectedNode) {
      onAttributeChange(selectedNode.id, { [prop]: value })
    }
  }

  const handleWrapClick = () => {
    const newTag = prompt("Enter tag to wrap with (e.g., div, section):", "div")
    if (newTag && selectedNode) {
      onWrap(selectedNode.id, newTag)
    }
  }

  const handleUnwrapClick = () => {
    if (selectedNode) {
      onUnwrap(selectedNode.id)
    }
  }

  const handleCopyClick = () => {
    if (selectedNode) {
      onCopy(selectedNode.id)
    }
  }

  const handleDeleteClick = () => {
    if (selectedNode) {
      onDelete(selectedNode.id)
    }
  }
  const isRoot = !!selectedNode && selectedNode.id === "root"

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-800 p-4 border-l border-gray-700 flex items-center justify-center">
        <p className="text-gray-400">Select an element to inspect</p>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gray-800 p-4 border-l border-gray-700 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-200">Inspector</h2>
        <p className="text-sm text-indigo-400 font-mono">{`<${selectedNode.tag}>`}</p>
      </div>

      <div className="space-y-2 mb-4">
        <Button
          onClick={handleWrapClick}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <WrapIcon className="w-4 h-4 mr-2" /> Wrap
        </Button>
        <Button
          onClick={handleUnwrapClick}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <UnwrapIcon className="w-4 h-4 mr-2" /> Unwrap
        </Button>
        <Button
          onClick={handleCopyClick}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <CopyIcon className="w-4 h-4 mr-2" /> Copy
        </Button>
        <Button
          onClick={handleDeleteClick}
          variant="destructive"
          size="sm"
          className="w-full"
          disabled={isRoot}
        >
          <TrashIcon className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["Attributes", "Typography", "Layout"]}
        className="w-full"
      >
        <AccordionItem value="Attributes">
          <AccordionTrigger>Attributes</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="textContent">textContent</Label>
                <Input
                  id="textContent"
                  value={selectedNode.attributes.textContent || ""}
                  onChange={(e) =>
                    handleAttributeInputChange("textContent", e.target.value)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {Object.entries(cssGroups).map(([groupName, properties]) => (
          <AccordionItem value={groupName} key={groupName}>
            <AccordionTrigger>{groupName}</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                {properties.map((prop) => (
                  <div key={prop} className="grid gap-2">
                    <Label htmlFor={prop} className="capitalize">
                      {prop.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    {prop.toLowerCase().includes("color") ? (
                      <ColorPicker
                        value={(selectedNode.styles as any)[prop] || ""}
                        onChange={(value) =>
                          handleInputChange(prop as any, value)
                        }
                      />
                    ) : (
                      <Input
                        id={prop}
                        value={(selectedNode.styles as any)[prop] || ""}
                        onChange={(e) =>
                          handleInputChange(prop as any, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
