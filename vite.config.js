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

  const yellowLamboSrc = 'C:/Users/amnap/.gemini/antigravity-ide/brain/b496913a-8371-46fa-8b7c-f0c6ed900574/yellow_lamborghini_diecast_1791821350123.jpg';
  const yellowLamboDest = path.resolve('public/yellow-lamborghini.jpg');
  if (fs.existsSync(yellowLamboSrc)) {
    fs.copyFileSync(yellowLamboSrc, yellowLamboDest);
  }

  const blueBmwSrc = 'C:/Users/amnap/.gemini/antigravity-ide/brain/b496913a-8371-46fa-8b7c-f0c6ed900574/blue_bmw_m4_diecast_1791821380027.jpg';
  const blueBmwDest = path.resolve('public/blue-bmw-m4.jpg');
  if (fs.existsSync(blueBmwSrc)) {
    fs.copyFileSync(blueBmwSrc, blueBmwDest);
  }
} catch (e) {
  console.error(e);
}

export default defineConfig({
  plugins: [react()],
});
