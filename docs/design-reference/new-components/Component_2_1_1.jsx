import Component_2_1_1_1 from './Component_2_1_1_1';

function Component_2_1_1() {
  return (
    <button
      aria-label="Continuar última conversa"
      className="bg-[rgba(255,139,163,0.08)] text-[16px] text-left w-full min-w-11 min-h-20 shadow-[rgba(0,0,0,0.03)_0px_1px_2px_0px] caret-[oklch(0.2_0.02_280)] [color-scheme:light] [appearance:button] p-4 rounded-br-[20px] rounded-t-[20px] rounded-bl-[20px] border-[rgba(255,139,163,0.15)] border group"
      data-component-id="Component_2_1_1"
    >
      <div className="flex items-start gap-y-3 gap-x-3 caret-[oklch(0.2_0.02_280)] [color-scheme:light] group">
        <span className="w-11 h-11 relative flex overflow-x-hidden overflow-y-hidden shrink-0 caret-[oklch(0.2_0.02_280)] [color-scheme:light] rounded-br-full rounded-t-full rounded-bl-full group">
          <img
            alt="NathIA"
            src="https://i.imgur.com/oB9ewPG.jpg"
            className="align-middle w-full h-full max-w-full aspect-square block object-cover object-[50%_0%] caret-[oklch(0.2_0.02_280)] [color-scheme:light] group"
          />
        </span>
        <Component_2_1_1_1 />
      </div>
    </button>
  );
}

export default Component_2_1_1;
