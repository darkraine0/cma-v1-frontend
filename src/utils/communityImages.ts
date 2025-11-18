// Import all community images
import brookvilleImg from '../assets/imgs/brookville.jpg';
import cambridgeImg from '../assets/imgs/cambridgecrossing.webp';
import creeksideImg from '../assets/imgs/creekside.jpg';
import echoparkImg from '../assets/imgs/echopark.jpg';
import edgewaterImg from '../assets/imgs/edgewater.jpg';
import elevonImg from '../assets/imgs/elevon.webp';
import lakebreezeImg from '../assets/imgs/lakebreeze.jpg';
import maddoxImg from '../assets/imgs/maddox.jpg';
import milranyImg from '../assets/imgs/milrany.jpg';
import myrtlecreekImg from '../assets/imgs/myrtlecreek.webp';
import pickensImg from '../assets/imgs/pickens.jpg';
import reunionImg from '../assets/imgs/reunion.jpg';
import waldenImg from '../assets/imgs/walden.jpg';
import wildflowerImg from '../assets/imgs/wildflower.jpg';

// Community name to image mapping
export const communityImageMap: Record<string, string> = {
  'Brookville': brookvilleImg,
  'Cambridge': cambridgeImg,
  'Cambridge Crossing': cambridgeImg,
  'Creekside': creeksideImg,
  'Echo Park': echoparkImg,
  'Edgewater': edgewaterImg,
  'Elevon': elevonImg,
  'Lake Breeze': lakebreezeImg,
  'Maddox': maddoxImg,
  'Milrany': milranyImg,
  'Milrany Ranch': milranyImg,
  'Myrtlecreek': myrtlecreekImg,
  'Myrtle Creek': myrtlecreekImg,
  'Pickens': pickensImg,
  'Pickens Bluff': pickensImg,
  'Reunion': reunionImg,
  'Walden': waldenImg,
  'Walden Pond West': waldenImg,
  'Wildflower': wildflowerImg,
  'Wildflower Ranch': wildflowerImg,
};

/**
 * Get the image for a community by name
 * @param communityName - The name of the community
 * @returns The image source string, or a default image if not found
 */
export function getCommunityImage(communityName: string): string {
  // Try exact match first
  if (communityImageMap[communityName]) {
    return communityImageMap[communityName];
  }
  
  // Try case-insensitive match
  const lowerName = communityName.toLowerCase();
  for (const [key, value] of Object.entries(communityImageMap)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  
  // Default to Lake Breeze image
  return lakebreezeImg;
}

/**
 * Check if a community has an image available
 * @param communityName - The name of the community
 * @returns True if an image is available for this community
 */
export function hasCommunityImage(communityName: string): boolean {
  return communityName in communityImageMap;
}

export default communityImageMap;
