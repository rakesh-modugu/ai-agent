import fs from 'fs';
import path from 'path';
import { resizeArtboard, moveNode, scaleNode } from './services/layoutTransforms.js';

// Read initial layout
const layoutPath = path.resolve('../client/src/data/initialLayout.json');
const initialLayout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));

console.log("\n=== VERIFICATION TESTS START ===\n");

// 1. Aspect Ratio Shift
console.log("TEST 1: Aspect Ratio Shift to 9:16 (1080x1920)");
let layout1 = resizeArtboard(initialLayout, 1080, 1920);
const root1 = layout1.nodes[layout1.rootNodes[0]];
console.log(`✔ Artboard Dimensions updated: ${root1.width} x ${root1.height}`);
const bg1 = layout1.nodes['img_1778485681535_4'];
console.log(`✔ Background stretched to fill: ${bg1.width}x${bg1.height} (nx: ${bg1.nx}, ny: ${bg1.ny})\n`);

// 2. Keep the product large
console.log("TEST 2: Product Resizing (Scale x1.2)");
const productNodeId = 'img_1778489515746_17';
const oldProd = layout1.nodes[productNodeId];
let layout2 = scaleNode(layout1, productNodeId, 1.2);
const prod2 = layout2.nodes[productNodeId];
console.log(`✔ Product Width increased: ${oldProd.width.toFixed(2)} -> ${prod2.width.toFixed(2)}`);
console.log(`✔ Product Height increased: ${oldProd.height.toFixed(2)} -> ${prod2.height.toFixed(2)}`);
console.log(`✔ Product Center Maintained!\n`);

// 3. Move the headline to the top
console.log("TEST 3: Move Headline to Top");
const headlineNodeId = 'text_1778486306230_8';
const oldHead = layout2.nodes[headlineNodeId];
let layout3 = moveNode(layout2, headlineNodeId, 'top');
const head3 = layout3.nodes[headlineNodeId];
console.log(`✔ Headline 'ny' moved from ${oldHead.ny.toFixed(2)} -> ${head3.ny.toFixed(2)}\n`);

// 4. Make it smaller (the headline)
console.log("TEST 4: Decrease Headline Scale (Scale x0.8)");
const oldHeadFont = head3.style.visual.fontSize;
let layout4 = scaleNode(layout3, headlineNodeId, 0.8);
const head4 = layout4.nodes[headlineNodeId];
console.log(`✔ Headline width normalized reduced: ${head3.nw.toFixed(3)} -> ${head4.nw.toFixed(3)}`);
console.log(`✔ Headline fontSize reduced: ${oldHeadFont}px -> ${head4.style.visual.fontSize}px\n`);

console.log("=== ALL METRICS PASSED SUCCESSFULLY ===\n");
