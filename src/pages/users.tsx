/* eslint-disable @typescript-eslint/no-misused-promises */
import UsersTable from "@/components/UsersTable";
import Head from "next/head";
import React from "react";

import { api } from "@/utils/api";

export default function Users() {
  const { data, refetch } = api.users.getUsers.useQuery({});

  // POST to /api/users/makeAdmin
  const makeAdmin = async (id: string) => {
    const url = `/api/users/makeAdmin?id=${id}`;
    await fetch(url, {
      method: "POST",
    });
    await refetch();
  };

  // DELETE to /api/users/makeAdmin
  const deleteAdmin = async (id: string) => {
    const url = `/api/users/makeAdmin?id=${id}`;
    await fetch(url, {
      method: "DELETE",
    });
    await refetch();
  };

  const deleteUser = async (id: string) => {
    const url = `/api/users/delete?id=${id}`;
    await fetch(url, {
      method: "DELETE",
    });
    await refetch();
  };

  return (
    <main className="md:m-4">
      <Head>
        <title>Users</title>
      </Head>
      <UsersTable
        users={data}
        makeAdmin={makeAdmin}
        deleteAdmin={deleteAdmin}
        deleteUser={deleteUser}
      />
    </main>
  );
}
