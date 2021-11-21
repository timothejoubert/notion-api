import Link from "next/link";
import { getDatabase } from "../../lib/notion";
import { Text } from "../../pages/[id].js";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
  return (
    <>
      <h1>Tesssssst</h1>
      <ol className={styles.posts}>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/${post.id}`}>
              <Text text={post.properties.Name.title} />
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
};
