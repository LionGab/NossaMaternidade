import Component_2_3_1 from './Component_2_3_1';

function Component_2_3() {
  return (
    <section
      className="[animation-delay:0.2s] will-change-[transform,opacity] caret-[oklch(0.2_0.02_280)] [color-scheme:light] group"
      data-component-id="Component_2_3"
    >
      <div className="bg-white overflow-x-hidden overflow-y-hidden shadow-[rgba(0,0,0,0.05)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_0px] caret-[oklch(0.2_0.02_280)] [color-scheme:light] p-4 rounded-br-[24px] rounded-t-[24px] rounded-bl-[24px] group">
        <div className="caret-[oklch(0.2_0.02_280)] [color-scheme:light] mb-4 group">
          <div className="flex items-center gap-y-2 gap-x-2 caret-[oklch(0.2_0.02_280)] [color-scheme:light] mb-1 group">
            <span className="leading-[32px] text-[24px] block caret-[oklch(0.2_0.02_280)] [color-scheme:light] group">
              🌍
            </span>
            <h3 className="text-[#3a2e2e] leading-[28px] font-bold text-[20px] tracking-[-0.4px] caret-[#3a2e2e] [color-scheme:light] my-0 group">
              Projeto África
            </h3>
          </div>
          <p className="text-[#6a5450] leading-[20px] font-medium text-[14px] caret-[#6a5450] [color-scheme:light] my-0 group">
            Amor e esperança em cada abraço
          </p>
        </div>
        <Component_2_3_1 />
      </div>
    </section>
  );
}

export default Component_2_3;
