import { FieldValues, UseFormRegister, useFormContext } from "react-hook-form";

function ThemeSection() {
  const form = useFormContext();

  const { register } = form;

  const themes = [
    {
      name: "default",
      bgClassName: "bg-accent1",
    },
    {
      name: "teal-theme",
      bgClassName: "bg-accent2",
    },
    {
      name: "purple-theme",
      bgClassName: "bg-accent3",
    },
  ];

  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between">
      <h2 className="text-sm font-bold tracking-[5px]">COLOR</h2>

      <div className="mt-5 flex gap-4 md:mt-0">
        {themes.map((theme) => (
          <ThemeSelector
            key={theme.name}
            theme={theme.name}
            bgClassName={theme.bgClassName}
            register={register}
          />
        ))}
      </div>
    </div>
  );
}

const ThemeSelector = ({
  theme,
  register,
  bgClassName,
}: {
  theme: string;
  bgClassName: string;
  register: UseFormRegister<FieldValues>;
}) => {
  // classnames has to exist here for the tailwind compiler to pick them up
  // focus-within:ring-accent1 focus-within:ring-accent2 focus-within:ring-accent3
  return (
    <label
      className={`flex h-10 w-10 items-center justify-center rounded-full ${bgClassName} font-bold text-blue ring-grey ring-offset-4 focus-within:ring-2 focus-within:ring-${
        bgClassName.split("-")[1]
      } hover:ring-1`}
    >
      <input
        className="peer absolute opacity-0"
        type="radio"
        value={theme}
        {...register("theme")}
      />
      <CheckMark />
    </label>
  );
};

const CheckMark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="11"
      fill="none"
      className="hidden peer-checked:block"
    >
      <path stroke="#161932" strokeWidth="2" d="m1 5.5 3.953 3.953L13.405 1" />
    </svg>
  );
};

export default ThemeSection;
