import { connectToDatabase } from "@/utils/connectMongo";

async function getData() {
  try {
    // DB Connect
    const client = await connectToDatabase();
    const db = client.db("programming");

    // DB Query for languages
    const items = await db.collection("languages").find({}).toArray();
    const res = { items };
    return res;
  } catch (error) {
    throw new Error("Failed to fetch data please try again later.");
  }
}

const Page = async () => {
  const data = await getData();

  return (
    <>
      <div className="container mx-auto mt-8">
        <ul className="grid grid-cols-4 gap-4 text-center">
          {data.items.map((item) => (
            <li key={item._id} className="bg-green-500">
              <h2>{item.name}</h2>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Page;
