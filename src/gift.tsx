import { useEffect, useRef, useState } from "react";
import { getDataGuaranteedNumbers } from "./common/functions";
import { MAX_NUMBER } from "./App";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { guaranteedNumberDB } from "./common/db";
import { useLayoutServiceWorker } from "./context";

const Gift = () => {
  const { handleEmitData } = useLayoutServiceWorker();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataGuaranteed, setDataGuaranteed] = useState<number[]>([]);

  const refreshData = async () => {
    const dataGua = await getDataGuaranteedNumbers();
    setDataGuaranteed(dataGua);
  };

  const refreshInput = async () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAdd = async () => {
    const value = inputRef.current?.value;
    if (!value) {
      refreshInput();
      return;
    }
    const newValue = +value;
    if (newValue <= 0 || newValue > MAX_NUMBER) {
      refreshInput();
      return;
    }
    await guaranteedNumberDB.add(newValue);
    await refreshData();
    handleEmitData("add_guaranteed", newValue);
    refreshInput();
  };

  const handleRemove = async (num: number) => {
    await guaranteedNumberDB.delete(num);
    handleEmitData("delete_guaranteed", num);
    refreshData();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5">
      <div className="flex items-center gap-5">
        <Input
          type="number"
          className="w-[200px]"
          placeholder={`Không vượt quá ${MAX_NUMBER}`}
          required
          max={MAX_NUMBER}
          min={1}
          ref={inputRef}
        />
        <Button onClick={handleAdd}>Thêm</Button>
      </div>
      <div className="max-h-[300px] space-y-5 overflow-y-auto px-3">
        {dataGuaranteed?.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-5">
              <Input className="w-[200px]" value={item} readOnly />
              <Button
                className="min-w-[67px]"
                onClick={() => handleRemove(item)}
                variant={"destructive"}
              >
                Xóa
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gift;
