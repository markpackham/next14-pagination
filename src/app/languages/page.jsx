import { connectToDatabase } from "@/utils/connectMongo";

async function getData(perPage) {
  try {
    // DB Connect
    const client = await connectToDatabase();
    const db = client.db("programming");

    // DB Query for languages
    const items = await db
      .collection("languages")
      .find({})
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

  const data = await getData(perPage);

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
      </div>
    </>
  );
};

export default Page;
