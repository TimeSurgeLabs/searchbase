import Head from "next/head";
import { useState } from "react";

const processFiles = async (files: FileList) => {
  // convert files to array
  const filesArray = Array.from(files);

  // for each file in the array, hit the load endpoint
  // with the text content of the file in the body of the request
  // req body structure: { content: string }
  const promises = filesArray.map(async (file: File) => {
    const content = await file.text();
    const filename = file.name;
    const res = await fetch("/api/load", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, filename }),
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
    try {
      setIsLoading(true);
      e.preventDefault();
      if (!files || files?.length === 0) return;
      await processFiles(files);
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window.success_modal.showModal();
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      window.error_modal.showModal();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <main>
      <Head>
        <title>Load</title>
      </Head>

      <dialog id="success_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Successfully Uploaded Files!</h3>
          <p className="py-4">You are now free to start chatting!</p>
          <div className="modal-action">
            <button className="btn-success btn">Close</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="error_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Error Uploading Files!</h3>
          <p className="py-4">Please try again later!</p>
          <div className="modal-action">
            <button className="btn-error btn">Close</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

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
                    <div className="join">
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        required
                        multiple
                        accept=".txt,.md"
                        className="file-input join-item w-full max-w-xs"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={() => setFiles(null)}
                        className="btn-error join-item btn"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <button
                    disabled={isLoading || !files || files?.length === 0}
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
