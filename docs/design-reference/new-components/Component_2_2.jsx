import Component_2_2_1 from './Component_2_2_1';

function Component_2_2() {
  return (
    <div
      className="[animation-delay:0.15s] will-change-[transform,opacity] caret-[oklch(0.2_0.02_280)] [color-scheme:light] group"
      data-component-id="Component_2_2"
    >
      <div
        className="opacity-100 [transform:none] bg-[rgba(243,247,255,0.95)] relative overflow-x-hidden overflow-y-hidden shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(228,205,221,0.2)_0px_8px_24px_0px,rgba(228,205,221,0.15)_0px_4px_8px_-1px] backdrop-blur-sm caret-[oklch(0.2_0.02_280)] [color-scheme:light] mt-0 p-6 rounded-br-[32px] rounded-t-[32px] rounded-bl-[32px] border-[rgba(191,219,254,0.6)] border group"
        data-style-id="style-1-1765484132970"
      >
        <div
          className="absolute caret-[oklch(0.2_0.02_280)] [color-scheme:light] pointer-events-none rounded-br-[32px] rounded-t-[32px] rounded-bl-[32px] inset-0 group"
          data-style-id="style-2-1765484132970"
        ></div>
        <div className="relative z-10 caret-[oklch(0.2_0.02_280)] [color-scheme:light] group">
          <div className="opacity-100 flex justify-between items-center caret-[oklch(0.2_0.02_280)] [color-scheme:light] mb-4 group">
            <h2 className="text-[#1e3a5f] leading-[28px] font-bold text-[20px] tracking-[-0.4px] caret-[#1e3a5f] [color-scheme:light] my-0 group">
              Vibe de Hoje
            </h2>
          </div>
          <div className="w-full caret-[oklch(0.2_0.02_280)] [color-scheme:light] mb-4 group">
            <div className="[scrollbar-width:none] mr-[-4px] ml-[-4px] caret-[oklch(0.2_0.02_280)] [color-scheme:light] px-1 group">
              <div
                role="tablist"
                tabIndex="0"
                className="[outline-style:none] text-[oklch(0.5_0.03_285)] w-max min-w-full inline-flex justify-center items-center gap-y-0 gap-x-0 caret-[oklch(0.5_0.03_285)] [color-scheme:light] border-[rgba(191,219,254,0.4)] border-b group"
              >
                <button
                  type="button"
                  role="tab"
                  id="radix-:r5:-trigger-hoje"
                  tabIndex="-1"
                  className="bg-[rgba(0,0,0,0)] text-[#ff8ba3] leading-[20px] font-bold text-[14px] [white-space-collapse:collapse] [text-wrap-mode:nowrap] min-w-11 min-h-11 relative flex justify-center items-center shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(228,205,221,0.15)_0px_2px_6px_0px,rgba(228,205,221,0.15)_0px_1px_2px_-1px] caret-[#ff8ba3] [color-scheme:light] [appearance:button] px-4 py-2.5 group"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  role="tab"
                  id="radix-:r5:-trigger-semana"
                  tabIndex="-1"
                  className="bg-[rgba(0,0,0,0)] text-[#6a5450] leading-[20px] font-semibold text-[14px] [white-space-collapse:collapse] [text-wrap-mode:nowrap] min-w-11 min-h-11 relative flex justify-center items-center caret-[#6a5450] [color-scheme:light] [appearance:button] px-4 py-2.5 group"
                >
                  Esta Semana
                </button>
                <button
                  type="button"
                  role="tab"
                  id="radix-:r5:-trigger-mes"
                  tabIndex="-1"
                  className="bg-[rgba(0,0,0,0)] text-[#6a5450] leading-[20px] font-semibold text-[14px] [white-space-collapse:collapse] [text-wrap-mode:nowrap] min-w-11 min-h-11 relative flex justify-center items-center caret-[#6a5450] [color-scheme:light] [appearance:button] px-4 py-2.5 group"
                >
                  Este Mês
                </button>
                <button
                  type="button"
                  role="tab"
                  id="radix-:r5:-trigger-historico"
                  tabIndex="-1"
                  className="bg-[rgba(0,0,0,0)] text-[#6a5450] leading-[20px] font-semibold text-[14px] [white-space-collapse:collapse] [text-wrap-mode:nowrap] min-w-11 min-h-11 relative flex justify-center items-center caret-[#6a5450] [color-scheme:light] [appearance:button] px-4 py-2.5 group"
                >
                  Histórico
                </button>
              </div>
            </div>
            <div
              role="tabpanel"
              aria-labelledby="radix-:r5:-trigger-hoje"
              id="radix-:r5:-content-hoje"
              tabIndex="0"
              className="[animation-duration:0s] caret-[oklch(0.2_0.02_280)] [color-scheme:light] mt-4 group"
            >
              <Component_2_2_1 />
            </div>
            <div
              role="tabpanel"
              aria-labelledby="radix-:r5:-trigger-semana"
              hidden
              id="radix-:r5:-content-semana"
              tabIndex="0"
              className="hidden caret-[oklch(0.2_0.02_280)] [color-scheme:light] mt-4 group"
            ></div>
            <div
              role="tabpanel"
              aria-labelledby="radix-:r5:-trigger-mes"
              hidden
              id="radix-:r5:-content-mes"
              tabIndex="0"
              className="hidden caret-[oklch(0.2_0.02_280)] [color-scheme:light] mt-4 group"
            ></div>
            <div
              role="tabpanel"
              aria-labelledby="radix-:r5:-trigger-historico"
              hidden
              id="radix-:r5:-content-historico"
              tabIndex="0"
              className="hidden caret-[oklch(0.2_0.02_280)] [color-scheme:light] mt-4 group"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component_2_2;
