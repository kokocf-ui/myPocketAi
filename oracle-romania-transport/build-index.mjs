// Manual, local-only index generation after an operator-authorised GTFS import.
// Example: node oracle-romania-transport/build-index.mjs RO ro-bh /home/ubuntu/pocketai-romania/feeds
import {createGtfsFeedIndex} from '../regional_gtfs_catalog.mjs';
const [country,region,dir,option]=process.argv.slice(2);
if(!dir||!['RO','GB'].includes(country)||!region)throw Error('Usage: node oracle-romania-transport/build-index.mjs RO|GB <region-code> <feed-directory> [--replace]');
if(option&&option!=='--replace')throw Error('unknown_option');
const result=createGtfsFeedIndex(dir,region,country,{replace:option==='--replace'});
console.log(JSON.stringify({status:'indexed',...result}));
