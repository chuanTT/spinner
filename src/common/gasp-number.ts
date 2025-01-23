import gsap from "gsap";

const LOOP = 3;

export const calculator = (num: number) => `-${(num / 11) * 100}%`;

export interface IGsapOnePayload {
  elem: HTMLDivElement;
  number: number;
  onComplete: () => void;
  reset?: boolean;
  onAlmostFinished?: (progress: number) => void;
}

export const gsapOne = ({
  elem,
  number,
  onComplete,
  reset = false,
  onAlmostFinished,
}: IGsapOnePayload) => {
  gsap.to(elem, {
    y: !reset ? calculator(10) : calculator(number), // Cuộn lên cho mỗi phần tử
    duration: 1.2, // Thời gian cuộn
    ease: "none", // Easing cho hiệu ứng cuộn
    stagger: 0.2, // Độ trễ giữa các phần tử để cuộn mượt
    repeat: !reset ? LOOP : 0,
    onUpdate: function () {
      const progress = this.progress();
      if (progress >= 0.9 && reset) {
        onAlmostFinished?.(progress);
      }
    },
    onComplete: () => {
      if (reset) {
        onComplete();
        return;
      }
      gsap.set(elem, { y: 0 });
      gsapOne({
        elem,
        number,
        onComplete,
        reset: true,
        onAlmostFinished
      }); // Gọi lại hàm để quay lại khi đã hoàn thành
    },
  });
};
