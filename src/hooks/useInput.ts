import { ChangeEvent, useCallback } from "react";
import { useState } from "react";

type UseInputReturn = [
  string,
  (e: ChangeEvent<HTMLInputElement>) => void,
  React.Dispatch<React.SetStateAction<string>>
];

const useInput = (): UseInputReturn => {
  const [value, setValue] = useState("");

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return [value, onChange, setValue];
};

export default useInput;
