import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface QueryParameterHookResult {
  value: string;
  updateQueryParam: (newValue: string) => void;
}

const useQueryParameter = (paramName: string): QueryParameterHookResult => {
  const router = useRouter();
  const queryParams = new URLSearchParams(router.asPath.split(/\?/)[1]);
  const initialValue = queryParams.get(paramName) || "";

  const [value, setParamValue] = useState<string>(initialValue);

  useEffect(() => {
    const updatedValue = queryParams.get(paramName) || "";
    setParamValue(updatedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, paramName]);

  const updateQueryParam = (newValue: string) => {
    const updatedParams = new URLSearchParams(router.asPath.split(/\?/)[1]);
    updatedParams.set(paramName, newValue);

    void router.push({
      pathname: router.pathname,
      search: updatedParams.toString(),
    });
  };

  return { value, updateQueryParam };
};

export default useQueryParameter;
