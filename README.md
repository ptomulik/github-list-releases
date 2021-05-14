# Paginate Rest Limit

![tests](https://github.com/ptomulik/octokit-paginate-rest-limit/workflows/Tests/badge.svg?branch=master)
![build](https://github.com/ptomulik/octokit-paginate-rest-limit/workflows/Build/badge.svg?branch=master)
![code](https://github.com/ptomulik/octokit-paginate-rest-limit/workflows/Code%20Quality/badge.svg?branch=master)
[![coverage](https://coveralls.io/repos/github/ptomulik/octokit-paginate-rest-limit/badge.svg?branch=master)](https://coveralls.io/github/ptomulik/octokit-paginate-rest-limit?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![@latest](https://img.shields.io/npm/v/@ptomulik/octokit-paginate-rest-limit.svg)](https://www.npmjs.com/package/@ptomulik/octokit-paginate-rest-limit)

### Description

Provides callback function that limits number of entries returned by
[@octokit/plugin-paginate-rest.js](https://github.com/octokit/plugin-paginate-rest.js).

The [paginate](https://github.com/octokit/plugin-paginate-rest.js#octokitpaginate)
method provided by [@octokit/plugin-paginate-rest.js](https://github.com/octokit/plugin-paginate-rest.js)
fetches all available entries page-by-page and returns them gathered into a
single array. The
[octokit-paginate-rest-limit](https://github.com/ptomulik/octokit-paginate-rest-limit)
allows to reduce the number of entries returned (and pages fetched) when
only few first records are required.

## Usage

<table>
<tbody valign=top align=left>
<tr><th>
Browsers
</th><td width=100%>

Load ``@ptomulik/octokit-paginate-rest-limit`` (and related modules)
directly from [cdn.skypack.dev](https://cdn.skypack.dev)

```html
<script type="module">
  import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
  import { paginateRest } from "https://cdn.skypack.dev/@octokit/plugin-paginate-rest";
  import { limit, adjust, MapFunction } from "https://cdn.skypack.dev/@ptomulik/octokit-paginate-rest-limit";
</script>
```

</td></tr>
<tr><th>
Node
</th><td>

Install ``@ptomulik/octokit-paginate-rest-limit`` (and related modules) with

```console
npm install @ptomulik/octokit-paginate-rest-limit @octokit/plugin-paginate-rest @octokit/core
```

then import modules in your code

```typescript
import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { limit, adjust, MapFunction } from "@ptomulik/octokit-paginate-rest-limit";
```

</td></tr>
</tbody>
</table>

### Applying limit

```typescript
import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { limit, MapFunction } from "@ptomulik/octokit-paginate-rest-limit";

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit();

type Response = { data: { tag_name: string }[] };

// Retrieve (no more than) 2 releases and print their tag names.
octokit.paginate(
  "GET /repos/{owner}/{repo}/releases",
  {owner: "octokit", repo: "plugin-paginate-rest.js"},
  limit(2) as MapFunction<Response>
).then((releases) => {
  console.log(releases.map((release) => release.tag_name));
});
```

Example output

```console
[ 'v2.13.3', 'v2.13.2' ]
```

### Applying limit & map function at once.

```typescript
import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { limit } from "@ptomulik/octokit-paginate-rest-limit";

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit();

type Response = { data: { tag_name: string }[] };

// Retrieve (no more than) 2 releases and print their tag names.
octokit
  .paginate(
    "GET /repos/{owner}/{repo}/releases",
    { owner: "octokit", repo: "plugin-paginate-rest.js" },
    limit(2, ({ data }: Response) => data.map((release) => release.tag_name))
  )
  .then((names) => {
    console.log(names);
  });
```

### Adjusting request parameters

Pagination parameters may be adjusted with ``adjust(max, parameters)``.
This operation adjusts ``per_page`` property of ``parameters`` to avoid
fetching redundant records.

```typescript
import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { limit, adjust, MapFunction } from "@ptomulik/octokit-paginate-rest-limit";

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit();
const max = 2;

type Response = { data: { tag_name: string }[] };

// Retrieve (no more than) `max` releases and print their tag names.
// The `per_page` is set to `max`.
octokit.paginate(
  "GET /repos/{owner}/{repo}/releases",
  adjust(max, {owner: "octokit", repo: "plugin-paginate-rest.js"}),
  limit(max) as MapFunction<Response>
).then((releases) => {
  console.log(releases.map((release) => release.tag_name));
});
```

## Limitations

- incompatible with
  [paginate.iterator](https://github.com/octokit/plugin-paginate-rest.js#octokitpaginateiterator),
- will cause bugs when a value (function) returned by ``limit()`` is reused;
  namely, this is WRONG:

  ```typescript
    const first = limit(1);
    octokit.paginate(..., first);
    octokit.paginate(..., first); // !!this will not work as one would expect!!
  ```

## LICENSE

Copyright (c) 2021 by Paweł Tomulik <ptomulik@meil.pw.edu.pl>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
