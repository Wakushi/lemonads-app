import { useState } from "react";

export function AdBlockCustomization() {
  const [adBlockSettings, setAdBlockSettings] = useState({
    fontSize: 16,
    width: 300,
    height: 250,
    borderRadius: 0,
    backgroundColor: "#ffffff",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.type === "color" ? e.target.value : Number(e.target.value);
    setAdBlockSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <div className="flex gap-4 justify-around">
      <div
        className="border flex justify-center items-center overflow-hidden w-2/3 h-full bg-gray-100"
      >
        <div
          style={{
            fontSize: `${adBlockSettings.fontSize}px`,
            width: `${adBlockSettings.width}px`,
            height: `${adBlockSettings.height}px`,
            borderRadius: `${adBlockSettings.borderRadius}px`,
            backgroundColor: adBlockSettings.backgroundColor,
            transition: "all 0.3s ease", 
          }}
        >
          <div className="flex justify-center items-center h-full">
            <span>Ad Preview</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label>Font Size</label>
          <input
            type="range"
            min="12"
            max="48"
            value={adBlockSettings.fontSize}
            onChange={(e) => handleInputChange(e, "fontSize")}
            className="w-full"
          />
          <span>{adBlockSettings.fontSize}px</span>
        </div>
        <div>
          <label>Width</label>
          <input
            type="range"
            min="200"
            max="500"
            value={adBlockSettings.width}
            onChange={(e) => handleInputChange(e, "width")}
            className="w-full"
          />
          <span>{adBlockSettings.width}px</span>
        </div>
        <div>
          <label>Height</label>
          <input
            type="range"
            min="150"
            max="400"
            value={adBlockSettings.height}
            onChange={(e) => handleInputChange(e, "height")}
            className="w-full"
          />
          <span>{adBlockSettings.height}px</span>
        </div>
        <div>
          <label>Border Radius</label>
          <input
            type="range"
            min="0"
            max="50"
            value={adBlockSettings.borderRadius}
            onChange={(e) => handleInputChange(e, "borderRadius")}
            className="w-full"
          />
          <span>{adBlockSettings.borderRadius}px</span>
        </div>
        <div>
          <label>Background Color</label>
          <input
            type="color"
            value={adBlockSettings.backgroundColor}
            onChange={(e) => handleInputChange(e, "backgroundColor")}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
