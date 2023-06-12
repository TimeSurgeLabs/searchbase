import Header from "@/components/Header";
import Head from "next/head";
import { useState } from "react";

const processFiles = async (files: FileList) => {
  // convert files to array
  const filesArray = Array.from(files);

  // for each file in the array, hit the load endpoint
  // with the text content of the file in the body of the request
  // req body structure: { content: string }
  const promises = filesArray.map(async (file) => {
    const content = await file.text();
    const res = await fetch("/api/load", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    return (await res.json()) as {
      id: string;
      content: string;
      vector: number[];
    };
  });

  // wait for all the promises to resolve
  const results = await Promise.all(promises);

  // return the results
  return results;
};

export default function LoadPage() {
  // const [datasetName, setDatasetName] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    if (!files || files?.length === 0) return;
    await processFiles(files);
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <main>
      <Head>
        <title>Load</title>
      </Head>
      <Header />
      <div className="flex flex-col justify-center py-6 sm:py-12">
        <div className="relative sm:mx-auto sm:max-w-xl">
          <div className="card rounded-3xl shadow sm:p-10">
            <div className="w-full max-w-md">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold">
                  Upload Documents
                </h2>
              </div>
              <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                  void handleSubmit(e)
                }
                className="mt-8"
              >
                <div className="flex flex-col items-start justify-center gap-4">
                  {/* <div>
                    <label htmlFor="dataset-name" className="label">
                      Dataset Name
                    </label>
                    <input
                      id="dataset-name"
                      name="dataset-name"
                      type="text"
                      required
                      className="input-bordered input"
                      placeholder="Dataset name"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                    />
                  </div> */}
                  <div>
                    <label htmlFor="file-upload" className="label">
                      Upload Files
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      required
                      multiple
                      accept=".txt,.md"
                      className="file-input w-full max-w-xs"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn-primary btn mt-5"
                  >
                    {isLoading ? (
                      <span className="loading loading-dots loading-lg"></span>
                    ) : (
                      "Load"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
