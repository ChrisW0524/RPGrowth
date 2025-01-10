import { useFormContext } from "react-hook-form";
import Button from "./Button";
type TimeInputProps = {
  title: string;
  inputName: string;
};

function TimeInput({ inputName, title }: TimeInputProps) {
  const form = useFormContext();

  const { setValue, register, watch } = form;

  const value = watch(inputName);

  return (
    <div className="flex items-center justify-between md:flex-col md:items-start">
      <label
        htmlFor={inputName}
        className="text-sm font-bold text-blue/40 md:mb-3"
      >
        {title}
      </label>
      <div className="flex h-12 max-w-36 justify-between rounded-xl bg-grey p-3 px-4">
        <input
          className="w-1/2 bg-transparent text-sm font-bold outline-offset-4 focus:outline-0 focus-visible:outline-1"
          id={inputName}
          type="number"
          {...register(inputName, { valueAsNumber: true })}
        />
        <div className="flex flex-col gap-2">
          <Button
            className="opacity-20 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-darkBlue rounded-full"
            type="button"
            onClick={() => {
              setValue(inputName, value + 1);
            }}
          >
            {/* <img src={upIcon} alt="" /> */}
          </Button>

          <Button
            className="opacity-20 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-darkBlue rounded-full"
            type="button"
            onClick={() => {
              setValue(inputName, value - 1);
            }}
          >
            {/* <img src={downIcon} alt="" /> */}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TimeInput;
