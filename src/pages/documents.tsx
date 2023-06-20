import DocumentTable from "@/components/DocumentTable";
import Head from "next/head";
import { api } from "@/utils/api";

export default function Documents() {
  const { data, refetch } = api.document.getDocuments.useQuery();

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
