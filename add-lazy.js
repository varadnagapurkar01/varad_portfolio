const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        filelist = walkSync(filePath, filelist);
      }
    } else {
      if (filePath.endsWith('.html')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const htmlFiles = walkSync(__dirname);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;

  // Replace <img ... > with <img loading="lazy" ... >
  // Only if loading="lazy" or loading='lazy' doesn't already exist in the tag
  content = content.replace(/<img\b([^>]*)>/gi, (match, p1) => {
    if (!/loading\s*=\s*['"]lazy['"]/i.test(p1)) {
      updated = true;
      return `<img loading="lazy" ${p1.trim()}>`;
    }
    return match;
  });

  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Done!');
