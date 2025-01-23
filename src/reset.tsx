import { useEffect, useState } from "react";
import { getDataUsedNumbers } from "./common/functions";
import { Input } from "./components/input";
import { Button } from "./components/button";
import { usedNumberDB } from "./common/db";

const Reset = () => {
  const [dataUsedNumbers, setDataUsedNumbers] = useState<number[]>([]);

  const refreshData = async () => {
    const dataGua = await getDataUsedNumbers();
    setDataUsedNumbers(dataGua);
  };

  const handleRemove = async (num: number) => {
    await usedNumberDB.delete(num);
    refreshData();
  };

  const handleRemoveAll = async () => {
    await usedNumberDB.clearAll();
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex flex-col items-center p-5 gap-5">
      <div className="flex justify-end">
        <Button
          disabled={dataUsedNumbers?.length <= 0}
          onClick={handleRemoveAll}
        >
          Xóa tất cả
        </Button>
      </div>
      <div className="max-h-[300px] space-y-5 overflow-y-auto px-3">
        {dataUsedNumbers?.map((item, index) => {
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

export default Reset;
