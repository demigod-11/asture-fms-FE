# Generated API types

This directory is generated from the backend OpenAPI schema. **Do not edit these files by hand.**

## Regenerate types

With the backend running:

```bash
npm run generate:api
```

Optional: set the API base URL (default `http://localhost:8000/api`):

```bash
VITE_API_URL=https://api.example.com/api npm run generate:api
```

## Using the types

Import the generated types for static typing of endpoints and responses:

```ts
import type { paths, components } from '@/generated/api';

// Response type for GET /api/v1/some-endpoint
type SomeResponse =
  paths['/api/v1/some-endpoint']['get']['responses'][200]['content']['application/json'];

// Schema (request/response body) types
type User = components['schemas']['User'];
```

Use with your HTTP client (e.g. axios) by typing the response:

```ts
const res =
  await axios.get<
    paths['/api/v1/health/']['get']['responses'][200]['content']['application/json']
  >('/api/v1/health/');
```
