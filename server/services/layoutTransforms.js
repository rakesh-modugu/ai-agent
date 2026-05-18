export function resizeArtboard(layout, w, h) {
  let newLayout = JSON.parse(JSON.stringify(layout));
  let rootId = newLayout.rootNodes[0];
  let artboard = newLayout.nodes[rootId];

  artboard.width = w;
  artboard.height = h;

  artboard.children.forEach(id => {
    let node = newLayout.nodes[id];
    if (node) {
      if (node.name.toLowerCase().includes('background')) {
        node.nx = 0;
        node.ny = 0;
        node.nw = 1;
        node.nh = 1;
      }
      node.x = node.nx * w;
      node.y = node.ny * h;
      node.width = node.nw * w;
      node.height = node.nh * h;
    }
  });

  return newLayout;
}

export function moveNode(layout, id, pos) {
  let newLayout = JSON.parse(JSON.stringify(layout));
  let node = newLayout.nodes[id];
  if (!node) return newLayout;

  if (pos === 'top') {
    node.ny = 0.05;
  } else if (pos === 'bottom') {
    node.ny = 1 - node.nh - 0.05;
  } else if (pos === 'center') {
    node.nx = 0.5 - (node.nw / 2);
  } else if (pos === 'left') {
    node.nx = 0.05;
  } else if (pos === 'right') {
    node.nx = 1 - node.nw - 0.05;
  } else if (pos === 'higher' || pos === 'up') {
    node.ny = node.ny - 0.1;
    if(node.ny < 0) node.ny = 0;
  }

  let rootId = newLayout.rootNodes[0];
  let artboard = newLayout.nodes[rootId];
  node.x = node.nx * artboard.width;
  node.y = node.ny * artboard.height;

  return newLayout;
}

export function scaleNode(layout, id, scale) {
  let newLayout = JSON.parse(JSON.stringify(layout));
  let node = newLayout.nodes[id];
  if (!node) return newLayout;

  let rootId = newLayout.rootNodes[0];
  let artboard = newLayout.nodes[rootId];

  let cx = node.nx + (node.nw / 2);
  let cy = node.ny + (node.nh / 2);

  node.nw = node.nw * scale;
  node.nh = node.nh * scale;

  node.nx = cx - (node.nw / 2);
  node.ny = cy - (node.nh / 2);

  node.x = node.nx * artboard.width;
  node.y = node.ny * artboard.height;
  node.width = node.nw * artboard.width;
  node.height = node.nh * artboard.height;

  if (node.type === 'text' && node.style && node.style.visual && node.style.visual.fontSize) {
    node.style.visual.fontSize = Math.round(node.style.visual.fontSize * scale);
  }

  return newLayout;
}
