import Link from "next/link";
import { createClient } from "pexels";

const client = createClient(
  "563492ad6f917000010000012f5d21c2339e4b598b19fd78c5242145"
); // Hardcoded API key

// This function generates static paths for the dynamic routes
export async function generateStaticParams() {
  //  Fetch photos from the Pexels API, Dynamically generate paths
  const response = await fetch("http://localhost:3000/pages").then((res) =>
    res.json()
  );

  // Return an empty array in case of an error
  if (response["error"]) {
    console.error(response["error"]);
    return [];
  }

  // Map photos to generate paths
  const paths = response.map((item) => ({
    id: item.id, // Ensure ID is a string for dynamic routing
  }));

  // Return paths for the dynamic route
  // [ { id: '1' }, { id: '2' }, { id: '3' } ]
  return paths;

  // return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

const SSG = async ({ params }) => {
  // Await the params
  const { id } = await params; // Await params to access id properly

  const response = await client.photos.curated({ per_page: 30, page: id });
  const photos = response["photos"].map((data) => ({
    id: data.id,
    src: data.src.medium,
  }));

  // Find the specific photo using params.id
  const specificPhoto = photos.find((photo) => photo.id === id);

  return (
    <main>
      {photos.length === 0 ? (
        <section className="flex items-center justify-center min-h-screen">
          <h1 className="self-center text-2xl font-bold">Carregando...</h1>
        </section>
      ) : (
        <>
          <section className="flex items-center justify-center flex-1 w-screen">
            <Link href={`/${parseInt(id) + 1}`}>
              <div className="flex items-center justify-center px-6 py-1 my-8 mb-4 mr-6 text-lg font-bold text-white bg-blue-500 rounded shadow hover:bg-blue-600">
                Próxima página
              </div>
            </Link>
            <Link href="/">
              <div className="flex self-center px-6 py-1 my-8 mb-4 text-lg font-bold text-white bg-blue-500 rounded shadow hover:bg-blue-600">
                Home
              </div>
            </Link>
          </section>
          <section className="grid grid-flow-col grid-cols-6 grid-rows-5 gap-6 p-4">
            {photos.map((photo) => (
              <img key={photo.id} src={photo.src} className="rounded" />
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default SSG;
