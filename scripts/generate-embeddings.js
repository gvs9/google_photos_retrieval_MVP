const fs = require('fs');
const path = require('path');

async function main() {
  // Use dynamic import for ESM module
  const { pipeline } = await import('@xenova/transformers');
  
  console.log('Loading feature-extraction model (this may take a few seconds on first run to download the model)...');
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  console.log('Loading photos.json...');
  const photosPath = path.join(__dirname, '../src/data/photos.json');
  const photos = JSON.parse(fs.readFileSync(photosPath, 'utf8'));
  
  const embeddings = {};
  
  console.log('Generating embeddings for', photos.length, 'photos...');
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    
    // We combine the location and visual tags into a single rich text document
    const textToEmbed = `${photo.metadata.location} ${photo.visual_tags.join(' ')}`;
    
    // Generate vector embedding
    const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });
    
    // Convert Float32Array to standard JS Array
    embeddings[photo.id] = Array.from(output.data);
    
    console.log(`Processed ${i + 1}/${photos.length}: ID ${photo.id}`);
  }
  
  const outPath = path.join(__dirname, '../src/data/embeddings.json');
  fs.writeFileSync(outPath, JSON.stringify(embeddings));
  console.log('\nSuccess! Saved 384-dimensional vectors to src/data/embeddings.json');
}

main().catch(console.error);
