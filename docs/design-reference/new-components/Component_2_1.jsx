import Component_2_1_1 from './Component_2_1_1';

function Component_2_1() {
  return (
    <section
      className="[animation-delay:0.1s] will-change-[transform,opacity] caret-[oklch(0.2_0.02_280)] [color-scheme:light] group"
      data-component-id="Component_2_1"
    >
      <div className="bg-[#fdf9fb] shadow-[rgba(0,0,0,0.05)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_0px] caret-[oklch(0.2_0.02_280)] [color-scheme:light] px-4 py-5 rounded-br-[22px] rounded-t-[22px] rounded-bl-[22px] group">
        <div className="caret-[oklch(0.2_0.02_280)] [color-scheme:light] mb-5 group">
          <h3 className="text-[#3a2e2e] leading-[28px] font-bold text-[20px] tracking-[-0.4px] caret-[#3a2e2e] [color-scheme:light] mt-0 mb-1.5 group">
            NathIA Sempre Contigo
            <span className="text-[28px] caret-[#3a2e2e] [color-scheme:light] group">
              ✨
            </span>
          </h3>
          <p className="text-[#6a5450] leading-[20px] font-medium text-[14px] caret-[#6a5450] [color-scheme:light] my-0 group">
            Sua AssistenteNath está aqui pra você
          </p>
        </div>
        <button
          aria-label="Enviar áudio para a NathIA"
          className="bg-[#ff8ba3] text-white text-[16px] w-full min-w-11 min-h-14 flex justify-center items-center gap-y-2.5 gap-x-2.5 shadow-[rgba(255,139,163,0.25)_0px_2px_8px_0px] caret-white [color-scheme:light] [appearance:button] mb-3 px-5 py-3.5 rounded-br-full rounded-t-full rounded-bl-full group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(255, 255, 255)"
            strokeWidth="2px"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-center align-middle w-5 h-5 block overflow-x-hidden overflow-y-hidden fill-none stroke-white stroke-[2px] [stroke-linecap:round] [stroke-linejoin:round] caret-white [color-scheme:light] group"
            data-svg-size="788"
          >
            <path
              d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
              className="inline fill-none stroke-white stroke-[2px] [stroke-linecap:round] [stroke-linejoin:round] caret-white [color-scheme:light] group"
            ></path>
            <path
              d="M19 10v2a7 7 0 0 1-14 0v-2"
              className="inline fill-none stroke-white stroke-[2px] [stroke-linecap:round] [stroke-linejoin:round] caret-white [color-scheme:light] group"
            ></path>
          </svg>
          <span className="leading-[24px] font-bold text-center [white-space-collapse:collapse] [text-wrap-mode:nowrap] block caret-white [color-scheme:light] group">
            Enviar áudio para a NathIA
          </span>
        </button>
        <button
          aria-label="Digitar mensagem para a NathIA"
          className="bg-[rgba(0,0,0,0)] text-[#ff8ba3] text-[16px] w-full min-w-11 min-h-[52px] flex justify-center items-center gap-y-2 gap-x-2 caret-[#ff8ba3] [color-scheme:light] [appearance:button] mb-4 px-5 py-3 rounded-br-full rounded-t-full rounded-bl-full group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(255, 139, 163)"
            strokeWidth="2px"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-center align-middle w-5 h-5 block overflow-x-hidden overflow-y-hidden fill-none stroke-[#ff8ba3] stroke-[2px] [stroke-linecap:round] [stroke-linejoin:round] caret-[#ff8ba3] [color-scheme:light] group"
            data-svg-size="632"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              className="inline fill-none stroke-[#ff8ba3] stroke-[2px] [stroke-linecap:round] [stroke-linejoin:round] caret-[#ff8ba3] [color-scheme:light] group"
            ></path>
          </svg>
          <span className="leading-[24px] font-semibold text-center [white-space-collapse:collapse] [text-wrap-mode:nowrap] block caret-[#ff8ba3] [color-scheme:light] group">
            Digitar mensagem
          </span>
        </button>
        <p className="[white-space-collapse:collapse] [text-wrap-mode:wrap] text-[#6a5450] leading-relaxed text-[12px] text-center break-keep caret-[#6a5450] [color-scheme:light] mt-0 mb-5 group">
          A NathIA responde em poucos segundos. Pode desabafar.
        </p>
        <Component_2_1_1 />
      </div>
    </section>
  );
}

export default Component_2_1;
