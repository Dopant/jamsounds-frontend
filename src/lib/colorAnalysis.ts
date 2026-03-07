// Color analysis utility for determining image dominant colors
export interface ColorAnalysis {
  isLight: boolean;
  dominantColor: 'light' | 'dark';
  backgroundColor: string;
  textColor: string;
}

// Function to analyze image colors and determine background
export async function analyzeImageColors(imageUrl: string): Promise<ColorAnalysis> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas to analyze image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(getDefaultColors());
          return;
        }
        
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample pixels for analysis (every 10th pixel for performance)
        let totalBrightness = 0;
        let sampleCount = 0;
        
        for (let i = 0; i < data.length; i += 40) { // RGBA = 4 values, every 10th pixel
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness using luminance formula
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          totalBrightness += brightness;
          sampleCount++;
        }
        
        const averageBrightness = totalBrightness / sampleCount;
        
        // Determine if image is light or dark
        const isLight = averageBrightness > 0.5;
        
        resolve({
          isLight,
          dominantColor: isLight ? 'light' : 'dark',
          backgroundColor: isLight ? '#ffffff' : '#000000',
          textColor: isLight ? '#000000' : '#ffffff'
        });
        
      } catch (error) {
        console.warn('Color analysis failed, using default colors:', error);
        resolve(getDefaultColors());
      }
    };
    
    img.onerror = () => {
      console.warn('Image failed to load for color analysis');
      resolve(getDefaultColors());
    };
    
    img.src = imageUrl;
  });
}

// Get default colors when analysis fails
function getDefaultColors(): ColorAnalysis {
  return {
    isLight: false,
    dominantColor: 'dark',
    backgroundColor: '#000000',
    textColor: '#ffffff'
  };
}

// Function to get CSS classes based on color analysis
export function getColorClasses(analysis: ColorAnalysis) {
  return {
    backgroundClass: analysis.isLight ? 'bg-white' : 'bg-black',
    textClass: analysis.isLight ? 'text-black' : 'text-white',
    borderClass: analysis.isLight ? 'border-gray-200' : 'border-gray-800'
  };
}
