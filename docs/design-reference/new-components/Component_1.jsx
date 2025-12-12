import Component_1_1 from './Component_1_1';

function Component_1() {
  return (
    <div
      className="bg-[rgba(253,249,251,0.95)] sticky z-40 backdrop-blur-xl caret-[oklch(0.2_0.02_280)] [color-scheme:light] top-0 bottom-auto inset-x-auto group"
      data-component-id="Component_1"
    >
      <div className="max-w-[512px] caret-[oklch(0.2_0.02_280)] [color-scheme:light] mx-auto p-4 group">
        <div className="flex justify-between items-center caret-[oklch(0.2_0.02_280)] [color-scheme:light] group">
          <div className="min-w-0 grow basis-[0%] caret-[oklch(0.2_0.02_280)] [color-scheme:light] pr-3 group">
            <h1 className="text-[#3a2e2e] leading-tight font-bold text-[24px] tracking-[-0.48px] text-ellipsis [white-space-collapse:collapse] [text-wrap-mode:nowrap] overflow-x-hidden overflow-y-hidden caret-[#3a2e2e] [color-scheme:light] mt-0 mb-0.5 group">
              Oi, amiga,
            </h1>
            <p className="text-[#6a5450] leading-relaxed font-medium text-[15px] caret-[#6a5450] [color-scheme:light] my-0 group">
              como você tá hoje?
            </p>
          </div>
          <Component_1_1 />
        </div>
      </div>
    </div>
  );
}

export default Component_1;
