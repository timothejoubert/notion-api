import Link from "next/link";
import { getDatabase } from "../lib/notion";
import {useState, useEffect} from 'react';
import { Text } from "./[id].js";

export const databaseId = "0eb34bc8b53242d7b3acfb38639bff5c";
//"0eb34bc8b53242d7b3acfb38639bff5c;"
//process.env.REACT_APP_NOTION_DATABASE;

const Page = ({pageData}) => {
  return (
    <div style={{margin: '30px 0'}}>
      <h3 style={{display: 'inline-block'}}>Jour {pageData.jour}</h3>
      <h2 style={{display: 'inline-block'}}>{pageData.title}</h2>
      {pageData.description && 
        <p>{pageData.description}</p>
      }
    </div>
  )
}
export default function Home({pages}) {
  //console.log(pages)
  const [pagesData, setPagesData] = useState([]);
  const [ascending, setAscending] = useState(false);

  const parseData = () => {
    pagesData = []
    pages.map(page => {
      var pageData = {};
      pageData.id = page.id;
      pageData.jour = page.properties.Jour.number;
      pageData.title = page.properties.Nom.title[0].plain_text;
      pageData.description = page.properties.Description.rich_text[0] ? page.properties.Description.rich_text[0].plain_text : null;
      pagesData.push(pageData);
    })
    return pagesData;
  }

  const changeOrder = () => {
    return pagesData.sort((a, b) => { 
      if(ascending){
        return (a.jour - b.jour); 
      }else{
        return (b.jour - a.jour); 
      }
    });
  }

  const handleOrder = () => {
    setAscending(ascending =! ascending);
  }

  const randomOrder = () => {
    console.log("suffle order");
    for (var i = pagesData.length - 1; i > 0; i--) {
      var rand = Math.floor(Math.random() * (i + 1));
      [pagesData[i], pagesData[rand]] = [pagesData[rand], pagesData[i]]
    }
  }

  useEffect(() => {
    console.log("init data", ascending)
    setPagesData(parseData());
  }, [])

  useEffect(() => {
    console.log("ascending ", ascending);
    changeOrder();
  }, [ascending])

  

  return(
    <>
    {pagesData && (
    <>
      <span onClick={handleOrder} style={{cursor: "pointer"}}>Order {ascending ? "↓": "↑" }</span>
      {pagesData.map( page => {
        return(
          <Page pageData={page} key={page.id}/>
        )
      })}
    </>
    )}
    </>
  )

  // return (
  //   <>
  //     <h1>Tesssssst</h1>
  //     <ol className={styles.posts}>
  //       {posts.map((post) => (
  //         <li key={post.id}>
  //           <Link href={`/${post.id}`}>
  //             <Text text={post.properties.Name.title} />
  //           </Link>
  //         </li>
  //       ))}
  //     </ol>
  //   </>
  // );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);  

  return {
    props: { pages : database },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
};
