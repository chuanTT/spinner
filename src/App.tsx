import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import bg from "./assets/images/bg.png";
import snake1 from "./assets/images/snake-1.png";
import snake2 from "./assets/images/snake-2.png";
import snake3 from "./assets/images/snake-3.png";
import gsap from "gsap";
import FireworkCanvas from "./firework";
import { parseArray } from "./common/functions";

const MAX_NUMBER = 136;
const VITECH_USED_NUMBERS = "VITECH_USED_NUMBERS";

function App() {
  const [isMouse, setIsMouse] = useState(false);
  const [isSpin, setIsSpin] = useState(false);
  const arrayNumber = useMemo(() => MAX_NUMBER?.toString()?.split(""), []);
  const length = arrayNumber?.length;
  const usedNumbers = useRef<Set<number>>(new Set());
  const guaranteedNumbers = useRef([]);

  const calculator = useCallback((num: number) => `-${(num / 11) * 100}%`, []);

  const gsapOne = useCallback(
    (
      elem: HTMLDivElement,
      number: number,
      onComplete: () => void,
      reset: boolean = false
    ) => {
      gsap.to(elem, {
        y: !reset ? calculator(10) : calculator(number), // Cuộn lên cho mỗi phần tử
        duration: 1, // Thời gian cuộn
        ease: "none", // Easing cho hiệu ứng cuộn
        stagger: 0.2, // Độ trễ giữa các phần tử để cuộn mượt
        repeat: !reset ? 2 : 0,
        onComplete: () => {
          if (reset) {
            onComplete();
            return;
          }
          gsap.set(elem, { y: 0 });
          gsapOne(elem, number, onComplete, true); // Gọi lại hàm để quay lại khi đã hoàn thành
        },
      });
    },
    [calculator]
  );

  const setSessionStorage = useCallback((arrSet: Set<number>) => {
    sessionStorage?.setItem(
      VITECH_USED_NUMBERS,
      JSON.stringify(Array.from(arrSet))
    );
  }, []);

  const randomUnixIndex = useCallback(() => {
    // Ưu tiên lấy từ danh sách guaranteedNumbers
    if (guaranteedNumbers.current.length > 0) {
      const guaranteedNumber = guaranteedNumbers.current.shift(); // Lấy số đầu tiên và xóa luôn
      if (guaranteedNumber !== undefined) {
        usedNumbers.current.add(guaranteedNumber);
        setSessionStorage(usedNumbers.current);
        return guaranteedNumber;
      }
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * MAX_NUMBER) + 1;
    } while (usedNumbers.current.has(randomIndex)); // Lặp lại nếu số đã tồn tại

    usedNumbers.current.add(randomIndex); // Thêm số vào Set
    setSessionStorage(usedNumbers.current);
    return randomIndex;
  }, [setSessionStorage]);

  const handleRandomValue = useCallback((): {
    arrValues: string[];
    randomIndex: number;
  } => {
    const prefix = "0".repeat(length - 1);
    const numberSlice = -length;
    const randomIndex = randomUnixIndex();
    const arrValues = `${prefix}${randomIndex}`
      .slice(numberSlice)
      .toString()
      .split("");
    return {
      arrValues,
      randomIndex,
    };
  }, [length, randomUnixIndex]);

  const handleSpiner = useCallback(async () => {
    if (isSpin) return;
    const { arrValues } = handleRandomValue();
    const elems = document.querySelectorAll(".number > div");
    let isDone = false;
    elems.forEach((elem, index) => {
      gsap.set(elem, { y: 0 });
      const number = arrValues?.[index];
      gsapOne(elem as HTMLDivElement, Number(number), () => {
        if (isDone) return;
        isDone = true;
        setIsSpin(false);
      });
    });
    setIsSpin(true);
  }, [isSpin, gsapOne, handleRandomValue]);

  useLayoutEffect(() => {
    if (isMouse) return;
    const values = sessionStorage.getItem(VITECH_USED_NUMBERS);
    const newValues = parseArray(values ?? "[]");
    usedNumbers.current = new Set(newValues);
    guaranteedNumbers.current = guaranteedNumbers.current.filter(
      (value) => !newValues.includes(value)
    );
    setIsMouse(true);
  }, [isMouse]);

  return (
    <>
      <div className="h-screen relative z-[10]">
        <div className="absolute top-[450px] left-1/2 -translate-x-1/2">
          <div className="h-[229px] w-[600px] rounded-lg bg-[#FFC04A] p-[6px]">
            <div className="w-full h-full bg-[#FDE6A0] rounded-[0.3rem] p-5 flex items-center gap-5">
              <div className="flex items-center gap-3 h-full [&>*]:w-[125px] [&>*]:h-full">
                {arrayNumber?.map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="text-center bg-[#C02520] rounded-[0.6rem] p-1"
                    >
                      <div
                        className="h-full text-white flex flex-col overflow-hidden items-center justify-center rounded-[0.4rem] font-semibold"
                        style={{
                          background: "linear-gradient(#FFF080, #FF7700)",
                        }}
                      >
                        <div className="h-[128px] overflow-hidden number select-none">
                          <div className="flex flex-col text-center text-9xl flex-shrink-[1]">
                            {Array(10)
                              .fill("")
                              .map((_, indexNumber) => {
                                const number = indexNumber;
                                return (
                                  <Fragment key={indexNumber}>
                                    <span
                                      className="leading-[128px]"
                                      data-value={number}
                                    >
                                      {indexNumber}
                                    </span>

                                    {number === 9 && (
                                      <span
                                        className="leading-[128px]"
                                        data-value={0}
                                      >
                                        {0}
                                      </span>
                                    )}
                                  </Fragment>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className={`flex items-center justify-center bg-[#F5971E] text-white p-1 rounded-[0.6rem] min-w-[126px] h-[64px] ${
                  isSpin ? "opacity-50 cursor-default" : ""
                }`}
                onClick={handleSpiner}
              >
                <div className="w-full h-full bg-[#DE0202] rounded-[0.4rem] flex items-center justify-center text-3xl font-semibold uppercase">
                  Quay
                </div>
              </button>
            </div>
          </div>
          <div
            className="absolute h-[249px] w-[265px] bg-contain bg-no-repeat -top-1/2 left-0 -rotate-[8.94deg] -translate-x-1/2 z-[-2]"
            style={{ backgroundImage: `url(${snake1})` }}
          ></div>

          <div
            className="absolute h-[249px] w-[265px] bg-contain bg-no-repeat right-0 top-0 rotate-[0.89deg] translate-x-[45%] z-[-2]"
            style={{ backgroundImage: `url(${snake2})` }}
          ></div>

          <div
            className="absolute h-[166px] w-[384px] bg-contain bg-no-repeat -rotate-[8.66deg] right-0 bottom-[-57px] translate-x-[20%] z-[-2]"
            style={{ backgroundImage: `url(${snake3})` }}
          ></div>

          <div
            className="absolute h-[166px] w-[384px] bg-contain bg-no-repeat -rotate-[8.67deg] left-0 -bottom-[50px] -translate-x-[30%] z-[-2]"
            style={{ backgroundImage: `url(${snake3})` }}
          ></div>
        </div>
      </div>
      <FireworkCanvas />
      <div
        className="fixed inset-0 bg-no-repeat bg-cover z-0"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      ></div>
    </>
  );
}

export default App;
