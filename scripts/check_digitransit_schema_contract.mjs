// Offline validation using the provider's published SDL, not an API smoke test.
// Usage: node scripts/check_digitransit_schema_contract.mjs <schema.graphql> <graphql/index.js>
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {DIGITRANSIT_QUERY} from '../digitransit_national_transit.mjs';
const [schemaPath,graphqlPath]=process.argv.slice(2);
if(!schemaPath||!graphqlPath)throw Error('Supply the official SDL and a local graphql package entry point; nothing is fetched or installed.');
const require=createRequire(import.meta.url),{buildSchema,parse,validate,specifiedRules,NoDeprecatedCustomRule}=require(resolve(graphqlPath));
const errors=validate(buildSchema(readFileSync(schemaPath,'utf8')),parse(DIGITRANSIT_QUERY),[...specifiedRules,NoDeprecatedCustomRule]);
if(errors.length){console.error(errors.map(e=>e.message).join('\n'));process.exitCode=1;}
else console.log('PASS Digitransit v2 query matches published schema and avoids deprecated fields. Not a live API or coverage test.');
