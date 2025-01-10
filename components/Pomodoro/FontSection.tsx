import { FieldValues, UseFormRegister, useFormContext } from "react-hook-form";

function FontSection() {
  const form = useFormContext();
  const { register, watch } = form;
  const selectedFont = watch("font");
  const fonts = ["kumbh", "roboto", "mono"];
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between">
      <h2 className="text-sm font-bold tracking-[5px]">FONT</h2>

      <div className="mt-5 flex gap-4 md:mt-0">
        {fonts.map((font) => (
          <FontInput
            key={font}
            font={font}
            selectedFont={selectedFont}
            register={register}
          />
        ))}
      </div>
    </div>
  );
}

const FontInput = ({
  font,
  selectedFont,
  register,
}: {
  font: string;
  selectedFont: string;
  register: UseFormRegister<FieldValues>;
}) => {
  // fonts classnames has to exist here for the tailwind compiler to pick them up
  // font-kumbh font-roboto font-mono
  return (
    <label
      className={`flex h-10 w-10 items-center justify-center rounded-full font-${font} font-bold ring-grey ring-offset-4 focus-within:ring-2 focus-within:ring-accent hover:ring-1 ${
        selectedFont === font ? "bg-darkBlue text-white" : "bg-grey text-blue"
      }`}
    >
      Aa
      <input
        className="absolute opacity-0"
        type="radio"
        value={font}
        {...register("font")}
      />
    </label>
  );
};

export default FontSection;
