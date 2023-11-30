import { connectToDatabase } from "@/utils/connectMongo";
import Link from "next/link";

// Example page url query http://localhost:3000/languages?page=2
async function getData(perPage, page) {
  try {
    // DB Connect
    const client = await connectToDatabase();
    const db = client.db("programming");

    // DB Query for languages
    const items = await db
      .collection("languages")
      .find({})
      // Calculate page offset
      .skip(perPage * (page - 1))
      .limit(perPage)
      .toArray();

    const itemCount = await db.collection("languages").countDocuments({});
    const res = { items, itemCount };
    return res;
  } catch (error) {
    throw new Error("Failed to fetch data please try again later.");
  }
}

const Page = async ({ searchParams }) => {
  //console.log(searchParams.page);

  // round down so page 4.9 or 4.1 just gives 4
  let page = parseInt(searchParams.page, 10);
  // handle negatives and nulls with a default to page 1
  page = !page || page < 1 ? 1 : page;
  // Only 8 items per page
  const perPage = 8;

  const data = await getData(perPage, page);

  // Total Pages
  const totalPages = Math.ceil(data.itemCount / perPage);

  // Previous Page, handle offset
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  // Next page
  const nextPage = page + 1;

  // Page Numbers
  const pageNumbers = [];
  const offsetNumber = 3;
  // Check if we are not on the first page or last page
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <div className="container mx-auto mt-8">
        <ul className="grid grid-cols-4 gap-4 text-center">
          {data.items.map((item) => (
            <li
              key={item._id}
              className="bg-green-500 rounded-md p-4 text-black"
            >
              {item.name}
            </li>
          ))}
        </ul>

        <div className="flex justify-center items-center mt-16">
          <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
            {page === 1 ? (
              <div className="opacity-60" aria-disabled="true">
                Previous
              </div>
            ) : (
              <Link href={`?page=${prevPage}`} aria-label="Previous Page">
                Previous
              </Link>
            )}

            {/* Highlight when on current page */}
            {pageNumbers.map((pageNumber, index) => (
              <Link
                key={index}
                className={
                  page === pageNumber
                    ? "bg-green-500 fw-bold px-2 rounded-md text-black"
                    : "hover:bg-green-500 px-1 rounded-md"
                }
                href={`?page=${pageNumber}`}
              >
                {pageNumber}
              </Link>
            ))}

            {page === totalPages ? (
              <div className="opacity-60" aria-disabled="true">
                Next
              </div>
            ) : (
              <Link href={`?page=${nextPage}`} aria-label="Next Page">
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
