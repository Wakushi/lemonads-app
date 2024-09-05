import { AdContent } from "./types/ad-content.type"
import { AdParcelTraits } from "./types/ad-parcel.type"

interface AdTemplateProps {
  traits: AdParcelTraits
  adContent: AdContent
  clickId?: string
}

export function getAdTemplate({
  traits,
  adContent,
  clickId,
}: AdTemplateProps): string {
  const { width } = traits
  const { title, imageUrl, linkUrl, description } = adContent

  return `
    <div class="ad-content">
        <a href=${linkUrl}?click_id=${clickId} target="_blank">   
            <img src=${imageUrl} alt=${title} class="ad-image" />
            <div class="ad-text">
                <h2 class="ad-title">${title}</h2>
                <p class="ad-description">${description}</p>
                <a href=${linkUrl}?click_id=${clickId} class="ad-link" target="_blank">Learn More</a>
            </div>
        </a>
    </div>
    <style>
        /* Ad Block Styles */
        .ad-content {
            width: ${width};
            height: auto;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .ad-image {
            width: 100%;
            height: auto;
        }

        .ad-text {
            padding: 15px;
        }

        .ad-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .ad-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .ad-link {
            display: inline-block;
            padding: 10px 15px;
            background-color: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .ad-link:hover {
            opacity:0.7
        }
    </style>
`
}
