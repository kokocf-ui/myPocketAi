// Offline GraphQL validation against an explicitly supplied Entur introspection
// snapshot. Tooling and the upstream schema stay outside the production bundle.
// Usage: node scripts/check_entur_schema_contract.mjs <schema.json> <graphql/index.js>
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {ENTUR_QUERY} from '../entur_national_transit.mjs';
const [schemaPath,graphqlPath]=process.argv.slice(2);
if(!schemaPath||!graphqlPath)throw Error('Supply the official introspection JSON and a local graphql package entry point; this script never fetches or installs anything.');
const require=createRequire(import.meta.url),{buildClientSchema,parse,validate}=require(resolve(graphqlPath));
const snapshot=JSON.parse(readFileSync(schemaPath,'utf8'));
const errors=validate(buildClientSchema(snapshot.data||snapshot),parse(ENTUR_QUERY));
if(errors.length){console.error(errors.map(e=>e.message).join('\n'));process.exitCode=1;}
else console.log('PASS Entur GraphQL query matches the supplied published schema snapshot. This is not a live API or coverage test.');
