import { useRouter } from "next/router";

import Head from "next/head";
import DocContent from "../components/docs/docContent";
import DocHeader from "../components/docs/docHeader";
import EditThisPage from "../components/EditThisPage";
import { getDocBySlug } from "../src/helpers/docs";
import markdownToHtml from "../src/helpers/docs/markdownFormat";
import { DocType, DocTypeEnum } from "../src/helpers/docs/types";
import Custom404 from "./404";

type Props = {
  doc: DocType;
};

export default function Post({ doc }: Props) {
  const router = useRouter();
  // TODO: 2x check to make sure we correctly set 404
  if (!router.isFallback && !doc?.slug) {
    console.warn(`Unable to find this doc!`);
    return <Custom404 />;
  }
  const githubLink: string = `https://github.com/KryptikApp/swordExample/blob/main/blog/${doc.slug}.md`;
  return (
    <div>
      <Head>
        <title>{doc.title}</title>
        <meta name="description" content={doc.oneLiner} />
        {/* to do: defer loading to speed up page load. ensure doesn't request on each page. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
          integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <div className="max-w-2xl mx-auto">
        {router.isFallback ? (
          <h1 className="text-2xl text-black dark:text-white">Loading....</h1>
        ) : (
          <div>
            <DocHeader
              title={doc.title}
              image={doc.image || undefined}
              hideIcon={true}
              lastUpdated={doc.lastUpdate}
              hideBackButton={true}
              emoji={doc.emoji || undefined}
            />
            <DocContent content={doc.content} />
          </div>
        )}
        {/* edit this page */}
        <div className="max-w-3xl mx-auto my-8">
          <EditThisPage link={githubLink} />
        </div>
      </div>
      <div className="h-[24vh]">
        {/* padding div for space between top and main elements */}
      </div>
    </div>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  let newDoc: DocType = getDocBySlug({
    slug: "guide",
    fields: [
      "slug",
      "title",
      "lastUpdate",
      "image",
      "oneLiner",
      "content",
      "category",
      "emoji",
    ],
    docEnum: DocTypeEnum.Blog,
  });
  // create html from markdown content
  const content: string = await markdownToHtml(newDoc.content || "");
  newDoc.content = content;
  return {
    props: {
      doc: newDoc,
    },
  };
}
