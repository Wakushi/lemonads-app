import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism"
import Copy from "./ui/copy"

export default function CodeSnippet({
  codeString,
  language,
}: {
  codeString: string
  language: string
}) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <Copy contentToCopy={codeString} />
      </div>
      <SyntaxHighlighter language={language} style={prism}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}
