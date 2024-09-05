import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function ConversionTrackingTutorial() {
  const backendSnippet = `
    fetch("/track-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clickId: clickId, // This is the ID from the query param
        conversionValue: 100, // This is an example value (e.g., purchase amount)
      }),
    })
    .then((res) => res.json())
    .then((data) => console.log(data));
  `

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Conversion Tracking Setup</h1>

      <p className="text-lg mb-4">
        To track conversions from users who click on ads, you'll receive a query
        parameter called <code>click_id</code> when a user is routed to your
        page from one of our ads. You need to send this <code>click_id</code>{" "}
        back to us in a POST request whenever a conversion happens (such as a
        purchase or signup) on your website.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions</h2>

      <ol className="list-decimal ml-6 text-lg mb-8">
        <li className="mb-2">
          <strong>
            Capture the <code>click_id</code>:
          </strong>{" "}
          When a user clicks on an ad, they are routed to your site with a{" "}
          <code>click_id</code> in the URL. Extract it using JavaScript from the
          query parameters.
        </li>
        <li className="mb-2">
          <strong>
            Send the <code>click_id</code> back to us:
          </strong>{" "}
          When the user completes a conversion (e.g., purchase), send a POST
          request to your server with the <code>click_id</code> and any
          additional details such as the conversion value.
        </li>
        <li className="mb-2">
          <strong>Backend Example:</strong> Set up an endpoint on your server
          that logs or processes the conversion event. Below is a code snippet
          to help you get started.
        </li>
      </ol>

      <div className="relative mb-6">
        <CodeSnippet codeString={backendSnippet} language="typescript" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
      <p className="text-lg mb-4">
        If you need further assistance setting up conversion tracking, feel free
        to contact our support team. We're here to help you get the most out of
        your ad campaigns!
      </p>
    </div>
  )
}

function CodeSnippet({
  codeString,
  language,
}: {
  codeString: string
  language: string
}) {
  return (
    <SyntaxHighlighter language={language} style={prism}>
      {codeString}
    </SyntaxHighlighter>
  )
}
