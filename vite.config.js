import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

try {
  const srcImg = 'C:/Users/amnap/.gemini/antigravity-ide/brain/f5303ca6-09c7-492c-abe5-856e59bb41f3/newsletter_boy_gift_1791404466119.jpg';
  const destImg = path.resolve('public/newsletter-boy.jpg');
  if (fs.existsSync(srcImg)) {
    fs.copyFileSync(srcImg, destImg);
  }
} catch (e) {
  console.error(e);
}

export default defineConfig({
  plugins: [react()],
});
