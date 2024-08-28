import Image from "next/image";
import { useState, useEffect } from "react";

interface AdBlockCustomizationProps {
  setAdBlockSettings: (settings: Record<string, string | number>) => void;
}

export function AdBlockCustomization({ setAdBlockSettings }: AdBlockCustomizationProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("banner");

  type TemplateKey = "banner" | "card" | "imageBox";

  interface Template {
    name: string;
    preview: JSX.Element;
    styles: Record<string, string | number>; // Styles for the ad block
  }

  const templates: Record<TemplateKey, Template> = {
    banner: {
      name: "Simple Banner",
      preview: (
        <div className="flex justify-center items-center w-full h-1/6 relative min-h-12">
          <Image
            src="/pubtest.webp"
            alt="Ad Image"
            className="w-full h-full object-cover rounded-t-lg absolute"
            width={2280}
            height={2280}
          />
        </div>
      ),
      styles: {
        width: "100%",
        height: "150px",
      },
    },
    card: {
      name: "Ad Card",
      preview: (
        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md min-w-52">
          <Image
            src="/pubtest.webp"
            alt="Ad Image"
            className="w-full h-32 object-cover rounded-t-lg"
            width={1280}
            height={1280}
          />
          <div className="p-2">
            <h2 className="font-bold text-lg">Ad Title</h2>
            <p className="text-sm text-gray-700">Quick ad description...</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Learn More</button>
          </div>
        </div>
      ),
      styles: {
        width: "300px",
        height: "250px",
        backgroundColor: "#fff",
      },
    },
    imageBox: {
      name: "Image Box",
      preview: (
        <div className="flex flex-col justify-center items-center h-10/12 bg-gray-100">
          <Image
            src="/pubtest.webp"
            alt="Ad Image"
            className="w-full h-1/2 object-cover"
            width={1280}
            height={1280}
          />
          <span style={{ fontSize: "16px", color: "#000" }}>Short advertising text</span>
        </div>
      ),
      styles: {
        width: "300px",
        height: "300px",
      },
    },
  };

  // Utiliser useEffect pour mettre à jour les paramètres du bloc publicitaire quand le template change
  useEffect(() => {
    setAdBlockSettings(templates[selectedTemplate].styles);
  }, [selectedTemplate, setAdBlockSettings]);

  return (
    <div className="flex gap-4 justify-around">
      {/* Template Preview on a Mock Website */}
      <div className="border flex justify-center overflow-hidden w-2/3 h-full bg-gray-100">
        <div className="mock-website-background relative w-full h-full flex flex-col justify-between">
          {/* Mock Website Header */}
          <div className="bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="text-2xl font-bold">My Website</div>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="text-white hover:text-yellow-400">Home</a></li>
                <li><a href="#" className="text-white hover:text-yellow-400">About</a></li>
                <li><a href="#" className="text-white hover:text-yellow-400">Services</a></li>
                <li><a href="#" className="text-white hover:text-yellow-400">Contact</a></li>
              </ul>
            </nav>
          </div>

          {/* Ad Preview Section */}
          <div className="ad-preview-section flex justify-center items-center py-8 bg-white h-full">
            {templates[selectedTemplate].preview}
          </div>

          {/* Mock Website Footer */}
          <div className="bg-gray-800 text-white text-center py-4">
            <p>&copy; 2024 My Website. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="text-white hover:text-yellow-400">Privacy Policy</a>
              <a href="#" className="text-white hover:text-yellow-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="flex flex-col gap-4 w-1/3">
        {Object.keys(templates).map((templateKey) => (
          <div
            key={templateKey}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedTemplate === templateKey ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedTemplate(templateKey as TemplateKey)}
          >
            <div className="mb-2">{templates[templateKey as TemplateKey].name}</div>
            {templates[templateKey as TemplateKey].preview}
          </div>
        ))}
      </div>
    </div>
  );
}
