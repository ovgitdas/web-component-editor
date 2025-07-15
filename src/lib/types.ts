export interface WebComponentNode {
  id: string
  tag: string
  children: WebComponentNode[]
  attributes: { [key: string]: string }
  styles: React.CSSProperties
}

export type WebComponent = WebComponentNode
