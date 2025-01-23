import gsap from "gsap";

const LOOP = 3;

export const calculator = (num: number) => `-${(num / 11) * 100}%`;

export const gsapOne = (
  elem: HTMLDivElement,
  number: number,
  onComplete: () => void,
  reset: boolean = false
) => {
  gsap.to(elem, {
    y: !reset ? calculator(10) : calculator(number), // Cuộn lên cho mỗi phần tử
    duration: 1.2, // Thời gian cuộn
    ease: "none", // Easing cho hiệu ứng cuộn
    stagger: 0.2, // Độ trễ giữa các phần tử để cuộn mượt
    repeat: !reset ? LOOP : 0,
    onComplete: () => {
      if (reset) {
        onComplete();
        return;
      }
      gsap.set(elem, { y: 0 });
      gsapOne(elem, number, onComplete, true); // Gọi lại hàm để quay lại khi đã hoàn thành
    },
  });
};
