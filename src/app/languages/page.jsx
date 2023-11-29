import { connectToDatabase } from "@/utils/connectMongo";

async function getData() {
  try {
    // DB Connect
    const client = await connectToDatabase();
    const db = client.db("programming");
  } catch (error) {}
}

const Page = () => {
  return (
    <>
      <div className="container mx-auto mt-8">Hello</div>
    </>
  );
};

export default Page;
