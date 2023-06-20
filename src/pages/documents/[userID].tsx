import DocumentTable from "@/components/DocumentTable";
import Head from "next/head";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function Documents() {
  const router = useRouter();
  const { data, refetch } = api.document.getDocumentsByUser.useQuery({
    userId: router.query?.userID as string,
  });

  return (
    <main className="md:m-4">
      <Head>
        <title>Documents</title>
      </Head>
      <DocumentTable
        documents={data}
        refetch={async () => {
          await refetch();
        }}
      />
    </main>
  );
}
