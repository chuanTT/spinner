import { Fragment, useMemo, useState } from "react";
import bg from "./assets/images/bg.png";
import snake1 from "./assets/images/snake-1.png";
import snake2 from "./assets/images/snake-2.png";
import snake3 from "./assets/images/snake-3.png";
import gsap from "gsap";
import { guaranteedNumberDB, usedNumberDB } from "./common/db";
import { getDataDB } from "./common/functions";
import { useLayoutServiceWorker } from "./context";
import { FireworkCanvas } from "./components";
import { gsapOne } from "./common/gasp-number";
import {
  audioClickFunc,
  audioLoopRoller,
  audioWinnerFunc,
} from "./common/audio-func";
import Confetti from "react-confetti-boom";

export const MAX_NUMBER = 136;

function App() {
  const [isWinner, setIsWinner] = useState(false);
  const { handleEmitData } = useLayoutServiceWorker();
  const [isSpin, setIsSpin] = useState(false);
  const arrayNumber = useMemo(() => MAX_NUMBER?.toString()?.split(""), []);
  const length = arrayNumber?.length;

  const handleAddUsed = async (num: number) => {
    await usedNumberDB.add(num);
    handleEmitData("add_used", num);
  };

  const handleDeleteGuaranteed = async (num: number) => {
    await guaranteedNumberDB.delete(num);
    handleEmitData("delete_guaranteed", num);
  };

  const randomUnixIndex = async () => {
    const { guaranteedNumbers, usedNumbers } = await getDataDB();
    const usedNumberSet = new Set(usedNumbers);
    // Ưu tiên lấy từ danh sách guaranteedNumbers
    if (guaranteedNumbers.length > 0) {
      const indexRandom = Math.floor(Math.random() * guaranteedNumbers.length);
      const guaranteedNumber = guaranteedNumbers?.[indexRandom]; // Lấy số đầu tiên và xóa luôn
      if (guaranteedNumber !== undefined) {
        usedNumberSet.add(guaranteedNumber);
        await handleAddUsed(guaranteedNumber);
        await handleDeleteGuaranteed(guaranteedNumber);
        return guaranteedNumber;
      }
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * MAX_NUMBER) + 1;
    } while (usedNumberSet.has(randomIndex)); // Lặp lại nếu số đã tồn tại
    await handleAddUsed(randomIndex);
    return randomIndex;
  };

  const handleRandomValue = async () => {
    const prefix = "0".repeat(length - 1);
    const numberSlice = -length;
    const randomIndex = await randomUnixIndex();
    const arrValues = `${prefix}${randomIndex}`
      .slice(numberSlice)
      .toString()
      .split("");
    return {
      arrValues,
      randomIndex,
    };
  };

  const handleSpiner = async () => {
    if (isSpin) return;
    const { arrValues } = await handleRandomValue();
    const elems = document.querySelectorAll(".number > div");
    let isDone = false;
    const loopRoller = audioLoopRoller();
    loopRoller.loop = true;
    elems.forEach((elem, index) => {
      gsap.set(elem, { y: 0 });
      const number = arrValues?.[index];
      gsapOne({
        elem: elem as HTMLDivElement,
        number: Number(number),
        onComplete: () => {
          if (isDone) return;
          const audioWinner = audioWinnerFunc();
          isDone = true;
          loopRoller.pause();
          audioWinner.play();
          setIsSpin(false);
          setIsWinner(true);
        },
        onAlmostFinished: (progress) => {
          if (progress >= 0.8) {
            loopRoller.volume = Math.max(0, 1 - (progress - 0.8) * 5); // Âm lượng giảm từ 1 -> 0
            // Tăng tốc độ vòng quay khi bắt đầu, giảm dần khi gần kết thúc
            loopRoller.playbackRate = 1 - progress * 0.5; // Tốc độ từ 1 -> 0.5
          }
        },
      });
    });
    const audioClick = audioClickFunc();
    audioClick.play();
    loopRoller.play();
    setIsSpin(true);
    setIsWinner(false);
  };

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

      {isWinner && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <Confetti
            mode="boom"
            particleCount={250}
            x={0.5}
            y={0.5}
            colors={["#FF7F50", "#00FF00", "#FFC0CB", "#0000FF", "#FFFF00"]}
            launchSpeed={1.4}
          />
        </div>
      )}
    </>
  );
}

export default App;
