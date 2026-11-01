export const extractDominantColor = (imgUrl) => {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 40) {
          const alpha = data[i + 3];
          if (alpha < 128) continue;
          const pr = data[i], pg = data[i + 1], pb = data[i + 2];
          const luminance = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;
          if (luminance > 0.75) continue;
          if (luminance < 0.10) continue;
          const maxC = Math.max(pr, pg, pb);
          const minC = Math.min(pr, pg, pb);
          if (maxC - minC < 20) continue;
          r += pr; g += pg; b += pb; count++;
        }
        if (count > 0) {
          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);
          const finalLuminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (finalLuminance > 0.65) {
            r = Math.floor(r * 0.6);
            g = Math.floor(g * 0.6);
            b = Math.floor(b * 0.6);
          }
          document.documentElement.style.setProperty('--primary-color', `rgb(${r}, ${g}, ${b})`);
          document.documentElement.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, 0.1)`);
          document.documentElement.style.setProperty('--primary-dark', `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`);
        } else {
          throw new Error('Fallback');
        }
      } catch (err) {
        document.documentElement.style.setProperty('--primary-color', '#3A2A20');
        document.documentElement.style.setProperty('--primary-light', 'rgba(58, 42, 32, 0.1)');
        document.documentElement.style.setProperty('--primary-dark', '#2A1F17');
      }
    };
    img.onerror = () => {
      document.documentElement.style.setProperty('--primary-color', '#3A2A20');
      document.documentElement.style.setProperty('--primary-light', 'rgba(58, 42, 32, 0.1)');
      document.documentElement.style.setProperty('--primary-dark', '#2A1F17');
    };
  } catch (e) {
    document.documentElement.style.setProperty('--primary-color', '#3A2A20');
    document.documentElement.style.setProperty('--primary-light', 'rgba(58, 42, 32, 0.1)');
    document.documentElement.style.setProperty('--primary-dark', '#2A1F17');
  }
};