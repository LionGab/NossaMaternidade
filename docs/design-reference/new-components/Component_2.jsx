import Component_2_1 from './Component_2_1';
import Component_2_2 from './Component_2_2';
import Component_2_3 from './Component_2_3';
import Component_2_4 from './Component_2_4';

function Component_2() {
  return (
    <main
      className="max-w-[448px] caret-[oklch(0.2_0.02_280)] [color-scheme:light] mx-auto pb-6 px-6 group"
      data-component-id="Component_2"
    >
      <div className="flex flex-col gap-y-4 gap-x-4 caret-[oklch(0.2_0.02_280)] [color-scheme:light] group">
        <Component_2_1 />
        <Component_2_2 />
        <Component_2_3 />
        <Component_2_4 />
        <div className="pb-[env(safe-area-inset-bottom,0px)] h-20 caret-[oklch(0.2_0.02_280)] [color-scheme:light] group"></div>
      </div>
    </main>
  );
}

export default Component_2;
