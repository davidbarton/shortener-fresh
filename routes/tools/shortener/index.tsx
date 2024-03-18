import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { JSX } from "preact";
import { urlJoin } from "https://deno.land/x/url_join/mod.ts";
import { encodeUrl } from "https://deno.land/x/encodeurl/mod.ts";
import {
  addLocation,
  getLocationList,
} from "../../../modules/shortener/model.ts";
import { LocationRecord } from "../../../modules/shortener/types.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    return await ctx.render();
  },

  async POST(req: Request, ctx: FreshContext): Promise<Response> {
    const form = await req.formData();
    const url = form.get("url")?.toString();
    const id = form.get("id")?.toString();

    if (!url) {
      return await ctx.render({ error: "Invalid url" });
    }

    if (!id) {
      return await ctx.render({ error: "Invalid id" });
    }

    if (!id.match(/^[a-zA-Z0-9_-]+$/)) {
      return await ctx.render({ error: "Invalid character used" });
    }

    const result = await addLocation("davidbarton", [id], { id, url });

    if (!result.ok) {
      return await ctx.render({ error: "Shortened link already exists" });
    }

    return await ctx.render();
  },
};

export function LocationForm() {
  return (
    <div>
      <form method="post">
        <div class="flex flex-col space-y-4">
          <div>
            <label htmlFor="url" class="block">URL</label>
            <input
              id="url"
              name="url"
              type="url"
              class="block rounded-md"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="id" class="block">ID (optional)</label>
            <input
              id="id"
              name="id"
              type="text"
              class="block rounded-md"
            />
          </div>

          <div>
            <button
              type="submit"
              class="rounded-md bg-indigo-600 px-3 py-2 font-semibold text-white"
            >
              Shorten
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const SHORTENER_PREFIX = "s";

export function UntrustedLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return <a referrerpolicy="no-referrer" rel="noopener" {...props} />;
}

interface Props {
  locations: LocationRecord[];
}

export function LocationLinks(props: Props) {
  const { locations } = props;

  const rows = locations.map((location) => (
    <tr key={location.id} class="border-t divide-gray-400">
      <td class="p-4">
        {urlJoin("/", SHORTENER_PREFIX, location.id)}
      </td>

      <td class="p-4">
        <UntrustedLink href={location.url}>
          {location.url}
        </UntrustedLink>
      </td>

      <td class="p-4">
        <form
          method="post"
          action={encodeUrl(`/tools/shortener/${location.id}`)}
        >
          <input
            name="url"
            type="hidden"
            value=""
          />
          <button
            type="submit"
            class="rounded-md bg-gray-600 px-3 py-2 font-semibold text-white"
          >
            Remove
          </button>
        </form>
      </td>
    </tr>
  ));

  if (!rows.length) {
    return (
      <div>
        <p>No shortened link yet.</p>
      </div>
    );
  }

  return (
    <div class="rounded-md border border-gray-400 overflow-hidden">
      <table class="table-auto m-0">
        <thead class=" bg-gray-100">
          <tr class="">
            <th class="p-4">ID</th>
            <th class="p-4">Url</th>
            <th class="p-4"></th>
          </tr>
        </thead>
        <tbody class="">
          {rows}
        </tbody>
      </table>
    </div>
  );
}

interface FormProps {
  error?: string;
}

function FormStatus(props: FormProps) {
  if (!props.error) {
    return null;
  }

  return <div>{props.error}</div>;
}

export default async function Shortener(props: PageProps) {
  const locationList = await getLocationList("davidbarton");

  return (
    <div class="container mx-auto px-4 py-8">
      <article class="prose">
        <div class="flex flex-col space-y-8">
          <h1 class="m-0">URL shortener</h1>

          <FormStatus error={props.data?.error} />

          <LocationForm />

          <LocationLinks locations={locationList} />
        </div>
      </article>
    </div>
  );
}
